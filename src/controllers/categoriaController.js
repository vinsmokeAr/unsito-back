const Categoria = require('../models/Categoria');

// @route   GET api/categorias
// @desc    Get all categories
// @access  Public
exports.getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.find();
        res.json(categorias);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/categorias
// @desc    Create a new category
// @access  Private (Admin)
exports.createCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        let categoria = await Categoria.findOne({ nombre });
        if (categoria) {
            return res.status(400).json({ msg: 'Category already exists' });
        }
        categoria = new Categoria({ nombre });
        await categoria.save();
        res.status(201).json(categoria);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/categorias/:id
// @desc    Update a category
// @access  Private (Admin)
exports.updateCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        let categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Check if new name already exists for another category
        const existingCategory = await Categoria.findOne({ nombre });
        if (existingCategory && existingCategory._id.toString() !== req.params.id) {
            return res.status(400).json({ msg: 'Category name already in use by another category' });
        }

        categoria.nombre = nombre;
        await categoria.save();
        res.json(categoria);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/categorias/:id
// @desc    Delete a category
// @access  Private (Admin)
exports.deleteCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            return res.status(404).json({ msg: 'Category not found' });
        }
        await Categoria.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
