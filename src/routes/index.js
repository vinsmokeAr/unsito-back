const express = require('express');
const router = express.Router();

// Importar archivos de ruta individuales
const authRoutes = require('./authRoutes');
const categoriaRoutes = require('./categoriaRoutes');
const publicacionRoutes = require('./publicacionRoutes');
const gacetaRoutes = require('./gacetaRoutes');

// Asignar rutas a caminos específicos
router.use('/auth', authRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/publicaciones', publicacionRoutes);
router.use('/gacetas', gacetaRoutes);

// Ruta de carga genérica (protegida)
const uploadMiddleware = require('../middlewares/uploadMiddleware');
router.post('/upload', uploadMiddleware, (req, res) => {
    if (req.file) {
        // Construir la URL del archivo subido
        const fileUrl = `${process.env.API_BASE_URL}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } else {
        res.status(400).json({ msg: 'No file uploaded or invalid file type' });
    }
});


module.exports = router;
