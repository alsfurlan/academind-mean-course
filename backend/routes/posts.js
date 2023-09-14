const express = require('express');
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middlewares/auth');
const Post = require('../models/post');
const fs = require('fs').promises;

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = null;
    if (!isValid) {
      error = new Error('Invalid myme tipe');
    }
    callback(error, 'backend/images');
  },
  filename: (request, filename, callback) => {
    const name = filename.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[filename.mimetype];
    callback(null, `${name}-${Date.now()}.${extension}`);
  },
});

router.post(
  '',
  checkAuth,
  multer({ storage }).single('image'),
  (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: getImagePath(req),
      creator: req.user.id,
    });
    post
      .save()
      .then((post) => {
        res.status(201).json({
          message: 'Post added successfully!',
          post: {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creator: post.creator,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: 'Creating a post failed!',
        });
      });
  }
);

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json({ post });
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  })
  .catch((error) => {
    res.status(500).json({
      message: 'Fetching post failed!'
    })
  });;
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize || 10;
  const currentPage = +req.query.page || 0;
  console.log('currentPage: ', currentPage);
  console.log('pageSize: ', pageSize);
  console.log('skip:', pageSize * currentPage);

  let fetchedPosts;
  Post.find({})
    .skip(pageSize * currentPage)
    .limit(pageSize)
    .then((posts) => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      })
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  let postDeleted;
  Post.deleteOne({ _id: req.params.id, creator: req.user.id }).then(
    ({ deletedCount }) => {
      if (deletedCount) {
        res.status(200).json({ message: 'Post deleted!', postDeleted });
      } else {
        res.status(401).json({ messagee: 'Not authorized!' });
      }
    }
  )
  .catch(() => {
    res.status(500).json({
      message: 'Error deleting the post!'
    })
  });;
});

router.put(
  '/:id',
  checkAuth,
  multer({ storage }).single('image'),
  (req, res, next) => {
    const { title, content, id, image } = req.body;
    const imagePath = req.file ? getImagePath(req) : image;
    const post = new Post({
      _id: id,
      title,
      content,
      imagePath,
      creator: req.user.id,
    });
    Post.updateOne({ _id: req.params.id, creator: req.user.id }, post)
      .then(({ modifiedCount }) => {
        if (modifiedCount) {
          res.status(200).json({
            message: 'Update successful!',
            post: { id, title, content, image: imagePath },
          });
        } else {
          res.status(401).json({ messagee: 'Not authorized!' });
        }
      })
      .catch((error) => {
        res.status(500).json({
          message: "Couldn't update the post!",
        });
      });
  }
);

module.exports = router;

function getImagePath(req) {
  return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
}
