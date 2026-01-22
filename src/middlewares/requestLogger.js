const logger = require('../utils/logger').createContextLogger('HTTP');

/**
 * Middleware para registrar todas las peticiones HTTP
 */
const requestLogger = (req, res, next) => {
    // Capturar el tiempo de inicio
    const startTime = Date.now();

    // Información de la petición
    const requestInfo = {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
    };

    // Log de la petición entrante
    logger.info(`Incoming ${req.method} request`, {
        ...requestInfo,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        body: req.method !== 'GET' && req.body ? sanitizeBody(req.body) : undefined,
    });

    // Capturar la respuesta
    const originalSend = res.send;
    res.send = function (data) {
        // Calcular tiempo de respuesta
        const duration = Date.now() - startTime;

        // Log de la respuesta
        const logData = {
            ...requestInfo,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        };

        if (res.statusCode >= 500) {
            logger.error(`${req.method} ${req.originalUrl} - Server Error`, logData);
        } else if (res.statusCode >= 400) {
            logger.warn(`${req.method} ${req.originalUrl} - Client Error`, logData);
        } else {
            logger.info(`${req.method} ${req.originalUrl} - Success`, logData);
        }

        // Llamar al send original
        return originalSend.call(this, data);
    };

    next();
};

/**
 * Función para sanitizar el body y remover datos sensibles
 */
function sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
        return body;
    }

    const sanitized = { ...body };

    // Remover campos sensibles
    const sensitiveFields = ['password', 'token', 'jwt', 'secret', 'apiKey'];

    for (const field of sensitiveFields) {
        if (sanitized[field]) {
            sanitized[field] = '***REDACTED***';
        }
    }

    return sanitized;
}

module.exports = requestLogger;
