const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const School = require("../../models/School");
const Class = require("../../models/Class");
const Posting = require("../../models/Posting");
const File = require("../../models/File");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const fileUploader = require('../../configs/cloudinary/cloudinaryConfig');


// CREATE NEW POST - AXIOS =========================================================

router.post('/api/landing/post/:classId', fileUploader.array('file', 10), (req, res, next)=>{
    
  let classId = req.params.classId

  console.log("Data from req.body: ",req.body);
  console.log("Data from req.files: ",req.files);
  
  let arrayOfFileUrls = [];
  let copyOfFiles = req.files.map((eachFile) => {
      arrayOfFileUrls.push(eachFile.url)
    }
  )
  console.log("Array of Posting File Urls: ", arrayOfFileUrls)

  Posting.create({ 
      creation: req.body.creation,
      description: req.body.description,
      files: arrayOfFileUrls,
      class: classId,
      creator: req.user._id,
      likes: [],
      comments: []
  })
  .then((newPost)=>{
      
      res.json({msg: 'New Posting created:', newPost});
  })  
  .catch((err)=>{
      console.log(err)
  })
  
})

// CREATE NEW FILE - AXIOS =========================================================

router.post('/api/landing/file/:classId', fileUploader.array('file', 10), (req, res, next)=>{
    
  let classId = req.params.classId

  console.log("Data from req.body: ",req.body);
  console.log("Data from req.files: ",req.files);
  
  let arrayOfFileUrls = [];
  let copyOfFiles = req.files.map((eachFile) => {
      arrayOfFileUrls.push(eachFile.url)
    }
  )
  console.log("Array of Posting File Urls: ", arrayOfFileUrls)

  File.create({ 
      creation: req.body.creation,
      description: req.body.description,
      files: arrayOfFileUrls,
      class: classId,
      creator: req.user._id
  })
  .then((newFile)=>{
      
      res.json({msg: 'New File created:', newFile});
  })  
  .catch((err)=>{
      console.log(err)
  })
  
})



// CREATE NEW FILE POST - AXIOS =========================================================

// router.post('/api/landing/file', fileUploader.array('uploadFiles', 10), (req, res, next)=>{
    
//   let arrayOfDocFileUrls = [];
//   let copyOfDocFiles = req.files.map((eachFile) => {
//       arrayOfDocFileUrls.push(eachFile.url)
//     }
//   )
  
//   console.log("Document File Urls: ", arrayOfDocFileUrls)

//   File.create({ 
//       creation: req.body.fileDate,
//       description: req.body.fileDescription,
//       files: arrayOfDocFileUrls,
//       class: req.body.postClassId,
//       creator: req.user._id,
//   })
//   .then((newDocs)=>{
//       res.json({msg: 'New Files JSON:', newDocs});
//   })  
//   .catch((err)=>{
//       console.log(err)
//   })
  
// })


// GET POSTING - AXIOS POST =========================================================











module.exports = router;