import ProfileService from '../services/profileService.js';
const profileService = new ProfileService();
const ProfileController = {
    async getUserProfile(req, res) {
        try {
            const userId = req.user._id;
            const result = await profileService.getUserProfile(userId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving user profile", error: error.message });
        }
    },
    async getOperatorProfile(req, res) {
        try {
            const operatorId = req.user._id;
            const result = await profileService.getOperatorProfile(operatorId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error retrieving operator profile", error: error.message });
        }
    },
    async updateOperatorProfile(req, res) {
        try {
            const operatorId = req.user._id;
            const operatorData = req.body;
            const result = await profileService.updateOperatorProfile(operatorId, operatorData);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error updating operator profile", error: error.message });
        }
    },
    async updateUserProfile(req, res) {
        try {
            const userId = req.user._id;
            const userData = req.body;
            const result = await profileService.updateUserProfile(userId, userData);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error updating user profile", error: error.message });
        }
    }
};
export default ProfileController;