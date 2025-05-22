// services/authService.js
import User from '../../backend/models/User.js';
import axios from 'axios';

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');

  const match = await user.comparePassword(password);
  if (!match) throw new Error('Credenciales inválidas');
  return user;
};

export const registerUser = async ({ nombre, apellidos, dni, email, password, telefono }) => {
  if (!nombre || !apellidos || !dni || !email || !password || !telefono) {
    throw new Error('Todos los campos son obligatorios');
  }

  // Verificar si el email ya está registrado
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('Este email ya está registrado');

  // Verificar si el DNI ya está registrado
  const existingDni = await User.findOne({ dni });
  if (existingDni) throw new Error('Este DNI ya está registrado');

  const user = new User({ nombre, apellidos, dni, email, password, telefono });
  await user.save();
  return user;
};

export const checkAuth = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/auth/me', {
      withCredentials: true,
    });
    console.log('Respuesta de /me:', res.data);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token inválido o no autenticado, pero es esperado si no ha iniciado sesión
      console.log('No loggeado');
      return null;
    }
    console.error('Error inesperado al verificar el usuario:', error);
    return null; // Devuelve null en cualquier otro caso también
  }
};
