// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import nodemailer from 'nodemailer';
import http from 'http';

import connectDB from './backend/utils/db.js';
import { errorMiddleware } from './backend/middlewares/errorMiddleware.js';
import { verificarToken } from './backend/middlewares/authMiddleware.js';

import { inicializarWebSocket } from './backend/websockets/socket.js';


import { validarLogin, verificarErrores } from './backend/utils/validations.js';

// Conectar a la base de datos MongoDB
connectDB();

// Inicializar Express y WebSocket
const app = express();
const backend = http.createServer(app);       // Crea el servidor HTTP manualmente para compartirlo con ws
const wss = inicializarWebSocket(backend);    // Inicializar WebSocket con el servidor HTTP

app.set('wss', wss);

// Middlewares globales
app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Seguridad
app.use(helmet({ 
    contentSecurityPolicy: false 
}));
app.use(mongoSanitize());

// Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Rutas
import authRoutes from './backend/routes/auth.js';
import protectedRoutes from './backend/routes/protectedRoute.js';
import usersRoutes from './backend/routes/usersRoutes.js';
import habitacionesRoutes from './backend/routes/habitacionesRoutes.js';
import reservasRoutes from './backend/routes/reservasRoutes.js';

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/reservas', reservasRoutes);

// ruta protegida
app.get('/api/auth/me', verificarToken, (req, res) => {
  res.json({ user: req.user });
});


// Envío de correo
app.post('/enviar-email', async (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Confirmación de solicitud de información',
    html: `<p>Hola <strong>${nombre}</strong>, hemos recibido tu solicitud. Bienvenido a TaskPlanner. Nos pondremos en contacto contigo pronto al email <strong>${email}</strong>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Correo de confirmación enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
  }
});


// Middleware de errores
app.use(errorMiddleware);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
backend.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
