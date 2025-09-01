import db from '../models/index.js';

const { ComoNosConociste } = db;

export const seedComoNosConociste = async () => {
  try {
    const opciones = [
      'Búsqueda en Google',
      'Redes sociales (Facebook, Instagram, TikTok)',
      'Recomendación de un amigo',
      'YouTube',
      'Publicidad online',
      'Ferias o eventos de tatuajes',
      'Otro estudio de tatuajes',
      'Blog o artículo',
      'Publicidad tradicional (radio, TV, periódico)',
      'Otro'
    ];

    for (const descripcion of opciones) {
      await ComoNosConociste.findOrCreate({
        where: { Descripcion: descripcion },
        defaults: {
          Descripcion: descripcion,
          Status: 'active'
        }
      });
    }

    console.log('✅ Opciones de "Cómo nos conociste" inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error inicializando opciones de "Cómo nos conociste":', error);
    throw error;
  }
};