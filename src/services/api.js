// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Cambié el puerto por 5000
  withCredentials: true, // si usas cookies
});

export default api;
