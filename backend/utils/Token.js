import jwt from "jsonwebtoken";

// Generate token
export const GenerateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
};
