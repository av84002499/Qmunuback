import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: String, required: true },
    ownerId: { type: String, required: true },
    sizes: [String], // Assuming sizes are stored as strings, adjust as necessary
    inStock: Number,
    imageUrl: { type: String, default: '2024-03-19T163819.704Zproduct_default.png' },
});
