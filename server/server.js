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

// start the server if the database connection succed
// For Master process
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  const numCPUs = length;
  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  // This event is firs when worker start
  cluster.on('listening', (worker) => {
    console.log(`worker ${worker.process.pid} started`);
  });
  // This event is firs when worker died
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  // For Worker
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const port = process.env.PORT || 80;
  app.listen(port);
  console.log(`API listen on port ${port}`);

  try {
    if (process.env.NODE_ENV === 'production') {
      mongoConnection(process.env.MONGODBURI);
    } else if (process.env.NODE_ENV === 'testing') {
      mongoConnection(process.env.TESTMONGODBURI);
    } else if (process.env.NODE_ENV === 'docker') {
      mongoConnection(process.env.MONGODB_DOCKER_URI);
    } else if (process.env.NODE_ENV === 'docker-dev') {
      mongoConnection(process.env.MONGODB_DOCKER_DEV_URI);
    } else {
      mongoConnection(process.env.DEVMONGODBURI);
    }
  } catch (err) {
    console.log(err);
  }
}
