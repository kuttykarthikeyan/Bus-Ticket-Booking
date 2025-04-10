import express from "express";
import { operatorAuthMiddleware } from "../middlewares/operatorAuthMiddleware.js";
import authController from "../controllers/authController.js";
import BusController from "../controllers/busController.js";
import TripController from "../controllers/tripController.js";
import ProfileController from "../controllers/profileController.js";

const operatorRouter = express.Router();  

operatorRouter.post("/register", authController.operatorRegister);
operatorRouter.post("/login", authController.operatorLogin);

operatorRouter.use(operatorAuthMiddleware);

operatorRouter.get("/profile", ProfileController.getOperatorProfile);
operatorRouter.put("/profile", ProfileController.updateOperatorProfile);

operatorRouter.post("/bus", BusController.createBus);
operatorRouter.put("/bus/:bus_id", BusController.updateBus);
operatorRouter.delete("/bus/:bus_id", BusController.deleteBus);

operatorRouter.post("/trip", TripController.createTrip);
operatorRouter.put("/trip/:trip_id", TripController.updateTrip);
operatorRouter.delete("/trip/:trip_id", TripController.deleteTrip);
operatorRouter.put("/trip/cancel/:trip_id", TripController.cancelTrip);
operatorRouter.get("/trip", TripController.getAllTrips);
operatorRouter.get("/trip/:trip_id", TripController.getTripById);

export default operatorRouter;  
