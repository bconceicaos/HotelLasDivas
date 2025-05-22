// reservasController.js
import Reserva from '../models/Reserva.js';
import Habitacion from '../models/Habitacion.js';

// Busca todas las reservas asociadas a un cliente específico
export const obtenerReservasPorCliente = async (req, res) => {
  try {
    const reservas = await Reserva.find({ clienteId: req.params.id })
      .populate('habitacionId')
      .sort({ fechaEntrada: 1 }); // <- Esto incluye los datos de la habitación

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reservas', error });
  }
};

// Muestra todas las reservas existentes en la base de datos
export const obtenerTodasLasReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate('clienteId', 'nombre apellidos')
      .populate('habitacionId');
    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error);
    res.status(500).json({ error: 'Error al obtener todas las reservas' });
  }
};

export const crearReserva = async (req, res) => {
  try {
    const {
      habitacionId,
      fechaEntrada,
      fechaSalida,
      personas,
      precio,
      nombre,
      apellidos,
      dni,
      email,
      telefono
    } = req.body;

    // Validación básica de campos obligatorios para guardar la reserva
    if (!habitacionId || !fechaEntrada || !fechaSalida || !personas || !precio) {
      return res.status(400).json({ message: 'Faltan datos para realizar la reserva.' });
    }

    // Verificar que la habitación exista
    const habitacion = await Habitacion.findById(habitacionId);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada.' });
    }

    // Verificar número de personas permitido
    if (personas < habitacion.personasMin || personas > habitacion.personasMax) {
      return res.status(400).json({ message: 'Número de personas fuera del rango permitido para esta habitación.' });
    }

    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);

    // Verificar solapamiento con otras reservas
    const reservasExistentes = await Reserva.find({
      habitacionId,
      $or: [
        { fechaEntrada: { $lt: salida }, fechaSalida: { $gt: entrada } }
      ]
    });

    if (reservasExistentes.length > 0) {
      return res.status(409).json({ message: 'La habitación ya está reservada en ese rango de fechas.' });
    }

    // Crear la reserva (solo datos necesarios)
    const nuevaReserva = new Reserva({
      habitacionId,
      fechaEntrada: entrada,
      fechaSalida: salida,
      personas,
      precio,
      nombre,
      apellidos,
      dni,
      email,
      telefono,
      ...(req.body.clienteId && { clienteId: req.body.clienteId })
    });


    await nuevaReserva.save();

    // Emitir evento WebSocket a admins conectados
    const wss = req.app.get('wss');
    if (wss) {
      const evento = {
        nombre: nuevaReserva.nombre,
        apellidos: nuevaReserva.apellidos,
        habitacion: habitacion.nombre,
        fechaEntrada: nuevaReserva.fechaEntrada,
        fechaSalida: nuevaReserva.fechaSalida,
        personas: nuevaReserva.personas,
      };

      if (typeof wss.broadcastToAdmins === 'function') {
        wss.broadcastToAdmins('reserva', evento);
      } else {
        wss.broadcast('reserva', evento); // fallback
      }
    }

    res.status(201).json({
      message: 'Reserva creada con éxito',
      reserva: nuevaReserva
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ message: 'Error al procesar la reserva.' });
  }
};

export const actualizarReserva = async (req, res) => {
  try {
    const {
      fechaEntrada,
      fechaSalida,
      personas,
      precio,
      nombre,
      apellidos,
      dni,
      email,
      telefono
    } = req.body;

    const reserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      {
        fechaEntrada,
        fechaSalida,
        personas,
        precio,
        nombre,
        apellidos,
        dni,
        email,
        telefono
      },
      { new: true }
    ).populate('habitacionId');

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json({ message: 'Reserva actualizada', reserva });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ message: 'Error al actualizar la reserva' });
  }
};


export const cancelarReserva = async (req, res) => {
  try {
    const deleted = await Reserva.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }
    res.status(200).json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ message: 'Error al cancelar la reserva' });
  }
};

