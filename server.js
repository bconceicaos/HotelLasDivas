// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
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
const allowedOrigins = [
  'http://localhost:3000',
  'https://hotellasdivas.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Seguridad
app.use(helmet({ 
    contentSecurityPolicy: false 
}));
app.use(mongoSanitize());

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

app.get('/', (req, res) => {
  res.send('API Hotel Las Divas está corriendo correctamente');
});

// ruta protegida
app.get('/api/auth/me', verificarToken, (req, res) => {
  res.json({ user: req.user });
});


// Middleware de errores
app.use(errorMiddleware);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
backend.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
