// Built-in modules imports

// Third library imports
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../swagger.json');

const app = express();

// custom modules imports
const clientErrorHandler = require('../middlewares/clientErrorHandler');
const errorLogger = require('../middlewares/errorLogger');
const notFound = require('../middlewares/notFound');
const storeRoutes = require('../routes/store');
const productsRoutes = require('../routes/product');
const categoryRoutes = require('../routes/category');
const optionsRoutes = require('../routes/option');
const promoCodeRoutes = require('../routes/promoCode');
const uploadRoutes = require('../routes/upload');

// Middleware
app.use(express.json());
app.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(express.static('../uploads'));

// Handle routes
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/product', productsRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/option', optionsRoutes);
app.use('/api/v1/promocode', promoCodeRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error handler middleware
app.use(errorLogger, clientErrorHandler);

// Handle not found routes
app.all('*', notFound);

module.exports = app;
