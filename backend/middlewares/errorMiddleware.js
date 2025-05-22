// Middleware global para manejar los errores
export const errorMiddleware = (err, req, res, next) => {
    console.error('Error interno del servidor:', err);

    // Si el error tiene un código de estado, lo utilizamos. Si no, usamos 500 (Error interno del servidor)
    const statusCode = err.statusCode || 500;
    const message = err.message || '¡Ups! Algo salió mal. Intenta de nuevo más tarde.';

    // Enviar respuesta de error
    res.status(statusCode).json({
        message: message,
        ...(process.env.NODE_ENV === 'production' && { stack: err.stack }) // Solo mostrar stack en entorno de desarrollo
    });
};

