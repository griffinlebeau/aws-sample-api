const express = require('express');
const router = express.Router();
const multer = require('multer');//adds a file property on the req object that contains the image file uploaded by the form 
const AWS = require('aws-sdk');
const paramsConfig = require('../utils/params-config');
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
  });
const storage = multer.memoryStorage({//holds image files until they're ready for upload to the S3B
    destination: function (req, file, callback) {
      callback(null, '');
    },
  });
// image is the key!
const upload = multer({ storage }).single('image');//contains the storage destination and the key 'image'
//upload function will store the image data from the form data received by the POST route
//.single() method defines that this upload function will receive only one image
router.post('/image-upload', upload, (req, res) => {//upload argument defines the key and storage destination
    const params = paramsConfig(req.file);
    s3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        }
        res.json(data);
      });
  });