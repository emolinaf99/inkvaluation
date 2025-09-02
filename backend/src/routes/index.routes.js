import express from 'express';
import indexController from '../controllers/indexController.js';

const router = express.Router();

// Ruta para inscripción de usuarios interesados (landing page)
router.post('/inscripcion', indexController.inscripcionUsuarioInteresado);

export default router;