// Built-in modules imports
const resolve = require('path').resolve('.env.dev');
const resolveProduction = require('path').resolve('.env');
require('dotenv').config({ path: resolve });
require('dotenv').config({ path: resolveProduction });
const cluster = require('cluster');
const { length } = require('os').cpus();

// Third library imports
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');

// custom modules imports
const mongoConnection = require('../db/mongoConnect');
const clientErrorHandler = require('../middlewares/clientErrorHandler');
const errorLogger = require('../middlewares/errorLogger');
const notFound = require('../middlewares/notFound');
const storeRoutes = require('../routes/store');
const productsRoutes = require('../routes/product');
const categoryRoutes = require('../routes/category');
const optionsRoutes = require('../routes/option');
const promoCodeRoutes = require('../routes/promoCode');
const uploadRoutes = require('../routes/upload');
const {
  MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, API_PORT, MONGODBURI
} = require('../config/config');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(express.static('../uploads'));

// Handle routes
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/options', optionsRoutes);
app.use('/api/v1/promocodes', promoCodeRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Error handler middleware
app.use(errorLogger, clientErrorHandler);

// home page

app.all('/', (req, res) => {
  res.json({
    message: 'Api Home page',
  });
});

// Handle not found routes
app.all('*', notFound);

// start the server if the database connection succed
// For Master process
if (cluster.isMaster) {
  // console.log(`Master ${process.pid} is running`);
  const numCPUs = length;
  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
    // console.log(`Worker ${process.pid} started`);
  }

  // This event is firs when worker died
  cluster.on('exit', (/* worker */) => {
    // console.log(`worker ${worker.process.pid} died`);
  });
  // For Worker
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  try {
    if (process.env.NODE_ENV = "production"){
      mongoConnection(MONGODBURI);
    }else{
      mongoConnection(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`);
    }
    app.listen(`${API_PORT}`);
  } catch (err) {
    console.log(err);
  }
}
