import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { generateText } from "ai";

async function generateAiResponse(apikey, prompt) {
  const google = createGoogleGenerativeAI({
    apiKey: apikey,
  });

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: prompt,
  });

  return text;
}

export default generateAiResponse;
