const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: API para la gestión de categorías
 */

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Una lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
//Rutas públicas
router.get('/', categoriaController.getCategorias);

// Rutas administrativas (protegidas)
router.post('/', authMiddleware, categoriaController.createCategoria);
router.put('/:id', authMiddleware, categoriaController.updateCategoria);
router.delete('/:id', authMiddleware, categoriaController.deleteCategoria);

module.exports = router;
