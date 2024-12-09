import Hotel from "../models/Hotel.js";
import bcrypt from "bcryptjs";
import { generateOTP, sendEmail } from "../utils/GmailService.js";
import { GenerateToken } from "../utils/Token.js";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const MOBILE_REGEX = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

const createHotel = async (req, res) => {
  try {
    const {
      hotelName,
      description,
      street,
      city,
      state,
      country,
      zip,
      mobilenumber,
      email,
      amenities,
      rooms,
      ratings,
      numReviews,
      images,
      password,
    } = req.body;

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate mobile number
    if (!MOBILE_REGEX.test(mobilenumber)) {
      return res.status(400).json({ message: "Invalid mobile number format." });
    }

    // Check if email or mobile number already exists
    const existingHotel = await Hotel.findOne({
      $or: [{ email }, { mobilenumber }],
    });

    if (existingHotel) {
      const conflictField =
        existingHotel.email === email ? "email" : "mobilenumber";
      return res
        .status(400)
        .json({ message: `User ${conflictField} already exists.` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Generate otp
    const otp = generateOTP();

    const hotel = await Hotel.create({
      hotelName: hotelName,
      description: description,
      street: street,
      city: city,
      state: state,
      country: country,
      zip: zip,
      mobilenumber: mobilenumber,
      email: email,
      otp: otp,
      amenities: amenities,
      rooms: rooms,
      ratings: ratings,
      numReviews: numReviews,
      images: images,
      password: hashedPassword,
    });

    // Send a OTP mail
    sendEmail(hotel.email, hotel.otp);

    // Generate a token
    const token = GenerateToken(hotel._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      hotelname: hotel.hotelName,
      street: hotel.street,
      city: hotel.city,
      state: hotel.state,
      country: hotel.country,
      zip: hotel.zip,
      mobilenumber: hotel.mobilenumber,
      email: hotel.email,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something went wrong while creating hotel" });
  }
};

export { createHotel };
