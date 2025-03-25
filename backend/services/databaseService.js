import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../services/loggingService.js";

dotenv.config();

class DatabaseService {
  constructor(model) {
    this.model = model;
  }

  static async connect() {
    try {
      logger.info("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/bus-booking", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info("MongoDB Connected");
    } catch (error) {
      logger.error(`MongoDB Connection Failed: ${error.message}`);
      process.exit(1);
    }

    mongoose.connection.on("error", (err) => logger.error(`MongoDB Error: ${err.message}`));
    mongoose.connection.on("disconnected", () => logger.warn("MongoDB Disconnected"));

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB Connection Closed due to App Termination");
      process.exit(0);
    });
  }

  
}

export default DatabaseService;
