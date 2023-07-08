const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    { id: "ashduasdhUASHd", title: "Post one", content: "Content of post one" },
    { id: "ashduasdhUASHe", title: "Post two", content: "Content of post two" },
    {
      id: "ashduasdhUASHf",
      title: "Post three",
      content: "Content of post three",
    },
  ];
  res.status(200).send({
    message: "Posts fetched successfully",
    posts,
  });
});

app.use((req, res, next) => {
  res.send("Hello from express!");
});

module.exports = app;
