// this function will check if user and request is valid

import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

// if valid it will allow next function to execute by next()
// THIS IS HARD/STRICT MIDDLEWARE LIKE A GUARD/GATE KEEPER
export const protectRoute = async (req, res, next) => {
  // get jwt cookie from req
  const { jwt_cookie } = req.cookies;

  if (!jwt_cookie) {
    return res.status(401).json({ message: "Unauthorized - No Token Found" });
  }

  try {
    // decode this jwt token and get user id from it
    const decryptedToken = jwt.verify(jwt_cookie, process.env.JWT_SECRET);

    if (!decryptedToken)
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });

    // get user id from the token and fetch userdata from database
    const { userId } = decryptedToken;
    const fetchedUserData =
      await UserModel.findById(userId).select("-password");

    if (!fetchedUserData)
      return res.status(404).json({ message: "Invalid - User not found" });

    // execute next function
    req.user = fetchedUserData;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

// if user hasnt sign up or not login or dont have coookie for some reason
// then instead of sending errors and loggin on consoles just send null value
// frontend will understand and simply route user to login page instead of logging errors
// THIS IS CALLED SOFTWARE MIDDLE WARE IT ONLY CHECKS OBSERVES REQ AND ADDS CONTEXT
export const protectRouteForCookie = async (req, res, next) => {
  // get jwt cookie from req
  const { jwt_cookie } = req.cookies;

  // No cookie = guest user (NOT an error)
  if (!jwt_cookie) {
    req.user = null;
    return next();
  }

  try {
    // decode this jwt token and get user id from it
    const decryptedToken = jwt.verify(jwt_cookie, process.env.JWT_SECRET);

    // get user id from the token and fetch userdata from database
    const { userId } = decryptedToken;
    const fetchedUserData =
      await UserModel.findById(userId).select("-password");

    if (!fetchedUserData) {
      req.user = null;
    } else {
      req.user = fetchedUserData;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
