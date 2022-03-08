const { app, port } = require('./app');

try {
  app.listen(port);
} catch (err) {
  console.log(err);
}
