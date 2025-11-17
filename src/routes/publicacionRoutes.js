const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', publicacionController.getPublicaciones);
router.get('/destacadas', publicacionController.getPublicacionesDestacadas);
router.get('/:id', publicacionController.getPublicacionById);

// Ruta de carga genérica (protegida)
router.post('/', authMiddleware, publicacionController.createPublicacion);
router.put('/:id', authMiddleware, publicacionController.updatePublicacion);
router.delete('/:id', authMiddleware, publicacionController.deletePublicacion);

module.exports = router;
