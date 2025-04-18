import express from 'express';
import cors from 'cors';
import databaseService from './services/databaseService.js';
import { logger, requestLogger, errorHandler } from './services/loggingService.js';
import userRoutes from './routes/userRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import busRoutes from './routes/busRoutes.js';
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(requestLogger); 

app.use('/api/user', userRoutes);
app.use('/api/operator', operatorRoutes);
app.use('/api/admin',adminRoutes)
app.use('/api/operator/bus', busRoutes);
app.use('/api/user/feedback',feedbackRoutes)
app.get('/',(req,res)=>{
    res.send("Bus Booking App Server")
})

app.get('/', (req, res) => {
    logger.info('Root endpoint accessed');
    res.send('Bus Booking API is running!');
});

app.use(errorHandler);

databaseService.connect().then(() => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});
export default app;