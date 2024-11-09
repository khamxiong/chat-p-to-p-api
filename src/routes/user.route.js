import express from  "express";
import { getUser,getUserById } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.get('/get',isAuth, getUser);
router.get('/get/:id',isAuth, getUserById);
export default router