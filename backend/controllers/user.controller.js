import { UserModel } from "../models/user.model.js";

export const handle_add_apikey = async (req, res) => {
    
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ message: "API key required" });
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { apiKey },
      { new: true },
    ).select("-password");

    res.status(200).json({
      _id: user._id,
      playerName: user.playerName,
      email: user.email,
      apiKey: user.apiKey,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add API key" });
  }
};

export const handle_remove_apikey = async (req, res) => {

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user._id,
      { apiKey: null },
      { new: true },
    ).select("-password");

    res.status(200).json({
      _id: user._id,
      playerName: user.playerName,
      email: user.email,
      apiKey: user.apiKey,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove API key" });
  }
};
