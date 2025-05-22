// authController.js
import jwt from 'jsonwebtoken';
import User  from '../models/User.js';
import * as authService from '../../src/services/authService.js';
import { generarToken, generarRefreshToken } from '../utils/jwt.js';
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);
    const user = await authService.loginUser({ email, password });

    // Generar token de acceso y refresh token
    const accessToken = generarToken(user);
    const refreshToken = generarRefreshToken(user);

    // Enviar los tokens como cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000,  // 1 hora de expiración
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 días de expiración
    });

    res.status(200).json({ message: 'Login exitoso', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const register = async (req, res) => {
    try {
        const { nombre, apellidos, dni, email, password, telefono } = req.body;

        if (!nombre || !apellidos || !dni || !email || !password || !telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Verificar si el email ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        // Verificar si el DNI ya está registrado
        const existingDni = await User.findOne({ dni });
        if (existingDni) {
            return res.status(400).json({ error: 'Este DNI ya está registrado' });
        }

        const user = new User({ nombre, apellidos, dni, email, password, telefono });
        await user.save();

        // Emitir evento WebSocket solo a admins
        const wss = req.app.get('wss');
        if (wss) {
            const evento = {
                email: user.email,
                nombre: user.nombre,
                creadoEn: user.createdAt,
            };

            if (typeof wss.broadcastToAdmins === 'function') {
                wss.broadcastToAdmins('user', evento);
            } else {
                wss.broadcast('user', evento);
            }
        }


        // Generar token de acceso
        const accessToken = generarToken(user);
        const refreshToken = generarRefreshToken(user);

        // Enviar los tokens como cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000,  // 1 hora
            path: '/',
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 días
        });

        res.status(200).json({ message: 'Usuario registrado con éxito', user });
    } catch (err) {
        console.error('Error al registrar:', err);
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};


export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;  // Obtener refresh token de las cookies

    if (!refreshToken) {
        console.log('No se recibió refreshToken');
        return res.status(401).json({ message: 'No hay refresh token' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
        console.log('Refresh token decodificado:', decoded);

        // Generar nuevo access token
        const newAccessToken = generarToken(decoded);  // Asegúrate de que la función generarToken sea correcta

        // Enviar nuevo access token como cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1000,  // 1 hora
            path: '/',
        });

        // Responder con el nuevo access token
        res.json({ access_token: newAccessToken });

    } catch (error) {
        console.error('Error al verificar refresh token:', error);
        res.status(403).json({ message: 'Refresh token inválido o expirado' });
    }
};

export const logout = (req, res) => {
    console.log('Cerrando sesión...');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

export const validateRole = (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ message: 'No autenticado' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verificar rol admin
        if (decoded.rol === 'admin') {
            return res.status(200).json({ message: 'Admin verificado', role: 'admin' });
        }

        // Verificar rol user
        if (decoded.rol === 'user') {
            return res.status(200).json({ message: 'Usuario verificado', role: 'user' });
        }

        return res.status(403).json({ message: 'Acceso denegado' });
    } catch {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
