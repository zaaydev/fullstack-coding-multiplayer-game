import express from "express";
import generateAiResponse from "../lib/ai.js";

const ai_router = express.Router();

ai_router.get("/test/:prompt", async (req, res) => {
  const { prompt } = req.params;
  const aiResponse = await generateAiResponse(prompt);

  res.status(200).json({ message: aiResponse });
});

export default ai_router;
