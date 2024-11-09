import User from "../models/user.model.js";


export const getUser = async (req, res) => {
    try{
    const loginedUserId = req.user._id;
     const users = await User.find({ _id: {$ne: loginedUserId}}).select("-password");
     res.status(200).json({ data: users ,"message": "success" });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getUserById = async (req, res) => {
    try{
     const user = await User.findById(req.params.id);
     res.status(200).json({ data: user ,"message": "success" });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}