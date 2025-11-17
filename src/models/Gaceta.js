const mongoose = require('mongoose');

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
