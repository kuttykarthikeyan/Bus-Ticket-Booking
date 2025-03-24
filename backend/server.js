import express from 'express';
import cors from 'cors';
import databaseService from './services/databaseService.js';
import { logger, requestLogger, errorHandler } from './services/loggingService.js';
import userRoutes from './routes/userRoutes.js';
import operatorRoutes from './routes/operatorRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger); 

app.use('/user', userRoutes);
app.use('/operator', operatorRoutes);

app.get('/', (req, res) => {
    logger.info('✅ Root endpoint accessed');
    res.send('Bus Booking API is running!');
});

app.use(errorHandler);

databaseService.connect().then(() => {
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});
