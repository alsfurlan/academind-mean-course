const express = require("express");
const bodyParser = require("body-parser");

const app = express();

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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully!'
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
