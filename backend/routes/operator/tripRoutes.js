import express from "express";
import OperatorTripController from "../../controllers/operator/operatorTripController.js";
import { operatorAuthMiddleware } from "../../middlewares/operatorAuthMiddleware.js";

const router = express.Router();

router.post("/",operatorAuthMiddleware, OperatorTripController.createTrip);
router.put("/:tripId",operatorAuthMiddleware, OperatorTripController.updateTrip);
router.delete("/:tripId",operatorAuthMiddleware, OperatorTripController.deleteTrip);
router.get("/",operatorAuthMiddleware, OperatorTripController.getTrips);

export default router;
