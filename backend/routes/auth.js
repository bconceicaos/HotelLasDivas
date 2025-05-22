import express from 'express';
const router = express.Router();
import { login, register, logout, refreshToken, validateRole } from '../controllers/authController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

router.get('/me', verificarToken, (req, res) => {
  res.json({
    _id: req.user.id,
    email: req.user.email,
    rol: req.user.rol,
  });
});

// Ruta para el refresh del access token
router.post('/refresh', refreshToken);

// Ruta para registrar usuarios
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

router.get('/validateRole', validateRole);

export default router;
