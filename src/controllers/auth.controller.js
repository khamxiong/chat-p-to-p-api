import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signUp = async (req, res) => {
    const { userName, email, password } = req.body;
    if(!userName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try{
        const user = await User.findOne({ email });
        if(user) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const checkAvatar = (gender) => {
            if(gender === "male") {
                return "https://avatar.iran.liara.run/public/17";
            } else {
                return "https://avatar.iran.liara.run/public/72";
            }
        }
        const newUser = new User({ 
            userName: req.body.userName, 
            email: req.body.email, 
            password: req.body.password,
            gender: req.body.gender,
           phone: req.body.phone,
            avatar: req.body.avatar || checkAvatar(req.body.gender),
         });
        await newUser.save();
        const token = generateToken(newUser._id, res);
        const returnInfo = {
            _id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            avatar: newUser.avatar
        }
        res.status(201).json({ message: "User created successfully", data:returnInfo, token:token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signIn = async (req, res) => {
  try{
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
      return res.status(401).json({ message: "not found user" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
   const token = generateToken(user._id, res);
    const returnInfo = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        avatar: user.avatar
    }
    res.status(200).json({ message: "Login successfully", data:returnInfo, token:token });
  }catch(error){
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const signOut = async (req, res) => {
  try{
    // res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Sign out successfully" });
  }catch(error){
    console.log(error);     
    res.status(500).json({ message: "Internal server error" });
} 
}