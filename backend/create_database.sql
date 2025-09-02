-- Script de creación de base de datos MySQL para InkValuation
-- Base de datos: ms_sesion_db
-- Motor: MySQL 8.0+
-- Configuración basada en basededatos.md

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS ms_sesion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE ms_sesion_db;

-- =============================================================================
-- TABLA: como_nos_conociste_options
-- =============================================================================
CREATE TABLE `como_nos_conociste_options` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(100) NOT NULL,
  `Status` enum('active','inactive') DEFAULT 'active',
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Descripcion` (`Descripcion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================================================
-- TABLA: users (CRÍTICO: timestamps con DEFAULT CURRENT_TIMESTAMP)
-- =============================================================================
CREATE TABLE `users` (
  `User_Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Apellido` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Pais_Residencia` varchar(10) DEFAULT NULL,
  `Fecha_Nacimiento` date DEFAULT NULL,
  `Como_Nos_Conociste_Id` int DEFAULT NULL,
  `Profile_Picture` varchar(255) DEFAULT NULL,
  `Email_Verified` tinyint(1) DEFAULT '0',
  `Email_Verification_Token` varchar(255) DEFAULT NULL,
  `Password_Reset_Token` varchar(255) DEFAULT NULL,
  `Password_Reset_Expires` datetime DEFAULT NULL,
  `Last_Login` datetime DEFAULT NULL,
  `Status` enum('active','inactive','suspended') DEFAULT 'active',
  `Refresh_Token` text,
  `Created_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Updated_At` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`User_Id`),
  UNIQUE KEY `Email` (`Email`),
  KEY `Como_Nos_Conociste_Id` (`Como_Nos_Conociste_Id`),
  KEY `Status` (`Status`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`Como_Nos_Conociste_Id`) REFERENCES `como_nos_conociste_options` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================================================
-- TABLA: user_interested (Landing page)
-- =============================================================================
CREATE TABLE `user_interested` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `Fecha_Inscripcion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =============================================================================
-- DATOS SEED: Opciones "Cómo nos conociste"
-- =============================================================================
INSERT INTO `como_nos_conociste_options` (`Descripcion`, `Status`) VALUES
('Búsqueda en Google', 'active'),
('Redes sociales (Facebook, Instagram, TikTok)', 'active'),
('Recomendación de un amigo', 'active'),
('YouTube', 'active'),
('Publicidad online', 'active'),
('Ferias o eventos de tatuajes', 'active'),
('Otro estudio de tatuajes', 'active'),
('Blog o artículo', 'active'),
('Publicidad tradicional (radio, TV, periódico)', 'active'),
('Otro', 'active');

-- =============================================================================
-- VERIFICACIONES
-- =============================================================================

-- Verificar estructura de timestamps (CRÍTICO)
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_DEFAULT, 
    EXTRA 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
    AND COLUMN_NAME IN ('Created_At', 'Updated_At')
    AND TABLE_SCHEMA = 'ms_sesion_db';

-- Verificar datos de "Cómo nos conociste"
SELECT Id, Descripcion, Status FROM como_nos_conociste_options WHERE Status = 'active' ORDER BY Descripcion;

-- Mensaje de éxito
SELECT 'Base de datos ms_sesion_db creada exitosamente con estructura corregida' AS Resultado;