const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    resumen: {
        type: String,
        required: true
    },
    contenido_completo: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: false // Opcional
    },
    fecha_publicacion: {
        type: Date,
        default: Date.now,
        required: true
    },
    es_destacado: {
        type: Boolean,
        default: false,
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Noticia', 'Evento', 'Convocatoria', 'Aviso']
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    fecha_evento_inicio: {
        type: Date,
        required: false // Opcional
    },
    fecha_evento_cierre: {
        type: Date,
        required: false // Opcional
    },
    imagen_principal_url: {
        type: String,
        required: true
    },
    imagenes_carousel: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    adjuntos: [
        {
            titulo: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
