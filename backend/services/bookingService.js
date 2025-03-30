import Booking from "../models/bookingModel.js";
import Trip from "../models/tripModel.js";

class BookingService {
    async createBooking(user_id, trip_id, seat_numbers) {
        try {
            const trip = await Trip.findById(trip_id);
            if (!trip) return { status: 404, success: false, message: "Trip not found" };
            if (trip.isCancelled) return { status: 400, success: false, message: "Trip is cancelled" };

            const invalidSeats = seat_numbers.filter(seat => 
                !trip.available_seats.includes(seat) && !trip.booked_seats.includes(seat)
            );
            if (invalidSeats.length > 0) {
                return { status: 400, success: false, message: `Invalid seat numbers: ${invalidSeats.join(", ")}` };
            }

            const unavailableSeats = seat_numbers.filter(seat => trip.booked_seats.includes(seat));
            if (unavailableSeats.length > 0) {
                return { status: 400, success: false, message: `Seats unavailable: ${unavailableSeats.join(", ")}` };
            }

            const booking = await Booking.create({
                user_id,
                trip_id,
                seat_numbers,
                booking_status: "confirmed",
                payment_status: "pending",
                booking_date: new Date(),
            });

            await Trip.updateOne(
                { _id: trip_id },
                {
                    $pullAll: { available_seats: seat_numbers },
                    $push: { booked_seats: { $each: seat_numbers } }
                }
            );

            return { status: 200, success: true, message: "Booking successful", data: { booking, seats: seat_numbers } };
        } catch (error) {
            console.error("Booking creation failed:", error);
            return { status: 500, success: false, message: "Booking failed", error: error.message };
        }
    }

    async cancelBooking(booking_id, user_id) {
        try {
            const booking = await Booking.findById(booking_id);
            if (!booking) return { status: 404, success: false, message: "Booking not found" };
            if (booking.user_id.toString() !== user_id.toString()) return { status: 403, success: false, message: "Unauthorized cancellation" };
            if (booking.booking_status === "cancelled") return { status: 400, success: false, message: "Booking already cancelled" };

            await Trip.updateOne(
                { _id: booking.trip_id },
                {
                    $pullAll: { booked_seats: booking.seat_numbers },
                    $push: { available_seats: { $each: booking.seat_numbers } },
                }
            );

            booking.booking_status = "cancelled";
            booking.cancellation_date = new Date();
            await booking.save();

            return { status: 200, success: true, message: "Booking cancelled successfully", data: { booking } };
        } catch (error) {
            console.error("Booking cancellation failed:", error);
            return { status: 500, success: false, message: "Cancellation failed", error: error.message };
        }
    }
}

export default BookingService;
