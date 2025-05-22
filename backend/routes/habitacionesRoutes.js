// habitacionesRoutes.js
import express from 'express';
import { mostrarHabitacionesDisponibles } from '../controllers/habitacionesController.js';

const router = express.Router();

router.get('/disponibles', mostrarHabitacionesDisponibles);

export default router;
