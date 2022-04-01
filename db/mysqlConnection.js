const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'sql10.freemysqlhosting.net',
  user: 'sql10482808',
  password: 'H3w3FvYZqr',
  database: 'sql10482808',
});

module.exports = connection;
