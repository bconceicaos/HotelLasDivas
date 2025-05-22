// jwt.js (usando ESModules)
import jwt from 'jsonwebtoken';

export const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

export const generarRefreshToken = (usuario) => {
    return jwt.sign(
        { id: usuario._id, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRET_REFRESH,
        { expiresIn: '7d' }
    );
};

// Función para verificar el token JWT
export const verificarToken = (token, secreto = JWT_SECRET) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secreto, (err, decoded) => {
            if (err) reject('Token inválido o expirado');
            else resolve(decoded);
        });
    });
};

// Middleware para verificar el JWT en las rutas protegidas
export const verificarJWT = async (req, res, next) => {
    try {
        const token = req.cookies['accessToken'];

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido o expirado' });
            }

            req.usuario = decoded.id;
            next();
        });
    } catch (error) {
        console.error('Error al verificar token:', error.name, error.message);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};
