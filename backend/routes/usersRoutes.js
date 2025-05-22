// usersRoutes.js
import express from 'express';
const router = express.Router();
import { verificarToken, verificarAdmin } from '../middlewares/authMiddleware.js';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser} from '../controllers/usersController.js';

// Ruta para obtener todos los usuarios
router.get('/', verificarToken, verificarAdmin, getAllUsers);

// Ruta para obtener un solo usuario
router.get('/:id', verificarToken, verificarAdmin, getUserById);

// Ruta para crear un nuevo usuario
router.post('/', verificarToken, verificarAdmin, createUser);

// Ruta para actualizar un usuario
router.put('/:id', verificarToken, verificarAdmin, updateUser);

// Ruta para eliminar un usuario
router.delete('/:id', verificarToken, verificarAdmin, deleteUser);

export default router;