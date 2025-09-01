# Diseño de Base de Datos - InkValuation User Service

## Descripción General
Microservicio de gestión de usuarios y sesiones para la plataforma InkValuation. Maneja autenticación, perfiles de usuario y suscripciones.

**Base de datos**: `ms_sesion_db` (MySQL 8.0+)

## Schema SQL

```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ms_sesion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ms_sesion_db;

-- Tabla de planes de suscripción
CREATE TABLE suscription_plans (
    Plan_Id INT AUTO_INCREMENT PRIMARY KEY,
    Plan_Name VARCHAR(100) NOT NULL UNIQUE,
    Description TEXT,
    Monthly_Price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Annual_Price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    Max_Users INT NOT NULL DEFAULT 1,
    Max_Quotations INT NULL COMMENT 'NULL = unlimited',
    Visual_Customization BOOLEAN DEFAULT FALSE,
    Features JSON,
    Status ENUM('active', 'inactive') DEFAULT 'active',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_plan_status (Status),
    INDEX idx_plan_name (Plan_Name)
) ENGINE=InnoDB;

-- Tabla de usuarios
CREATE TABLE users (
    User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Telefono VARCHAR(20) NULL,
    Pais_Residencia VARCHAR(10) NULL,
    Profile_Picture VARCHAR(255) NULL,
    Email_Verified BOOLEAN DEFAULT FALSE,
    Email_Verification_Token VARCHAR(255) NULL,
    Password_Reset_Token VARCHAR(255) NULL,
    Password_Reset_Expires DATETIME NULL,
    Last_Login DATETIME NULL,
    Status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    Refresh_Token TEXT NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (Email),
    INDEX idx_status (Status),
    INDEX idx_email_verification (Email_Verification_Token),
    INDEX idx_password_reset (Password_Reset_Token)
) ENGINE=InnoDB;

-- Tabla de suscripciones de usuarios
CREATE TABLE user_suscriptions (
    Suscription_Id INT AUTO_INCREMENT PRIMARY KEY,
    User_Id INT NOT NULL,
    Plan_Id INT NOT NULL,
    Start_Date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    End_Date DATETIME NOT NULL,
    Automatic_Renovation BOOLEAN DEFAULT FALSE,
    Status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    Payment_Method VARCHAR(50) NULL,
    Transaction_Id VARCHAR(100) NULL,
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (User_Id) REFERENCES users(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Plan_Id) REFERENCES suscription_plans(Plan_Id) ON DELETE RESTRICT,
    
    INDEX idx_user_id (User_Id),
    INDEX idx_plan_id (Plan_Id),
    INDEX idx_status (Status),
    INDEX idx_end_date (End_Date),
    
    UNIQUE KEY unique_active_user_suscription (User_Id, Status)
) ENGINE=InnoDB;

-- Tabla de usuarios interesados (landing page)
CREATE TABLE user_interested (
    Id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    Fecha_Inscripcion DATETIME NOT NULL,
    
    INDEX idx_correo (Correo),
    INDEX idx_fecha (Fecha_Inscripcion)
) ENGINE=InnoDB;
```

## Datos Iniciales

```sql
-- Insertar planes de suscripción
INSERT INTO suscription_plans (Plan_Name, Description, Monthly_Price, Annual_Price, Max_Users, Max_Quotations, Visual_Customization, Features) VALUES
('PLAN INICIAL', 'Plan básico para empezar', 0.00, 0.00, 1, 5, FALSE, '{"users": 1, "quotations": 5, "customization": false}'),
('PLAN PROFESIONAL', 'Plan profesional para pequeñas empresas', 29.00, 348.00, 5, 60, TRUE, '{"users": 5, "quotations": 60, "customization": true}'),
('PLAN PRO', 'Plan avanzado para empresas grandes', 60.00, 720.00, 20, NULL, TRUE, '{"users": 20, "quotations": "unlimited", "customization": true}');
```

## Tablas Detalladas

### 1. users
Tabla principal de usuarios del sistema.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| User_Id | INT | ID único del usuario | PK, AUTO_INCREMENT |
| Nombre | VARCHAR(50) | Nombre del usuario | NOT NULL, 1-50 chars |
| Apellido | VARCHAR(50) | Apellido del usuario | NOT NULL, 1-50 chars |
| Email | VARCHAR(100) | Correo electrónico | NOT NULL, UNIQUE, valid email |
| Password | VARCHAR(255) | Contraseña hasheada | NOT NULL, min 6 chars |
| Telefono | VARCHAR(20) | Número de teléfono | NULLABLE, max 20 chars |
| Pais_Residencia | VARCHAR(10) | Código de país | NULLABLE, max 10 chars |
| Profile_Picture | VARCHAR(255) | URL de imagen de perfil | NULLABLE |
| Email_Verified | BOOLEAN | Email verificado | DEFAULT false |
| Email_Verification_Token | VARCHAR(255) | Token de verificación | NULLABLE |
| Password_Reset_Token | VARCHAR(255) | Token de reset de password | NULLABLE |
| Password_Reset_Expires | DATETIME | Expiración del token | NULLABLE |
| Last_Login | DATETIME | Último inicio de sesión | NULLABLE |
| Status | ENUM | Estado del usuario | 'active', 'inactive', 'suspended' |
| Refresh_Token | TEXT | Token de renovación JWT | NULLABLE |
| Created_At | DATETIME | Fecha de creación | AUTO |
| Updated_At | DATETIME | Fecha de actualización | AUTO |

