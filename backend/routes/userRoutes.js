import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import TripController from "../controllers/tripController.js";
import authController from "../controllers/authController.js";
import AdminController from "../controllers/adminController.js";
const router = express.Router();

router.post("/register", authController.userRegister);
router.post("/login", authController.userLogin);


//admin Routes
router.put("/trip/:tripId", authMiddleware, adminMiddleware, TripController.updateTrip);
router.delete("/trip/:tripId", authMiddleware, adminMiddleware, TripController.deleteTrip);
router.get("/trips", authMiddleware, adminMiddleware, TripController.getAllTrips);
router.get("/trip/:tripId", authMiddleware, adminMiddleware, TripController.getTripById);
router.put("/canceltrip/:tripId", authMiddleware, adminMiddleware, TripController.cancelTrip);


// User Management
router.get("/users", authMiddleware, adminMiddleware, AdminController.getAllUsers);
router.put("/users/block/:userId", authMiddleware, adminMiddleware, AdminController.blockUser);
router.put("/users/unblock/:userId", authMiddleware, adminMiddleware, AdminController.unblockUser);

// Operator Management
router.get("/operators", authMiddleware, adminMiddleware, AdminController.getAllOperators);
router.get("/operators/:operatorId", authMiddleware, adminMiddleware, AdminController.getOperatorTrips);
router.put("/operators/block/:operatorId", authMiddleware, adminMiddleware, AdminController.blockOperator);
router.put("/operators/unblock/:operatorId", authMiddleware, adminMiddleware, AdminController.unblockOperator);

export default router;
