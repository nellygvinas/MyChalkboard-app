// config/ cloudinary.js

const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

var storedFiles = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'class-files', // The name of the folder in cloudinary
  allowedFormats: ['jpg','png','jpeg','gif','pdf','mp4','xls','docx','doc'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  }
});

// file types ,'jpeg','gif','pdf','mp4','xls','docx','doc'

const uploadCloud = multer({ storage: storedFiles });

module.exports = uploadCloud;