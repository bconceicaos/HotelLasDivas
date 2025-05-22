// middlewares/roleMiddleware.js
export const verificarRol = (rolRequerido) => {
    return (req, res, next) => {
        if (!req.userRol || req.userRol !== rolRequerido) {
        return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes' });
        }
        next();
    };
};

