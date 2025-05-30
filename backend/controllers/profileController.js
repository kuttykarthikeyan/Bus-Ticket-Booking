import ProfileService from '../services/profileService.js';
import { handleError } from "../utils/authUtils.js";
const profileService = new ProfileService();

class ProfileController {
  async getUserProfile(req, res) {
    try {
      const user_id = req.user._id;
      const result = await profileService.getUserProfile(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error retrieving user profile");
    }
  }

  async getOperatorProfile(req, res) {
    try {
      const operator_id = req.user._id;
      const result = await profileService.getOperatorProfile(operator_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error retrieving operator profile");
    }
  }

  async updateOperatorProfile(req, res) {
    try {
      const operator_id = req.user._id;
      const operatorData = req.body;
      const result = await profileService.updateOperatorProfile(operator_id, operatorData);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error updating operator profile");
    }
  }

  async updateUserProfile(req, res) {
    try {
      const user_id = req.user._id;
      const userData = req.body;
      const result = await profileService.updateUserProfile(user_id, userData);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error updating user profile");
    }
  }

  // New method to get the user's trip history (booked and canceled trips)
  async getUserHistory(req, res) {
    try {
      const user_id = req.user._id;
      const result = await profileService.getUserHistory(user_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error retrieving user trip history");
    }
  }

  // New method to get the operator's bus history (buses they created)
  async getOperatorHistory(req, res) {
    try {
      const operator_id = req.user._id;
      const result = await profileService.getOperatorHistory(operator_id);
      return res.status(result.status).json(result);
    } catch (error) {
      return handleError(res, error, "Error retrieving operator bus history");
    }
  }
}

export default new ProfileController();
