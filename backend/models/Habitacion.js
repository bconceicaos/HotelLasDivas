// models/Habitacion.js
import mongoose from 'mongoose';

const habitacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  disponible: {
    type: Boolean,
    required: true
  },
  caracteristicas: {
    type: String,
    required: true
  },
  personasMin: {
    type: Number,
    required: true
  },
  personasMax: {
    type: Number,
    required: true
  },
  suplementoPorPersona: {
    type: Number,
    required: true
  }
}, { 
  timestamps: true,
  collection: 'habitaciones'
});

const Habitacion = mongoose.model('Habitacion', habitacionSchema);
export default Habitacion;
