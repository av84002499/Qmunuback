import mongoose from "mongoose";

export const userOtpSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  otp: { type: String },
});
