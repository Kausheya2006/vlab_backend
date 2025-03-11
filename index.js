import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import connectDb from "./config/connectDb.js";
import apiRoutes from "./api/routes.js"; // Centralized API route handler
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const server = createServer(app); // Create an HTTP server for WebSockets
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  },
});

// Middleware setup
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (optional, for session management)
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // For non-https environment
}));

// Connect to MongoDB
connectDb();
console.log("MongoDB URI:", process.env.MONGO_URI);

// 🔥 WebSocket connection handling
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  // Handle comment events
  socket.on("sendComment", (data) => {
    console.log("💬 New Comment Received:", data);
    io.emit("newComment", data);
  });

  // 🟢 Interactive Box Feature (Real-Time Box Movement)
  let boxPosition = { x: 100, y: 100 }; // Store the last known box position

  // Send current position to newly connected users
  socket.emit("boxPosition", boxPosition);

  // Listen for box movement events
  socket.on("moveBox", (newPosition) => {
    boxPosition = newPosition;
    io.emit("boxPosition", newPosition); // Broadcast to all active users
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Attach WebSocket instance to Express app
app.set("io", io);

// Use all API routes under /api
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("VLab Backend is running!");
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Export io for use in routes
export { io };
