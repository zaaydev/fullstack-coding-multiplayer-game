import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model.js";

/* =====================================================
   ✍️ SIGN-UP CONTROLLER
===================================================== */
export const handleSignUp = async (req, res) => {
  // Extract data coming from the frontend request body
  console.log("hittttt", req.body);
  const { playerName, email, password } = req.body;

  // Validate empty fields
  if (!playerName || !email || !password)
    return res.status(400).json({ message: "Fields Are Empty" });

  // Validate password length
  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password Length Should Be More Than 6" });

  // Check if user already exists in DB
  const userFound = await UserModel.findOne({ email });

  if (userFound)
    return res.status(301).json({ message: "EMAIL ALREADY EXIST!" });

  // Continue if validations passed and make password hashed
  try {
    // 1️⃣ Generate a random salt for hashing
    const salt = await bcrypt.genSalt(10);

    // 2️⃣ Hash password along with salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3️⃣ Create a new user with hashed password
    const newUser = await UserModel.create({
      playerName,
      email,
      password: hashedPassword,
    });

    // If user creation successful, generate JWT cookie and save
    if (newUser) {
      // Prepare user id for token payload
      const userId = newUser._id;

      // Create a signed JWT token valid for 7 days
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Send token as HTTP-only cookie to frontend
      res.cookie("jwt_cookie", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // prevent access via JS
        sameSite: "none", // protection against CSRF (only when same site)
        secure: process.env.SERVER_ENV !== "development", // secure in production
      });

      // Save user to DB
      await newUser.save();

      // Return user data (excluding password)
      res.status(201).json({
        _id: newUser._id,
        playerName: newUser.playerName,
        email: newUser.email,
      });
    } else {
      // User not created for some unexpected reason
      return res.status(400).json("INVALID USER DATA");
    }
  } catch (error) {
    // Any server or database error
    console.log(error);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

/* =====================================================
   🔑 LOG-IN CONTROLLER
===================================================== */
export const handleLogIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Basic validations
    if (!email || !password) {
      return res.status(400).json({ message: "ALL FIELDS REQUIRED" });
    }

    // Find user using email
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ message: "User dosen't exists" });
    }

    // 2️⃣ Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password,
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Create token cookie and send it too frontend
    const userId = foundUser._id;

    // Create a signed JWT token valid for 7 days
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send token as HTTP-only cookie to frontend
    res.cookie("jwt_cookie", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // prevent access via JS
      sameSite: "none", // protection against CSRF
      secure: process.env.SERVER_ENV !== "development", // secure in production
    });

    // Send user info (no password)
    res.status(200).json({
      _id: foundUser._id,
      playerName: foundUser.playerName,
      email: foundUser.email,
    });
  } catch (error) {
    console.log(error);
    res.send(500).json({ message: "Internal server error" });
  }
};

/* =====================================================
   🚪 LOG-OUT CONTROLLER
===================================================== */
export const handleLogOut = (req, res) => {
  try {
    // Clear auth cookie
    res.cookie("jwt_cookie", "");
    res.status(200).json({ message: "Successfully logout" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed logout" });
  }
};

/* =====================================================
   🔍 CHECK AUTH CONTROLLER
===================================================== */
export const handleCheckAuth = (req, res) => {
  try {
    // req.user is injected by auth middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error In check auth" });
  }
};
