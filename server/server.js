const cluster = require('cluster');
const { length } = require('os').cpus();
const mongoose = require('mongoose');
const app = require('./app');
const mongoConnection = require('../db/mongoConnect');
const Console = require('../libs/logger');

// start the server if the database connection succed
// For Master process
if (cluster.isMaster) {
  process.stdout.write('\x1B[2J'); // clear the console
  Console.debug('The Server is starting ...');
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

  try {
    mongoConnection(mongoose);
    startServer();
  } catch (err) {
    Console.error(err);
  }
}
