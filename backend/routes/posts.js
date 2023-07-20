const express = require("express");
const router = express.Router();
const Post = require("../models/post");

router.post("", (req, res, next) => {
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

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({ post });
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.get("", (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      message: "Posts fetched successfully",
      posts,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then(() => {
    res.status(200).json({ message: "Update successful!" });
  });
});

module.exports = router;
