import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import Trip from "../models/tripModel.js";

class BookingService {
    async createBooking(user_id, trip_id, seat_numbers) {
        try {
            const trip = await Trip.findById(trip_id);
            if (!trip) throw new Error("Trip not found");
            if (trip.isCancelled) throw new Error("Trip is cancelled");

            const unavailableSeats = seat_numbers.filter(seat => trip.booked_seats.includes(seat));
            if (unavailableSeats.length > 0) {
                throw new Error(`Seats unavailable: ${unavailableSeats.join(", ")}`);
            }

            const booking = await Booking.create({
                user_id,
                trip_id,
                seat_numbers,
                booking_status: "confirmed",
                booking_date: new Date(),
            });

            await Trip.updateOne(
                { _id: trip_id },
                {
                    $push: { booked_seats: { $each: seat_numbers } },
                    $pullAll: { available_seats: seat_numbers },
                }
            );

            await User.findByIdAndUpdate(user_id, { $push: { booked_Trips: trip_id } });

            return {
                success: true,
                message: "Booking successful",
                booking,
                seats: seat_numbers,
            };
        } catch (error) {
            console.error("Booking creation failed:", error);
            return { success: false, message: error.message || "Booking failed" };
        }
    }

    async cancelBooking(booking_id, user_id) {
        try {
            const booking = await Booking.findById(booking_id).populate("trip_id");

            if (!booking) throw new Error("Booking not found");
            if (booking.user_id.toString() !== user_id.toString()) throw new Error("Unauthorized cancellation");
            if (booking.booking_status === "cancelled") throw new Error("Booking already cancelled");

            const trip = booking.trip_id;
            const cancellationDeadline = new Date(trip.departure_time);
            cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);
            if (new Date() >= cancellationDeadline) {
                throw new Error("Cancellation not allowed within 24 hours of trip");
            }

            await Trip.updateOne(
                { _id: trip._id },
                {
                    $pull: { booked_seats: { $in: booking.seat_numbers } },
                    $push: { available_seats: { $each: booking.seat_numbers } },
                }
            );

            booking.booking_status = "cancelled";
            booking.cancellation_date = new Date();
            await booking.save();

            await User.findByIdAndUpdate(user_id, { $pull: { booked_Trips: trip._id } });

            console.log("Booking cancelled:", { bookingId: booking_id, userId: user_id });

            return { success: true, message: "Booking cancelled successfully", booking };
        } catch (error) {
            console.error("Booking cancellation failed:", error);
            return { success: false, message: error.message || "Cancellation failed" };
        }
    }
}

export default BookingService;
