import Payment from "../models/Payment.js";
import UserPolicy from "../models/UserPolicy.js";
import Joi from "joi";
import AuditLog from "../models/AuditLog.js";

const paymentSchema = Joi.object({
  policyId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid("CARD", "NETBANKING", "OFFLINE", "SIMULATED").required(),
  reference: Joi.string().required(),
});

export const recordPayment = async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userPolicy = await UserPolicy.findById(value.policyId);
    if (!userPolicy) return res.status(404).json({ error: "UserPolicy not found" });

    if (userPolicy.userId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    
    const payment = new Payment({
      userId: userPolicy.userId,
      userPolicyId: userPolicy._id,
      amount: value.amount,
      method: value.method,
      reference: value.reference,
      status: "SUCCESS",
    });

    await payment.save();

    await AuditLog.create({
      action: "PAYMENT_RECORD",
      actorId: req.user.userId,
      details: { paymentId: payment._id.toString(), userPolicyId: userPolicy._id.toString() },
      ip: req.ip,
    });

    return res.status(201).json(payment);
  } catch (err) {
    return res.status(500).json({ error: "Failed to record payment: " + err.message });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.userId })
    .populate({
        path: "userPolicyId",
        populate: { path: "policyProductId", select: "title code" } // 👈 get title+code
      })
    .sort({ createdAt: -1 });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch payments: " + err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    if (!(req.user.role === "admin" || req.user.role === "agent"))
      return res.status(403).json({ error: "Forbidden" });

    const payments = await Payment.find()
    .populate({
    path: "userPolicyId",
    populate: { path: "policyProductId", select: "title code" }
     })
    .sort({ createdAt: -1 });
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch payments: " + err.message });
  }
};
