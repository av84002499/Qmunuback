import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: String },
    ownerId: { type: String, required: true },
    sizes: [String], // Assuming sizes are stored as strings, adjust as necessary
    inStock: Number,
    imageUrl: { type: String, },
});
