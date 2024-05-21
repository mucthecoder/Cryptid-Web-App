const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
var path = require('path');
const nodemailer = require("nodemailer");

const login = async function(req, res) {
    try{
      const {username,password} = req.body;
      
      if(!username || !password){
        return res.sendStatus(401);
      }
      
      const this_user = await User.findOne({username});
      if(!this_user){
        return res.sendStatus(401);
      }
  
      const isMatch = await bcrypt.compare(password,this_user.password);
      if(!isMatch){
        return res.sendStatus(401);
      }
  
      req.session.user_id = this_user._id;
      res.sendStatus(200)
  
    }catch(err){
        console.log(err);
        res.status(500).json({message:"server error"});
    }
}

const signup =  async function(req, res) {
    try{
      const {username,password,email, userType} = req.body;
      
      if(!username || !password || !email){
        return res.status(401).send({message:"Insert your credintials"});
      }
      
      const this_user = await User.findOne({username});
      if(this_user){
        return res.status(409).json({
          message:"Username already taken"
        });
      }
  
      const hashedPass = await bcrypt.hash(password,10);
      const newUser = new User({
        username,
        password: hashedPass,
        email,
        userType:"user"
      });
  
      const user = await newUser.save();
  
      req.session.user_id = user._id;
  
      res.sendStatus(201);
  
    }catch(err){
        console.log(err);
        res.status(500).json({message:"server error"});
    }
}

const postforgot = async (req, res) => {
  try {
      const { email } = req.body;
      if (!email) {
          return res.status(400).json({
              message: "bad request"
          });
      }

      const available = await User.findOne({ email });
      if (!available) {
          return res.status(401).json({
              message: "No email address like that"
          });
      }

      //==============================================================================
      const code = generateCode();
      // console.log(code, email);
      // uncomment when a correct email is set
      sendEmail(code, email)
          .catch((err) => {
              console.log(err);
              return res.status(500).json({ message: "server error" });
          });
      //============================================================================


      // now code store in session
      const user_id = available._id;
      req.session.code_user_id = {
          user_id,
          code
      };

      res.status(200).json({
          message: "waiting for code"
      });
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: "server error" });
  }
}

async function sendEmail(code, email) {
  const service = "gmail";
  const host = "smtp.gmail.com"; // Corrected the host to Gmail SMTP server
  const user =  "munadandou@gmail.com"; //=================================email
  const pass = "bkmm prtb pvjr fsuy";//=================================email
  const transporter = nodemailer.createTransport({
    service: service,
    host: host,
    port: 587,
    secure: false,
    auth: {
      user: user,
      pass: pass,
    },
  });

      // HTML email content for security code
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="background-color: #4CAF50; color: white; padding: 10px;">Forgot Password Code</h2>
        <p>Dear Player,</p>
        <p>We received a request to reset your password. Use the code below to complete the process:</p>
        <div style="background-color: #f4f4f4; padding: 20px; border: 1px solid #ddd; text-align: center; font-size: 24px; font-weight: bold;">
            ${code}
        </div>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,<br>The Cryptid Game Team</p>
        <footer style="margin-top: 20px; text-align: center; color: #888;">
            <p>&copy; ${new Date().getFullYear()} Cryptid Game. All rights reserved.</p>
        </footer>
    </div>
  `;

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Cryptid Game" <${user}>`, // corrected the from field
    to: email,
    subject: "Forgot Password Code",
    html:htmlContent
  });
  
  return info;
}

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

const postforgotcode = async(req,res)=>{
    try{
      const {code} = req.body;
      if(!req.session.code_user_id){
        return res.status(401).json({
          message:"Unauthorized"
        });
      }
      if(req.session.code_user_id.code != code){
        return res.status(401).json({
          message:"Incorrect code"
        });
      }
      //correct verification code
      res.status(201).json({
        message:"correct code"
      });
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:"server error"});
    }
}

const patchpassword = async(req,res)=>{
    try{
      const {password} = req.body;
      if(!password){
        return res.sendStatus(400);
      }
      if(!req.session.id){
        return res.sendStatus(401);
      }
  
      const hashedPass = await bcrypt.hash(password,10);
      const updatedUser = await User.findByIdAndUpdate(
        req.session.code_user_id.user_id,
        {password:hashedPass},
        {new:true}
      );
  
      delete req.session.code_user_id;
      
      req.session.user_id = updatedUser._id;
  
      res.sendStatus(200);
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:"server error"});
    }
}

const usersendemail = (req,res)=>{
    const {message,phone,email,fullname} = req.body;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="background-color: #4CAF50; color: white; padding: 10px;">New Contact Form Submission</h2>
          <p><strong>Full Name:</strong> ${fullname}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd;">${message}</p>
          <footer style="margin-top: 20px; text-align: center; color: #888;">
              <p>&copy; ${new Date().getFullYear()} Cryptid Game. All rights reserved.</p>
          </footer>
      </div>
    `;
    //send email using nodemail or something else
    sendUserEmail(htmlContent)
    .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    });
  
    const filePath = path.join(__dirname, "../public/index.html");
    res.sendFile(filePath);
}

async function sendUserEmail(htmlContent) {
  const service = "gmail";
  const host = "smtp.gmail.com";
  const user =  "munadandou@gmail.com";
  const pass = "bkmm prtb pvjr fsuy";


  const transporter = nodemailer.createTransport({
    service: service,
    host: host,
    port: 587,
    secure: false,
    auth: {
      user: user,
      pass: pass,
    },
  });

  const info = await transporter.sendMail({
    to: user,
    subject: 'New Contact Us Form Submission',
    html: htmlContent
  });
  
  return info;
}

const verifyUserData = (req, res, next) => {
  if (!req.session || !req.session.user_id) {
      if (req._parsedUrl.pathname !== "/users/login") {
        // const filePath = path.join(__dirname, "../public/login.html");
        // return res.sendFile(filePath)
      }
  }
  // If user is authenticated or already on the login page, proceed to the next middleware
  next();
};


module.exports = {
    login,
    signup,
    postforgot,
    postforgotcode,
    patchpassword,
    usersendemail,
    verifyUserData
}