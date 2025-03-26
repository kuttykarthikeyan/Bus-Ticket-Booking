import express from "express";
import { operatorAuthMiddleware } from "../middlewares/operatorAuthMiddleware.js";
import authController from "../controllers/authController.js";
import BusController from "../controllers/busController.js";
import TripController from "../controllers/tripController.js";

// Create Router
const router = express.Router();

//  Operator Authentication Routes
router.post("/register", authController.operatorRegister);
router.post("/login", authController.operatorLogin);
router.get("/profile", operatorAuthMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Operator Profile", operator: req.operator });
});

//  Bus Management Routes
router.post("/bus", operatorAuthMiddleware, BusController.createBus);
router.put("/bus/:busId", operatorAuthMiddleware, BusController.updateBus);
router.delete("/bus/:busId", operatorAuthMiddleware, BusController.deleteBus);

// ✅ Trip Management Routes
router.post("/trip", operatorAuthMiddleware, TripController.createTrip);
router.put("/trip/:tripId", operatorAuthMiddleware, TripController.updateTrip);
router.delete("/trip/:tripId", operatorAuthMiddleware, TripController.deleteTrip);
router.get("/trip", operatorAuthMiddleware, TripController.getTrips);

// Export Router
export default router;
