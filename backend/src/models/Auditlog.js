import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    details: { type: Object },
    ip: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

export default mongoose.model("AuditLog", auditLogSchema);
