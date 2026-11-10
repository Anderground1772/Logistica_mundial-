# Logística Mundial — Angular + Node.js + MySQL

Aplicación web para administrar una operación logística. Incluye frontend Angular, API REST con Node.js/Express, base de datos MySQL y Docker Compose.

## Requisitos
- Docker Desktop y Docker Compose (recomendado), o:
- Node.js 20+, npm 10+ y MySQL 8+

## Ejecutar con Docker
1. Descomprime el ZIP.
2. Abre una terminal en la carpeta `logistica-mundial-angular`.
3. Ejecuta:
   ```bash
   docker compose up --build
   ```
4. Abre:
   - Frontend: http://localhost:4200
   - API: http://localhost:3000/api
   - Estado de API: http://localhost:3000/api/health

La base de datos se crea automáticamente desde `database/init.sql` la primera vez que se inicializa el volumen.

## Ejecutar sin Docker
### Base de datos
1. Crea una base MySQL llamada `logistica_mundial`.
2. Ejecuta `database/init.sql` en MySQL Workbench o phpMyAdmin.
3. Copia `backend/.env.example` a `backend/.env` y configura las credenciales.
4. En `backend/`:
   ```bash
   npm install
   npm run dev
   ```
5. En `frontend/`:
   ```bash
   npm install
   npm start
   ```

## Funcionalidades
- Panel con indicadores de envíos, clientes, paquetes y transportadoras.
- Listado y registro de envíos.
- Listado y registro de clientes.
- Consulta de paquetes.
- Consulta de transportadoras y vehículos.
- Seguimiento por número de envío.
- Vista SQL `vista_estado_envios`.
- API REST y validaciones básicas.

## Estructura
- `frontend/`: aplicación Angular standalone.
- `backend/`: API REST Express.
- `database/init.sql`: esquema, datos de demostración, consultas y vista.
- `docker-compose.yml`: servicios de MySQL, API y Angular.

## Datos de demostración
El SQL carga países, ciudades, transportadoras, clientes, empleados, conductores, vehículos, centros, rutas, asignaciones, paquetes, envíos, seguimientos y una incidencia.

> Nota: las credenciales incluidas en Docker son únicamente para desarrollo local. Cámbialas antes de desplegar en internet. Esta versión es una base funcional académica; antes de producción añade autenticación, autorización, auditoría, copias de seguridad y manejo seguro de secretos.
