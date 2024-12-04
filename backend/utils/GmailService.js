import nodemailer from "nodemailer";

// Generate OTP
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  return otp.toString(); // Return as a string if needed
};

export const sendEmail = async (email, otp) => {
  // Create a transporter using Ethereal's SMTP server
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: "mayra.kilback@ethereal.email",
      pass: "QMnZYtJmWeQMFtU6MU",
    },
  });

  // Setup email data
  const mailoptions = {
    from: "mayra.kilback@ethereal.email",
    to: email,
    subject: "Your OTP is here",
    text: `This is your OTP from btbooking: ${otp}`,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailoptions);
    console.log("Email sent: ", nodemailer.getTestMessageUrl(info)); // Preview URL
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};
