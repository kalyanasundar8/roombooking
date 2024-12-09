import express from "express";
import colors from "colors";
import parser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

// Modules
import connectToDb from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import hotelRoutes from "./routes/HotelRoutes.js";

// Db Connection
connectToDb();

// Server
const server = express();

// Port
const port = process.env.PORT;

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(parser());
server.use(errorHandler);

// Routes
server.use("/api/user", userRoutes);
server.use("/api/hotel", hotelRoutes);

server.listen(port, () => {
  console.log(`Server listening port: ${port}`.bgBlue);
});
