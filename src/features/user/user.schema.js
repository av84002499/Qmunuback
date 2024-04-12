import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name can't be greater than 25 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
    type: String,
  },
  type: { type: String, enum: ["Customer", "Seller"] },
});
