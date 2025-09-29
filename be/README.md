# Backend - Sistema de Gestión de Autos

Backend desarrollado en Node.js con Express para un sistema de gestión de turnos y revisiones de vehículos.

## 🛠️ Tecnologías Utilizadas

- **Express.js** - Framework web para Node.js
- **Prisma** - ORM (Object Relational Mapping) para base de datos
- **MySQL** - Base de datos relacional
- **JWT** - Autenticación mediante tokens
- **bcrypt** - Encriptación de contraseñas
- **Nodemon** - Herramienta de desarrollo para reinicio automático
- **Clever Cloud** - Plataforma de hosting para la base de datos

## 📋 Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn
- Acceso a base de datos MySQL (configurada en Clever Cloud)

## 🚀 Instalación

1. **Clonar el repositorio e ir al directorio del backend:**

   ```bash
   cd be
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**

   Crear un archivo `.env` en la raíz del directorio `be/` con las siguientes variables:

   ```env
   # Configuración del servidor
   PORT=4000

   # Configuración de base de datos (Clever Cloud)
   DATABASE_URL="mysql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME"
   DB_HOST=tu_host_clever_cloud
   DB_PORT=3306
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_base_datos

   # Configuración JWT
   JWT_SECRET=tu_clave_secreta_jwt
   JWT_EXPIRES_IN=24h

   # Configuración de administrador
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=tu_contraseña_admin
   ```

4. **Generar el cliente de Prisma:**

   ```bash
   npx prisma generate
   ```

5. **Ejecutar migraciones:**

   ```bash
   npx prisma db push
   ```

6. **Ejecutar semilla (opcional):**
   ```bash
   npm run seed
   ```

## 🏃‍♂️ Ejecución

### Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en modo desarrollo con Nodemon, reiniciándose automáticamente ante cambios.

### Producción

```bash
npm start
```

El servidor estará disponible en `http://localhost:4000` (o el puerto configurado en `PORT`).

## 🗄️ Base de Datos

### Configuración con Clever Cloud

La base de datos MySQL está alojada en **Clever Cloud**. Asegúrate de tener las credenciales correctas en tu archivo `.env`.

### Migraciones con Prisma

Para aplicar cambios en la base de datos:

1. **Modificar el schema:**
   Edita el archivo `prisma/schema.prisma`

2. **Generar migración:**

   ```bash
   npx prisma db push
   ```

3. **Ver estado de la base de datos:**
   ```bash
   npx prisma studio
   ```

### Comandos útiles de Prisma

- **Generar cliente:** `npx prisma generate`
- **Reiniciar base de datos:** `npx prisma db push --force-reset`
- **Ver esquema actual:** `npx prisma db pull`
- **Abrir Prisma Studio:** `npx prisma studio`

## 📊 Modelos de Datos

### Usuario

- `id`: Identificador único
- `email`: Email del usuario (único)
- `password`: Contraseña encriptada
- `rol`: Rol del usuario (por defecto: "ADMIN")
- `createdAt`: Fecha de creación

### Vehiculo

- `id`: Identificador único
- `marca`: Marca del vehículo
- `modelo`: Modelo del vehículo
- `anio`: Año del vehículo
- `propietarioNombre`: Nombre del propietario
- `propietarioEmail`: Email del propietario
- `createdAt`: Fecha de creación

### Turno

- `id`: Identificador único
- `vehiculoId`: ID del vehículo relacionado
- `fechaTurno`: Fecha y hora del turno
- `estado`: Estado del turno (por defecto: "PENDIENTE")
- `verificationCode`: Código de verificación único
- `createdAt`: Fecha de creación

### Revision

- `id`: Identificador único
- `turnoId`: ID del turno relacionado (único)
- `notas`: Notas de la revisión
- `estado`: Estado de la revisión (por defecto: "PROGRAMADA")
- `updatedAt`: Fecha de última actualización

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)** para la autenticación:

- **Login:** `POST /auth/login`
- Las rutas administrativas requieren token válido
- Token expira según configuración en `JWT_EXPIRES_IN`

## 📡 API Endpoints

### Autenticación

- `POST /auth/login` - Inicio de sesión

### Rutas Administrativas (requieren autenticación)

- `GET /admin/*` - Rutas protegidas para administradores

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con Nodemon
- `npm start` - Ejecutar en modo producción
- `npm run seed` - Ejecutar semilla de datos

## 📁 Estructura del Proyecto

```
be/
├── src/
│   ├── config/
│   │   └── db.js          # Configuración de base de datos
│   ├── controllers/
│   │   └── authController.js  # Controlador de autenticación
│   ├── middleware/
│   │   └── auth.js        # Middleware de autenticación
│   ├── routes/
│   │   └── adminRoutes.js # Rutas administrativas
│   ├── utils/
│   │   └── jwt.js         # Utilidades JWT
│   └── index.js           # Punto de entrada de la aplicación
├── prisma/
│   ├── schema.prisma      # Schema de base de datos
│   └── seed.js           # Datos de semilla
├── package.json
└── .env                  # Variables de entorno (crear)
```

## 🚨 Variables de Entorno Requeridas

Las siguientes variables son **obligatorias** para el funcionamiento del sistema:

| Variable         | Descripción                    | Ejemplo                          |
| ---------------- | ------------------------------ | -------------------------------- |
| `PORT`           | Puerto del servidor            | `4000`                           |
| `DATABASE_URL`   | URL completa de conexión MySQL | `mysql://user:pass@host:port/db` |
| `DB_HOST`        | Host de Clever Cloud           | `host.clever-cloud.com`          |
| `DB_PORT`        | Puerto de base de datos        | `3306`                           |
| `DB_USER`        | Usuario de base de datos       | `usuario`                        |
| `DB_PASSWORD`    | Contraseña de base de datos    | `contraseña`                     |
| `DB_NAME`        | Nombre de base de datos        | `nombre_db`                      |
| `JWT_SECRET`     | Clave secreta para JWT         | `mi_clave_super_secreta`         |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h`                            |
| `ADMIN_EMAIL`    | Email del administrador        | `admin@example.com`              |
| `ADMIN_PASSWORD` | Contraseña del administrador   | `password123`                    |
