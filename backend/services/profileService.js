import User from "../models/userModel.js";
import Operator from "../models/operatorModel.js";
class ProfileService {
    async getUserProfile(userId) {
        try{
            const user = await User.findById(userId);
            if(!user){
                return { status: 404, success: false, message: "User not found" };
            }
            return { status: 200, success: true, message: "User profile retrieved successfully", user };
        }
        catch(error){
            return { status: 500, success: false, message: "Error retrieving user profile", error: error.message };
        }
    }
   async getOperatorProfile(operatorId) {
        try{
            const operator = await Operator.findById(operatorId);
            if(!operator){
                return { status: 404, success: false, message: "Operator not found" };
            }
            return { status: 200, success: true, message: "Operator profile retrieved successfully", operator };
        }
        catch(error){
            return { status: 500, success: false, message: "Error retrieving operator profile", error: error.message };
        }
    }
    async updateOperatorProfile(operatorId, operatorData) {
        
            const operator=Operator.findByIdAndUpdate(operatorId,operatorData,{new:true});
            return { status: 200, success: true, message: "Operator profile updated successfully", operator };
    }
    async updateUserProfile(operatorId, operatorData) {
        
        const user=User.findByIdAndUpdate(operatorId,operatorData,{new:true});
        return { status: 200, success: true, message: "User profile updated successfully", user };
}
}
export default  ProfileService;