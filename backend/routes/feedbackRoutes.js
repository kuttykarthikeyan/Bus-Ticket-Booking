import express from 'express';
import FeedbackController  from '../controllers/feedbackController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const feedbackRouter=express.Router()

feedbackRouter.use(authMiddleware)
feedbackRouter.post("",FeedbackController.createFeedback)



export default feedbackRouter