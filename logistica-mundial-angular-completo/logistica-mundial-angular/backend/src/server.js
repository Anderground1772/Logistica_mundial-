const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200' }));
app.use(express.json());

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get('/api/health', asyncRoute(async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true, message: 'API y base de datos conectadas' });
}));

app.get('/api/dashboard', asyncRoute(async (req, res) => {
  const [[envios]] = await pool.query('SELECT COUNT(*) total FROM envios');
  const [[clientes]] = await pool.query('SELECT COUNT(*) total FROM clientes');
  const [[paquetes]] = await pool.query('SELECT COUNT(*) total FROM paquetes');
  const [[transportadoras]] = await pool.query('SELECT COUNT(*) total FROM transportadoras');
  const [estados] = await pool.query('SELECT estado, COUNT(*) cantidad FROM envios GROUP BY estado');
  res.json({ envios: envios.total, clientes: clientes.total, paquetes: paquetes.total,
    transportadoras: transportadoras.total, estados });
}));

app.get('/api/envios', asyncRoute(async (req, res) => {
  const [rows] = await pool.query(`
    SELECT e.id_envio,e.numero_envio,e.estado,e.fecha_registro,e.fecha_estimada_entrega,e.costo_total,
    r.nombre remitente,d.nombre destinatario,co.nombre ciudad_origen,cd.nombre ciudad_destino
    FROM envios e JOIN clientes r ON e.id_cliente_remitente=r.id_cliente
    JOIN clientes d ON e.id_cliente_destinatario=d.id_cliente
    JOIN ciudades co ON e.id_ciudad_origen=co.id_ciudad
    JOIN ciudades cd ON e.id_ciudad_destino=cd.id_ciudad
    ORDER BY e.id_envio DESC`);
  res.json(rows);
}));

app.post('/api/envios', asyncRoute(async (req, res) => {
  const { numero_envio,id_cliente_remitente,id_cliente_destinatario,id_transportadora,
    id_ciudad_origen,id_ciudad_destino,direccion_origen,direccion_destino,
    fecha_estimada_entrega,costo_total } = req.body;
  if (!numero_envio || !direccion_origen || !direccion_destino ||
      !id_cliente_remitente || !id_cliente_destinatario || !id_transportadora ||
      !id_ciudad_origen || !id_ciudad_destino) {
    return res.status(400).json({ message: 'Completa todos los campos obligatorios.' });
  }
  if (Number(id_cliente_remitente) === Number(id_cliente_destinatario)) {
    return res.status(400).json({ message: 'El remitente y destinatario deben ser diferentes.' });
  }
  const [result] = await pool.query(`INSERT INTO envios
    (numero_envio,id_cliente_remitente,id_cliente_destinatario,id_transportadora,
    id_ciudad_origen,id_ciudad_destino,direccion_origen,direccion_destino,
    fecha_estimada_entrega,costo_total)
    VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [numero_envio,id_cliente_remitente,id_cliente_destinatario,id_transportadora,
     id_ciudad_origen,id_ciudad_destino,direccion_origen,direccion_destino,
     fecha_estimada_entrega || null,costo_total || 0]);
  res.status(201).json({ id_envio: result.insertId, message: 'Envío creado correctamente.' });
}));

app.get('/api/clientes', asyncRoute(async (req, res) => {
  const [rows] = await pool.query(`SELECT c.*, ci.nombre ciudad FROM clientes c
    JOIN ciudades ci ON c.id_ciudad=ci.id_ciudad ORDER BY c.id_cliente DESC`);
  res.json(rows);
}));

app.post('/api/clientes', asyncRoute(async (req, res) => {
  const { tipo_cliente,nombre,documento,correo,telefono,direccion,id_ciudad } = req.body;
  if (!tipo_cliente || !nombre || !documento || !id_ciudad)
    return res.status(400).json({ message: 'Tipo, nombre, documento y ciudad son obligatorios.' });
  const [result] = await pool.query(`INSERT INTO clientes
    (tipo_cliente,nombre,documento,correo,telefono,direccion,id_ciudad) VALUES (?,?,?,?,?,?,?)`,
    [tipo_cliente,nombre,documento,correo || null,telefono || null,direccion || null,id_ciudad]);
  res.status(201).json({ id_cliente: result.insertId, message: 'Cliente creado correctamente.' });
}));

app.get('/api/paquetes', asyncRoute(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM paquetes ORDER BY id_paquete DESC');
  res.json(rows);
}));

app.get('/api/transportadoras', asyncRoute(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM transportadoras ORDER BY nombre');
  res.json(rows);
}));

app.get('/api/vehiculos', asyncRoute(async (req, res) => {
  const [rows] = await pool.query(`SELECT v.*,t.nombre transportadora FROM vehiculos v
    JOIN transportadoras t ON v.id_transportadora=t.id_transportadora ORDER BY v.id_vehiculo DESC`);
  res.json(rows);
}));

app.get('/api/ciudades', asyncRoute(async (req, res) => {
  const [rows] = await pool.query(`SELECT ci.id_ciudad,ci.nombre,p.nombre pais
    FROM ciudades ci JOIN paises p ON ci.id_pais=p.id_pais ORDER BY p.nombre,ci.nombre`);
  res.json(rows);
}));

app.get('/api/seguimientos/:numero', asyncRoute(async (req, res) => {
  const [rows] = await pool.query(`SELECT e.numero_envio,e.estado estado_envio,
    s.fecha_evento,s.ubicacion,s.estado,s.descripcion
    FROM envios e JOIN seguimientos s ON e.id_envio=s.id_envio
    WHERE e.numero_envio=? ORDER BY s.fecha_evento`, [req.params.numero]);
  if (!rows.length) return res.status(404).json({ message: 'No se encontró el envío o no tiene eventos.' });
  res.json(rows);
}));

app.get('/api/vista-envios', asyncRoute(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM vista_estado_envios ORDER BY fecha_registro DESC');
  res.json(rows);
}));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'El dato ya existe (código, documento o número duplicado).' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ message: 'Una de las relaciones seleccionadas no existe.' });
  res.status(500).json({ message: 'Error interno del servidor.', detail: err.message });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API Logística Mundial escuchando en puerto ${port}`));
