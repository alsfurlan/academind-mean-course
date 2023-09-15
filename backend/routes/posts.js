const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const file = require('../middlewares/file');

const PostController = require('../controllers/posts');

router.get('/:id', PostController.getPost);
router.get('', PostController.getPosts);
router.post('', auth, file, PostController.createPost);
router.put('/:id', auth, file, PostController.updatePost);
router.delete('/:id', auth, PostController.deletePost);

module.exports = router;
