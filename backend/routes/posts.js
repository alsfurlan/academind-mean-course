const express = require("express");
const multer = require("multer");
const router = express.Router();
const Post = require("../models/post");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = null;
    if (!isValid) {
      error = new Error("Invalid myme tipe");
    }
    callback(error, "backend/images");
  },
  filename: (request, filename, callback) => {
    const name = filename.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[filename.mimetype];
    callback(null, `${name}-${Date.now()}.${extension}`);
  },
});

router.post("", multer({ storage }).single("image"), (req, res, next) => {
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
