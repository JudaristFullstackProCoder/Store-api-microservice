// Built-in modules imports

// Third library imports
const cookieParser = require('cookie-parser');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

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

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// Handle routes
app.get('/', (req, res) => res.json({
  name: 'e-commerce api',
  data: 'Welcome to api',
  description: 'this is a e-commerce api designed to CRUD product, category, store, child category, options, promocode and also variable product',
  endpoints: {
    product: {},
    variable_product: {},
    category: {},
    child_category: {},
    option: {},
    promo_code: {},
    store: {},
  },
}));
app.use('/api/v1/store', storeRoutes);
app.use('/api/v1/product', productsRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/option', optionsRoutes);
app.use('/api/v1/promocode', promoCodeRoutes);

// Error handler middleware
app.use(errorLogger, clientErrorHandler);

// Handle not found routes
app.all('*', notFound);

module.exports = app;
