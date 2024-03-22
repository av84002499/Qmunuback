import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connected using Mongoose");
        // addCategories(); // Call addCategories() here if needed
    } catch (err) {
        console.log("Error while connecting to DB");
        console.log(err);
    }
}
