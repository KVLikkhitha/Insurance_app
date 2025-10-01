import PolicyProduct from "../models/PolicyProduct.js";
import UserPolicy from "../models/UserPolicy.js";
import Claim from "../models/Claim.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import Joi from "joi";
import mongoose from "mongoose";


/* -----------------  Add a new Policy ----------------- */
export const addPolicy = async (req, res) => {
  const { code, title, description, premium, minSumInsured, termMonths } = req.body;
  try {
    //Check if a policy with the same code already exists
    const existingPolicy = await PolicyProduct.findOne({ code });
    if (existingPolicy) {
      return res.status(400).json({ error: "Policy with this code already exists" });
    }
    const newPolicy = new PolicyProduct({
      code,
      title,
      description,
      premium,
      minSumInsured,
      termMonths
    });
    await newPolicy.save();
    res.status(201).json({
      message: 'Policy added successfully',
      policy: newPolicy
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

/* ----------------- Policies (products) ----------------- */
export const getPolicies = async (req, res) => {
  try {
    const products = await PolicyProduct.find();
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch policies: " + err.message });
  }
};

export const getPolicyById = async (req, res) => {
  try {
    const product = await PolicyProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Policy product not found" });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch policy: " + err.message });
  }
};

/* ----------------- Purchase & UserPolicies ----------------- */
const purchaseSchema = Joi.object({
  startDate: Joi.date().required(),
  termMonths: Joi.number().integer().positive().required(),
  nominee: Joi.object({
    name: Joi.string().required(),
    relation: Joi.string().required(),
  }).required(),
});

export const purchasePolicy = async (req, res) => {
  try {
    // only customers allowed by route-level middleware
    if (req.user.role !== "customer") return res.status(403).json({ error: "Forbidden" });

    const { error, value } = purchaseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const product = await PolicyProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Policy product not found" });

    const start = new Date(value.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + value.termMonths);

    const userPolicy = new UserPolicy({
      userId: req.user.userId,
      policyProductId: product._id,
      startDate: start,
      endDate: end,
      premiumPaid: product.premium,
      nominee: value.nominee,
    });

    await userPolicy.save();
    await AuditLog.create({
      action: "POLICY_PURCHASE",
      actorId: req.user.userId,
      details: { userPolicyId: userPolicy._id.toString(), productId: product._id.toString() },
      ip: req.ip,
    });
    return res.status(201).json(userPolicy);
  } catch (err) {
    return res.status(500).json({ error: "Failed to purchase policy: " + err.message });
  }
};

export const getUserPolicies = async (req, res) => {
  try {
    const policies = await UserPolicy.find({ userId: req.user.userId })
    .populate("policyProductId", "title code premium termMonths minSumInsured description");
    return res.json(policies);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user policies: " + err.message });
  }
};

export const cancelPolicy = async (req, res) => {
  try {
    const policy = await UserPolicy.findById(req.params.id);
    if (!policy) return res.status(404).json({ error: "UserPolicy not found" });

    if (policy.userId.toString() !== req.user.userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    if (policy.status === "EXPIRED") return res.status(400).json({ error: "Cannot cancel expired policy" });

    policy.status = "CANCELLED";
    await policy.save();

    await AuditLog.create({
      action: "POLICY_CANCEL",
      actorId: req.user.userId,
      details: { userPolicyId: policy._id.toString() },
      ip: req.ip,
    });

    return res.json({ message: "Policy cancelled", policy });
  } catch (err) {
    return res.status(500).json({ error: "Failed to cancel policy: " + err.message });
  }
};

/* ----------------- Claims ----------------- */
const claimSchema = Joi.object({
  userPolicyId: Joi.string().required(),
  incidentDate: Joi.date().required(),
  description: Joi.string().required(),
  amountClaimed: Joi.number().positive().required(),
});


export const submitClaim = async (req, res) => {
  try {
    if (req.user.role !== "customer") return res.status(403).json({ error: "Forbidden" });

    const { error, value } = claimSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const userPolicy = await UserPolicy.findById(value.userPolicyId);
    if (!userPolicy) return res.status(404).json({ error: "UserPolicy not found" });

    if (userPolicy.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden: not your policy" });
    }

    const claim = new Claim({
      userId: req.user.userId,
      userPolicyId: userPolicy._id,
      incidentDate: value.incidentDate,
      description: value.description,
      amountClaimed: value.amountClaimed,
    });

    await claim.save();

    await AuditLog.create({
      action: "CLAIM_SUBMIT",
      actorId: req.user.userId,
      details: { claimId: claim._id.toString(), userPolicyId: userPolicy._id.toString() },
      ip: req.ip,
    });

    return res.status(201).json(claim);
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit claim: " + err.message });
  }
};

export const listClaims = async (req, res) => {
  try {
    let claimsQuery;

    if (req.user.role === "admin" || req.user.role === "agent") {
      claimsQuery = Claim.find()
        .populate({
          path: "userPolicyId",
          populate: { path: "policyProductId", select: "title code" }
        })
        .populate("userId", "name email");
    } else {
      claimsQuery = Claim.find({ userId: req.user.userId })
        .populate({
          path: "userPolicyId",
          populate: { path: "policyProductId", select: "title code" }
        });
    }

    const claims = await claimsQuery.sort({ createdAt: -1 });
    return res.json(claims);

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch claims: " + err.message });
  }
};

export const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("userPolicyId");
    if (!claim) return res.status(404).json({ error: "Claim not found" });

    if (req.user.role === "customer" && claim.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return res.json(claim);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch claim: " + err.message });
  }
};

export const updateClaimStatus = async (req, res) => {
  try {
    if (!(req.user.role === "agent" || req.user.role === "admin"))
      return res.status(403).json({ error: "Forbidden" });

    const { status, notes } = req.body;
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: "Claim not found" });

    claim.status = status;
    claim.decisionNotes = notes || claim.decisionNotes;
    claim.decidedByAgentId = req.user.userId;
    await claim.save();

    await AuditLog.create({
      action: "CLAIM_UPDATE_STATUS",
      actorId: req.user.userId,
      details: { claimId: claim._id.toString(), status },
      ip: req.ip,
    });

    return res.json({ message: "Claim updated", claim });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update claim: " + err.message });
  }
};

