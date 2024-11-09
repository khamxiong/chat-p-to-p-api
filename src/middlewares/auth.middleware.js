import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized Not Token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized Invalid Token" });
    }
    const user = await User.findOne({ _id: decoded.id}).select("-password");
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};
