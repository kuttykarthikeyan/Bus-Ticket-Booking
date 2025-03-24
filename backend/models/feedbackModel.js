import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  trip_id: { type: mongoose.Schema.Types.ObjectId, ref: "Trip" },
  rating: { type: Number, min: 1, max: 5 },
  comments: String,
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;