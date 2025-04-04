import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trip_id: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
