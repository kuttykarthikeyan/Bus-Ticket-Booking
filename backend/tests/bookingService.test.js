import BookingService from '../services/bookingService.js';
import Booking from '../models/bookingModel.js';
import Trip from '../models/tripModel.js';

// Mock the Booking and Trip models
jest.mock('../models/bookingModel.js');
jest.mock('../models/tripModel.js');

const bookingService = new BookingService();

describe('BookingService', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should return 404 if trip not found', async () => {
      Trip.findById.mockResolvedValue(null);

      const response = await bookingService.createBooking('user1', 'trip1', ['A1']);
      expect(response.status).toBe(404);
      expect(response.message).toBe("Trip not found");
    });

    it('should return 400 if trip is cancelled', async () => {
      Trip.findById.mockResolvedValue({ isCancelled: true });

      const response = await bookingService.createBooking('user1', 'trip1', ['A1']);
      expect(response.status).toBe(400);
      expect(response.message).toBe("Trip is cancelled");
    });

    it('should return 400 for invalid seats', async () => {
      Trip.findById.mockResolvedValue({
        isCancelled: false,
        available_seats: ['A1', 'A2'],
        booked_seats: ['B1']
      });

      const response = await bookingService.createBooking('user1', 'trip1', ['Z1']);
      expect(response.status).toBe(400);
      expect(response.message).toMatch(/Invalid seat numbers/);
    });

    it('should return 400 for already booked seats', async () => {
      Trip.findById.mockResolvedValue({
        isCancelled: false,
        available_seats: ['A1', 'A2'],
        booked_seats: ['A3']
      });

      const response = await bookingService.createBooking('user1', 'trip1', ['A3']);
      expect(response.status).toBe(400);
      expect(response.message).toMatch(/Seats unavailable/);
    });

    it('should successfully create a booking', async () => {
      const mockTrip = {
        isCancelled: false,
        available_seats: ['A1', 'A2', 'A3'],
        booked_seats: []
      };

      const mockBooking = {
        _id: 'booking1',
        user_id: 'user1',
        trip_id: 'trip1',
        seat_numbers: ['A1']
      };

      Trip.findById.mockResolvedValue(mockTrip);
      Booking.create.mockResolvedValue(mockBooking);
      Trip.updateOne.mockResolvedValue({});

      const response = await bookingService.createBooking('user1', 'trip1', ['A1']);
      expect(response.status).toBe(200);
      expect(response.success).toBe(true);
      expect(response.data.booking).toEqual(mockBooking);
    });
  });

  describe('cancelBooking', () => {
    it('should return 404 if booking not found', async () => {
      Booking.findById.mockResolvedValue(null);

      const response = await bookingService.cancelBooking('booking1', 'user1');
      expect(response.status).toBe(404);
      expect(response.message).toBe("Booking not found");
    });

    it('should return 403 if user is unauthorized', async () => {
      Booking.findById.mockResolvedValue({
        user_id: 'other_user'
      });

      const response = await bookingService.cancelBooking('booking1', 'user1');
      expect(response.status).toBe(403);
      expect(response.message).toBe("Unauthorized cancellation");
    });

    it('should return 400 if already cancelled', async () => {
      Booking.findById.mockResolvedValue({
        user_id: 'user1',
        booking_status: 'cancelled'
      });

      const response = await bookingService.cancelBooking('booking1', 'user1');
      expect(response.status).toBe(400);
      expect(response.message).toBe("Booking already cancelled");
    });

    it('should successfully cancel a booking', async () => {
      const mockBooking = {
        _id: 'booking1',
        user_id: 'user1',
        trip_id: 'trip1',
        seat_numbers: ['A1'],
        booking_status: 'confirmed',
        save: jest.fn().mockResolvedValue(true)
      };

      Booking.findById.mockResolvedValue(mockBooking);
      Trip.updateOne.mockResolvedValue({});

      const response = await bookingService.cancelBooking('booking1', 'user1');
      expect(response.status).toBe(200);
      expect(response.success).toBe(true);
      expect(mockBooking.save).toHaveBeenCalled();
    });
  });
});
