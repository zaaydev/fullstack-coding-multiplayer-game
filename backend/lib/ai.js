import { google } from "@ai-sdk/google";
import { generateText } from "ai";

async function generateAiResponse(prompt) {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
  });

  return text;
}

export default generateAiResponse;
