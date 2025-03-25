import express from "express";
import OperatorAuthController from "../../controllers/operator/operatorAuthController.js";
import { operatorAuthMiddleware } from "../../middlewares/operatorAuthMiddleware.js";

const router = express.Router();

router.post("/register", OperatorAuthController.register);
router.post("/login", OperatorAuthController.login);
router.get("/profile", operatorAuthMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: "Operator Profile", operator: req.operator });
});

export default router;
