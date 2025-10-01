import express from "express";
import {
  addPolicy,
  getPolicies,
  getPolicyById,
  purchasePolicy,
  getUserPolicies,
  cancelPolicy,
  submitClaim,
  listClaims,
  getClaimById,
  updateClaimStatus,
  listAgents,
  createAgent,
  assignAgent,
  getAuditLogs,
  getSummary,
} from "../controllers/PolicyController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

// --- Agents (admin only)
router.post("/agents", requireAuth, createAgent);           // POST /api/policies/agents
router.get("/agents", requireAuth, listAgents);             // GET /api/policies/agents
router.put("/agents/:id/assign", requireAuth, assignAgent); // PUT /api/policies/agents/:id/assign

// --- Policy Products (admin + public)
router.post("/", requireAuth, addPolicy);                   // POST /api/policies (admin only)
router.get("/", getPolicies);                               // GET /api/policies

// --- User Policies (customer)
router.post("/:id/purchase", requireAuth, purchasePolicy);  // POST /api/policies/:id/purchase
router.get("/user/me", requireAuth, getUserPolicies);       // GET /api/policies/user/me
router.put("/user/:id/cancel", requireAuth, cancelPolicy);  // PUT /api/policies/user/:id/cancel

// --- Claims (must come before :id route!)
router.post("/claims", requireAuth, submitClaim);           
router.get("/claims", requireAuth, listClaims);             
router.get("/claims/:id", requireAuth, getClaimById);       
router.put("/claims/:id/status", requireAuth, updateClaimStatus); 

// --- Audit & Summary (admin only)
router.get("/admin/audit", requireAuth, getAuditLogs);      // GET /api/policies/admin/audit
router.get("/admin/summary", requireAuth, getSummary);      // GET /api/policies/admin/summary

// --- Policy by ID (keep LAST to avoid conflicts)
router.get("/:id", getPolicyById);                          // GET /api/policies/:id

export default router;



// import express from "express";
// import {
//   addPolicy,
//   getPolicies,
//   getPolicyById,
//   purchasePolicy,
//   getUserPolicies,
//   cancelPolicy,
//   submitClaim,
//   listClaims,
//   getClaimById,
//   updateClaimStatus,
//   listAgents,
//   createAgent,
//   assignAgent,
//   getAuditLogs,
//   getSummary,
// } from "../controllers/PolicyController.js";
// import { requireAuth } from "../middlewares/auth.js";

// const router = express.Router();

// // --- Agents (admin only) -- Place before /:id route
// router.post("/agents", requireAuth, createAgent);           // POST /api/policies/agents
// router.get("/agents", requireAuth, listAgents);             // GET /api/policies/agents
// router.put("/agents/:id/assign", requireAuth, assignAgent); // PUT /api/policies/agents/:id/assign

// // --- Policy Products (admin + public)
// router.post("/", requireAuth, addPolicy);         // POST /api/policies (admin only)
// router.get("/", getPolicies);                     // GET /api/policies
// router.get("/:id", getPolicyById);                // GET /api/policies/:id

// // --- User Policies (customer)
// router.post("/:id/purchase", requireAuth, purchasePolicy);  // POST /api/policies/:id/purchase
// router.get("/user/me", requireAuth, getUserPolicies);       // GET /api/policies/user/me
// router.put("/user/:id/cancel", requireAuth, cancelPolicy);  // PUT /api/policies/user/:id/cancel

// // --- Claims
// router.post("/claims", requireAuth, submitClaim);           // POST /api/policies/claims
// router.get("/claims", requireAuth, listClaims);             // GET /api/policies/claims
// router.get("/claims/:id", requireAuth, getClaimById);       // GET /api/policies/claims/:id
// router.put("/claims/:id/status", requireAuth, updateClaimStatus); // PUT /api/policies/claims/:id/status

// // --- Audit & Summary (admin only)
// router.get("/admin/audit", requireAuth, getAuditLogs);      // GET /api/policies/admin/audit
// router.get("/admin/summary", requireAuth, getSummary);      // GET /api/policies/admin/summary

// export default router;