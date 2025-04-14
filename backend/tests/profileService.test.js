// profileService.test.js
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import ProfileService from '../services/profileService.js';
import User from '../models/userModel.js';
import Operator from '../models/operatorModel.js';
import Bus from '../models/busModel.js';
import Booking from '../models/bookingModel.js';

// Mock the models
jest.mock('../models/userModel.js');
jest.mock('../models/operatorModel.js');
jest.mock('../models/busModel.js');
jest.mock('../models/bookingModel.js');

describe('ProfileService', () => {
  let profileService;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    profileService = new ProfileService();
  });

  describe('handleDatabaseOperation', () => {
    it('should return success response when operation succeeds', async () => {
      // Arrange
      const mockOperation = jest.fn().mockResolvedValue({ id: '123', name: 'Test' });
      const successMessage = 'Success message';
      const errorMessage = 'Error message';

      // Act
      const result = await profileService.handleDatabaseOperation(
        mockOperation, 
        successMessage, 
        errorMessage
      );

      // Assert
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: 200,
        success: true,
        message: successMessage,
        data: { id: '123', name: 'Test' }
      });
    });

    it('should return not found response when operation returns null', async () => {
      // Arrange
      const mockOperation = jest.fn().mockResolvedValue(null);
      const successMessage = 'Success message';
      const errorMessage = 'Error message';

      // Act
      const result = await profileService.handleDatabaseOperation(
        mockOperation, 
        successMessage, 
        errorMessage
      );

      // Assert
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        status: 404,
        success: false,
        message: 'Not found'
      });
    });

    it('should return error response when operation throws an error', async () => {
      // Arrange
      const mockError = new Error('Database error');
      const mockOperation = jest.fn().mockRejectedValue(mockError);
      const successMessage = 'Success message';
      const errorMessage = 'Error message';

      // Spy on console.error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.handleDatabaseOperation(
        mockOperation, 
        successMessage, 
        errorMessage
      );

      // Assert
      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith('Error message failed:', mockError);
      expect(result).toEqual({
        status: 500,
        success: false,
        message: errorMessage,
        error: 'Database error'
      });

      // Restore console.error
      consoleSpy.mockRestore();
    });
  });

  describe('getUserProfile', () => {
    it('should retrieve user profile successfully', async () => {
      // Arrange
      const userId = 'user123';
      const mockUser = { _id: userId, name: 'Test User', email: 'test@example.com' };
      User.findById.mockResolvedValue(mockUser);

      // Act
      const result = await profileService.getUserProfile(userId);

      // Assert
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'User profile retrieved successfully',
        data: mockUser
      });
    });

    it('should return not found when user does not exist', async () => {
      // Arrange
      const userId = 'nonexistent';
      User.findById.mockResolvedValue(null);

      // Act
      const result = await profileService.getUserProfile(userId);

      // Assert
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        status: 404,
        success: false,
        message: 'Not found'
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user123';
      const mockError = new Error('Database connection lost');
      User.findById.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.getUserProfile(userId);

      // Assert
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Error retrieving user profile',
        error: 'Database connection lost'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('getOperatorProfile', () => {
    it('should retrieve operator profile successfully', async () => {
      // Arrange
      const operatorId = 'op123';
      const mockOperator = { _id: operatorId, name: 'Test Operator', company: 'Test Company' };
      Operator.findById.mockResolvedValue(mockOperator);

      // Act
      const result = await profileService.getOperatorProfile(operatorId);

      // Assert
      expect(Operator.findById).toHaveBeenCalledWith(operatorId);
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Operator profile retrieved successfully',
        data: mockOperator
      });
    });

    it('should return not found when operator does not exist', async () => {
      // Arrange
      const operatorId = 'nonexistent';
      Operator.findById.mockResolvedValue(null);

      // Act
      const result = await profileService.getOperatorProfile(operatorId);

      // Assert
      expect(Operator.findById).toHaveBeenCalledWith(operatorId);
      expect(result).toEqual({
        status: 404,
        success: false,
        message: 'Not found'
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const operatorId = 'op123';
      const mockError = new Error('Database connection lost');
      Operator.findById.mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.getOperatorProfile(operatorId);

      // Assert
      expect(Operator.findById).toHaveBeenCalledWith(operatorId);
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Error retrieving operator profile',
        error: 'Database connection lost'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('updateOperatorProfile', () => {
    it('should update operator profile successfully', async () => {
      // Arrange
      const operatorId = 'op123';
      const operatorData = { name: 'Updated Operator', company: 'Updated Company' };
      const updatedOperator = { _id: operatorId, ...operatorData };
      
      Operator.findByIdAndUpdate.mockResolvedValue(updatedOperator);

      // Act
      const result = await profileService.updateOperatorProfile(operatorId, operatorData);

      // Assert
      expect(Operator.findByIdAndUpdate).toHaveBeenCalledWith(
        operatorId,
        { $set: operatorData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Operator profile updated successfully',
        data: updatedOperator
      });
    });

    it('should return not found when operator does not exist', async () => {
      // Arrange
      const operatorId = 'nonexistent';
      const operatorData = { name: 'Updated Operator' };
      
      Operator.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      const result = await profileService.updateOperatorProfile(operatorId, operatorData);

      // Assert
      expect(Operator.findByIdAndUpdate).toHaveBeenCalledWith(
        operatorId,
        { $set: operatorData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual({
        status: 404,
        success: false,
        message: 'Not found'
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const operatorId = 'op123';
      const operatorData = { name: 'Updated Operator' };
      const mockError = new Error('Validation failed');
      
      Operator.findByIdAndUpdate.mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.updateOperatorProfile(operatorId, operatorData);

      // Assert
      expect(Operator.findByIdAndUpdate).toHaveBeenCalledWith(
        operatorId,
        { $set: operatorData },
        { new: true, runValidators: true }
      );
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Error updating operator profile',
        error: 'Validation failed'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const userId = 'user123';
      const userData = { name: 'Updated User', email: 'updated@example.com' };
      const updatedUser = { _id: userId, ...userData };
      
      User.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Act
      const result = await profileService.updateUserProfile(userId, userData);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $set: userData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'User profile updated successfully',
        data: updatedUser
      });
    });

    it('should return not found when user does not exist', async () => {
      // Arrange
      const userId = 'nonexistent';
      const userData = { name: 'Updated User' };
      
      User.findByIdAndUpdate.mockResolvedValue(null);

      // Act
      const result = await profileService.updateUserProfile(userId, userData);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $set: userData },
        { new: true, runValidators: true }
      );
      expect(result).toEqual({
        status: 404,
        success: false,
        message: 'Not found'
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user123';
      const userData = { name: 'Updated User' };
      const mockError = new Error('Validation failed');
      
      User.findByIdAndUpdate.mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.updateUserProfile(userId, userData);

      // Assert
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { $set: userData },
        { new: true, runValidators: true }
      );
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Error updating user profile',
        error: 'Validation failed'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('getUserHistory', () => {
    it('should retrieve user history successfully', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookings = [
        { _id: 'booking1', user_id: userId, booking_status: 'confirmed', trip_id: { _id: 'trip1', from: 'CityA', to: 'CityB' } },
        { _id: 'booking2', user_id: userId, booking_status: 'cancelled', trip_id: { _id: 'trip2', from: 'CityC', to: 'CityD' } },
        { _id: 'booking3', user_id: userId, booking_status: 'confirmed', trip_id: { _id: 'trip3', from: 'CityE', to: 'CityF' } }
      ];
      
      const mockPopulateFunction = jest.fn().mockResolvedValue(mockBookings);
      Booking.find.mockReturnValue({ populate: mockPopulateFunction });

      // Act
      const result = await profileService.getUserHistory(userId);

      // Assert
      expect(Booking.find).toHaveBeenCalledWith({ user_id: userId });
      expect(mockPopulateFunction).toHaveBeenCalledWith('trip_id');
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'User trip history retrieved successfully',
        data: {
          bookedTrips: [mockBookings[0], mockBookings[2]],
          canceledTrips: [mockBookings[1]]
        }
      });
    });

    it('should return empty arrays when no bookings exist', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookings = [];
      
      const mockPopulateFunction = jest.fn().mockResolvedValue(mockBookings);
      Booking.find.mockReturnValue({ populate: mockPopulateFunction });

      // Act
      const result = await profileService.getUserHistory(userId);

      // Assert
      expect(Booking.find).toHaveBeenCalledWith({ user_id: userId });
      expect(mockPopulateFunction).toHaveBeenCalledWith('trip_id');
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'User trip history retrieved successfully',
        data: {
          bookedTrips: [],
          canceledTrips: []
        }
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const userId = 'user123';
      const mockError = new Error('Database query failed');
      
      Booking.find.mockImplementation(() => {
        throw mockError;
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.getUserHistory(userId);

      // Assert
      expect(Booking.find).toHaveBeenCalledWith({ user_id: userId });
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Error retrieving user trip history',
        error: 'Database query failed'
      });

      consoleSpy.mockRestore();
    });
  });

  describe('getOperatorHistory', () => {
    it('should retrieve operator history successfully', async () => {
      // Arrange
      const operatorId = 'op123';
      const mockBuses = [
        { _id: 'bus1', operator_id: operatorId, name: 'Bus A', capacity: 50 },
        { _id: 'bus2', operator_id: operatorId, name: 'Bus B', capacity: 45 }
      ];
      
      Bus.find.mockResolvedValue(mockBuses);

      // Act
      const result = await profileService.getOperatorHistory(operatorId);

      // Assert
      expect(Bus.find).toHaveBeenCalledWith({ operator_id: operatorId });
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Operator bus history retrieved successfully',
        data: {
          createdBuses: mockBuses
        }
      });
    });

    it('should return empty array when no buses exist', async () => {
      // Arrange
      const operatorId = 'op123';
      const mockBuses = [];
      
      Bus.find.mockResolvedValue(mockBuses);

      // Act
      const result = await profileService.getOperatorHistory(operatorId);

      // Assert
      expect(Bus.find).toHaveBeenCalledWith({ operator_id: operatorId });
      expect(result).toEqual({
        status: 200,
        success: true,
        message: 'Operator bus history retrieved successfully',
        data: {
          createdBuses: []
        }
      });
    });

    it('should handle database errors', async () => {
      // Arrange
      const operatorId = 'op123';
      const mockError = new Error('Database query failed');
      
      Bus.find.mockRejectedValue(mockError);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act
      const result = await profileService.getOperatorHistory(operatorId);

      // Assert
      expect(Bus.find).toHaveBeenCalledWith({ operator_id: operatorId });
      expect(consoleSpy).toHaveBeenCalled();
      expect(result).toEqual({
        status: 500,
        success: false,
        message: 'Error retrieving operator bus history',
        error: 'Database query failed'
      });

      consoleSpy.mockRestore();
    });
  });
});