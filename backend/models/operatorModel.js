import mongoose from "mongoose";

const OperatorSchema = new mongoose.Schema({
  company_name: String,
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  verification_status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
}, { timestamps: true });


const Operator = mongoose.model("Operator", OperatorSchema);
export default Operator;