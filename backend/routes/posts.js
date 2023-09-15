const express = require('express');
const multer = require('multer');
const router = express.Router();
const checkAuth = require('../middlewares/auth');

const PostController = require('../controllers/posts');

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
  PostController.createPost
);

router.get('/:id', PostController.getPost);

router.get('', PostController.getPosts);

router.delete('/:id', checkAuth, PostController.deletePost);

router.put(
  '/:id',
  checkAuth,
  multer({ storage }).single('image'),
  PostController.updatePost
);

module.exports = router;

function getImagePath(req) {
  return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
}
