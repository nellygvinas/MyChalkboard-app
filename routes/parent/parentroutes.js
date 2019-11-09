const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const School = require("../../models/School");
const Class = require("../../models/Class");
const Posting = require("../../models/Posting");
const File = require("../../models/File");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// const fileUploader = require('.../../../configs/cloudinary/cloudinaryConfig');


// CREATE NEW SCHOOL (ADMIN) - AXIOS POST =========================================================





// CREATE NEW CLASS (ADMIN) - AXIOS POST =========================================================





// GET CLASS WITH CLASS CODE  =========================================================

router.get('/api/setup/class/code/', (req, res, next) => {

  console.log("Frontend form data for school: ", req.body);
  const code = req.body;

  Class.findOne({ classCode: code })
  .then((foundClass)=>{
    
    res.json({msg: 'The class found:', foundClass});
    console.log(JSON.stringify(foundClass))
  })  
  .catch((err)=>{
    console.log(err)
  })

})
 


module.exports = router