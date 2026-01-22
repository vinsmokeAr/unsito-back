const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar el directorio de almacenamiento desde variable de entorno
// En desarrollo: './uploads' (relativo al proyecto)
// En producción: '/var/www/uploads' (ruta absoluta)
const uploadDir = path.isAbsolute(process.env.UPLOADS_PATH || './uploads')
    ? process.env.UPLOADS_PATH
    : path.join(__dirname, '../../', process.env.UPLOADS_PATH || 'uploads');

// Crear el directorio si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Carpeta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        cb(null, basename + '-' + uniqueSuffix + ext);
    }
});

// Filtro para validar tipos de archivo (imágenes y documentos)
const fileFilter = (req, file, cb) => {
    // Tipos MIME permitidos
    const allowedMimeTypes = [
        // Imágenes
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        // Documentos
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, BMP) y documentos (PDF, DOC, DOCX)'), false);
    }
};

// Configuración de Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

module.exports = upload;
