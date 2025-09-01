import db from '../database/models/index.js';
const Op = db.Sequelize.Op;

const indexController = {

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
    },

    submitFormulario: async (req, res) => {
        try {
            const { formId, sessionId, responses, completedAt, visitedQuestions } = req.body;

            // Log para debugging
            console.log('Recibiendo formulario:', {
                formId,
                sessionId, 
                responses: Object.keys(responses || {}),
                completedAt,
                visitedQuestions: Object.keys(visitedQuestions || {})
            });

            // Por ahora, solo devolvemos éxito
            // Aquí puedes agregar lógica para guardar en base de datos
            return res.status(200).json({ 
                mensaje: 'Formulario enviado exitosamente',
                submissionId: `submission_${Date.now()}`,
                status: 'completed'
            });

        } catch (error) {
            console.error('Error al enviar formulario:', error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });
        }
    }

};

export default indexController;