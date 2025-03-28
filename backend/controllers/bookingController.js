import BookingService from "../services/bookingService.js";

const bookingService = new BookingService();

const BookingController = {
    async bookTrip(req, res) {
        try {
            const user_id = req.user._id; 
            const { trip_id, seat_numbers } = req.body;

            const response = await bookingService.createBooking(user_id, trip_id, seat_numbers);

            return res.status(response.success ? 201 : 400).json(response);
        } catch (error) {
            console.error("Error booking trip:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    },

    async cancelBooking(req, res) {
        try {
            const user_id = req.user._id;
            const { booking_id } = req.body;

            const response = await bookingService.cancelBooking(booking_id, user_id);

            return res.status(response.success ? 200 : 400).json(response);
        } catch (error) {
            console.error("Error cancelling booking:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
};

export default BookingController;
