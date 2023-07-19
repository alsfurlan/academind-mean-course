const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./model/post");
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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((post) => {
    res.status(201).json({
      message: "Post added successfully!",
      postId: post.id,
    });
  });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then(() => {
    res.status(200).json({ message: "Update successful!" });
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({ post });
    }
    res.status(404).json({message: 'Post not found!'});
  });
});

app.use((req, res, next) => {
  res.send("Hello from express!");
});

module.exports = app;
