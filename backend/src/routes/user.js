import express from 'express';
import { body } from 'express-validator';
import { verifyToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/security.js';
import bcrypt from 'bcryptjs';
import db from '../database/models/index.js';

const { User, ComoNosConociste } = db;
const router = express.Router();

// Validaciones para actualizar perfil
const updateProfileValidation = [
  body('Nombre')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El nombre debe tener entre 1 y 50 caracteres'),
  body('Apellido')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El apellido debe tener entre 1 y 50 caracteres'),
  body('Telefono')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),
  body('Pais_Residencia')
    .optional()
    .isLength({ max: 10 })
    .withMessage('El código de país no puede exceder 10 caracteres')
];

// Validaciones para cambiar contraseña
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { Nombre, Apellido, Telefono, Pais_Residencia, Profile_Picture } = req.body;

    const updateData = {};
    if (Nombre !== undefined) updateData.Nombre = Nombre;
    if (Apellido !== undefined) updateData.Apellido = Apellido;
    if (Telefono !== undefined) updateData.Telefono = Telefono;
    if (Pais_Residencia !== undefined) updateData.Pais_Residencia = Pais_Residencia;
    if (Profile_Picture !== undefined) updateData.Profile_Picture = Profile_Picture;

    await User.update(updateData, {
      where: { User_Id: userId }
    });

    const updatedUser = await User.findOne({
      where: { User_Id: userId },
      include: [{
        model: ComoNosConociste,
        as: 'ComoNosConociste',
        required: false
      }],
      attributes: { exclude: ['Password', 'Refresh_Token'] }
    });

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({ where: { User_Id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.Password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    await User.update(
      { Password: hashedNewPassword },
      { where: { User_Id: userId } }
    );

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener opciones de "Cómo nos conociste"
export const getComoNosConociste = async (req, res) => {
  try {
    const opciones = await ComoNosConociste.findAll({
      where: { Status: 'active' },
      attributes: ['Id', 'Descripcion'],
      order: [['Descripcion', 'ASC']]
    });

    res.json({
      success: true,
      opciones: opciones
    });

  } catch (error) {
    console.error('Error obteniendo opciones de "Cómo nos conociste":', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Rutas
router.put('/profile', 
  verifyToken,
  updateProfileValidation,
  validateRequest,
  updateProfile
);

router.put('/change-password',
  verifyToken,
  changePasswordValidation,
  validateRequest,
  changePassword
);

router.get('/como-nos-conociste',
  getComoNosConociste
);

// ====================================================================
// NOTA: Las rutas de autenticación están disponibles en /api/auth/*
// Este microservicio solo maneja operaciones de perfil de usuario
// ====================================================================

export default router;