import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, enum: ["user", "admin"] },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

const  User = mongoose.model("User", UserSchema);
export default User;
