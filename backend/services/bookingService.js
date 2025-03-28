import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import Trip from "../models/tripModel.js";

class BookingService {
    async createBooking(user_id, trip_id, seat_numbers) {
        try {
            const trip = await Trip.findById(trip_id);
            if (!trip) return { status: 400, success: false, message: "Trip not found", data: null };

            if (trip.isCancelled) return { status: 400, success: false, message: "Trip is cancelled", data: null };

            const unavailableSeats = seat_numbers.filter(seat => trip.booked_seats.includes(seat));
            if (unavailableSeats.length > 0) {
                return { status: 400, success: false, message: `Seats unavailable: ${unavailableSeats.join(", ")}`, data: null };
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
                status: 200,
                success: true,
                message: "Booking successful",
                data: { booking, seats: seat_numbers },
            };
        } catch (error) {
            console.error("Booking creation failed:", error);
            return { status: 500, success: false, message: "Booking failed", error: error.message };
        }
    }

    async cancelBooking(booking_id, user_id) {
        try {
            const booking = await Booking.findById(booking_id).populate("trip_id");

            if (!booking) return { status: 400, success: false, message: "Booking not found", data: null };
            if (booking.user_id.toString() !== user_id.toString()) {
                return { status: 403, success: false, message: "Unauthorized cancellation", data: null };
            }
            if (booking.booking_status === "cancelled") {
                return { status: 400, success: false, message: "Booking already cancelled", data: null };
            }

            const trip = booking.trip_id;
            const cancellationDeadline = new Date(trip.departure_time);
            cancellationDeadline.setHours(cancellationDeadline.getHours() - 24);
            if (new Date() >= cancellationDeadline) {
                return { status: 400, success: false, message: "Cancellation not allowed within 24 hours of trip", data: null };
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

            return { status: 200, success: true, message: "Booking cancelled successfully", data: { booking } };
        } catch (error) {
            console.error("Booking cancellation failed:", error);
            return { status: 500, success: false, message: "Cancellation failed", error: error.message };
        }
    }
}

export default BookingService;
