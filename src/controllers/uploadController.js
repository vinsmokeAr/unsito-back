const path = require('path');
const fs = require('fs');

/**
 * @desc    Subir una imagen al servidor
 * @route   POST /api/upload
 * @access  Public (puedes agregar autenticación si lo necesitas)
 */
const uploadImage = async (req, res, next) => {
    try {
        // Verificar si se recibió un archivo
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No se recibió ningún archivo'
            });
        }

        // Construir la URL relativa del archivo guardado
        const fileUrl = `/uploads/${req.file.filename}`;

        // Responder con la URL del archivo
        res.status(200).json({
            success: true,
            message: 'Imagen subida exitosamente',
            data: {
                url: fileUrl,
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage
};
