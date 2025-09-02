# InkValuation - Authentication Microservice

Microservicio de autenticación pura para la plataforma InkValuation.

## Descripción

Este microservicio maneja exclusivamente:
- **Autenticación básica**: register, login, logout
- **Gestión básica de perfiles** de usuario (actualizar datos, cambiar contraseña)
- **Inscripción de usuarios interesados** desde landing page
- **Tokens JWT** y refresh tokens

## Tecnologías

- **Node.js** con Express.js
- **MySQL** con Sequelize ORM
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **Helmet** y **CORS** para seguridad
- **Rate limiting** para protección contra ataques

## Estructura de la Base de Datos

### Tablas:

1. **`users`** - Información básica de usuarios registrados
2. **`user_interested`** - Usuarios interesados desde landing page
3. **`como_nos_conociste_options`** - Opciones para formulario de registro

## API Endpoints

### Autenticación (`/api/auth`)
- `POST /register` - Registro de nuevos usuarios
- `POST /login` - Inicio de sesión
- `POST /logout` - Cerrar sesión
- `POST /refresh-token` - Renovar token JWT
- `GET /profile` - Obtener perfil del usuario autenticado
- `GET /check` - Verificar si el usuario está autenticado

### Gestión de Usuarios (`/api/user`)
- `PUT /profile` - Actualizar perfil básico (nombre, apellido, teléfono, país)
- `PUT /change-password` - Cambiar contraseña
- `GET /como-nos-conociste` - Obtener opciones de "Cómo nos conociste"

### Landing Page
- `POST /inscripcion` - Inscribir usuario interesado desde landing page

### Health Check
- `GET /api/health` - Estado del microservicio

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (copiar `.env.example` a `.env`):
```bash
cp .env.example .env
```

3. Crear base de datos:
```bash
mysql -u root -p < create_database.sql
```

4. Iniciar servidor:
```bash
# Desarrollo
npm run test

# Producción  
npm start
```

## Variables de Entorno

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ms_sesion_db
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Funcionalidades

### Autenticación
- Registro con validaciones completas
- Login con verificación de credenciales
- Logout que limpia cookies y tokens
- Refresh tokens para renovación automática
- JWT con cookies httpOnly para seguridad

### Gestión de Usuarios
- Actualización de perfil básico
- Cambio de contraseña con verificación
- Validaciones con express-validator

### Landing Page
- Inscripción de usuarios interesados
- Verificación de emails duplicados

### Seguridad
- **Helmet** para headers de seguridad
- **CORS** configurado para el frontend
- **Rate limiting** en rutas de API
- **Input sanitization** en todos los endpoints
- **Passwords** hasheados con bcrypt (12 rounds)
- **Validation** completa con express-validator

## Puerto

El microservicio corre por defecto en el puerto **3001**.

## Estructura Simple

```
src/
├── controllers/
│   ├── authController.js     # Login, register, logout
│   └── indexController.js    # Landing page inscripciones
├── routes/
│   ├── auth.js              # Rutas de autenticación
│   ├── user.js              # Rutas de gestión de perfil
│   └── index.routes.js      # Rutas de landing page
├── database/
│   ├── models/              # Modelos Sequelize
│   └── config/              # Configuración DB
├── middleware/              # Auth, seguridad, validación
└── app.js                   # Aplicación principal
```

## Logs

El microservicio muestra información de inicio:
- Puerto de ejecución (3001)
- Modo (development/production)  
- Estado de seguridad activado
- Conexión exitosa a base de datos
- Servicios disponibles: Auth, Profile, Landing Inscriptions