const mongoose = require('mongoose');
const log = require('../libs/log');

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

module.exports = async function main(url) {
  await mongoose.connect(url, options).then(() => {
    log.debug('successfully connected to db');
  }).catch((err) => {
    log.error(err);
  });
};
