
import mongoose from "mongoose";

export const userdataschema = new mongoose.Schema({
    shopname: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    phonenumber: { type: String, required: true }, // Assuming phone number can have characters like '+'
    gstnumber: { type: String }, // GST number might be better as a string
    aadharnumber: { type: String, required: true },
    imageUrl: { type: String, default: '2024-03-17T152939.511Zshopimg.jpg' },
    userId: { type: String, unique: true, required: true },
});
