import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;
const MODEL_NAME = "gemini-2.0-flash";

if (!API_KEY) {
  console.error("❌ API_KEY is missing. Check your .env file.");
  process.exit(1);
}

const VLABS_KNOWLEDGE = `
  You are the Virtual Labs AI chatbot, designed to assist users with information related to Virtual Labs (vlab.co.in).
  You should strictly provide details about Virtual Labs, its courses, functionalities, and official content.
`;

export const runChat = async (userInput, chatHistory) => {
    try {
      console.log("🔹 Received chatHistory:", chatHistory); // ✅ Debugging log
  
      if (!Array.isArray(chatHistory)) {
        console.error("❌ chatHistory is not an array!", chatHistory);
        return "Internal error: chatHistory is not formatted correctly.";
      }
  
      const genAI = new GoogleGenerativeAI(process.env.API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
      const formattedHistory = chatHistory.map((entry) => ({
        role: entry.role,
        parts: [{ text: entry.text }],
      }));
  
      console.log("🔹 Formatted chat history:", formattedHistory); // ✅ Debugging log
  
      const chat = model.startChat({ history: formattedHistory });
      const result = await chat.sendMessage(userInput);
  
      return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't understand that.";
    } catch (error) {
      console.error("❌ Error in runChat:", error);
      return "Sorry, I am experiencing technical issues. Please try again later.";
    }
  };
  