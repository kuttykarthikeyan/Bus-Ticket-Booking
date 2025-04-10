import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import TripController from "../controllers/tripController.js";
import authController from "../controllers/authController.js";
import AdminController from "../controllers/adminController.js";
import BookingController from "../controllers/bookingController.js";
import ProfileController from "../controllers/profileController.js";

const userRouter = express.Router();

userRouter.post("/register", authController.userRegister);
userRouter.post("/login", authController.userLogin);

userRouter.use(authMiddleware); 

userRouter.post("/book", BookingController.bookTrip);
userRouter.post("/cancelBook", BookingController.cancelBooking);
userRouter.get("/profile", ProfileController.getUserProfile);
userRouter.put("/profile", ProfileController.updateUserProfile);
userRouter.post("/trips", TripController.getTripByFilter);
userRouter.get("/trips", TripController.getAllTrips);



export default userRouter;
