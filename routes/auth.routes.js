const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// NEW USER SIGNUP ROUTE =======================================================================================
authRouter.post("/api/signup", (req, res, next) => {
  console.log("frontend form data: ", req.body);
  const { fullName, email, password, role } = req.body;

  if(fullName == "" || email == "" || password.match(/[0-9]/) === null){
    // send JSON file to the frontend if any of these fields are empty or password doesn't contain a number
    res.status(401).json({ message: "All fields need to be filled and password must contain a number! 🤨" });
    return;
  }

  User
    .findOne({ email })
    .then( foundUser => {
      if(foundUser !== null ){
        res.status(401).json({ message: "A user with the same email is already registered!" });
        return;
      }

      const bcryptSalt = 10;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const encryptedPassword = bcrypt.hashSync(password, salt);

      User
        .create({ fullName, email, encryptedPassword, role })
        .then( userDoc => { 
          // if all good, log in the user automatically
          // "req.login()" is a Passport method that calls "serializeUser()"
          // (that saves the USER ID in the session)
          
          req.login(userDoc, (err) => {
            if(err){
              res.status(401).json({ message: "Something happened when logging in after the signup" });
              return;
            }
            userDoc.encryptedPassword = undefined;
            res.status(200).json({ userDoc });  
          })
         } )
        .catch( err => next(err) ); // close User.create()
    })
    .catch(err => next(err)); // close User.findOne()
});


// USER LOGIN ROUTE =======================================================================================

authRouter.post("/api/login", (req, res, next)  => {
  
  passport.authenticate("local", (err, userDoc, failureDetails) => {
    if(err){
      res.status(500).json({ message: "Something went wrong with login." })
    }
    if(!userDoc){
      res.status(401).json(failureDetails);
    }

    req.login(userDoc, (err) => {
      if(err){
        res.status(500).json({message: "Something went wrong with getting user object from DB"})
        return;
      }
      // set password to undefined so it doesn't get revealed in the client side (browser ==> react app)
      userDoc.encryptedPassword = undefined;
      // send json object with user information to the client
      res.status(200).json({ userDoc });
    } )
  })(req, res, next);
})

// USER LOGOUT ROUTE =======================================================================================

authRouter.delete("/api/logout", (req, res, next) => {
  // "req.logout()" is a Passport method that removes the user ID from session
  req.logout();
  // send empty "userDoc" when you log out
  res.json({ userDoc: null })
  // console.log("LOGGED OUT", userDoc)
})

// CHECK USER ROUTE =======================================================================================
// check if user is logged in and if we are logged in what are user's details
// this is the information that is useful for the frontend application

authRouter.get("/api/checkuser", (req, res, next) => {
  console.log("do i have user: ", req.user);
  if(req.user){
    req.user.encryptedPassword = undefined;
    // res.json(req.user)
    res.status(200).json({ userDoc: req.user })
  } else {
    res.status(401).json({ userDoc: null })
  }
})

// NEW USER - ASSIGN ROLE =======================================================================================

authRouter.put("/api/setup/role", (req, res, next) => {

  let id = req.user._id;
  console.log("req.user._id is:"+ id)
  
  const { userId, role } = req.body;

  console.log("req.body is " + userId, role)
  
  User
    .findByIdAndUpdate(userId, {$set: {role: role}})
    .then( theUpdatedUser => {
        res.status(200).json({ message: "Your role has been updated.", theUpdatedUser});
      }
    )
    .catch(err => next(err)); // close User.findByIdAndUpdate()

})

// GET USER - AFTER ASSIGN ROLE =======================================================================================

authRouter.get("/api/setup/role/:id", (req, res, next) => {

  let userId = req.params.id;
  console.log("req.params.id is:"+ userId)
  
  User
    .findById(userId)
    .then( theUpdatedUser => {
        res.status(200).json({ message: "Your role has been updated.", theUpdatedUser});
      }
    )
    .catch(err => next(err)); // close User.findByIdAndUpdate()

})


// USER - EDIT NAME =======================================================================================================

authRouter.put("/api/account/name/:id", (req, res, next) => {

  let id = req.user._id;
  console.log("req.user._id is:"+ id)
  
  const { fullName } = req.body;

  User
    .findByIdAndUpdate(id, {$set: {fullName: fullName}})
    .then( theUpdatedUser => {
        res.status(200).json({ message: "Your username has been updated.", theUpdatedUser});
      }
    )
    .catch(err => next(err)); // close User.findByIdAndUpdate()

})


// USER - EDIT EMAIL =======================================================================================================

authRouter.put("/api/account/email/:id", (req, res, next) => {

  let id = req.user._id;
  console.log("req.user._id is:"+ id)


  console.log("Edit email - frontend form data from req.body: ", req.body);
  const { email } = req.body;

  if(email == "" ){
    // send JSON file to the frontend if any of these fields are empty or password doesn't contain a number
    res.status(401).json({ message: "Please provide a valid email." });
    return;
  }

  User
    .findOne({ email })
    .then( foundUser => {
      if(foundUser !== null ){
        res.status(401).json({ message: "A user with the same email is already registered! Please provide a different email." });
        return;
      }

      User
        .findByIdAndUpdate(id, {$set: {email: email}})
        .then( userDoc => { 
          // if all good, log in the user automatically
          // "req.login()" is a Passport method that calls "serializeUser()"
          // (that saves the USER ID in the session)
          
          req.login(userDoc, (err) => {
            if(err){
              res.status(401).json({ message: "Something happened when logging in after the password update" });
              return;
            }
            userDoc.encryptedPassword = undefined;
            res.status(200).json({ userDoc });  
          })
         } )
        .catch( err => next(err) ); // close User.findbyidandupdate()
    })
    .catch(err => next(err)); // close User.findOne()

});



// USER - EDIT PASSWORD =======================================================================================================


authRouter.put("/api/account/password/:id", (req, res, next) => {
 
  let id = req.user._id
  const { password } = req.body;
  console.log("Edit password - frontend form data: ", req.body);

  if(password.match(/[0-9]/) === null){
    // send JSON file to the frontend if any of these fields are empty or password doesn't contain a number
    res.status(401).json({ message: "Please provide a valid password. Your password must contain a number!" });
    return;
  }


    const bcryptSalt = 10;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    User
      .findByIdAndUpdate(id, { encryptedPassword})
      .then( userDoc => { 
        // if all good, log in the user automatically
        // "req.login()" is a Passport method that calls "serializeUser()"
        // (that saves the USER ID in the session)
        
        req.login(userDoc, (err) => {
          if(err){
            res.status(401).json({ message: "Something happened when logging in after the password update" });
            return;
          }
          userDoc.encryptedPassword = undefined;
          res.status(200).json({ userDoc });  
        })

       })
      .catch(err => next(err)); // close User.findbyidandupdate()
    
    
})
    










// GET USER - AFTER EDIT =======================================================================================

authRouter.get("/api/account/:id", (req, res, next) => {

  let userId = req.params.id;
  console.log("req.params.id is:"+ userId)
  
  User
    .findById(userId)
    .then( theUpdatedUser => {
        res.status(200).json({ message: "Your user has been updated.", theUpdatedUser});
      }
    )
    .catch(err => next(err)); // close User.findByIdAndUpdate()

})






module.exports = authRouter;