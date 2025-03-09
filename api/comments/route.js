import express from "express";
import Comment from "../../models/Comment.js";
import { io } from "../../index.js"; // Import the io instance directly

const router = express.Router();

// Fetch All Comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Add a New Comment
router.post("/", async (req, res) => {
  const { text, user } = req.body;
  if (!text || !user) return res.status(400).json({ error: "Text and user are required" });

  try {
    const newComment = new Comment({ text, user });
    await newComment.save();

    // Emit new comment to all connected WebSocket clients
    io.emit("newComment", newComment); // Emit the event to all clients
    console.log("📡 Emitted 'newComment' event:", newComment);

    res.status(201).json(newComment); // Send the new comment in the response
  } catch (error) {
    res.status(500).json({ error: "Failed to save comment" });
  }
});

export default router;