/* ----------------- Agents & Admin Endpoints ----------------- */
export const listAgents = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const agents = await User.find({ role: "agent" }).select("-password");
    return res.json(agents);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch agents: " + err.message });
  }
};

export const createAgent = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const agent = new User({ ...value, role: "agent" });
    await agent.save();

    await AuditLog.create({
      action: "AGENT_CREATE",
      actorId: req.user.userId,
      details: { agentId: agent._id.toString() },
      ip: req.ip,
    });

    return res.status(201).json(agent);
  } catch (err) {
    return res.status(500).json({ error: "Failed to create agent: " + err.message });
  }
};

export const assignAgent = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { id } = req.params;
    const { targetType, targetId } = req.body;

    if (!["policy", "claim"].includes(targetType)) return res.status(400).json({ error: "Invalid targetType" });
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ error: "Invalid ids" });
    }

    const agent = await User.findById(id);
    if (!agent || agent.role !== "agent") return res.status(404).json({ error: "Agent not found" });

    if (targetType === "policy") {
      const policy = await UserPolicy.findById(targetId);
      if (!policy) return res.status(404).json({ error: "UserPolicy not found" });
      policy.assignedAgentId = agent._id;
      await policy.save();
    } else {
      const claim = await Claim.findById(targetId);
      if (!claim) return res.status(404).json({ error: "Claim not found" });
      claim.decidedByAgentId = agent._id;
      await claim.save();
    }

    await AuditLog.create({
      action: "ASSIGN_AGENT",
      actorId: req.user.userId,
      details: { agentId: agent._id.toString(), targetType, targetId },
      ip: req.ip,
    });

    return res.json({ message: "Agent assigned" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to assign agent: " + err.message });
  }
};

/* ----------------- Audit & Summary ----------------- */
export const getAuditLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch audit logs: " + err.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

    const usersCount = await User.countDocuments();
    const policiesSold = await UserPolicy.countDocuments({ status: "ACTIVE" });
    const claimsPending = await Claim.countDocuments({ status: "PENDING" });
    const totalPaymentsAgg = await (await import("../models/Payment.js")).default.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalPayments = totalPaymentsAgg[0]?.total || 0;

    return res.json({ usersCount, policiesSold, claimsPending, totalPayments });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch summary: " + err.message });
  }
};
