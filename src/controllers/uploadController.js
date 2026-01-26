const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

/**
 * @desc    Subir una imagen al servidor con validación de contenido
 * @route   POST /api/upload
 * @access  Public (puedes agregar autenticación si lo necesitas)
 */
const uploadImage = async (req, res, next) => {
  try {
    // 1. Verificar si se recibió un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ningún archivo",
      });
    }

    const filePath = req.file.path;

    // 2. Validar que sea una imagen válida usando sharp
    // Multer ya filtró por extensión/mimetype, pero sharp revisa los "magic bytes" reales
    try {
      const metadata = await sharp(filePath).metadata();

      // Opcional: Podrías restringir dimensiones aquí
      // if (metadata.width > 2000) { ... }
    } catch (error) {
      // Si sharp falla, el archivo no es una imagen válida (aunque tenga extensión .png/.jpg)
      // Procedemos a eliminar el archivo basura del servidor
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      return res.status(400).json({
        success: false,
        message: "El archivo subido no es una imagen válida o está corrupto",
        error: "Invalid file content",
      });
    }

    // 3. Construir la URL relativa del archivo guardado
    const fileUrl = `/uploads/${req.file.filename}`;

    // 4. Responder con éxito
    res.status(200).json({
      success: true,
      message: "Imagen subida y validada exitosamente",
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    // Limpieza en caso de error inesperado
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

module.exports = {
  uploadImage,
};
