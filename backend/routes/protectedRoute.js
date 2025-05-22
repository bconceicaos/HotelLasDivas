// backend/routes/protectedRoute.js
import express from 'express';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { verificarRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Ruta solo accesible por admin
router.get('/admin-data', verificarToken, verificarRol('admin'), (req, res) => {
  res.json({ message: 'Datos confidenciales de admin' });
});

// Ruta accesible por usuarios normales
router.get('/user-data', verificarToken, verificarRol('user'), (req, res) => {
  res.json({ message: 'Contenido para usuarios autenticados' });
});

export default router;
