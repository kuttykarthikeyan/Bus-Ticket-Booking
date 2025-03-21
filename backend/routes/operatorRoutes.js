import express from 'express';
import { registerOperator } from '../controllers/operatorController.js';
import { loginOperator } from '../controllers/operatorController.js';
import {operatorAuthMiddleware} from '../middlewares/operatorAuthMiddleware.js';
const router = express.Router();
router.post('/register', registerOperator);
router.post('/login', loginOperator);
router.get('/profile',operatorAuthMiddleware, (req, res) => {
    res.send('Operator Profile');
});
export default router;


