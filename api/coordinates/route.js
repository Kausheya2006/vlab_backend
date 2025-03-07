import express from "express";
import Users from "../../models/users.js";

const router = express.Router();

// GET Coordinates
router.get("/", async (req, res) => {
  try {
    const users = await Users.find({}, { latitude: 1, longitude: 1, _id: 0 });

    if (users.length === 0) {
      console.warn("No users found with coordinates.");
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    res.status(500).json({ error: "Failed to fetch coordinates" });
  }
});

export default router;
