const cluster = require('cluster');
const { length } = require('os').cpus();
const resolve = require('path').resolve('.env.dev');
const resolveProduction = require('path').resolve('.env');
const resolveTestingEnvironment = require('path').resolve('.env.test.local');
const resolveDockerEnvironment = require('path').resolve('docker-compose.env');
require('dotenv').config({ path: resolve });
require('dotenv').config({ path: resolveProduction });
require('dotenv').config({ path: resolveTestingEnvironment });
require('dotenv').config({ path: resolveDockerEnvironment });
const app = require('./app');
const mongoConnection = require('../db/mongoConnect');
const Console = require('../libs/logger');

// start the server if the database connection succed
// For Master process
if (cluster.isMaster) {
  Console.warn(`Master Process ${process.pid} is running`);
  const numCPUs = length;
  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  // This event is firs when worker start
  cluster.on('listening', (worker) => {
    Console.info(`worker ${worker.process.pid} started`);
  });
  // This event is firs when worker died
  cluster.on('exit', (worker) => {
    Console.info(`worker ${worker.process.pid} died`);
  });
  // For Worker
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const port = process.env.PORT || 80;
  const startServer = function strServApp() {
    app.listen(port);
  };
  const getUri = async function Jf(env) {
    if (env === 'production') await mongoConnection(process.env.MONGODBURI);
    if (env === 'testing') await mongoConnection(process.env.TESTMONGODBURI);
    if (env === 'docker') await mongoConnection(process.env.MONGODB_DOCKER_URI);
    if (env === 'docker-dev') await mongoConnection(process.env.MONGODB_DOCKER_DEV_URI);
    if (env === 'development') await mongoConnection(process.env.DEVMONGODBURI);
  };
  try {
    startServer();
    getUri(process.env.NODE_ENV).then(() => Console.info('Connected to MongoDB Server')).catch((err) => Console.error(err));
  } catch (err) {
    Console.error(err);
  }
}
