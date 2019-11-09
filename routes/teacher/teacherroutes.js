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

router.post('/api/landing/post', fileUploader.array('postingFiles', 10), (req, res, next)=>{
    
  // console.log("Data from req.body: ",req.body);
  // console.log("Data from req.files: ",req.files);
  // console.log("Data from req.files.url: ",req.files[0].url);

  let arrayOfFileUrls = [];
  let copyOfFiles = req.files.map((eachFile) => {
      arrayOfFileUrls.push(eachFile.url)
    }
  )

  console.log("Array of Posting File Urls: ", arrayOfFileUrls)

  Posting.create({ 
      creation: req.body.postDate,
      description: req.body.postDescription,
      files: arrayOfFileUrls,
      class: req.body.postClassId,
      creator: req.user._id,
  })
  .then((newPost)=>{
      
      res.json({msg: 'New Posting JSON:', newPost});
  })  
  .catch((err)=>{
      console.log(err)
  })
  
})

// CREATE NEW FILE POST - AXIOS =========================================================

router.post('/api/landing/file', fileUploader.array('uploadFiles', 10), (req, res, next)=>{
    
  let arrayOfDocFileUrls = [];
  let copyOfDocFiles = req.files.map((eachFile) => {
      arrayOfDocFileUrls.push(eachFile.url)
    }
  )
  
  console.log("Document File Urls: ", arrayOfDocFileUrls)

  File.create({ 
      creation: req.body.fileDate,
      description: req.body.fileDescription,
      files: arrayOfDocFileUrls,
      class: req.body.postClassId,
      creator: req.user._id,
  })
  .then((newDocs)=>{
      
      res.json({msg: 'New Files JSON:', newDocs});
  })  
  .catch((err)=>{
      console.log(err)
  })
  
})


// EDIT CLASS (Admin/Teacher) - AXIOS POST =========================================================

// router.put('/api/setup/class/edit', (req, res, next) => {
  
//   // let creatorId = req.user._id;

//   const { className, teacher, schoolName, schoolId, creatorId } = req.body;
//   console.log("Frontend form data for school: ",req.body);

//   Class.create({ className, teacher, schoolName, schoolId, creatorId })
//   .then((newClass)=>{
    
//     res.json({msg: 'A new class has been added.', newClass});
//     console.log(JSON.stringify(newClass))
//   })  
//   .catch((err)=>{
//     console.log(err)
//   })

// })










module.exports = router;