import bcrypt from 'bcrypt';
import { body } from 'express-validator';
import nodemailer from 'nodemailer';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/security.js';

import db from '../database/models/index.js';
const { User, UserSuscription, SuscriptionPlan, ComoNosConociste } = db;

// Configuración del transportador de correo
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Template de correo de confirmación
const getWelcomeEmailTemplate = (nombre, apellido) => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Bienvenido a InkValuation!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; background-color: #666666;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            <!-- Header -->
            <div style="background-color: #114B7A; padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">InkValuation</h1>
                <p style="color: #F6CA75; margin: 10px 0 0 0; font-size: 16px;">Optimiza tus cotizaciones</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <h2 style="color: #114B7A; margin: 0 0 20px 0; font-size: 24px;">¡Bienvenido ${nombre} ${apellido}!</h2>
                
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Nos complace confirmar que tu cuenta en <strong>InkValuation</strong> ha sido creada exitosamente.
                </p>
                
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    Ahora puedes comenzar a optimizar tus cotizaciones y ganar más clientes con nuestra plataforma diseñada especialmente para estudios de tatuajes y piercings.
                </p>
                
                <!-- Features -->
                <div style="background-color: #fbfbfb; border-radius: 10px; padding: 25px; margin: 30px 0;">
                    <h3 style="color: #114B7A; margin: 0 0 20px 0; font-size: 20px;">¿Qué puedes hacer ahora?</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="color: #039BE5; font-weight: bold;">✓</span>
                        <span style="color: #333; margin-left: 10px;">Configurar tu perfil y servicios</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="color: #90d387; font-weight: bold;">✓</span>
                        <span style="color: #333; margin-left: 10px;">Crear formularios personalizados</span>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <span style="color: #F6CA75; font-weight: bold;">✓</span>
                        <span style="color: #333; margin-left: 10px;">Recibir cotizaciones 24/7 con nuestro asistente virtual</span>
                    </div>
                    
                    <div>
                        <span style="color: #114B7A; font-weight: bold;">✓</span>
                        <span style="color: #333; margin-left: 10px;">Gestionar clientes potenciales de manera eficiente</span>
                    </div>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}" style="background-color: #039BE5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block;">
                        Comenzar a usar InkValuation
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0; text-align: center;">
                    Si tienes alguna pregunta, no dudes en contactarnos.<br>
                    ¡Estamos aquí para ayudarte a optimizar tu negocio!
                </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #114B7A; padding: 20px; text-align: center;">
                <p style="color: #F6CA75; margin: 0; font-size: 14px;">
                    © 2024 InkValuation. Todos los derechos reservados.
                </p>
                <p style="color: white; margin: 10px 0 0 0; font-size: 12px;">
                    Plataforma especializada para estudios de tatuajes y piercings
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

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
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('contrasena')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmarContrasena')
    .custom((value, { req }) => {
      if (value !== req.body.contrasena) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),
  body('fechaDeNacimiento')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe ser válida'),
  body('telefono')
    .isLength({ min: 7, max: 20 })
    .withMessage('El teléfono debe tener entre 7 y 20 caracteres'),
  body('paisDeResidencia')
    .notEmpty()
    .withMessage('El país de residencia es requerido'),
  body('comoNosConociste')
    .notEmpty()
    .withMessage('Debes indicar cómo nos conociste')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

export const register = async (req, res) => {
  try {
    const { 
      nombre, 
      apellido, 
      email, 
      contrasena, 
      fechaDeNacimiento,
      telefono, 
      paisDeResidencia,
      comoNosConociste 
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
    const hashedPassword = await bcrypt.hash(contrasena, 12);

    // Buscar el ID de "Como nos conociste"
    let comoNosConociste_Id = null;
    if (comoNosConociste) {
      const comoNosConociste_option = await ComoNosConociste.findOne({
        where: { Descripcion: comoNosConociste }
      });
      comoNosConociste_Id = comoNosConociste_option?.Id || null;
    }

    // Crear el usuario
    const user = await User.create({
      Nombre: nombre,
      Apellido: apellido,
      Email: email,
      Password: hashedPassword,
      Telefono: telefono,
      Pais_Residencia: paisDeResidencia,
      Fecha_Nacimiento: fechaDeNacimiento,
      Como_Nos_Conociste_Id: comoNosConociste_Id
    });

    // Asignar plan inicial
    const defaultPlan = await SuscriptionPlan.findOne({ 
      where: { Plan_Name: 'PLAN INICIAL' } 
    });

    if (defaultPlan) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await UserSuscription.create({
        User_Id: user.User_Id,
        Plan_Id: defaultPlan.Plan_Id,
        Start_Date: startDate,
        End_Date: endDate,
        Automatic_Renovation: false
      });
    }

    // Generar tokens
    const token = generateToken({ 
      userId: user.User_Id, 
      email: user.Email 
    });
    
    const refreshToken = generateRefreshToken({ 
      userId: user.User_Id 
    });

    await User.update(
      { Refresh_Token: refreshToken },
      { where: { User_Id: user.User_Id } }
    );

    // Configurar cookies
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    // Enviar correo de bienvenida
    try {
      const transporter = createTransporter();
      const emailTemplate = getWelcomeEmailTemplate(nombre, apellido);

      await transporter.sendMail({
        from: `"InkValuation" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '¡Bienvenido a InkValuation! Tu cuenta ha sido creada exitosamente',
        html: emailTemplate
      });

      console.log(`Correo de bienvenida enviado a ${email}`);
    } catch (emailError) {
      console.error('Error enviando correo de bienvenida:', emailError);
      // No fallar el registro si el correo falla
    }

    const { Password: _, Refresh_Token: __, ...userWithoutSensitiveData } = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userWithoutSensitiveData,
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { Email: email },
      include: [{
        model: UserSuscription,
        as: 'UserSuscription',
        include: [{
          model: SuscriptionPlan,
          as: 'SuscriptionPlan'
        }]
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    if (user.Status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Cuenta suspendida o inactiva'
      });
    }

    await User.update(
      { Last_Login: new Date() },
      { where: { User_Id: user.User_Id } }
    );

    const token = generateToken({ 
      userId: user.User_Id, 
      email: user.Email,
      nombre: user.Nombre,
      apellido: user.Apellido
    });
    
    const refreshToken = generateRefreshToken({ 
      userId: user.User_Id 
    });

    await User.update(
      { Refresh_Token: refreshToken },
      { where: { User_Id: user.User_Id } }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { Password: _, Refresh_Token: __, ...userWithoutSensitiveData } = user.toJSON();

    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutSensitiveData,
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    await User.update(
      { Refresh_Token: null },
      { where: { User_Id: userId } }
    );

    res.clearCookie('authToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logout exitoso'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token requerido'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findOne({ 
      where: { 
        User_Id: decoded.userId,
        Refresh_Token: refreshToken 
      } 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }

    const newToken = generateToken({ 
      userId: user.User_Id, 
      email: user.Email 
    });

    res.cookie('authToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      token: newToken
    });

  } catch (error) {
    console.error('Error renovando token:', error);
    res.status(401).json({
      success: false,
      message: 'Refresh token inválido'
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findOne({
      where: { User_Id: userId },
      include: [{
        model: UserSuscription,
        as: 'UserSuscription',
        include: [{
          model: SuscriptionPlan,
          as: 'SuscriptionPlan'
        }]
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