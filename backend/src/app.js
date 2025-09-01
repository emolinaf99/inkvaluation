import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Importar middleware de seguridad
import { helmetConfig, generalRateLimit, apiRateLimit, sanitizeInput } from './middleware/security.js';

// Importar rutas del microservicio
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

// Importar inicialización de base de datos
import { initializeDatabase } from './database/init.js';

// Importar módulos existentes
import config from './modules/server.js';
import statics from './modules/static.js';

dotenv.config();

const app = express();
const port = process.env.PORT || config.port || 3000;

// Configuración de archivos estáticos y rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de seguridad
app.use(helmetConfig);
app.use('/api', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
app.use('/api/', apiRateLimit);
app.use(generalRateLimit);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(sanitizeInput);

// Archivos estáticos
app.use(statics(path.join(__dirname,"../public")));

// Rutas del microservicio de usuario
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Rutas adicionales (mantener solo user-interested para landing)
import indexRoutes from './routes/index.routes.js';
app.use(indexRoutes);

// Ruta de prueba del microservicio
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Microservicio de usuario funcionando correctamente',
    service: 'user-session-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Inicializar base de datos y servidor
const iniciarServidor = async () => {
  try {
    await initializeDatabase();
    
    app.listen(port, () => {
      console.log(`🚀 Microservicio de Usuario corriendo en http://localhost:${port}`);
      console.log(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔒 Seguridad: Helmet, CORS y Rate Limiting activados`);
      console.log(`💾 Base de datos: MySQL con Sequelize ORM`);
      console.log(`🔐 Autenticación: JWT con cookies httpOnly`);
      console.log(`👤 Servicios: Autenticación, Perfil de Usuario, Suscripciones`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();