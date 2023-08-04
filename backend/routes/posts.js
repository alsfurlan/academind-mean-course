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
    imagePath: getImagePath(req),
  });
  post.save().then((post) => {
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        imagePath: post.imagePath,
      },
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
  const pageSize = +req.query.pagesize;
  const page = +req.query.page;
  console.log(pageSize, " ", page);
  const postQuery = Post.find();
  if (page && pageSize) {
    postQuery.skip(pageSize * (page - 1)).limit(pageSize);
  }
  postQuery.then((posts) => {
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

router.put("/:id", multer({ storage }).single("image"), (req, res, next) => {
  const { title, content, id, image } = req.body;
  const imagePath = req.file ? getImagePath(req) : image;
  const post = new Post({
    _id: id,
    title,
    content,
    imagePath,
  });
  Post.updateOne({ _id: req.params.id }, post).then(() => {
    res.status(200).json({
      message: "Update successful!",
      post: { id, title, content, image: imagePath },
    });
  });
});

module.exports = router;

function getImagePath(req) {
  return `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
}
