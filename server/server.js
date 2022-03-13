const cluster = require('cluster');
const { length } = require('os').cpus();
const resolve = require('path').resolve('.env.dev');
const resolveProduction = require('path').resolve('.env');
const resilveTestingEnvironment = require('path').resolve('.env.test.local');
require('dotenv').config({ path: resolve });
require('dotenv').config({ path: resolveProduction });
require('dotenv').config({ path: resilveTestingEnvironment });
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
    console.log(`Worker ${process.pid} started`);
  }

  // This event is firs when worker died
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
  // For Worker
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const port = process.env.API_PORT;
  app.listen(port);
  console.log(`API listen on port ${port}`);

  try {
    if (process.env.NODE_ENV === 'production') {
      mongoConnection(process.env.MONGODBURI);
    } else if (process.env.NODE_ENV === 'testing') {
      mongoConnection(process.env.TESTMONGODBURI);
    } else {
      mongoConnection(process.env.DEVMONGODBURI);
    }
  } catch (err) {
    console.log(err);
  }
}
