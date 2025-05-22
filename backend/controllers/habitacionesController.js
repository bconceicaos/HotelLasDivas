// habitacionesController.js

import Habitacion from '../models/Habitacion.js';
import Reserva from '../models/Reserva.js';

export const mostrarHabitacionesDisponibles = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, numPersonas } = req.query;

    // Validación de parámetros
    if (!checkInDate || !checkOutDate || !numPersonas) {
      return res.status(400).json({ message: "Faltan parámetros." });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numPersonasInt = parseInt(numPersonas);

    if (
      isNaN(checkIn.getTime()) || 
      isNaN(checkOut.getTime()) || 
      isNaN(numPersonasInt)
    ) {
      return res.status(400).json({ message: "Parámetros inválidos." });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: "La fecha de salida debe ser posterior a la de entrada." });
    }

    // Buscar reservas solapadas
    const reservasSolapadas = await Reserva.find({
      fechaEntrada: { $lt: checkOut },
      fechaSalida: { $gt: checkIn }
    }).select('habitacionId');

    const habitacionesReservadas = reservasSolapadas.map(r => r.habitacionId.toString());

    // Buscar habitaciones disponibles y no reservadas
    const habitaciones = await Habitacion.find({
      disponible: true,
      _id: { $nin: habitacionesReservadas },
      personasMin: { $lte: numPersonasInt },
      personasMax: { $gte: numPersonasInt }
    });
    
    // Respuesta
    res.json(habitaciones.map(h => ({
      habitacion_id: h._id,
      nombre_habitacion: h.nombre,
      descripcion: `Capacidad: ${h.personasMin}-${h.personasMax} personas.`,
      caracteristicas: h.caracteristicas || '',
      precio_noche: h.precio,
      suplemento_persona: h.suplementoPorPersona
    })));

  } catch (error) {
    console.error('❌ Error al obtener habitaciones disponibles:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
