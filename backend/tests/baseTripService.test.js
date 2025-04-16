import BaseTripService from '../services/tripServices/BaseTripService.js';
import Trip from '../models/tripModel';
import mongoose from 'mongoose';

jest.mock('../models/tripModel');

describe('BaseTripService', () => {
  let tripService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    tripService = new BaseTripService();
  });
  
  describe('getTripById', () => {
    it('should return a trip when valid ID is provided', async () => {
      const mockTrip = {
        _id: new mongoose.Types.ObjectId(),
        source: 'New York',
        destination: 'Boston',
        price: 50,
        available_seats: ['A1', 'A2', 'B1']
      };
      
      Trip.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTrip)
      });
      
      const result = await tripService.getTripById(mockTrip._id);
      
      expect(Trip.findById).toHaveBeenCalledWith(mockTrip._id);
      expect(result.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Trip retrieved');
      expect(result.data).toEqual(mockTrip);
    });
    
    it('should return a 404 error when trip is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      Trip.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });
      
      const result = await tripService.getTripById(nonExistentId);
      
      expect(Trip.findById).toHaveBeenCalledWith(nonExistentId);
      expect(result.status).toBe(404);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Trip not found');
    });
    
    it('should return a 500 error when database operation fails', async () => {
      const mockError = new Error('Database connection failed');
      Trip.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(mockError)
      });
      
      const result = await tripService.getTripById(new mongoose.Types.ObjectId());
      
      expect(result.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error fetching trip');
      expect(result.error).toBe(mockError.message);
    });
  });
  
  describe('getAllTrips', () => {
    it('should return all trips successfully', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'New York',
          destination: 'Boston',
          price: 50
        },
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'Chicago',
          destination: 'Detroit',
          price: 45
        }
      ];
      
      Trip.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTrips)
      });
      
      const result = await tripService.getAllTrips();
      
      expect(Trip.find).toHaveBeenCalled();
      expect(result.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Trips retrieved');
      expect(result.data).toEqual(mockTrips);
    });
    
    it('should return a 500 error when database operation fails', async () => {
      const mockError = new Error('Database connection failed');
      Trip.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(mockError)
      });
      
      const result = await tripService.getAllTrips();
      
      expect(result.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error fetching trips');
      expect(result.error).toBe(mockError.message);
    });
  });
  
  describe('getTripByFilter', () => {
    it('should filter trips by source', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'New York',
          destination: 'Boston',
          price: 50,
          available_seats: ['A1', 'A2'],
          isCancelled: false
        }
      ];
      
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTrips)
        })
      });
      
      const result = await tripService.getTripByFilter({ source: 'New York' });
      
      expect(Trip.find).toHaveBeenCalledWith({
        source: 'New York',
        isCancelled: false
      });
      expect(result.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTrips);
    });
    
    it('should filter trips by destination', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'New York',
          destination: 'Boston',
          price: 50,
          available_seats: ['A1', 'A2'],
          isCancelled: false
        }
      ];
      
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTrips)
        })
      });
      
      const result = await tripService.getTripByFilter({ destination: 'Boston' });
      
      expect(Trip.find).toHaveBeenCalledWith({
        destination: 'Boston',
        isCancelled: false
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockTrips);
    });
    
    it('should filter trips by price range', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'New York',
          destination: 'Boston',
          price: 50,
          available_seats: ['A1', 'A2'],
          isCancelled: false
        }
      ];
      
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTrips)
        })
      });
      const result = await tripService.getTripByFilter({ 
        minPrice: 40, 
        maxPrice: 60 
      });
      
      expect(Trip.find).toHaveBeenCalledWith({
        price: { $gte: 40, $lte: 60 },
        isCancelled: false
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockTrips);
    });
    
    it('should filter trips by available seats', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'New York',
          destination: 'Boston',
          price: 50,
          available_seats: ['A1', 'A2', 'B1'],
          isCancelled: false
        },
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'Chicago',
          destination: 'Detroit',
          price: 45,
          available_seats: ['A1'],
          isCancelled: false
        }
      ];
      
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTrips)
        })
      });
      
      const result = await tripService.getTripByFilter({ seats: 2 });
      
      expect(Trip.find).toHaveBeenCalledWith({
        isCancelled: false
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual([mockTrips[0]]); 
    });
    
    it('should return a 500 error when database operation fails', async () => {
      const mockError = new Error('Database connection failed');
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockRejectedValue(mockError)
        })
      });
      
      const result = await tripService.getTripByFilter();
      
      expect(result.status).toBe(500);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Error fetching trips');
      expect(result.error).toBe(mockError.message);
    });
    
    it('should combine multiple filters correctly', async () => {
      const mockTrips = [
        {
          _id: new mongoose.Types.ObjectId(),
          source: 'New York',
          destination: 'Boston',
          price: 50,
          available_seats: ['A1', 'A2', 'B1', 'B2'],
          isCancelled: false
        }
      ];
      
      Trip.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(mockTrips)
        })
      });
      
      const filters = {
        source: 'New York',
        destination: 'Boston',
        minPrice: 40,
        maxPrice: 60,
        seats: 3
      };
      
      const result = await tripService.getTripByFilter(filters);
      
      expect(Trip.find).toHaveBeenCalledWith({
        source: 'New York',
        destination: 'Boston',
        price: { $gte: 40, $lte: 60 },
        isCancelled: false
      });
      expect(result.status).toBe(200);
      expect(result.data).toEqual(mockTrips);
    });
  });
});
