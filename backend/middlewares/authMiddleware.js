// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json({ message: 'Token faltante' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, rol: decoded.rol };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};


export const verificarAdmin = (req, res, next) => {
    if (req.user?.rol !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores' });
    }
    next();
};

// Verificar el token desde la cookie 'accessToken'
export const autenticarUsuario = (req, res, next) => {
  const token = req.cookies['accessToken'];
  if (!token) return res.status(401).json({ message: 'No autorizado: token faltante' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido o expirado' });

    req.user = {
      email: decoded.email,
      rol: decoded.rol,
      id: decoded.id
    };

    next();
  });
};
