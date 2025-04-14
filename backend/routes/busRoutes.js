import express from "express";
import { operatorAuthMiddleware } from "../middlewares/operatorAuthMiddleware.js";
import authController from "../controllers/authController.js";
import BusController from "../controllers/busController.js";
import ProfileController from "../controllers/profileController.js";

const busRouter = express.Router();  

busRouter.use(operatorAuthMiddleware);

busRouter.post("", BusController.createBus);

busRouter.put("/:bus_id", BusController.updateBus);

busRouter.delete("/:bus_id", BusController.deleteBus);

busRouter.get("",BusController.getBus)

export default busRouter;