import BookingService from "../services/bookingService.js";

const bookingService = new BookingService();
const BookingController= {

    async bookTrip (req, res) {
  const user_id = req.user._id;
    const { trip_id, seat_numbers} = req.body;

    const response = await bookingService.createBooking(user_id, trip_id, seat_numbers);
    
    if(response.success){
        res.status(201).json(response);
    }
    else{
        res.status(400).json(response);
    }
  }
}
export default BookingController;
         