### 2. suscription_plans
Catálogo de planes de suscripción disponibles.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| Plan_Id | INT | ID único del plan | PK, AUTO_INCREMENT |
| Plan_Name | VARCHAR(100) | Nombre del plan | NOT NULL, unique |
| Description | TEXT | Descripción del plan | NULLABLE |
| Monthly_Price | DECIMAL(10,2) | Precio mensual | NOT NULL, >= 0 |
| Annual_Price | DECIMAL(10,2) | Precio anual | NOT NULL, >= 0 |
| Max_Users | INT | Máximo de usuarios | NOT NULL, >= 1 |
| Max_Quotations | INT | Máximo de cotizaciones | NULLABLE (NULL = ilimitado) |
| Visual_Customization | BOOLEAN | Personalización visual | DEFAULT false |
| Features | JSON | Características del plan | NULLABLE |
| Status | ENUM | Estado del plan | 'active', 'inactive' |
| Created_At | DATETIME | Fecha de creación | AUTO |
| Updated_At | DATETIME | Fecha de actualización | AUTO |

### 3. user_suscriptions
Relación entre usuarios y sus suscripciones activas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| Suscription_Id | INT | ID único de la suscripción | PK, AUTO_INCREMENT |
| User_Id | INT | ID del usuario | FK to users.User_Id |
| Plan_Id | INT | ID del plan | FK to suscription_plans.Plan_Id |
| Start_Date | DATETIME | Fecha de inicio | NOT NULL, DEFAULT NOW |
| End_Date | DATETIME | Fecha de finalización | NOT NULL |
| Automatic_Renovation | BOOLEAN | Renovación automática | DEFAULT false |
| Status | ENUM | Estado de la suscripción | 'active', 'expired', 'cancelled' |
| Payment_Method | VARCHAR(50) | Método de pago | NULLABLE |
| Transaction_Id | VARCHAR(100) | ID de transacción | NULLABLE |
| Created_At | DATETIME | Fecha de creación | AUTO |
| Updated_At | DATETIME | Fecha de actualización | AUTO |

### 4. user_interested
Tabla para usuarios interesados desde landing page.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| Id | MEDIUMINT | ID único | PK, AUTO_INCREMENT |
| Nombre | VARCHAR(100) | Nombre del interesado | NOT NULL |
| Correo | VARCHAR(100) | Email del interesado | NOT NULL |
| Fecha_Inscripcion | DATETIME | Fecha de inscripción | NOT NULL |

## Relaciones

### One-to-One
- `users.User_Id` ← → `user_suscriptions.User_Id`
  - Un usuario tiene una suscripción activa

### Many-to-One
- `user_suscriptions.Plan_Id` → `suscription_plans.Plan_Id`
  - Muchas suscripciones pueden usar el mismo plan

## Índices Recomendados

```sql
-- Índices para optimización de consultas
CREATE INDEX idx_users_email ON users(Email);
CREATE INDEX idx_users_status ON users(Status);
CREATE INDEX idx_user_suscriptions_user_id ON user_suscriptions(User_Id);
CREATE INDEX idx_user_suscriptions_status ON user_suscriptions(Status);
CREATE INDEX idx_user_suscriptions_end_date ON user_suscriptions(End_Date);
CREATE INDEX idx_suscription_plans_status ON suscription_plans(Status);
```

## Datos Iniciales (Seeders)

### Planes de Suscripción
```javascript
[
  {
    Plan_Name: "PLAN INICIAL",
    Monthly_Price: 0.00,
    Annual_Price: 0.00,
    Max_Users: 1,
    Max_Quotations: 5,
    Visual_Customization: false
  },
  {
    Plan_Name: "PLAN PROFESIONAL", 
    Monthly_Price: 29.00,
    Annual_Price: 348.00,
    Max_Users: 5,
    Max_Quotations: 60,
    Visual_Customization: true
  },
  {
    Plan_Name: "PLAN PRO",
    Monthly_Price: 60.00, 
    Annual_Price: 720.00,
    Max_Users: 20,
    Max_Quotations: null, // ilimitado
    Visual_Customization: true
  }
]
```

## Variables de Entorno Requeridas

```bash
# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=ms_sesion_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Security
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=2000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Endpoints del Microservicio

### Autenticación (`/api/auth/`)
- `POST /register` - Registro con asignación automática a plan inicial
- `POST /login` - Login con JWT en cookies httpOnly
- `POST /logout` - Logout con limpieza de tokens
- `POST /refresh-token` - Renovación automática de tokens
- `GET /profile` - Perfil completo con suscripción

### Gestión de Usuario (`/api/user/`)
- `PUT /profile` - Actualizar datos personales
- `PUT /change-password` - Cambio seguro de contraseña
- `PUT /auto-renewal` - Configurar renovación automática
- `GET /subscription-plans` - Obtener planes disponibles

### Utilidades
- `GET /api/health` - Estado del microservicio
- `POST /api/userInterested` - Registro desde landing

## Características de Seguridad

✅ **Autenticación JWT**: Tokens en cookies httpOnly  
✅ **Rate Limiting**: Protección contra ataques de fuerza bruta  
✅ **Helmet**: Headers de seguridad HTTP  
✅ **CORS**: Configurado para frontend específico  
✅ **Validación**: express-validator para inputs  
✅ **Sanitización**: Limpieza automática de datos  
✅ **Hashing**: bcryptjs para contraseñas  
✅ **Refresh Tokens**: Renovación automática segura