const db = require('../database/models/index'); // trae toda la base de datos
const Op = db.Sequelize.Op; // operadores sequelize

module.exports = {

    inscripcionUsuarioInteresado: async (req, res) => {
        try {
            // Verificar que el cuerpo tenga los campos requeridos
            const { nombre, email } = req.body;

            if (!nombre || !email) {
                return res.status(400).json({ mensaje: 'Nombre y correo son obligatorios' });
            }

            // Buscar si ya existe una inscripción con ese correo
            const inscripcionExistente = await db.User_Interested.findOne({
                where: { Correo: email }
            });

            if (inscripcionExistente) {
                return res.status(409).json({ mensaje: 'Correo ya inscrito' }); // 409 Conflict es más preciso
            }

            // Crear nueva inscripción
            await db.User_Interested.create({
                Nombre: nombre,
                Correo: email,
                Fecha_Inscripcion: new Date()
            });

            return res.status(201).json({ mensaje: 'Inscripción realizada exitosamente' }); // 201 Created

        } catch (error) {
            console.error('Error en la inscripción:', error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

}