
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

// initialize const
// get required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const rootPath = process.cwd();
const apiController = require('../controller/appController');

const app = express();
const port = process.env.PORT || 7000; // set port

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set mongo db connection string
const dbURL = process.env.MONGODB_URL;

// Connect to database
mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected ...."))

  .catch(err => console.error(err));

// Redirct any route which includes /api to apiRoute controller
app.use("/", apiController);
app.use(express.static(path.join(__dirname, '../../public')));

// Start listening
app.listen(port, () => console.log("Server started at port " + port));