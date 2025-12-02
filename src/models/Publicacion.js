/**
 * @swagger
 * components:
 *   schemas:
 *     Publicacion:
 *       type: object
 *       required:
 *         - titulo
 *         - resumen
 *         - contenido_completo
 *         - fecha_publicacion
 *         - es_destacado
 *         - tipo
 *         - categoria
 *         - imagen_principal_url
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la publicación
 *           readOnly: true
 *         titulo:
 *           type: string
 *           description: Título de la publicación
 *         resumen:
 *           type: string
 *           description: Resumen corto de la publicación
 *         contenido_completo:
 *           type: string
 *           description: Contenido completo de la publicación
 *         autor:
 *           type: string
 *           description: Autor de la publicación (opcional)
 *         fecha_publicacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de publicación
 *         es_destacado:
 *           type: boolean
 *           description: Indica si la publicación es destacada
 *         tipo:
 *           type: string
 *           enum: [Noticia, Evento, Convocatoria, Aviso]
 *           description: Tipo de publicación
 *         categoria:
 *           type: string
 *           description: ID de la categoría a la que pertenece la publicación
 *         fecha_evento_inicio:
 *           type: string
 *           format: date-time
 *           description: Fecha de inicio del evento (si el tipo es Evento)
 *         fecha_evento_cierre:
 *           type: string
 *           format: date-time
 *           description: Fecha de cierre del evento (si el tipo es Evento)
 *         imagen_principal_url:
 *           type: string
 *           description: URL de la imagen principal de la publicación
 *         imagenes_carousel:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *           description: URLs de las imágenes para el carrusel
 *         adjuntos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               url:
 *                 type: string
 *           description: Lista de adjuntos (archivos, enlaces)
 *       example:
 *         _id: "60c72b2f9b1d8e001c8e4a1a"
 *         titulo: "Nueva Publicación Importante"
 *         resumen: "Este es un resumen de la nueva publicación."
 *         contenido_completo: "Aquí va el contenido completo y detallado de la publicación."
 *         autor: "Juan Pérez"
 *         fecha_publicacion: "2023-11-20T10:00:00Z"
 *         es_destacado: true
 *         tipo: "Noticia"
 *         categoria: "60c72b2f9b1d8e001c8e4a1b"
 *         imagen_principal_url: "http://example.com/imagen1.jpg"
 *         imagenes_carousel:
 *           - url: "http://example.com/carousel1.jpg"
 *           - url: "http://example.com/carousel2.jpg"
 *         adjuntos:
 *           - titulo: "Documento Anexo"
 *             url: "http://example.com/documento.pdf"
 */

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
