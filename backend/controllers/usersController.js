import User from '../models/User.js';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

// Obtener un solo usuario por su ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const { nombre, apellidos, dni, email, password, telefono, rol } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: 'El usuario ya existe' });

        const newUser = new User({ nombre, apellidos, dni, email, password, telefono, rol });
        await newUser.save();

        // Emitir evento WebSocket solo a admins
        const wss = req.app.get('wss');
        if (wss) {
        const evento = {
            email: newUser.email,
            nombre: newUser.nombre,
            creadoEn: newUser.createdAt,
        };

        if (typeof wss.broadcastToAdmins === 'function') {
            wss.broadcastToAdmins('user', evento);
        } else {
            wss.broadcast('user', evento);
        }
        }

        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario (con manejo de hash si hay contraseña nueva)
export const updateUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        Object.assign(user, rest);

        if (password) {
            user.password = password; // Triggea el middleware `pre('save')`
        }

        await user.save();

        res.json({ message: 'Usuario actualizado correctamente', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
};
