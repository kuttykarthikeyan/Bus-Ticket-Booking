
import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    operatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Operator' },
    busNumber: String,
    busType: String,
    totalSeats: Number,
    amenities: [String],
  },
  {
    timestamps: true, 
  }
);

const Bus = mongoose.model('Bus', busSchema);
export default Bus;