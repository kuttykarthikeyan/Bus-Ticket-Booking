import mongoose from "mongoose";

const OperatorSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    verification_status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Operator = mongoose.model("Operator", OperatorSchema);
export default Operator;
