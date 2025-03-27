import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import Trip from "../models/tripModel.js";

class BookingService {
     async createBooking(user_id, trip_id, seat_numbers) {
        try {
            const trip = await Trip.findById(trip_id);
            if (!trip || trip.isCancelled) {
                return { success: false, message: "Trip not found or is cancelled" };
            }

            const availableSeats = trip.available_seats.filter(seat => seat_numbers.includes(seat));
            const unavailableSeats = seat_numbers.filter(seat => !trip.available_seats.includes(seat));

            if (availableSeats.length === 0) {
                return { success: false, message: "None of the selected seats are available" };
            }

            trip.available_seats = trip.available_seats.filter(seat => !availableSeats.includes(seat));
            trip.booked_seats.push(...availableSeats);
            await trip.save();

            const booking = await Booking.create({
                user_id,
                trip_id,
                seat_numbers: availableSeats,
                payment_status: "pending",
                booking_status: "confirmed"
            });

            await User.findByIdAndUpdate(user_id, { $push: { booked_Trips: trip_id } });

            return {
                success: true,
                message: unavailableSeats.length > 0
                    ? `Booking successful, but some seats were unavailable: ${unavailableSeats.join(", ")}`
                    : "Booking successful",
                booking,
                unavailableSeats
            };
        } catch (error) {
            console.error("Error in BookingService.createBooking:", error);
            return { success: false, message: "Internal server error", error: error.message };
        }
    }

     async cancelBooking(booking_id, user_id) {
        try {
            const booking = await Booking.findById(booking_id);
            if (!booking) {
                return { success: false, message: "Booking not found" };
            }

            if (booking.user_id.toString() !== user_id) {
                return { success: false, message: "Unauthorized to cancel this booking" };
            }

            const trip = await Trip.findById(booking.trip_id);
            trip.available_seats.push(...booking.seat_numbers);
            trip.booked_seats = trip.booked_seats.filter(seat => !booking.seat_numbers.includes(seat));
            await trip.save();

            await User.findByIdAndUpdate(user_id, { $push: { cancelled_trips: booking.trip_id } });

            booking.booking_status = "cancelled";
            await booking.save();

            return { success: true, message: "Booking cancelled successfully" };
        } catch (error) {
            console.error("Error in BookingService.cancelBooking:", error);
            return { success: false, message: "Internal server error", error: error.message };
        }
    }
}

export default BookingService;
