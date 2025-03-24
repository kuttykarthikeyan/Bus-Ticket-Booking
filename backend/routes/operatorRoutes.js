import express from "express";
import OperatorController from "../controllers/operatorController.js";
import { operatorAuthMiddleware } from "../middlewares/operatorAuthMiddleware.js";

const router = express.Router();

router.post("/register", OperatorController.register);
router.post("/login", OperatorController.login);
router.get("/profile", operatorAuthMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Operator Profile", operator: req.operator });
});

export default router;
