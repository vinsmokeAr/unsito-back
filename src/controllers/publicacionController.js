const Publicacion = require('../models/Publicacion');
const Categoria = require('../models/Categoria'); // To populate category name

// Función auxiliar para crear filtros de consulta
const buildPublicationQuery = (req) => {
    const { tipo, categoria, mes, ano } = req.query;
    let query = {};

    if (tipo) {
        query.tipo = tipo;
    }
    if (categoria) {
        query.categoria = categoria; // Assuming category ID is passed
    }
    if (mes && ano) {
        const startDate = new Date(ano, mes - 1, 1); // Month is 0-indexed
        const endDate = new Date(ano, mes, 0); // Last day of the month
        query.fecha_publicacion = {
            $gte: startDate,
            $lte: endDate
        };
    }
    return query;
};

// @route GET api/publicaciones
// @desc Obtener todas las publicaciones con paginación y filtros
// @access Público
exports.getPublicaciones = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = buildPublicationQuery(req);

        const publicaciones = await Publicacion.find(query)
            .sort({ fecha_publicacion: -1 })
            .skip(skip)
            .limit(limit)
            .populate('categoria', 'nombre'); // Populate category name

        const total = await Publicacion.countDocuments(query);

        res.json({
            publicaciones,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route GET api/publicaciones/destacadas
// @desc Obtener publicaciones destacadas
// @acceso público
exports.getPublicacionesDestacadas = async (req, res) => {
    try {
        const publicaciones = await Publicacion.find({ es_destacado: true })
            .sort({ fecha_publicacion: -1 })
            .populate('categoria', 'nombre');
        res.json(publicaciones);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route GET api/publicaciones/:id
// @desc Obtener una publicación por su ID
// @access Público
exports.getPublicacionById = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id).populate('categoria', 'nombre');
        if (!publicacion) {
            return res.status(404).json({ msg: 'Publication not found' });
        }
        res.json(publicacion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route POST api/publicaciones
// @desc Crear una nueva publicación
// @access Privado (Admin)
exports.createPublicacion = async (req, res) => {
    const {
        titulo,
        resumen,
        contenido_completo,
        autor,
        es_destacado,
        tipo,
        categoria,
        fecha_evento_inicio,
        fecha_evento_cierre,
        imagen_principal_url,
        imagenes_carousel,
        adjuntos
    } = req.body;

    try {
        const newPublicacion = new Publicacion({
            titulo,
            resumen,
            contenido_completo,
            autor,
            es_destacado,
            tipo,
            categoria,
            fecha_evento_inicio,
            fecha_evento_cierre,
            imagen_principal_url,
            imagenes_carousel,
            adjuntos
        });

        const publicacion = await newPublicacion.save();
        res.status(201).json(publicacion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route PUT api/publicaciones/:id
// @desc Actualizar una publicación
// @access Privado (Admin)
exports.updatePublicacion = async (req, res) => {
    const {
        titulo,
        resumen,
        contenido_completo,
        autor,
        es_destacado,
        tipo,
        categoria,
        fecha_evento_inicio,
        fecha_evento_cierre,
        imagen_principal_url,
        imagenes_carousel,
        adjuntos
    } = req.body;

    // Construir objeto de publicación
    const publicacionFields = {};
    if (titulo) publicacionFields.titulo = titulo;
    if (resumen) publicacionFields.resumen = resumen;
    if (contenido_completo) publicacionFields.contenido_completo = contenido_completo;
    if (autor) publicacionFields.autor = autor;
    if (es_destacado !== undefined) publicacionFields.es_destacado = es_destacado;
    if (tipo) publicacionFields.tipo = tipo;
    if (categoria) publicacionFields.categoria = categoria;
    if (fecha_evento_inicio) publicacionFields.fecha_evento_inicio = fecha_evento_inicio;
    if (fecha_evento_cierre) publicacionFields.fecha_evento_cierre = fecha_evento_cierre;
    if (imagen_principal_url) publicacionFields.imagen_principal_url = imagen_principal_url;
    if (imagenes_carousel) publicacionFields.imagenes_carousel = imagenes_carousel;
    if (adjuntos) publicacionFields.adjuntos = adjuntos;

    try {
        let publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) {
            return res.status(404).json({ msg: 'Publication not found' });
        }

        publicacion = await Publicacion.findByIdAndUpdate(
            req.params.id,
            { $set: publicacionFields },
            { new: true }
        ).populate('categoria', 'nombre');

        res.json(publicacion);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route DELETE api/publicaciones/:id
// @desc Eliminar una publicación
// @access Privado (Admin)
exports.deletePublicacion = async (req, res) => {
    try {
        const publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) {
            return res.status(404).json({ msg: 'Publication not found' });
        }
        await Publicacion.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Publication removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route POST api/publicaciones/:id/upload
// @desc Subir archivos asociados a una publicación
// @access Privado (Admin)
exports.uploadPublicacionFiles = async (req, res) => {
    try {
        // 1. Validar que la publicación existe
        const publicacion = await Publicacion.findById(req.params.id);
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        // 2. Validar que se recibieron archivos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No se recibieron archivos'
            });
        }

        // 3. Validar query param 'tipo'
        const { tipo } = req.query;
        const tiposValidos = ['imagen_principal', 'imagenes_carousel', 'adjuntos'];

        if (!tipo || !tiposValidos.includes(tipo)) {
            return res.status(400).json({
                success: false,
                message: `Tipo inválido. Debe ser uno de: ${tiposValidos.join(', ')}`
            });
        }

        // 4. Construir URLs relativas
        const archivosSubidos = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            urlRelativa: `/uploads/${file.filename}`,
            urlAbsoluta: `${process.env.API_BASE_URL}/uploads/${file.filename}`
        }));

        // 5. Actualizar publicación según el tipo
        let updateData = {};
        let mensaje = '';

        switch (tipo) {
            case 'imagen_principal':
                // Solo tomar el primer archivo
                updateData.imagen_principal_url = archivosSubidos[0].urlRelativa;
                mensaje = 'Imagen principal actualizada exitosamente';
                break;

            case 'imagenes_carousel':
                // Agregar todas las imágenes al carousel
                const nuevasImagenesCarousel = archivosSubidos.map(archivo => ({
                    url: archivo.urlRelativa
                }));
                updateData.$push = {
                    imagenes_carousel: { $each: nuevasImagenesCarousel }
                };
                mensaje = `${archivosSubidos.length} imagen(es) agregada(s) al carousel`;
                break;

            case 'adjuntos':
                // Agregar todos los adjuntos
                const nuevosAdjuntos = archivosSubidos.map(archivo => ({
                    titulo: archivo.originalName,
                    url: archivo.urlRelativa
                }));
                updateData.$push = {
                    adjuntos: { $each: nuevosAdjuntos }
                };
                mensaje = `${archivosSubidos.length} adjunto(s) agregado(s)`;
                break;
        }

        // 6. Actualizar en base de datos
        const publicacionActualizada = await Publicacion.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('categoria', 'nombre');

        // 7. Construir respuesta con URLs absolutas
        const respuesta = publicacionActualizada.toObject();

        // Convertir URLs relativas a absolutas en la respuesta
        if (respuesta.imagen_principal_url) {
            respuesta.imagen_principal_url = `${process.env.API_BASE_URL}${respuesta.imagen_principal_url}`;
        }

        if (respuesta.imagenes_carousel) {
            respuesta.imagenes_carousel = respuesta.imagenes_carousel.map(img => ({
                ...img,
                url: `${process.env.API_BASE_URL}${img.url}`
            }));
        }

        if (respuesta.adjuntos) {
            respuesta.adjuntos = respuesta.adjuntos.map(adj => ({
                ...adj,
                url: `${process.env.API_BASE_URL}${adj.url}`
            }));
        }

        // 8. Retornar respuesta
        res.status(200).json({
            success: true,
            message: mensaje,
            data: {
                publicacion: respuesta,
                archivosSubidos: archivosSubidos.map(a => ({
                    filename: a.filename,
                    originalName: a.originalName,
                    url: a.urlAbsoluta,
                    size: a.size
                }))
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Error del servidor',
            error: err.message
        });
    }
};

