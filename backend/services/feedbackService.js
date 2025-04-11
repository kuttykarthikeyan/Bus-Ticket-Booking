import Feedback from "../models/feedbackModel.js";
import Booking from "../models/bookingModel.js";


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
    async getFeedback(trip_id)
    {
      try{
         const feedbacks= Feedback.find(trip_id);
         if(!feedbacks){
          return {
            status: 200,
            success: false,
            message: "None feedback",
          };
         }
         return { status: 200, success: true, data: feedbacks };

      }
      catch(error)
      {return {
        status: 500,
        success: false,
        message: "Error in getting  feedback",
        error: error.message,
      };

      }
    }
  
}

export default FeedbackService;
