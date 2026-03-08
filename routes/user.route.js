const express = require('express')
const { signUp, signUpPage, login, getProfile, updateProfile, verifyToken } = require("../controllers/user.controller");
const router = express.Router()



router.post('/signup', signUp)
router.get('/signup', signUpPage)
router.post('/login', login)
router.get("/profile", verifyToken, getProfile);
router.post("/update-profile", verifyToken, updateProfile);


module.exports= router