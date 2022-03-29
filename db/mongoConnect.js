const resolve = require('path').resolve('.env.dev');
const resolveProduction = require('path').resolve('.env');
const resolveTestingEnvironment = require('path').resolve('.env.test.local');
const resolveDockerEnvironment = require('path').resolve('docker-compose.env');
require('dotenv').config({ path: resolve });
require('dotenv').config({ path: resolveProduction });
require('dotenv').config({ path: resolveTestingEnvironment });
require('dotenv').config({ path: resolveDockerEnvironment });
const Console = require('../libs/logger');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 50, // Maintain up to 50 socket connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

module.exports = function mongooseConnect(mongoose) {
  // const nodeenv = process.env.NODE_ENV;
  const pe = process.env;
  // const obj = {
  //   production: pe.MONGODBURI,
  //   testing: pe.TESTMONGODBURI,
  //   docker: pe.MONGODB_DOCKER_URI,
  //   docker_dev: pe.MONGODB_DOCKER_DEV_URI,
  //   development: pe.DEVMONGODBURI,
  // };

  mongoose.connect(pe.TESTMONGODBURI, options)
    .then((mongo) => mongo)
    .catch((err) => Console.error(err));
};
