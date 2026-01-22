const Gaceta = require('../models/Gaceta');
const logger = require('../utils/logger').createContextLogger('GacetaController');

// @route GET api/gacetas
// @desc Obtener todas las gacetas con filtros opcionales
// @access Público
exports.getGacetas = async (req, res) => {
    try {
        const { mes, ano } = req.query;
        let query = {};

        if (mes) {
            query.mes = parseInt(mes);
        }
        if (ano) {
            query.ano = parseInt(ano);
        }

        logger.info('Fetching gacetas', { filters: query });
        const gacetas = await Gaceta.find(query).sort({ ano: -1, mes: -1 });
        logger.info('Gacetas fetched successfully', { count: gacetas.length });
        res.json(gacetas);
    } catch (err) {
        logger.error('Error fetching gacetas', {
            error: err.message,
            stack: err.stack,
            query: req.query
        });
        res.status(500).send('Server Error');
    }
};

// @route POST api/gacetas
// @desc Subir una nueva gaceta (PDF)
// @access Privado (Admin)
exports.createGaceta = async (req, res) => {
    const { titulo, mes, ano, url_pdf } = req.body;

    try {
        logger.info('Creating new gaceta', { titulo, mes, ano });

        const newGaceta = new Gaceta({
            titulo,
            mes,
            ano,
            url_pdf
        });

        const gaceta = await newGaceta.save();
        logger.info('Gaceta created successfully', {
            gacetaId: gaceta._id,
            titulo: gaceta.titulo
        });
        res.status(201).json(gaceta);
    } catch (err) {
        logger.error('Error creating gaceta', {
            error: err.message,
            stack: err.stack,
            titulo
        });
        res.status(500).send('Server Error');
    }
};


// @ruta PUT api/gacetas/:id
// @desc Actualizar una gaceta
// @access Privado (Administrador)
exports.updateGaceta = async (req, res) => {
    const { titulo, mes, ano, url_pdf } = req.body;

    try {
        logger.info('Updating gaceta', { gacetaId: req.params.id });
        let gaceta = await Gaceta.findById(req.params.id);
        if (!gaceta) {
            logger.warn('Gaceta not found for update', { gacetaId: req.params.id });
            return res.status(404).json({ msg: 'Gaceta not found' });
        }

        gaceta.titulo = titulo || gaceta.titulo;
        gaceta.mes = mes || gaceta.mes;
        gaceta.ano = ano || gaceta.ano;
        gaceta.url_pdf = url_pdf || gaceta.url_pdf;

        await gaceta.save();
        logger.info('Gaceta updated successfully', {
            gacetaId: gaceta._id,
            titulo: gaceta.titulo
        });
        res.json(gaceta);
    } catch (err) {
        logger.error('Error updating gaceta', {
            error: err.message,
            stack: err.stack,
            gacetaId: req.params.id
        });
        res.status(500).send('Server Error');
    }
};

// @ruta BORRAR api/gacetas/:id
// @desc Eliminar una gaceta
// @access Privado (Administrador)
exports.deleteGaceta = async (req, res) => {
    try {
        logger.info('Deleting gaceta', { gacetaId: req.params.id });
        const gaceta = await Gaceta.findById(req.params.id);
        if (!gaceta) {
            logger.warn('Gaceta not found for deletion', { gacetaId: req.params.id });
            return res.status(404).json({ msg: 'Gaceta not found' });
        }
        await Gaceta.deleteOne({ _id: req.params.id });
        logger.info('Gaceta deleted successfully', {
            gacetaId: req.params.id,
            titulo: gaceta.titulo
        });
        res.json({ msg: 'Gaceta removed' });
    } catch (err) {
        logger.error('Error deleting gaceta', {
            error: err.message,
            stack: err.stack,
            gacetaId: req.params.id
        });
        res.status(500).send('Server Error');
    }
};
