import express from 'express';
import { obtenerReservasPorCliente, obtenerTodasLasReservas, crearReserva, actualizarReserva, cancelarReserva } from '../controllers/reservasController.js';

const router = express.Router();

router.get('/', obtenerTodasLasReservas);
router.get('/cliente/:id', obtenerReservasPorCliente);
router.post('/crearReserva', crearReserva);
router.put('/:id', actualizarReserva);
router.delete('/:id', cancelarReserva);

export default router;
