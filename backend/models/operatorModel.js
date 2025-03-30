import mongoose from "mongoose";

const OperatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    company_name: { type: String, required: true, trim: true },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trip" }], 
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Operator = mongoose.model("Operator", OperatorSchema);
export default Operator;
