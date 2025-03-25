import express from "express";
import OperatorBusController from "../../controllers/operator/operatorBusController.js";
import { operatorAuthMiddleware } from "../../middlewares/operatorAuthMiddleware.js";

const router = express.Router();

router.post("/", operatorAuthMiddleware, OperatorBusController.createBus);
router.put("/:busId",operatorAuthMiddleware, OperatorBusController.updateBus);
router.delete("/:busId",operatorAuthMiddleware, OperatorBusController.deleteBus);

export default router;
