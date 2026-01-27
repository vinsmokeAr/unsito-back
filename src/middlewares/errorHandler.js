const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    // Log the error for debugging (using project logger if available, otherwise console)
    console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);
    
    // Default error status and message
    let statusCode = err.status || 500;
    let message = err.message || 'Error interno del servidor';
    let errorType = 'ServerError';

    // Handle Multer specific errors
    if (err instanceof multer.MulterError) {
        statusCode = 400;
        errorType = 'MulterError';
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'El archivo es demasiado grande. El límite es de 5MB.';
                break;
            case 'LIMIT_UNEXPECTED_FIELD':
                message = 'Campo de archivo no esperado. Asegúrate de usar el campo correcto (ej. "image").';
                break;
            default:
                message = `Error al subir el archivo: ${err.message}`;
        }
    } 
    // Handle validation errors or custom errors with specific messages
    else if (err.message && (err.message.includes('Tipo de archivo no permitido') || statusCode === 400)) {
        statusCode = 400;
        errorType = 'ValidationError';
        message = err.message;
    }

    // Return detailed error response in JSON format
    res.status(statusCode).json({
        success: false,
        error: errorType,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
