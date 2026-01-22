const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Publicaciones
 *   description: Gestión de publicaciones
 */

/**
 * @swagger
 * /api/publicaciones:
 *   get:
 *     summary: Obtener todas las publicaciones
 *     tags: [Publicaciones]
 *     responses:
 *       200:
 *         description: Lista de publicaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicacion'
 *       500:
 *         description: Error del servidor
 */
router.get('/', publicacionController.getPublicaciones);

/**
 * @swagger
 * /api/publicaciones/destacadas:
 *   get:
 *     summary: Obtener publicaciones destacadas
 *     tags: [Publicaciones]
 *     responses:
 *       200:
 *         description: Lista de publicaciones destacadas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Publicacion'
 *       500:
 *         description: Error del servidor
 */
router.get('/destacadas', publicacionController.getPublicacionesDestacadas);
/**
 * @swagger
 * /api/publicaciones/{id}:
 *   get:
 *     summary: Obtener una publicación por ID
 *     tags: [Publicaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publicacion'
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', publicacionController.getPublicacionById);

/**
 * @swagger
 * /api/publicaciones:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publicacion'
 *     responses:
 *       201:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, publicacionController.createPublicacion);
/**
 * @swagger
 * /api/publicaciones/{id}:
 *   put:
 *     summary: Actualizar una publicación por ID
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Publicacion'
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Publicacion'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, publicacionController.updatePublicacion);

/**
 * @swagger
 * /api/publicaciones/{id}/upload:
 *   post:
 *     summary: Subir archivos asociados a una publicación
 *     description: Endpoint para subir imagen principal, imágenes de carousel o adjuntos a una publicación existente
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [imagen_principal, imagenes_carousel, adjuntos]
 *         required: true
 *         description: Tipo de archivo a subir
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos a subir (máximo 10)
 *     responses:
 *       200:
 *         description: Archivos subidos exitosamente
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
 *                   example: Imagen principal actualizada exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     publicacion:
 *                       $ref: '#/components/schemas/Publicacion'
 *                     archivosSubidos:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           filename:
 *                             type: string
 *                           originalName:
 *                             type: string
 *                           url:
 *                             type: string
 *                           size:
 *                             type: integer
 *       400:
 *         description: Datos inválidos o tipo incorrecto
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/:id/upload', authMiddleware, upload.array('files', 10), publicacionController.uploadPublicacionFiles);

/**
 * @swagger
 * /api/publicaciones/{id}:
 *   delete:
 *     summary: Eliminar una publicación por ID
 *     tags: [Publicaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, publicacionController.deletePublicacion);

module.exports = router;
