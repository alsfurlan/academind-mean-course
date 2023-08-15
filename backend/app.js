const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoute = require("./routes/posts");
const userRoute = require('./routes/user');
const app = express();

mongoose
  .connect(
    "mongodb+srv://max:Yfm4s5VawVNUzywk@academind.k0cse0j.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(
    () => {
      console.log("Connected to database!");
    },
    () => {
      console.log("Connection failed!");
    }
  );

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoute);
app.use('/api/user', userRoute);
app.use("/images", express.static(path.join('backend/images')));


module.exports = app;
