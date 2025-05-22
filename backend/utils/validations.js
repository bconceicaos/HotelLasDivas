import { body, validationResult } from 'express-validator';

// Valida que el campo no esté vacío y tenga una longitud mínima
export const validarLogin = [
    body('email')
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('El correo debe ser válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Función para verificar los errores de validación
export const verificarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errors: errores.array() });
    }
    next();
};
