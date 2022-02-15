module.exports = {
  MONGO_IP: process.env.MONGO_IP || 'mongo',
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  API_PORT: process.env.PORT,
};
