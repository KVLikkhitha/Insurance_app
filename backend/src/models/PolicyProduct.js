import mongoose from "mongoose";

const policyProductSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    premium: {
      type: Number,
      required: true,
    },
    termMonths: {
      type: Number,
      required: true,
    },
    minSumInsured: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export default mongoose.model("PolicyProduct", policyProductSchema);
