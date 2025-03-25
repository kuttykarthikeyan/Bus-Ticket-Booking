import express from "express";
import OperatorTripService from "../../services/tripServices/operatorTripService.js";
import { operatorAuthMiddleware } from "../../middlewares/operatorAuthMiddleware.js";
import authRoutes from "./authRoutes.js"
import busRoutes from "./busRoutes.js"
import tripRoutes from "./tripRoutes.js"
const router = express.Router();
const operatorTripService = new OperatorTripService();

router.use("/bus", operatorAuthMiddleware,busRoutes);

router.use("/trip", operatorAuthMiddleware, tripRoutes);
router.use("/",authRoutes);

export default router;
