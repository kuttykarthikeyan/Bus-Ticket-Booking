import express from "express";
import { operatorAuthMiddleware } from "../middlewares/operatorAuthMiddleware.js";
import authController from "../controllers/authController.js";
import BusController from "../controllers/busController.js";
import ProfileController from "../controllers/profileController.js";

const operatorRouter = express.Router();  

operatorRouter.post("/register", authController.operatorRegister);
operatorRouter.post("/login", authController.operatorLogin);

operatorRouter.use(operatorAuthMiddleware);



operatorRouter.post("/bus", BusController.createBus);

operatorRouter.put("/bus/:bus_id", BusController.updateBus);

operatorRouter.delete("/bus/:bus_id", BusController.deleteBus);

operatorRouter.get("/bus",BusController.get)