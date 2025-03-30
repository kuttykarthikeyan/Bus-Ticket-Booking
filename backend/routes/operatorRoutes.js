import express from "express";
import { operatorAuthMiddleware } from "../middlewares/operatorAuthMiddleware.js";
import authController from "../controllers/authController.js";
import BusController from "../controllers/busController.js";
import TripController from "../controllers/tripController.js";
import ProfileController from "../controllers/profileController.js";

const router = express.Router();

// Authentication Routes
router.post("/register", authController.operatorRegister);
router.post("/login", authController.operatorLogin);

// Operator Profile Route
router.get("/profile", operatorAuthMiddleware, ProfileController.getOperatorProfile);

// Bus Routes
router.post("/bus", operatorAuthMiddleware, BusController.createBus);
router.put("/bus/:bus_id", operatorAuthMiddleware, BusController.updateBus);
router.delete("/bus/:bus_id", operatorAuthMiddleware, BusController.deleteBus);

// Trip Routes
router.post("/trip", operatorAuthMiddleware, TripController.createTrip);
router.put("/trip/:trip_id", operatorAuthMiddleware, TripController.updateTrip);
router.delete("/trip/:trip_id", operatorAuthMiddleware, TripController.deleteTrip);
router.put("/trip/cancel/:trip_id", operatorAuthMiddleware, TripController.cancelTrip);
router.get("/trip", operatorAuthMiddleware, TripController.getAllTrips);
router.get("/trip/:trip_id", operatorAuthMiddleware, TripController.getTripById);

export default router;