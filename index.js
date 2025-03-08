import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // ✅ Import session
import connectDb from "./config/connectDb.js";
import apiRoutes from "./api/routes.js"; // Centralized API route handler

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
// Middleware
app.use(cors({
  origin: "*", // ✅ Allows all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));

app.use(express.json()); // ✅ Fix: Enables JSON parsing
app.use(express.urlencoded({ extended: true })); // ✅ Parses form data

// ✅ Add session middleware before routes
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


// ✅ Add session middleware before routes
app.use(session({
  secret: "your-secret-key",  // Change this to a strong secret in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   // ⚠️ `true` in production if using HTTPS
}));

// Connect to MongoDB
connectDb();
console.log("MongoDB URI:", process.env.MONGO_URI);

// Use all API routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("VLab Backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
