const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Gaceta:
 *       type: object
 *       required:
 *         - titulo
 *         - mes
 *         - ano
 *         - url_pdf
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la gaceta
 *         titulo:
 *           type: string
 *           description: Título de la gaceta
 *         mes:
 *           type: number
 *           description: Mes de publicación de la gaceta
 *         ano:
 *           type: number
 *           description: Año de publicación de la gaceta
 *         url_pdf:
 *           type: string
 *           description: URL del archivo PDF de la gaceta
 *       example:
 *         _id: "60d0fe4f5311236168a109cb"
 *         titulo: "Gaceta Oficial Mes de Enero"
 *         mes: 1
 *         ano: 2023
 *         url_pdf: "http://example.com/gaceta.pdf"
 */

const gacetaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    mes: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    ano: {
        type: Number,
        required: true
    },
    url_pdf: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Gaceta', gacetaSchema);
