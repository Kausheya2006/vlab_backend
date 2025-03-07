import express from "express";
import Users from "../../models/users.js";

const router = express.Router();

// POST: Create new user(s)
router.post("/", async (req, res) => {
    try {
        const body = req.body;

        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ message: "Request body cannot be empty." });
        }

        if (Array.isArray(body)) {
            if (body.length === 0) {
                return res.status(400).json({ message: "User list cannot be empty." });
            }
            const newUsers = await Users.insertMany(body);
            return res.status(201).json({ message: "Users created", users: newUsers });
        } else {
            const newUser = new Users(body);
            await newUser.save();
            return res.status(201).json({ message: "User created", user: newUser });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// GET: Fetch all users
router.get("/", async (req, res) => {
    try {
        const users = await Users.find().lean();
        res.json({ users, totalUsers: users.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
