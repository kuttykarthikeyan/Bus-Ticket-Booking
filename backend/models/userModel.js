import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isBlocked: { type: Boolean, default: false },
    booked_Trips:{type: Array, default: []},
    cancelled_trips:{type:Array, default:[]}
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
