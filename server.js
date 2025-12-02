require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Para analizar application/json

// Sirve archivos estáticos desde el directorio 'uploads' - Es temporal para pruebas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = require('./src/config/database');

// Conexion a la bd
connectDB();

// Ruta básica
app.get('/', (req, res) => {
    res.send('Todo correcto en el UNSITO Backend!');
});

// Rutas de importación y uso
const apiRoutes = require('./src/routes');
app.use('/api', apiRoutes);

// Swagger Configuration
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unsito API',
      version: '1.0.0',
      description: 'Documentación de la API para el proyecto Unsito',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Rutas a los archivos que contienen las anotaciones
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// Middleware de manejo de errores (debería ser el último middleware)
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Iniciar el server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
