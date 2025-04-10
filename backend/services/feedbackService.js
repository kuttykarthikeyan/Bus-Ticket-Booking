import Feedback from "../models/feedbackModel";
import Booking from "../models/bookingModel";


class FeedbackService {
  async createFeedback(feedBackData, user_id) {
    try {
      const trip_id = feedBackData.trip_id;

      const booking = await Booking.findOne({ user_id, trip_id });

      if (booking) {
        const newFeedback = new Feedback({
          ...feedBackData,
          user_id,
        });

        const result = await newFeedback.save();

        return { status: 200, success: true, data: result };
      } else {
        return {
          status: 400,
          success: false,
          message: "User must have booked the trip to provide feedback",
        };
      }
    } catch (error) {
      return {
        status: 500,
        success: false,
        message: "Error in creating feedback",
        error: error.message,
      };
    }
  }
  async editFeedback(feedback_id, feedbackData) {
    try {
      const { rating, comment } = feedbackData;
  
      const updatedFields = {};
      if (rating !== undefined) updatedFields.rating = rating;
      if (comment !== undefined) updatedFields.comment = comment;
  
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        feedback_id,
        { $set: updatedFields },
        { new: true, runValidators: true }
      );
  
      if (!updatedFeedback) {
        return {
          status: 404,
          success: false,
          message: "Feedback not found",
        };
      }
  
      return {
        status: 200,
        success: true,
        message: "Feedback updated successfully",
        data: updatedFeedback,
      };
    } catch (error) {
      console.error("Edit Feedback Error:", error);
      return {
        status: 500,
        success: false,
        message: "Failed to update feedback",
        error: error.message,
      };
    }
  }
  
}

export default FeedbackService;
