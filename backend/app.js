const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require("./model/post");
const app = express();

mongoose.connect('mongodb+srv://max:Yfm4s5VawVNUzywk@academind.k0cse0j.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
  console.log('Connected to database!');
}, () => {
  console.log('Connection failed!')
})

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save();
  res.status(201).json({
    message: "Post added successfully!",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    { id: "ashduasdhUASHd", title: "Post one", content: "Content of post one" },
    { id: "ashduasdhUASHe", title: "Post two", content: "Content of post two" },
    {
      id: "ashduasdhUASHf",
      title: "Post three",
      content: "Content of post three",
    },
  ];
  res.status(200).json({
    message: "Posts fetched successfully",
    posts,
  });
});

app.use((req, res, next) => {
  res.send("Hello from express!");
});

module.exports = app;
