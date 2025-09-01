import express from 'express';
import { 
  register, 
  login, 
  logout, 
  refreshToken, 
  getProfile,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest, authRateLimit } from '../middleware/security.js';

const router = express.Router();

router.post('/register', 
  authRateLimit,
  registerValidation,
  validateRequest,
  register
);

router.post('/login', 
  authRateLimit,
  loginValidation,
  validateRequest,
  login
);

router.post('/logout', 
  verifyToken,
  logout
);

router.post('/refresh-token', 
  refreshToken
);

router.get('/profile', 
  verifyToken,
  getProfile
);

// Verificar si el usuario está autenticado (para guards de Vue)
router.get('/check', 
  verifyToken,
  (req, res) => {
    // Si llegamos aquí, el token es válido (gracias al middleware verifyToken)
    res.json({
      success: true,
      authenticated: true,
      user: {
        userId: req.user.userId,
        email: req.user.email
      }
    });
  }
);

export default router;