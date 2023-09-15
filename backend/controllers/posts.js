const PostModel = require('../models/post');

exports.createPost = (req, res, next) => {
  const post = new PostModel({
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
};

exports.getPost = (req, res, next) => {
  PostModel.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json({ post });
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching post failed!',
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize || 10;
  const currentPage = +req.query.page || 0;
  console.log('currentPage: ', currentPage);
  console.log('pageSize: ', pageSize);
  console.log('skip:', pageSize * currentPage);

  let fetchedPosts;
  PostModel.find({})
    .skip(pageSize * currentPage)
    .limit(pageSize)
    .then((posts) => {
      fetchedPosts = posts;
      return PostModel.count();
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
        message: 'Fetching posts failed!',
      });
    });
};

exports.deletePost = (req, res, next) => {
  let postDeleted;
  PostModel.deleteOne({ _id: req.params.id, creator: req.user.id })
    .then(({ deletedCount }) => {
      if (deletedCount) {
        res.status(200).json({ message: 'Post deleted!', postDeleted });
      } else {
        res.status(401).json({ messagee: 'Not authorized!' });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Error deleting the post!',
      });
    });
};

exports.updatePost = (req, res, next) => {
  const { title, content, id, image } = req.body;
  const imagePath = req.file ? getImagePath(req) : image;
  const post = new PostModel({
    _id: id,
    title,
    content,
    imagePath,
    creator: req.user.id,
  });
  PostModel.updateOne({ _id: req.params.id, creator: req.user.id }, post)
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
};
