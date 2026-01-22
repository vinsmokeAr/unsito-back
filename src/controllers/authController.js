const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger').createContextLogger('AuthController');

// @route   POST api/auth/register
// @desc    Register a new admin user (for initial setup)
// @access  Public
exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        logger.info('User registration attempt', { email });

        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            logger.warn('Registration failed - User already exists', { email });
            return res.status(400).json({ msg: 'User already exists' });
        }

        usuario = new Usuario({
            nombre,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();
        logger.info('User registered successfully', {
            userId: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre
        });

        const payload = {
            user: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    logger.error('JWT signing error during registration', {
                        error: err.message,
                        userId: usuario.id
                    });
                    throw err;
                }
                logger.info('JWT token generated for new user', { userId: usuario.id });
                res.json({ token });
            }
        );

    } catch (err) {
        logger.error('Registration error', {
            error: err.message,
            stack: err.stack,
            email
        });
        res.status(500).send('Server error');
    }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        logger.info('User login attempt', { email });

        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            logger.warn('Login failed - User not found', { email });
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            logger.warn('Login failed - Invalid password', { email, userId: usuario.id });
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        logger.info('User authenticated successfully', {
            userId: usuario.id,
            email: usuario.email
        });

        const payload = {
            user: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    logger.error('JWT signing error during login', {
                        error: err.message,
                        userId: usuario.id
                    });
                    throw err;
                }
                logger.info('JWT token generated for login', { userId: usuario.id });
                res.json({ token });
            }
        );

    } catch (err) {
        logger.error('Login error', {
            error: err.message,
            stack: err.stack,
            email
        });
        res.status(500).send('Server error');
    }
};
