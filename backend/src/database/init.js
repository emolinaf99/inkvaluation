import db from './models/index.js';
import { seedSubscriptionPlans } from './seeders/subscriptionPlans.js';
import { seedComoNosConociste } from './seeders/comoNosConoceiste.js';

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Iniciando conexión con la base de datos...');
    
    // Verificar conexión
    await db.sequelize.authenticate();
    console.log('✅ Conexión con la base de datos establecida correctamente.');

    // Sincronizar modelos (crear tablas si no existen)
    await db.sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente.');

    // Ejecutar seeders
    await seedSubscriptionPlans();
    await seedComoNosConociste();
    console.log('✅ Base de datos inicializada correctamente.');

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    throw error;
  }
};