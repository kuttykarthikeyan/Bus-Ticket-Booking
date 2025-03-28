import ProfileService from '../services/profileService.js';
import { handleError } from "../utils/authUtils.js";

const profileService = new ProfileService();

const ProfileController = {
    async getUserProfile(req, res) {
        try {
            const userId = req.user._id;
            const result = await profileService.getUserProfile(userId);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error retrieving user profile");
        }
    },

    async getOperatorProfile(req, res) {
        try {
            const operatorId = req.user._id;
            const result = await profileService.getOperatorProfile(operatorId);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error retrieving operator profile");
        }
    },

    async updateOperatorProfile(req, res) {
        try {
            const operatorId = req.user._id;
            const operatorData = req.body;
            const result = await profileService.updateOperatorProfile(operatorId, operatorData);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error updating operator profile");
        }
    },

    async updateUserProfile(req, res) {
        try {
            const userId = req.user._id;
            const userData = req.body;
            const result = await profileService.updateUserProfile(userId, userData);
            return res.status(result.status).json(result);
        } catch (error) {
            return handleError(res, error, "Error updating user profile");
        }
    }
};

export default ProfileController;
