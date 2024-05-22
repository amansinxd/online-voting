import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, required: true },
  sessionID: { type: String },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
