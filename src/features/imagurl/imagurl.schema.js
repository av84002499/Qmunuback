import mongoose from "mongoose";

export const imagurlSchema = new mongoose.Schema({
   
    imageUrl: { type: String,  },
    prodId:  { type: String,  },
    userId : { type: String,  }
});
