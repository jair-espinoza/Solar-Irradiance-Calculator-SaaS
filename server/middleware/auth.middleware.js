import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

// soft auth check cookie for username 
const JWT_SECRET = process.env.JWT_SECRET

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    // user doesn't have a cookie
    if(!token){
        req.user = null
        return next();
    }

    // auth cookie
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.userId);
    if(!user){
      req.user = null
      return next();
    }

    // attach the user to the req
    req.user = user
    next();
  } catch (error) {
    req.user = null
    next();
  }
}