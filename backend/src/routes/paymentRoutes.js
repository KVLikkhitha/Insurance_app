import express from "express";
import { recordPayment, getUserPayments, getAllPayments } from "../controllers/paymentController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", requireAuth, recordPayment);     // POST /api/payments
router.get("/user/me", requireAuth, getUserPayments); // GET /api/payments/user/me
router.get("/", requireAuth, getAllPayments);     // GET /api/payments (admin/agent only)

export default router;
