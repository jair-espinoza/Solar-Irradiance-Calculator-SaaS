import {User} from "../models/user.models.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = "1h"


// generate a JWT
const createToken = (id) => { 
  return jwt.sign(
    {userId: id}, 
    JWT_SECRET, 
    {expiresIn: JWT_EXPIRES_IN}
  )
};

// set cookie
const cookieBuild = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000
}


const registerUser = async(req, res) =>{
  try {
    // break down body
    const{username, email, password} = req.body;

    // validate
    if (!username || !email || !password){
      return res.status(400).json({message: "Missing all required inputs"})
    }
   // check if account exist in the db
    const userExist = await User.findOne({email: email.toLowerCase()})
    if (userExist) {
      return res.status(400).json({message: "User Already Exist"})
    }

    // create the user
    const user = await User.create({
      username: username.toLowerCase(),
      email: email,
      password: password,
      loggedIn: false
    })

    // get the id from the user created in MONGODB
    const token = createToken(user._id)

    // return status 201 and cookie
    res.cookie('jwt', token, cookieBuild)
    res.status(201).json({
      message:"User Registered",
      user:{
        id: user._id.toString(), 
        email: user.email, 
        username: user.username
      },
      token, 
    })

  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error: error.message})
  }
}

const loginUser = async (req,res) => {
  try {
    // check if user exist
    const {email, password} = req.body
    const user = await User.findOne({email:email.toLowerCase() })

    // user dne
    if(!user){
      return res.status(404).json({message: "Please Try Again"})
    }

    // check password
    const isMatch = await user.comparePassword(password)
    if(!isMatch){
      console.error("error logging in")
      return res.status(400).json({message: "Please Try Again"})
    }

    // JWT
    const token = createToken(user._id)

    // login user
    res.cookie("jwt", token, cookieBuild)
    res.status(200).json({
      message:"Login Successful, Welcome Back!",
      user:{
        id: user._id,
        email: user.email,
        username:user.username
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({message:"server error", error})
  }
}

const logoutUser = async (req, res) => {
  try {
    // expire the cookie
    res.cookie("jwt", "", {maxAge: 1})
    res.status(200).json({
      message: "Logged out Successful"
    })
  } catch (error) {
    res.status(500).json({message:"Server side error,", error: error.message})
  }
}

// pass in auth for cookie validation
const getCookieUser = async (req, res) => {
  try {
    if(!req.user){
      return res.status(200).json({authenticated: false})
    }

    res.status(200).json({
      authenticated: true, 
      message: "Authenticated",
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      authenticated: false,
      message: "Cookie Server error", error: error.message
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser, 
  getCookieUser
}