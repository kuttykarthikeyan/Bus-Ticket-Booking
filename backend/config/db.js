import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const conn = mongoose.connect("mongodb://localhost:27017/bus-booking");
        console.log("MongoDB Connected");
    }
    catch(err){
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}
export default connectDB;