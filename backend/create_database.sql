-- Script de creación de base de datos MySQL para InkValuation User Service
-- Base de datos: ms_sesion_db

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
) ENGINE=InnoDB COMMENT='Catálogo de planes de suscripción';

-- Tabla de opciones "Cómo nos conociste"
CREATE TABLE como_nos_conociste_options (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion VARCHAR(100) NOT NULL UNIQUE,
    Status ENUM('active', 'inactive') DEFAULT 'active',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (Status)
) ENGINE=InnoDB COMMENT='Opciones de cómo nos conociste';

-- Tabla de usuarios
CREATE TABLE users (
    User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Telefono VARCHAR(20) NULL,
    Pais_Residencia VARCHAR(10) NULL,
    Fecha_Nacimiento DATE NULL,
    Como_Nos_Conociste_Id INT NULL,
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
    
    FOREIGN KEY (Como_Nos_Conociste_Id) REFERENCES como_nos_conociste_options(Id) ON DELETE SET NULL,
    
    INDEX idx_email (Email),
    INDEX idx_status (Status),
    INDEX idx_email_verification (Email_Verification_Token),
    INDEX idx_password_reset (Password_Reset_Token),
    INDEX idx_como_nos_conociste (Como_Nos_Conociste_Id)
) ENGINE=InnoDB COMMENT='Usuarios del sistema';

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
) ENGINE=InnoDB COMMENT='Suscripciones activas de usuarios';

-- Tabla de usuarios interesados (landing page)
CREATE TABLE user_interested (
    Id MEDIUMINT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    Fecha_Inscripcion DATETIME NOT NULL,
    
    INDEX idx_correo (Correo),
    INDEX idx_fecha (Fecha_Inscripcion)
) ENGINE=InnoDB COMMENT='Usuarios interesados desde landing page';

-- Insertar opciones de "Cómo nos conociste"
INSERT INTO como_nos_conociste_options (Descripcion) VALUES
('Búsqueda en Google'),
('Redes sociales (Facebook, Instagram, TikTok)'),
('Recomendación de un amigo'),
('YouTube'),
('Publicidad online'),
('Ferias o eventos de tatuajes'),
('Otro estudio de tatuajes'),
('Blog o artículo'),
('Publicidad tradicional (radio, TV, periódico)'),
('Otro');

-- Insertar planes de suscripción iniciales
INSERT INTO suscription_plans (Plan_Name, Description, Monthly_Price, Annual_Price, Max_Users, Max_Quotations, Visual_Customization, Features) VALUES
('PLAN INICIAL', 'Plan básico para empezar', 0.00, 0.00, 1, 5, FALSE, '{"users": 1, "quotations": 5, "customization": false}'),
('PLAN PROFESIONAL', 'Plan profesional para pequeñas empresas', 29.00, 348.00, 5, 60, TRUE, '{"users": 5, "quotations": 60, "customization": true}'),
('PLAN PRO', 'Plan avanzado para empresas grandes', 60.00, 720.00, 20, NULL, TRUE, '{"users": 20, "quotations": "unlimited", "customization": true}');

-- Verificar instalación
SELECT 'Base de datos ms_sesion_db creada exitosamente' AS Resultado;
SELECT Plan_Name, Monthly_Price, Annual_Price FROM suscription_plans;