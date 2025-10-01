import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("customer", "agent", "admin").default("customer"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const existing = await User.findOne({ email: value.email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const user = new User(value);
    await user.save();

    return res.status(201).json({ message: "registered", user });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed: " + err.message });
  }
};

export const login = async (req, res) => {
  console.log("[AUTH] JWT_SECRET in login:", process.env.JWT_SECRET);
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: value.email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.comparePassword(value.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });

    return res.json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: "Login failed: " + err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user: " + err.message });
  }
};
