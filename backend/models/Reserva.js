// models/Reserva.js
import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  habitacionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitacion',
    required: true
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false   // Opcional si reservas sin login
  },
  fechaEntrada: {
    type: Date,
    required: true
  },
  fechaSalida: {
    type: Date,
    required: true
  },
  personas: {
    type: Number,
    required: true
  },
  precio: { 
    type: Number, 
    required: true 
  },
  nombre: {
    type: String
  },
  apellidos: {
    type: String
  },
  dni: {
    type: String
  },
  email: {
    type: String
  },
  telefono: {
    type: String
  },
}, { timestamps: true });

const Reserva = mongoose.model('Reserva', reservaSchema);
export default Reserva;
