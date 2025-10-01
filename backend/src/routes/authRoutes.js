// src/routes/authRoutes.js
import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";
const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", register);

// POST /api/v1/auth/login
router.post("/login", login);

// GET /api/v1/auth/me
router.get("/me", requireAuth, getMe);
export default router;