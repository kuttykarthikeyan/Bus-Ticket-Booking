import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import TripController from "../controllers/tripController.js";
import authController from "../controllers/authController.js";
import AdminController from "../controllers/adminController.js";
import BookingController from "../controllers/bookingController.js";
import ProfileController from "../controllers/profileController.js";
const router = express.Router();

router.post("/register", authController.userRegister);
router.post("/login", authController.userLogin);
router.post("/book", authMiddleware,BookingController.bookTrip);
router.post("/cancelBook",authMiddleware,BookingController.cancelBooking)
router.get("/profile", authMiddleware, ProfileController.getUserProfile);
router.put("/profile", authMiddleware, ProfileController.updateUserProfile);
router.post("/trips",authMiddleware,TripController.getTripByFilter);
router.get("/trips", authMiddleware, TripController.getAllTrips);




//admin Routes
router.put("/trip/:tripId", authMiddleware, adminMiddleware, TripController.updateTrip);
router.delete("/trip/:tripId", authMiddleware, adminMiddleware, TripController.deleteTrip);
router.get("/trips", authMiddleware, adminMiddleware, TripController.getAllTrips);
router.get("/trip/:tripId", authMiddleware, adminMiddleware, TripController.getTripById);
router.put("/canceltrip/:tripId", authMiddleware, adminMiddleware, TripController.cancelTrip);
router.post("/trips",authMiddleware,adminMiddleware,TripController.getTripByFilter);



router.get("/users", authMiddleware, adminMiddleware, AdminController.getAllUsers);
router.put("/users/block/:userId", authMiddleware, adminMiddleware, AdminController.blockUser);
router.put("/users/unblock/:userId", authMiddleware, adminMiddleware, AdminController.unblockUser);


router.get("/operators", authMiddleware, adminMiddleware, AdminController.getAllOperators);
router.get("/operators/:operatorId", authMiddleware, adminMiddleware, AdminController.getOperatorTrips);
router.put("/operators/block/:operatorId", authMiddleware, adminMiddleware, AdminController.blockOperator);
router.put("/operators/unblock/:operatorId", authMiddleware, adminMiddleware, AdminController.unblockOperator);

router.get("/analytics",authMiddleware,adminMiddleware,AdminController.getAnalytics);
export default router;
