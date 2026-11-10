CREATE DATABASE IF NOT EXISTS logistica_mundial
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE logistica_mundial;

CREATE TABLE IF NOT EXISTS paises (
 id_pais INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL UNIQUE,
 codigo_iso CHAR(2) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS ciudades (
 id_ciudad INT AUTO_INCREMENT PRIMARY KEY,
 id_pais INT NOT NULL,
 nombre VARCHAR(100) NOT NULL,
 codigo_postal VARCHAR(20),
 UNIQUE KEY uq_ciudad_pais (id_pais,nombre),
 FOREIGN KEY (id_pais) REFERENCES paises(id_pais)
);
CREATE TABLE IF NOT EXISTS transportadoras (
 id_transportadora INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(120) NOT NULL UNIQUE,
 nit VARCHAR(30) UNIQUE,
 telefono VARCHAR(25),
 correo VARCHAR(120),
 tipo_servicio ENUM('TERRESTRE','AEREO','MARITIMO','MULTIMODAL'),
 estado ENUM('ACTIVA','INACTIVA') DEFAULT 'ACTIVA'
);
CREATE TABLE IF NOT EXISTS clientes (
 id_cliente INT AUTO_INCREMENT PRIMARY KEY,
 tipo_cliente ENUM('PERSONA','EMPRESA') NOT NULL,
 nombre VARCHAR(120) NOT NULL,
 documento VARCHAR(40) NOT NULL UNIQUE,
 correo VARCHAR(120),
 telefono VARCHAR(25),
 direccion VARCHAR(180),
 id_ciudad INT NOT NULL,
 fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);
CREATE TABLE IF NOT EXISTS empleados (
 id_empleado INT AUTO_INCREMENT PRIMARY KEY,
 nombres VARCHAR(80) NOT NULL,
 apellidos VARCHAR(80) NOT NULL,
 documento VARCHAR(40) NOT NULL UNIQUE,
 telefono VARCHAR(25),
 correo VARCHAR(120) UNIQUE,
 cargo VARCHAR(70) NOT NULL,
 estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO'
);
CREATE TABLE IF NOT EXISTS conductores (
 id_conductor INT AUTO_INCREMENT PRIMARY KEY,
 id_empleado INT NOT NULL UNIQUE,
 numero_licencia VARCHAR(50) NOT NULL UNIQUE,
 categoria_licencia VARCHAR(10) NOT NULL,
 fecha_vencimiento_licencia DATE NOT NULL,
 estado ENUM('DISPONIBLE','EN_RUTA','INACTIVO') DEFAULT 'DISPONIBLE',
 FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);
CREATE TABLE IF NOT EXISTS vehiculos (
 id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
 id_transportadora INT NOT NULL,
 placa VARCHAR(20) NOT NULL UNIQUE,
 tipo ENUM('CAMION','FURGON','MOTOCICLETA','AVION','BARCO','VAN'),
 capacidad_kg DECIMAL(12,2) NOT NULL,
 modelo VARCHAR(80),
 estado ENUM('DISPONIBLE','EN_SERVICIO','MANTENIMIENTO','INACTIVO') DEFAULT 'DISPONIBLE',
 CHECK (capacidad_kg > 0),
 FOREIGN KEY (id_transportadora) REFERENCES transportadoras(id_transportadora)
);
CREATE TABLE IF NOT EXISTS centros_distribucion (
 id_centro INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(120) NOT NULL,
 direccion VARCHAR(180) NOT NULL,
 id_ciudad INT NOT NULL,
 telefono VARCHAR(25),
 capacidad_almacenamiento INT DEFAULT 0,
 estado ENUM('OPERATIVO','CERRADO') DEFAULT 'OPERATIVO',
 FOREIGN KEY (id_ciudad) REFERENCES ciudades(id_ciudad)
);
CREATE TABLE IF NOT EXISTS rutas (
 id_ruta INT AUTO_INCREMENT PRIMARY KEY,
 codigo_ruta VARCHAR(40) NOT NULL UNIQUE,
 id_ciudad_origen INT NOT NULL,
 id_ciudad_destino INT NOT NULL,
 distancia_km DECIMAL(10,2),
 tiempo_estimado_horas DECIMAL(8,2),
 tipo_transporte ENUM('TERRESTRE','AEREO','MARITIMO','MULTIMODAL'),
 estado ENUM('ACTIVA','INACTIVA') DEFAULT 'ACTIVA',
 CHECK (id_ciudad_origen <> id_ciudad_destino),
 FOREIGN KEY (id_ciudad_origen) REFERENCES ciudades(id_ciudad),
 FOREIGN KEY (id_ciudad_destino) REFERENCES ciudades(id_ciudad)
);
CREATE TABLE IF NOT EXISTS asignaciones_ruta (
 id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
 id_ruta INT NOT NULL,
 id_conductor INT NOT NULL,
 id_vehiculo INT NOT NULL,
 id_empleado_responsable INT,
 fecha_salida DATETIME NOT NULL,
 fecha_regreso_estimada DATETIME,
 fecha_regreso_real DATETIME,
 estado ENUM('PROGRAMADA','EN_CURSO','FINALIZADA','CANCELADA') DEFAULT 'PROGRAMADA',
 FOREIGN KEY (id_ruta) REFERENCES rutas(id_ruta),
 FOREIGN KEY (id_conductor) REFERENCES conductores(id_conductor),
 FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo),
 FOREIGN KEY (id_empleado_responsable) REFERENCES empleados(id_empleado)
);
CREATE TABLE IF NOT EXISTS paquetes (
 id_paquete INT AUTO_INCREMENT PRIMARY KEY,
 codigo_rastreo VARCHAR(60) NOT NULL UNIQUE,
 descripcion VARCHAR(255) NOT NULL,
 peso_kg DECIMAL(10,2) NOT NULL,
 largo_cm DECIMAL(10,2),
 ancho_cm DECIMAL(10,2),
 alto_cm DECIMAL(10,2),
 valor_declarado DECIMAL(14,2) DEFAULT 0,
 tipo_contenido VARCHAR(80),
 estado ENUM('REGISTRADO','EN_ALMACEN','EN_TRANSITO','ENTREGADO','DEVUELTO','EXTRAVIADO') DEFAULT 'REGISTRADO',
 CHECK (peso_kg > 0)
);
CREATE TABLE IF NOT EXISTS envios (
 id_envio INT AUTO_INCREMENT PRIMARY KEY,
 numero_envio VARCHAR(50) NOT NULL UNIQUE,
 id_cliente_remitente INT NOT NULL,
 id_cliente_destinatario INT NOT NULL,
 id_transportadora INT NOT NULL,
 id_ciudad_origen INT NOT NULL,
 id_ciudad_destino INT NOT NULL,
 direccion_origen VARCHAR(180) NOT NULL,
 direccion_destino VARCHAR(180) NOT NULL,
 fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
 fecha_estimada_entrega DATE,
 estado ENUM('CREADO','RECOGIDO','EN_CENTRO','EN_TRANSITO','EN_REPARTO','ENTREGADO','CANCELADO','DEVUELTO') DEFAULT 'CREADO',
 costo_total DECIMAL(14,2) DEFAULT 0,
 CHECK (id_cliente_remitente <> id_cliente_destinatario),
 FOREIGN KEY (id_cliente_remitente) REFERENCES clientes(id_cliente),
 FOREIGN KEY (id_cliente_destinatario) REFERENCES clientes(id_cliente),
 FOREIGN KEY (id_transportadora) REFERENCES transportadoras(id_transportadora),
 FOREIGN KEY (id_ciudad_origen) REFERENCES ciudades(id_ciudad),
 FOREIGN KEY (id_ciudad_destino) REFERENCES ciudades(id_ciudad)
);
CREATE TABLE IF NOT EXISTS detalle_envios (
 id_detalle_envio INT AUTO_INCREMENT PRIMARY KEY,
 id_envio INT NOT NULL,
 id_paquete INT NOT NULL UNIQUE,
 FOREIGN KEY (id_envio) REFERENCES envios(id_envio),
 FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete)
);
CREATE TABLE IF NOT EXISTS seguimientos (
 id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
 id_envio INT NOT NULL,
 id_centro INT,
 id_asignacion INT,
 fecha_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
 ubicacion VARCHAR(150) NOT NULL,
 estado ENUM('RECIBIDO','EN_CENTRO','DESPACHADO','EN_TRANSITO','EN_REPARTO','ENTREGADO','INCIDENCIA') NOT NULL,
 descripcion VARCHAR(500),
 FOREIGN KEY (id_envio) REFERENCES envios(id_envio),
 FOREIGN KEY (id_centro) REFERENCES centros_distribucion(id_centro),
 FOREIGN KEY (id_asignacion) REFERENCES asignaciones_ruta(id_asignacion)
);
CREATE TABLE IF NOT EXISTS entregas (
 id_entrega INT AUTO_INCREMENT PRIMARY KEY,
 id_envio INT NOT NULL UNIQUE,
 fecha_entrega DATETIME,
 recibido_por VARCHAR(120),
 documento_receptor VARCHAR(40),
 observaciones VARCHAR(500),
 resultado ENUM('EXITOSA','RECHAZADA','NO_ENCONTRADO','REPROGRAMADA') NOT NULL,
 FOREIGN KEY (id_envio) REFERENCES envios(id_envio)
);
CREATE TABLE IF NOT EXISTS incidencias (
 id_incidencia INT AUTO_INCREMENT PRIMARY KEY,
 id_envio INT NOT NULL,
 id_empleado INT,
 fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
 tipo ENUM('RETRASO','DANO','PERDIDA','DIRECCION_INCORRECTA','PROBLEMA_ADUANERO','OTRO') NOT NULL,
 descripcion VARCHAR(500) NOT NULL,
 estado ENUM('ABIERTA','EN_REVISION','RESUELTA','CERRADA') DEFAULT 'ABIERTA',
 solucion VARCHAR(500),
 FOREIGN KEY (id_envio) REFERENCES envios(id_envio),
 FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
);

