import bcrypt from "bcryptjs";
// Modal
import User from "../models/User.js";
import { GenerateToken } from "../utils/Token.js";
import { sendEmail, generateOTP } from "../utils/GmailService.js";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const MOBILE_REGEX = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

// Registe a user
const signup = async (req, res) => {
  try {
    const { username, mobilenumber, email, password } = req.body;

    // Validate required fields
    if (!username || !mobilenumber || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate mobile number
    if (!MOBILE_REGEX.test(mobilenumber)) {
      return res.status(400).json({ message: "Invalid mobile number format." });
    }

    // Validate password strength
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number.",
      });
    }

    // Check if email or mobile number already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobilenumber }],
    });
    if (existingUser) {
      const conflictField =
        existingUser.email === email ? "email" : "mobile number";
      return res
        .status(400)
        .json({ message: `User ${conflictField} already exists.` });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Generate otp
    const otp = generateOTP();

    // Create a user
    const user = await User.create({
      username: username,
      mobilenumber: mobilenumber,
      email: email,
      otp: otp,
      password: hashedPassword,
    });

    // Send a OTP mail
    sendEmail(user.email, user.otp);

    // Generate a token
    const token = GenerateToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      id: user._id,
      username: user.username,
      mobilenumber,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Signup Error: ", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Verify the otp
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "Enter your OTP" });
    }

    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP." });
    }

    user.verified = true;
    await user.save();

    return res.status(400).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification Error: ", error);
    return res.status(500).json({ message: "Intenal server error." });
  }
};

export { signup, verifyOtp };
