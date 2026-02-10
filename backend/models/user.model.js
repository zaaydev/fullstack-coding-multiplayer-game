import mongoose from "mongoose";

//1. we create body schema of user
const userSchema = new mongoose.Schema(
  {
    playerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

//2. we create model(collection) of that schemas with "User" name
export const UserModel = mongoose.model("User", userSchema);