const Gaceta = require('../models/Gaceta');

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

        const gacetas = await Gaceta.find(query).sort({ ano: -1, mes: -1 });
        res.json(gacetas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route POST api/gacetas
// @desc Subir una nueva gaceta (PDF)
// @access Privado (Admin)
exports.createGaceta = async (req, res) => {
    const { titulo, mes, ano, url_pdf } = req.body;

    try {
        const newGaceta = new Gaceta({
            titulo,
            mes,
            ano,
            url_pdf
        });

        const gaceta = await newGaceta.save();
        res.status(201).json(gaceta);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @ruta BORRAR api/gacetas/:id
// @desc Eliminar una gaceta
// @access Privado (Administrador)
exports.deleteGaceta = async (req, res) => {
    try {
        const gaceta = await Gaceta.findById(req.params.id);
        if (!gaceta) {
            return res.status(404).json({ msg: 'Gaceta not found' });
        }
        await Gaceta.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Gaceta removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
