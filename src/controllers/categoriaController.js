const Categoria = require('../models/Categoria');
const logger = require('../utils/logger').createContextLogger('CategoriaController');

// @route   GET api/categorias
// @desc    Get all categories
// @access  Public
exports.getCategorias = async (req, res) => {
    try {
        logger.info('Fetching all categories');
        const categorias = await Categoria.find();
        logger.info('Categories fetched successfully', { count: categorias.length });
        res.json(categorias);
    } catch (err) {
        logger.error('Error fetching categories', {
            error: err.message,
            stack: err.stack
        });
        res.status(500).send('Server Error');
    }
};

// @route   POST api/categorias
// @desc    Create a new category
// @access  Private (Admin)
exports.createCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        logger.info('Creating new category', { nombre });
        let categoria = await Categoria.findOne({ nombre });
        if (categoria) {
            logger.warn('Category creation failed - Already exists', { nombre });
            return res.status(400).json({ msg: 'Category already exists' });
        }
        categoria = new Categoria({ nombre });
        await categoria.save();
        logger.info('Category created successfully', {
            categoriaId: categoria._id,
            nombre: categoria.nombre
        });
        res.status(201).json(categoria);
    } catch (err) {
        logger.error('Error creating category', {
            error: err.message,
            stack: err.stack,
            nombre
        });
        res.status(500).send('Server Error');
    }
};

// @route   PUT api/categorias/:id
// @desc    Update a category
// @access  Private (Admin)
exports.updateCategoria = async (req, res) => {
    const { nombre } = req.body;
    try {
        logger.info('Updating category', { categoriaId: req.params.id, newNombre: nombre });
        let categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            logger.warn('Category not found for update', { categoriaId: req.params.id });
            return res.status(404).json({ msg: 'Category not found' });
        }

        // Check if new name already exists for another category
        const existingCategory = await Categoria.findOne({ nombre });
        if (existingCategory && existingCategory._id.toString() !== req.params.id) {
            logger.warn('Category update failed - Name already in use', {
                nombre,
                categoriaId: req.params.id
            });
            return res.status(400).json({ msg: 'Category name already in use by another category' });
        }

        categoria.nombre = nombre;
        await categoria.save();
        logger.info('Category updated successfully', {
            categoriaId: categoria._id,
            nombre: categoria.nombre
        });
        res.json(categoria);
    } catch (err) {
        logger.error('Error updating category', {
            error: err.message,
            stack: err.stack,
            categoriaId: req.params.id
        });
        res.status(500).send('Server Error');
    }
};

// @route   DELETE api/categorias/:id
// @desc    Delete a category
// @access  Private (Admin)
exports.deleteCategoria = async (req, res) => {
    try {
        logger.info('Deleting category', { categoriaId: req.params.id });
        const categoria = await Categoria.findById(req.params.id);
        if (!categoria) {
            logger.warn('Category not found for deletion', { categoriaId: req.params.id });
            return res.status(404).json({ msg: 'Category not found' });
        }
        await Categoria.deleteOne({ _id: req.params.id });
        logger.info('Category deleted successfully', {
            categoriaId: req.params.id,
            nombre: categoria.nombre
        });
        res.json({ msg: 'Category removed' });
    } catch (err) {
        logger.error('Error deleting category', {
            error: err.message,
            stack: err.stack,
            categoriaId: req.params.id
        });
        res.status(500).send('Server Error');
    }
};
