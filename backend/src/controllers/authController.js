import bcrypt from 'bcrypt';
import { body } from 'express-validator';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';

import db from '../database/models/index.js';
const { User, ComoNosConociste } = db;

// Validaciones para registro
export const registerValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El nombre debe tener entre 1 y 50 caracteres'),
  body('apellido')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('El apellido debe tener entre 1 y 50 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono')
    .optional()
    .isLength({ max: 20 })
    .withMessage('El teléfono no puede exceder 20 caracteres'),
  body('pais_residencia')
    .optional()
    .isLength({ max: 10 })
    .withMessage('El código de país no puede exceder 10 caracteres'),
  body('como_nos_conociste_id')
    .optional()
    .isInt()
    .withMessage('Debe ser un ID válido')
];

// Validaciones para login
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña requerida')
];

// Registro de usuario
export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      password,
      telefono,
      pais_residencia,
      fecha_nacimiento,
      como_nos_conociste_id
    } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const newUser = await User.create({
      Nombre: nombre,
      Apellido: apellido,
      Email: email,
      Password: hashedPassword,
      Telefono: telefono || null,
      Pais_Residencia: pais_residencia || null,
      Fecha_Nacimiento: fecha_nacimiento || null,
      Como_Nos_Conociste_Id: como_nos_conociste_id || null,
      Email_Verified: false,
      Status: 'active'
    });

    // Generar tokens
    const payload = {
      userId: newUser.User_Id,
      email: newUser.Email,
      nombre: newUser.Nombre
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Guardar refresh token
    await User.update(
      { Refresh_Token: refreshToken },
      { where: { User_Id: newUser.User_Id } }
    );

    // Configurar cookie del token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        User_Id: newUser.User_Id,
        Nombre: newUser.Nombre,
        Apellido: newUser.Apellido,
        Email: newUser.Email,
        Telefono: newUser.Telefono,
        Pais_Residencia: newUser.Pais_Residencia,
        Status: newUser.Status,
        Created_At: newUser.Created_At
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Login de usuario
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({
      where: { Email: email, Status: 'active' },
      include: [{
        model: ComoNosConociste,
        as: 'ComoNosConociste',
        required: false
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await User.update(
      { Last_Login: new Date() },
      { where: { User_Id: user.User_Id } }
    );

    // Generar tokens
    const payload = {
      userId: user.User_Id,
      email: user.Email,
      nombre: user.Nombre
    };

    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Guardar refresh token
    await User.update(
      { Refresh_Token: refreshToken },
      { where: { User_Id: user.User_Id } }
    );

    // Configurar cookie del token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        User_Id: user.User_Id,
        Nombre: user.Nombre,
        Apellido: user.Apellido,
        Email: user.Email,
        Telefono: user.Telefono,
        Pais_Residencia: user.Pais_Residencia,
        Status: user.Status,
        Last_Login: user.Last_Login,
        Created_At: user.Created_At
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Logout de usuario
export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Eliminar refresh token de la base de datos
    await User.update(
      { Refresh_Token: null },
      { where: { User_Id: userId } }
    );

    // Limpiar cookie
    res.clearCookie('authToken');

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Buscar usuario
    const user = await User.findOne({
      where: { 
        User_Id: decoded.userId,
        Refresh_Token: refreshToken,
        Status: 'active'
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    // Generar nuevo token de acceso
    const payload = {
      userId: user.User_Id,
      email: user.Email,
      nombre: user.Nombre
    };

    const newToken = generateToken(payload);

    // Configurar cookie del nuevo token
    res.cookie('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.json({
      success: true,
      message: 'Token renovado exitosamente'
    });

  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido'
    });
  }
};

// Obtener perfil del usuario autenticado
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({
      where: { User_Id: userId },
      include: [{
        model: ComoNosConociste,
        as: 'ComoNosConociste',
        required: false
      }],
      attributes: { exclude: ['Password', 'Refresh_Token'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};