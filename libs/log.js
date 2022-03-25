const winston = require('winston');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    (warn) => `${warn.timestamp} ${warn.level}: ${warn.message}`,
    (debug) => `${debug.timestamp} ${debug.level}: ${debug.message}`,
    (http) => `${http.timestamp} ${http.level}: ${http.message}`,
    (error) => `${error.timestamp} ${error.level}: ${error.message}`,
  ),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  new winston.transports.File({ filename: 'logs/all.log' }),
];

const log = winston.createLogger({
  levels,
  format,
  transports,
});

module.exports = log;
