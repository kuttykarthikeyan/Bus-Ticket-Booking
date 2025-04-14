import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import TripController from "../controllers/tripController.js";
import authController from "../controllers/authController.js";
import BookingController from "../controllers/bookingController.js";
import ProfileController from "../controllers/profileController.js";

const userRouter = express.Router();

userRouter.post("/register", authController.userRegister);
userRouter.post("/login", authController.userLogin);

userRouter.use(authMiddleware); 

userRouter.post("/book", BookingController.bookTrip);

userRouter.post("/cancelBooking", BookingController.cancelBooking);

userRouter.get("/profile", ProfileController.getUserProfile);

userRouter.put("/profile", ProfileController.updateUserProfile);

userRouter.get("/history", ProfileController.getUserHistory);


userRouter.post("/trip", TripController.getTripByFilter);

userRouter.get("/trip", TripController.getAllTrips);



export default userRouter;
