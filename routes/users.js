var express = require('express');
var router = express.Router();
var path = require('path');

const userController = require("../controllers/userController");

const verify = userController.verifyUserData;

//handle all user stuff
router.get("/",(req,res)=>{
  if(req.session.user_id){
    const filePath = path.join(__dirname, "../public/home.html");
    res.sendFile(filePath);
  }
  else{
    const filePath = path.join(__dirname, "../public/login.html");
    res.sendFile(filePath);
  }
});

// get
router.get('/login', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/login.html");
  res.sendFile(filePath);
});

router.get('/forgot', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/forgot.html");
  res.sendFile(filePath);
});

// =============================================================================

router.post('/login', userController.login);

router.get('/logout', verify, userController.logout);

router.post('/register',userController.signup);

router.post('/forgot',userController.postforgot);

router.post('/forgot/code',userController.postforgotcode);

router.patch('/updatepassword',userController.patchpassword);

router.post('/sendemail', userController.usersendemail);

router.get("/getusername", verify,(req,res)=>{
  res.status(200).json({
    username:req.session.username
  });

});


module.exports = router;
