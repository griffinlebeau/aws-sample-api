const { v4: uuidv4 } = require('uuid');
const params = (fileName) => {
    const myFile = fileName.originalname.split('.');
    const fileType = myFile[myFile.length - 1];
  
    const imageParams = {//must define bucket, key, and body to connect to bucket
      // Replace the <My_Bucket_Name> with the name of your own S3 bucket
      Bucket: 'user-images-2ee39593-0deb-4257-92e2-7ed1840f21ea',
      Key: `${uuidv4()}.${fileType}`, //name of this file, uuid gives a unique name
      Body: fileName.buffer,
      ACL: 'public-read' // allow read access to this file
    };
  
    return imageParams;
  };

 module.exports = params;