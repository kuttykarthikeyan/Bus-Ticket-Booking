import BookingService from "../services/bookingService.js";
import { handleError } from "../utils/authUtils.js";

class BookingController {
  constructor() {
    this.bookingService = new BookingService();
  }

  async bookTrip(req, res) {
    try {
      const user_id = req.user._id;
      const { trip_id, seat_numbers } = req.body;

      const response = await this.bookingService.createBooking(user_id, trip_id, seat_numbers);
      return res.status(response.status).json(response);
    } catch (error) {
      return handleError(res, error, "Error in bookTrip Controller");
    }
  }

  async cancelBooking(req, res) {
    try {
      const user_id = req.user._id;
      const { booking_id } = req.body;

      const response = await this.bookingService.cancelBooking(booking_id, user_id);
      return res.status(response.status).json(response);
    } catch (error) {
      return handleError(res, error, "Error in cancelBooking Controller");
    }
  }
}

export default new BookingController();
