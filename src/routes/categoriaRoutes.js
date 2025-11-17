const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const authMiddleware = require('../middlewares/authMiddleware');

//Rutas públicas
router.get('/', categoriaController.getCategorias);

// Rutas administrativas (protegidas)
router.post('/', authMiddleware, categoriaController.createCategoria);
router.put('/:id', authMiddleware, categoriaController.updateCategoria);
router.delete('/:id', authMiddleware, categoriaController.deleteCategoria);

module.exports = router;
