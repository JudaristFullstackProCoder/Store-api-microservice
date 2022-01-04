// Built-in modules imports
const process = require('process');
require("dotenv").config({path : require('path').resolve(".env")});
const cookieParser = require("cookie-parser");


// Third library imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require("helmet");


// custom modules imports
const mongoConnection = require('../db/mongoConnect');
const clientErrorHandler = require('../middlewares/clientErrorHandler');
const logError = require('../middlewares/logError');
const notFound = require("../middlewares/notFound");

// Middleware
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(helmet());

// Error handler middleware
app.use(logError, clientErrorHandler);

// Handle not found routes
app.all("*", notFound);

// start the server if the database connection succed

try {
    mongoConnection(process.env.mongodb);
    app.listen(process.env.port);
}catch(err) {
    console.log("The server can't start ");
    console.log(err);
}
