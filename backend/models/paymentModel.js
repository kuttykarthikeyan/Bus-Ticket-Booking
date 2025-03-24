import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  payment_method: {
    type: String,
    enum: ["credit_card", "debit_card", "upi", "net_banking", "cash"],
  },
  payment_status: {
    type: String,
    enum: ["pending", "successful", "failed"],
    default: "pending",
  },
}, { timestamps: true });

const Payment = mongoose.model("Payment", PaymentSchema);
export  default Payment;