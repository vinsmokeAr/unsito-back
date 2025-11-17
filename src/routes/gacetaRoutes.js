const express = require('express');
const router = express.Router();
const gacetaController = require('../controllers/gacetaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', gacetaController.getGacetas);

// Rutas administrativas (protegidas)
router.post('/', authMiddleware, gacetaController.createGaceta);
router.delete('/:id', authMiddleware, gacetaController.deleteGaceta);

module.exports = router;
