import { Router } from 'express';
import controller from '../controllers/indexController.js';

const router = Router();

// APIs
router.post("/api/userInterested", controller.inscripcionUsuarioInteresado);

export default router;