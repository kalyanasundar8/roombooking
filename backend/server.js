import express from "express";
import colors from "colors";
import parser from "cookie-parser";
import dotenv, { parse } from "dotenv";
dotenv.config();

// Modules
import connectToDb from "./config/db.js";
import userRoutes from "./routes/UserRoutes.js";

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

// Routes
server.use("/api/user", userRoutes);

server.listen(port, () => {
  console.log(`Server listening port: ${port}`.bgBlue);
});
