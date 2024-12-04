import express from "express";
import { signup, verifyOtp } from "../controllers/UserController.js";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/verifyotp", verifyOtp);

export default userRoutes;
