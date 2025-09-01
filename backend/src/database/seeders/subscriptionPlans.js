import db from '../models/index.js';
const { SuscriptionPlan } = db;

export const seedSubscriptionPlans = async () => {
  try {
    const plans = [
      {
        Plan_Name: 'PLAN INICIAL',
        Description: 'Plan básico para empezar',
        Monthly_Price: 0.00,
        Annual_Price: 0.00,
        Max_Users: 1,
        Max_Quotations: 5,
        Visual_Customization: false,
        Features: {
          users: 1,
          quotations: 5,
          customization: false
        },
        Status: 'active'
      },
      {
        Plan_Name: 'PLAN PROFESIONAL',
        Description: 'Plan profesional para pequeñas empresas',
        Monthly_Price: 29.00,
        Annual_Price: 348.00,
        Max_Users: 5,
        Max_Quotations: 60,
        Visual_Customization: true,
        Features: {
          users: 5,
          quotations: 60,
          customization: true
        },
        Status: 'active'
      },
      {
        Plan_Name: 'PLAN PRO',
        Description: 'Plan avanzado para empresas grandes',
        Monthly_Price: 60.00,
        Annual_Price: 720.00,
        Max_Users: 20,
        Max_Quotations: null, // ilimitadas
        Visual_Customization: true,
        Features: {
          users: 20,
          quotations: 'unlimited',
          customization: true
        },
        Status: 'active'
      }
    ];

    for (const planData of plans) {
      const [plan, created] = await SuscriptionPlan.findOrCreate({
        where: { Plan_Name: planData.Plan_Name },
        defaults: planData
      });

      if (created) {
        console.log(`✅ Plan creado: ${plan.Plan_Name}`);
      } else {
        console.log(`ℹ️ Plan ya existe: ${plan.Plan_Name}`);
      }
    }

    console.log('✅ Planes de suscripción inicializados correctamente');
  } catch (error) {
    console.error('❌ Error inicializando planes de suscripción:', error);
    throw error;
  }
};