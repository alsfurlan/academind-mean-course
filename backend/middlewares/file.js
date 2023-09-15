const multer = require('multer');

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

module.exports = multer({ storage }).single('image');
