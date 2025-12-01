const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la categoría
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *       example:
 *         _id: "60d0fe4f5311236168a109ca"
 *         nombre: "Noticias"
 */
 
const categoriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
