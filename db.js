import mongoose from "mongoose";

const connectDb = (handler) => async (req, res) => {
  try {
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("New connection");
    return handler(req, res);
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export default connectDb;
