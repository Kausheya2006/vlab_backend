import express from "express";
import usersRoutes from "./users/route.js"; // Users API
import coordinatesRoutes from "./coordinates/route.js"; // Coordinates API
import chatbotRoutes from "./chatbot/chat/route.js"; // Chatbot API

const router = express.Router();

// Register all API routes under `/api/*`
router.use("/users", usersRoutes);
router.use("/coordinates", coordinatesRoutes);
router.use("/chatbot/chat", chatbotRoutes);

export default router;
