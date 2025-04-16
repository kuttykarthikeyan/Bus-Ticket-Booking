import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';
import TripController from "../controllers/tripController.js";
import authController from "../controllers/authController.js";
import AdminController from "../controllers/adminController.js";
import ProfileController from '../controllers/profileController.js';

const adminRouter = express.Router();

adminRouter.post("/register", authController.userRegister);
adminRouter.post("/login", authController.userLogin);

adminRouter.use(authMiddleware); 
adminRouter.use(adminMiddleware);

adminRouter.put("/trip/:tripId", AdminController.updateTrip);
adminRouter.delete("/trip/:tripId", AdminController.deleteTrip);
adminRouter.get("/trip", AdminController.getAllTrips);
adminRouter.get("/trip/:tripId", AdminController.getTripById);
adminRouter.put("/canceltrip/:tripId", AdminController.cancelTrip);

adminRouter.post("/trip", TripController.getTripByFilter);

adminRouter.get("/users", AdminController.getAllUsers);
adminRouter.put("/users/block/:userId", AdminController.blockUser);
adminRouter.put("/users/unblock/:userId", AdminController.unblockUser);

adminRouter.get("/operators", AdminController.getAllOperators);
adminRouter.get("/operators/:operatorId", AdminController.getOperatorTrips);
adminRouter.put("/operators/block/:operatorId", AdminController.blockOperator);
adminRouter.put("/operators/unblock/:operatorId", AdminController.unblockOperator);

adminRouter.get("/profile",ProfileController.getUserProfile)
adminRouter.put("/profile",ProfileController.updateUserProfile)


adminRouter.get("/analytics", AdminController.getAnalytics);

export default adminRouter;
