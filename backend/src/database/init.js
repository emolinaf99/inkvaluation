import db from './models/index.js';
import { seedComoNosConociste } from './seeders/comoNosConoceiste.js';

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Iniciando conexión con la base de datos...');
    
    // Verificar conexión
    await db.sequelize.authenticate();
    console.log('✅ Conexión con la base de datos establecida correctamente.');

    // Sincronizar modelos (crear tablas si no existen, pero no alterar las existentes)
    await db.sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados correctamente.');

    // Ejecutar seeders
    await seedComoNosConociste();
    console.log('✅ Base de datos inicializada correctamente.');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    throw error;
  }
};