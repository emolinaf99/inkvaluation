import db from '../database/models/index.js';

const { User, UserSuscription, SuscriptionPlan } = db;

/**
 * Verifica y asigna plan gratuito a usuarios que no tengan plan activo
 */
export const ensureAllUsersHavePlan = async () => {
  try {
    console.log('🔍 Verificando usuarios sin plan activo...');

    // Buscar usuarios sin suscripción activa
    const usersWithoutActivePlan = await User.findAll({
      include: [{
        model: UserSuscription,
        as: 'UserSuscription',
        where: { Status: 'active' },
        required: false
      }],
      where: {
        '$UserSuscription.Suscription_Id$': null
      }
    });

    if (usersWithoutActivePlan.length === 0) {
      console.log('✅ Todos los usuarios tienen plan activo');
      return { success: true, usersFixed: 0 };
    }

    console.log(`⚠️  Encontrados ${usersWithoutActivePlan.length} usuarios sin plan activo`);

    // Obtener plan inicial
    const defaultPlan = await SuscriptionPlan.findOne({
      where: { Plan_Name: 'Plan Inicial', Status: 'active' }
    });

    if (!defaultPlan) {
      throw new Error('Plan Inicial no encontrado en el sistema');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 año gratis

    let usersFixed = 0;

    // Asignar plan a cada usuario
    for (const user of usersWithoutActivePlan) {
      try {
        await UserSuscription.create({
          User_Id: user.User_Id,
          Plan_Id: defaultPlan.Plan_Id,
          Start_Date: startDate,
          End_Date: endDate,
          Automatic_Renovation: false,
          Status: 'active'
        });

        console.log(`✅ Plan asignado al usuario ${user.User_Id} (${user.Email})`);
        usersFixed++;
      } catch (error) {
        console.error(`❌ Error asignando plan al usuario ${user.User_Id}:`, error);
      }
    }

    console.log(`✅ Proceso completado. ${usersFixed} usuarios corregidos`);
    return { success: true, usersFixed };

  } catch (error) {
    console.error('❌ Error en ensureAllUsersHavePlan:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifica si un usuario tiene plan activo
 */
export const userHasActivePlan = async (userId) => {
  try {
    const activePlan = await UserSuscription.findOne({
      where: {
        User_Id: userId,
        Status: 'active',
        End_Date: {
          [db.Sequelize.Op.gt]: new Date()
        }
      }
    });

    return !!activePlan;
  } catch (error) {
    console.error('Error verificando plan activo:', error);
    return false;
  }
};

/**
 * Obtiene estadísticas de planes
 */
export const getPlanStats = async () => {
  try {
    const stats = await SuscriptionPlan.findAll({
      include: [{
        model: UserSuscription,
        as: 'UserSuscriptions',
        where: { Status: 'active' },
        required: false
      }],
      attributes: {
        include: [
          [db.Sequelize.fn('COUNT', db.Sequelize.col('UserSuscriptions.Suscription_Id')), 'active_users']
        ]
      },
      group: ['SuscriptionPlan.Plan_Id']
    });

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas de planes:', error);
    return [];
  }
};