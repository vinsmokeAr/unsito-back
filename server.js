require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // For parsing application/json

// Serve static files from the 'uploads' directory - Es temporal para pruebas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = require('./src/config/database');

// Database Connection
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('Todo correcto en el UNSITO Backend!');
});

// Import and use routes
const apiRoutes = require('./src/routes');
app.use('/api', apiRoutes);

// Error handling middleware (should be the last middleware)
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
