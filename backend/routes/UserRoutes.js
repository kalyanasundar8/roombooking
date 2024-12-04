import express from "express";
import { signin, signup, verifyOtp } from "../controllers/UserController.js";

const userRoutes = express.Router();

userRoutes.post("/signup", signup);
userRoutes.post("/verifyotp", verifyOtp);
userRoutes.post("/signin", signin);

export default userRoutes;
