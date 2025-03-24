import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../services/loggingService.js';

dotenv.config();

class DatabaseService {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            logger.info('Connecting to MongoDB...');
            this.connection = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bus-booking', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            logger.info('MongoDB Connected');
        } catch (error) {
            logger.error(`MongoDB Connection Failed: ${error.message}`);
            process.exit(1);
        }

        mongoose.connection.on('error', (err) => {
            logger.error(`MongoDB Error: ${err.message}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB Disconnected');
        });

        process.on('SIGINT', async () => {
            await this.disconnect();
            logger.info('MongoDB Connection Closed due to App Termination');
            process.exit(0);
        });
    }

    async disconnect() {
        if (this.connection) {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB Disconnected Successfully');
            } catch (error) {
                logger.error(`MongoDB Disconnection Error: ${error.message}`);
            }
        }
    }
}

const databaseService = new DatabaseService();
export default databaseService;
