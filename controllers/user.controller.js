const UserModel = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const jwt = require('jsonwebtoken')
// const otpGenerator = require('otp-generator')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "onifadjosh@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

// let otp;

const signUp = async (req, res) => {
  const {
    fullname,
    password,
    email,
    profilePicture,
    username,
    gender,
    skill,
    dateOfBirth,
    role,
    bio,
    location,
  } = req.body;
  try {
    let saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    

    let image = await cloudinary.uploader.upload(profilePicture, {
      resource_type: "image",
    });

    let user = await UserModel.create({
      fullname,
      password: hashedPassword,
      email,
      profilePicture: image.secure_url,
      username,
      gender,
      skill,
      dateOfBirth,
      role,
      bio,
      location,
    });

    if (user) {
      jwt.sign({id:user._id}, process.env.SKILL_PASS, {expiresIn:'2h'}, (err, token)=>{
        if(err){
          console.log(err);
        }else{

          res.send({ status: true, message: "user registered successfully" , token});
        }
      })
      const emailTemplatePath = path.join(
        __dirname,
        "../views/email-templates/welcome-email.ejs"
      );

      ejs.renderFile(emailTemplatePath, { username, fullname }, (err, html) => {
        if (err) {
          console.error("Error rendering email template:", err);
          return;
        }
        let mailOptions = {
          from: "SkillLink",
          to: email,
          subject: "Welcome to SkillLink 🥳",
          html: html,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      });
    }
  } catch (error) {
    if (error.code == 11000) {
      console.log(error);
      res.send({ status: false, message: "user already exists" });
    } else {
      console.log(error);
      res.send({
        status: false,
        message: "user cannot register at this moment",
      });
    }
  }
};

const signUpPage = (req, res) => {
  res.send("sign up working");
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.findOne({email});
    if (user) {
      console.log(user.password);
      let isMatch= await bcrypt.compare(password, user.password)
      if(isMatch){

        jwt.sign({id:user._id}, process.env.SKILL_PASS, {expiresIn:'2h'}, (err, token)=>{
          if(err){
            console.log(err);
          }else{
            console.log({status:true, message:'Login successfull', user:{}, token})
            res.send({status:true, message:'Login successfull', user, token});
          }
        })
  
      }
      
    } else {
      res.send({status:false, message:'invalid credentials'})
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Account not found" });
  }
};

const verifyToken= (req, res, next)=>{
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.send({status:false, message:'Access denied, token missing'})
  const token = authHeader.split(" ")[1];
  if(!token) return res.send({status:false, message:'Access denied, token missing'})
  jwt.verify(token, process.env.SKILL_PASS, (err, decoded)=>{
console.log(err);

    if(err) return res.send({status:false, message:'Invalid token'})
    req.userId = decoded.id
    next()
  })
}

const verifyAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user && user.role === "admin") {
      next();
    } else {
      res.send({ status: false, message: "Unauthorized. Admin access required." });
    }
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error verifying admin" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.send({ status: false, message: "User not found" });
    }
    res.send({ status: true, user });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error fetching profile" });
  }
};

const updateProfile = async (req, res) => {
  const { fullname, skill, gender, dateOfBirth, bio, location, profilePicture } = req.body;
  try {
    let updateData = { fullname, skill, gender, dateOfBirth, bio, location };
    
    if (profilePicture && profilePicture.startsWith("data:image")) {
      let image = await cloudinary.uploader.upload(profilePicture, {
        resource_type: "image",
      });
      updateData.profilePicture = image.secure_url;
    }

    const user = await UserModel.findByIdAndUpdate(req.userId, updateData, { new: true }).select("-password");
    if (!user) {
      return res.send({ status: false, message: "User not found" });
    }
    res.send({ status: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error);
    res.send({ status: false, message: "Error updating profile" });
  }
};

module.exports = {
  signUp,
  signUpPage,
  login,
  getProfile,
  updateProfile,
  verifyToken,
  verifyAdmin
};
