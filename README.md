# 🚗 Sistema de Gestión de Autos - TP TAC

Sistema completo para la gestión de turnos y revisiones técnicas de vehículos. Proyecto académico desarrollado con arquitectura desacoplada Frontend/Backend.

## 📖 Descripción del Proyecto

Este trabajo práctico (TP) implementa un **sistema integral de gestión automotriz** que permite:

- 📅 **Gestión de turnos** para revisiones técnicas vehiculares
- 🚙 **Registro y administración de vehículos**
- 👥 **Control de propietarios** y sus datos de contacto
- 🔍 **Seguimiento de revisiones** y estados de los turnos
- 🔐 **Sistema de autenticación** para administradores
- 📋 **Panel administrativo** para gestión completa del sistema

### 🎯 Objetivo del Sistema

El sistema está diseñado para digitalizar y optimizar el proceso de gestión de turnos en talleres mecánicos, concesionarias o centros de revisión técnica vehicular, proporcionando una solución moderna y eficiente para:

- Administradores del taller/centro
- Propietarios de vehículos que necesitan agendar servicios
- Personal técnico que realiza las revisiones

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una **arquitectura desacoplada** con separación clara entre Frontend y Backend:

```
tp-tac_gestion-autos/
├── 🔧 be/                 # Backend (API REST)
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── routes/        # Definición de rutas API
│   │   ├── middleware/    # Middlewares (auth, cors, etc.)
│   │   ├── config/        # Configuraciones (DB, etc.)
│   │   └── utils/         # Utilidades (JWT, helpers)
│   ├── prisma/           # Schema y migraciones DB
│   └── package.json      # Dependencias backend
└── 🎨 fe/                # Frontend (por implementar)
    └── [Interfaz de usuario]
```

### 🔄 Comunicación Frontend ↔ Backend

- **Protocolo**: HTTP/HTTPS con API REST
- **Formato**: JSON para intercambio de datos
- **Autenticación**: JWT (JSON Web Tokens)
- **CORS**: Configurado para permitir peticiones cross-origin

### ✅ Ventajas de la Arquitectura Desacoplada

1. **Escalabilidad**: Frontend y Backend pueden escalar independientemente
2. **Mantenibilidad**: Equipos pueden trabajar en paralelo sin conflictos
3. **Flexibilidad**: El Backend puede servir múltiples frontends (web, mobile, etc.)
4. **Reutilización**: API REST puede ser consumida por diferentes clientes
5. **Tecnologías independientes**: Cada capa puede usar la mejor tecnología para su propósito

## 🛠️ Stack Tecnológico

### Backend (be/)

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de Datos**: MySQL (Clever Cloud)
- **Autenticación**: JWT + bcrypt
- **Desarrollo**: Nodemon para hot-reload

### Frontend (fe/)

- _Por implementar - Puede ser React, Vue, Angular, etc._

### Base de Datos

- **Motor**: MySQL
- **Hosting**: Clever Cloud
- **ORM**: Prisma para gestión de esquemas y migraciones

## 📊 Modelo de Datos

El sistema maneja las siguientes entidades principales:

### 👤 Usuario

Administradores del sistema con acceso completo

- Email único y contraseña encriptada
- Sistema de roles (ADMIN por defecto)

### 🚗 Vehículo

Información de los vehículos registrados

- Datos técnicos: marca, modelo, año
- Información del propietario: nombre y email

### 📅 Turno

Citas programadas para revisiones

- Vinculado a un vehículo específico
- Fecha/hora del turno
- Estado del turno (PENDIENTE, CONFIRMADO, etc.)
- Código de verificación único

## 📁 Estructura de Directorios

```
tp-tac_gestion-autos/
├── 📄 README.md              # Documentación general (este archivo)
├── 📄 package.json           # Configuración raíz del proyecto
├── 🔧 be/                    # Backend - API REST
│   ├── 📄 README.md          # Documentación específica del backend
│   ├── 📄 package.json       # Dependencias del backend
│   ├── 📄 .env              # Variables de entorno (no versionado)
│   ├── 🗄️ prisma/           # ORM y base de datos
│   │   ├── schema.prisma     # Esquema de base de datos
│   │   └── seed.js          # Datos de prueba
│   └── 📁 src/              # Código fuente
│       ├── 📁 controllers/   # Lógica de negocio
│       ├── 📁 routes/        # Definición de rutas API
│       ├── 📁 middleware/    # Middlewares personalizados
│       ├── 📁 config/        # Configuraciones
│       ├── 📁 utils/         # Funciones auxiliares
│       └── 📄 index.js      # Punto de entrada del servidor
└── 🎨 fe/                   # Frontend (por implementar)
    └── [Interfaz de usuario]
```
