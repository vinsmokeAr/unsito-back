const express = require('express');
const router = express.Router();

// Importar archivos de ruta individuales
const authRoutes = require('./authRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const publicacionRoutes = require('./publicacionRoutes');
const gacetaRoutes = require('./gacetaRoutes');
const uploadRoutes = require('./uploadRoutes');

// Asignar rutas a caminos específicos
router.use('/auth', authRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/publicaciones', publicacionRoutes);
router.use('/gacetas', gacetaRoutes);
router.use('/', uploadRoutes); // Ruta de upload dedicada


module.exports = router;
