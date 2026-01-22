const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Subir una imagen al servidor
 *     description: Endpoint para cargar una imagen mediante Multipart/Form-Data. La imagen se guarda físicamente en el disco del servidor.
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen a subir (JPEG, PNG, GIF, WebP, BMP)
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Imagen subida exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: /uploads/imagen-1234567890-987654321.png
 *                     filename:
 *                       type: string
 *                       example: imagen-1234567890-987654321.png
 *                     originalName:
 *                       type: string
 *                       example: mi_foto.png
 *                     mimetype:
 *                       type: string
 *                       example: image/png
 *                     size:
 *                       type: integer
 *                       example: 245678
 *       400:
 *         description: No se recibió ningún archivo
 *       500:
 *         description: Error del servidor
 */
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
