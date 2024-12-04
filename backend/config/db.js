import mongoose from "mongoose";

// Connection
const connectToDb = async () => {
  const uri = process.env.CONNECTION_URI;
  try {
    await mongoose.connect(uri);
    console.log(`Server connected to DB`.yellow);
  } catch (error) {
    console.log(`Error while connecting to DB`.red);
  }
};

export default connectToDb;
