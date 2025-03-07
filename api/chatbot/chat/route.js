import express from "express";
import { runChat } from "../../../chatbot/chatbotController.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userInput = req.body.message;
    if (!userInput) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // ✅ Ensure `req.session` exists before using it
    if (!req.session) {
      return res.status(500).json({ error: "Session is not initialized" });
    }

    req.session.chatHistory = req.session.chatHistory || [];
    const aiResponse = await runChat(userInput, req.session.chatHistory);

    req.session.chatHistory.push({ role: "user", text: userInput });
    req.session.chatHistory.push({ role: "model", text: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
