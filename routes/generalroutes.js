const express = require("express");
const router = express.Router();
const User = require("../models/User");
const School = require("../models/School");
const Class = require("../models/Class")
const Posting = require("../models/Posting")
const File = require("../models/File")
const bcrypt = require("bcryptjs");
const passport = require("passport");

// const fileUploader = require('../configs/cloudinary/cloudinaryConfig');


// GET LANDING PAGE  =========================================================

router.get('/api/landing/posts/', (req, res, next) => {

  console.log(req.user)


  Class.find({ creator: req.user._id, teacher: req.user._id, parents: req.user._id})
  .then((classes) => {

    console.log(classes)

    Posting.find()
      .then((posts) => {

        let childList = classes.map((eachClass) => {
          if (eachClass.creator.equals(req.user._id) || eachClass.creator.equals(req.user._id)) {
            eachClass.owned = true;
            return eachClass
          } else {
            console.log("No classes found for this user.")
          }
        })

        let postList = posts.map((eachPost) => {
          if (eachPost.creator.equals(req.user._id)) {
          classes.map((eachClass) => {
            if (eachClass.id == eachPost.child) {
              eachPost.child = eachClass;
            } else {
              console.log("No classes found for this user.")
            }
          })
          eachPost.owned = true;
          return eachPost
          } else {
          console.log("No postings found for this user.")
          }
          })
        
        let chronologicalPosts = postList.reverse()
        let chronologicalChildList = childList.reverse()

        res.render('home-feed', { listOfclasses: childList,listOfPosts: postList });
        //console.log("POSTS BY ORDER:"+chronologicalPosts)
      })
      .catch((err) => {
        next(err)
      })
  }) // end of Child find .then
  .catch((err) => {
    next(err)
  })


})


// GET POSTS BY CLASS ID   =========================================================

router.get('/api/posting/:classId', (req, res, next) => {

  let classId = req.params.classId;

  console.log("the user getting the posts is:", req.user)


  Posting.find({class: classId})
    .populate('class')
    .populate('creator')
    .then((posts) => {

      posts.reverse()
      
      res.json({msg: 'posts found:', posts});

    })
    .catch((err) => {
      next(err)
    })


})
 

// LIKE A POST - AXIOS PUT =========================================================


router.put('/api/landing/post/like/:postId', (req, res, next) => {

  // console.log("user that is liking the post from req.user is: ", req.user)
  const userId = req.body._id
  console.log("current user id from req.body is : ", userId)
  console.log("req.body is: ", req.body)
  // let postId = req.params.postId;
  // let userId = req.user._id



  // Posting.findByIdAndUpdate(postId, {likes: likes.push(userId)})
  //   .then((postLiked) => {
      
  //     res.json({msg: 'Like added to post:', postLiked});

  //   })
  //   .catch((err) => {
  //     next(err)
  //   })


})


// // CREATE NEW CLASS (ADMIN) - AXIOS POST =========================================================

// router.post('/api/setup/class', (req, res, next) => {
  
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