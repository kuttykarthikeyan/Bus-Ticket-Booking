
class FeedbackController {
  constructor() {
    this.feedbackService = new FeedbackService();
  }


  async createFeedback(req, res) {
    try {
      const user_id = req.user._id; 
      const feedbackData = req.body;

      const result = await this.feedbackService.createFeedback(feedbackData, user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Unexpected error in creating feedback",
        error: error.message,
      });
    }
  }


  async editFeedback(req, res) {
    try {
      const feedback_id = req.params.id;
      const feedbackData = req.body;

      const result = await this.feedbackService.editFeedback(feedback_id, feedbackData);
      return res.status(result.status).json(result);
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Unexpected error in editing feedback",
        error: error.message,
      });
    }
  }
}

export default FeedbackController;
