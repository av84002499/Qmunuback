import mongoose from "mongoose";

export const userdataschema = new mongoose.Schema({
  shopname: { type: String, required: true },
  category: { type: String, required: true },
  address: { type: String, required: true },
  fcinumber: { type: String },
  phonenumber1: { type: String, required: true }, // Assuming phone number can have characters like '+'
  phonenumber2: { type: String }, // Assuming phone number can have characters like '+'
  gstnumber: { type: String }, // GST number might be better as a string
  imageUrl: { type: String, default: "2024-03-17T152939.511Zshopimg.jpg" },
  userId: { type: String, unique: true, required: true },
});