INSERT IGNORE INTO paises(nombre,codigo_iso) VALUES
('Colombia','CO'),('Mexico','MX'),('Estados Unidos','US'),('España','ES');
INSERT IGNORE INTO ciudades(id_pais,nombre,codigo_postal) VALUES
(1,'Bogota','110111'),(1,'Medellin','050001'),(1,'Cali','760001'),
(2,'Ciudad de Mexico','01000'),(3,'Miami','33101'),(4,'Madrid','28001');
INSERT IGNORE INTO transportadoras(nombre,nit,telefono,correo,tipo_servicio) VALUES
('Logistica Andina','900111111-1','6011111111','contacto@andina.co','TERRESTRE'),
('Global Cargo','900222222-2','6012222222','info@globalcargo.co','MULTIMODAL');
INSERT IGNORE INTO clientes(tipo_cliente,nombre,documento,correo,telefono,direccion,id_ciudad) VALUES
('PERSONA','Santiago Martinez','1020304050','santiago@email.com','3001112233','Calle 10 #20-30',1),
('EMPRESA','Comercializadora del Valle SAS','900333333-1','compras@valle.co','6023334444','Avenida 5 #12-10',3),
('PERSONA','Valentina Lopez','1030405060','valentina@email.com','3012223344','Carrera 50 #40-20',2);
INSERT IGNORE INTO empleados(nombres,apellidos,documento,telefono,correo,cargo) VALUES
('Carlos','Ramirez','7001001001','3004445566','carlos@logistica.co','Coordinador'),
('Diana','Castro','7001001002','3005556677','diana@logistica.co','Supervisora');
INSERT IGNORE INTO conductores(id_empleado,numero_licencia,categoria_licencia,fecha_vencimiento_licencia) VALUES
(1,'LIC-CO-001','C2','2028-12-31');
INSERT IGNORE INTO vehiculos(id_transportadora,placa,tipo,capacidad_kg,modelo) VALUES
(1,'ABC123','CAMION',8000,'2024'),(2,'XYZ789','FURGON',2500,'2023');
INSERT IGNORE INTO centros_distribucion(nombre,direccion,id_ciudad,telefono,capacidad_almacenamiento) VALUES
('Centro Bogota','Zona Industrial Bodega 10',1,'6017778888',5000),
('Centro Medellin','Parque Logistico Norte',2,'6047778888',2500);
INSERT IGNORE INTO rutas(codigo_ruta,id_ciudad_origen,id_ciudad_destino,distancia_km,tiempo_estimado_horas,tipo_transporte) VALUES
('BOG-MDE-01',1,2,415,8,'TERRESTRE'),('BOG-CLO-01',1,3,460,9,'TERRESTRE'),
('BOG-MEX-01',1,4,3150,12,'AEREO');
INSERT IGNORE INTO asignaciones_ruta(id_ruta,id_conductor,id_vehiculo,id_empleado_responsable,fecha_salida,fecha_regreso_estimada,estado) VALUES
(1,1,1,2,'2026-11-04 08:00:00','2026-11-04 18:00:00','EN_CURSO');
INSERT IGNORE INTO paquetes(codigo_rastreo,descripcion,peso_kg,largo_cm,ancho_cm,alto_cm,valor_declarado,tipo_contenido,estado) VALUES
('LM-2026-0001','Repuestos para bicicleta',4.5,30,20,15,350000,'Repuestos','EN_TRANSITO'),
('LM-2026-0002','Prendas de vestir',2,35,25,10,180000,'Textiles','REGISTRADO'),
('LM-2026-0003','Accesorios electronicos',1.2,20,15,8,500000,'Electronica','EN_ALMACEN');
INSERT IGNORE INTO envios(numero_envio,id_cliente_remitente,id_cliente_destinatario,id_transportadora,id_ciudad_origen,id_ciudad_destino,direccion_origen,direccion_destino,fecha_estimada_entrega,estado,costo_total) VALUES
('ENV-2026-001',1,3,1,1,2,'Calle 10 #20-30 Bogota','Carrera 50 #40-20 Medellin','2026-11-05','EN_TRANSITO',28000),
('ENV-2026-002',2,1,2,3,1,'Avenida 5 #12-10 Cali','Calle 10 #20-30 Bogota','2026-11-06','CREADO',42000);
INSERT IGNORE INTO detalle_envios(id_envio,id_paquete) VALUES (1,1),(2,2),(2,3);
INSERT INTO seguimientos(id_envio,id_centro,id_asignacion,ubicacion,estado,descripcion)
SELECT 1,1,1,'Centro de distribucion Bogota','DESPACHADO','Paquete despachado hacia Medellin'
WHERE NOT EXISTS (SELECT 1 FROM seguimientos WHERE id_envio=1 AND estado='DESPACHADO');
INSERT INTO seguimientos(id_envio,id_centro,id_asignacion,ubicacion,estado,descripcion)
SELECT 1,NULL,1,'Carretera Bogota-Medellin','EN_TRANSITO','Vehiculo en ruta'
WHERE NOT EXISTS (SELECT 1 FROM seguimientos WHERE id_envio=1 AND ubicacion='Carretera Bogota-Medellin');
INSERT INTO seguimientos(id_envio,id_centro,ubicacion,estado,descripcion)
SELECT 2,2,'Centro de distribucion Cali','RECIBIDO','Envio recibido para clasificacion'
WHERE NOT EXISTS (SELECT 1 FROM seguimientos WHERE id_envio=2 AND estado='RECIBIDO');
INSERT IGNORE INTO entregas(id_envio,resultado,observaciones) VALUES
(1,'REPROGRAMADA','Entrega prevista para el dia siguiente');
INSERT INTO incidencias(id_envio,id_empleado,tipo,descripcion,estado)
SELECT 1,2,'RETRASO','Demora por condiciones de trafico','EN_REVISION'
WHERE NOT EXISTS (SELECT 1 FROM incidencias WHERE id_envio=1 AND tipo='RETRASO');

CREATE OR REPLACE VIEW vista_estado_envios AS
SELECT e.numero_envio,e.estado,e.fecha_registro,
 r.nombre AS remitente,d.nombre AS destinatario,
 co.nombre AS ciudad_origen,cd.nombre AS ciudad_destino
FROM envios e
JOIN clientes r ON e.id_cliente_remitente=r.id_cliente
JOIN clientes d ON e.id_cliente_destinatario=d.id_cliente
JOIN ciudades co ON e.id_ciudad_origen=co.id_ciudad
JOIN ciudades cd ON e.id_ciudad_destino=cd.id_ciudad;
