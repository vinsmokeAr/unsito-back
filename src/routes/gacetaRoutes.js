const express = require('express');
const router = express.Router();
const gacetaController = require('../controllers/gacetaController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Gacetas
 *   description: API para la gestión de gacetas
 */

/**
 * @swagger
 * /api/gacetas:
 *   get:
 *     summary: Obtiene todas las gacetas
 *     tags: [Gacetas]
 *     responses:
 *       200:
 *         description: Una lista de gacetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Gaceta'
 */
// Rutas públicas
router.get('/', gacetaController.getGacetas);


// Rutas administrativas (protegidas)
/**
 * @swagger
 * /api/gacetas:
 *   post:
 *     summary: Crea una nueva gaceta
 *     tags: [Gacetas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gaceta'
 *     responses:
 *       201:
 *         description: Gaceta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gaceta'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, gacetaController.createGaceta);
/**
 * @swagger
 * /api/gacetas/{id}:
 *   put:
 *     summary: Actualiza una gaceta existente
 *     tags: [Gacetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la gaceta a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gaceta'
 *     responses:
 *       200:
 *         description: Gaceta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gaceta'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Gaceta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, gacetaController.updateGaceta);
/**
 * @swagger
 * /api/gacetas/{id}:
 *   delete:
 *     summary: Elimina una gaceta por su ID
 *     tags: [Gacetas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la gaceta a eliminar
 *     responses:
 *       200:
 *         description: Gaceta eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Gaceta no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, gacetaController.deleteGaceta);


module.exports = router;
