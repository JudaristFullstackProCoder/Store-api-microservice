// Built-in modules imports
const process = require('process');
require("dotenv").config({path : require('path').resolve(".env")});
const cluster = require('cluster');

// Third library imports
const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require("helmet");
const multer = require("multer");
// File upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
});
const uploadStorage = multer({ storage: storage });

// custom modules imports
const mongoConnection = require('../db/mongoConnect');
const clientErrorHandler = require('../middlewares/clientErrorHandler');
const errorLogger = require('../middlewares/errorLogger');
const notFound = require("../middlewares/notFound");
const storeRoutes = require("../routes/store");
const productsRoutes = require("../routes/product");
const categoryRoutes = require("../routes/category");
const optionsRoutes = require("../routes/option");
const addProductImage = require("../controllers/product").addProductImage;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(helmet());
app.use(express.static('../uploads'));

// Handle routes
app.use("/stores", storeRoutes);
app.use("/products", productsRoutes);
app.use("/category", categoryRoutes);
app.use("/options", optionsRoutes);
// images upload for product
app.post("/products/:id/upload", uploadStorage.single('image'), function(req, res, next) {
    // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   return addProductImage(req, res, next);
});

// Error handler middleware
app.use(errorLogger, clientErrorHandler);

// Handle not found routes
app.all("*", notFound);

// start the server if the database connection succed
// For Master process
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    const numCPUs = require('os').cpus().length;
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
      console.log(`Worker ${process.pid} started`);
    }
   
    // This event is firs when worker died
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
    // For Worker
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    try {
        mongoConnection(process.env.mongodb);
        app.listen(process.env.port);
    }catch(err) {
        console.log("The server can't start ");
        console.log(err);
    }
  }

