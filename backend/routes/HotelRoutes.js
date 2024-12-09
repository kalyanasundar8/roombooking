import express from "express";
import { createHotel } from "../controllers/HotelController.js";

const hotelRoutes = express.Router();

hotelRoutes.post("/createhotel", createHotel);

export default hotelRoutes;
