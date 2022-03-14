const mongoose = require('mongoose');

// close all database connections in parallel
module.exports = async function mongoDBDisconnectAll() {
  return mongoose.disconnect();
};
