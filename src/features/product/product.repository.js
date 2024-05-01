import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";

const ProductModel = mongoose.model("Product", productSchema);

class ProductRepository{

    constructor(){
        this.collection = "products";
    }

    async add(productData){
        try{
            // 1. Adding Product
            productData.categories=productData.category
            console.log(productData);
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();
            return savedProduct
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

    async getAll(){
        try{
            // const db = getDB();
            // const collection = db.collection(this.collection);

            const products = await ProductModel.find();
            console.log(products);
            return products;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

    async getByOwner(ownerId) {
        const products = ProductModel.find(ownerId = ownerId);
        return products;
      }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }

    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

    // Product hosuld have min price specified and category
    async filter(minPrice, categories){
        try{
            const db = getDB();
            const collection = db.collection(this.collection); 
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            // ['Cat1', 'Cat2']
            categories = JSON.parse(categories.replace(/'/g, '"'));
            console.log(categories);
            if(categories){
                filterExpression={$or:[{category:{$in:categories}} , filterExpression]}
                // filterExpression.category=category
            }
            return collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:-1}}).toArray();

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }

//     async rate(userID, productID, rating){
//         try{
//             const db = getDB();
//             const collection = db.collection(this.collection); 
//             //1. Find the product
//            
//                     $set:{
//                         "ratings.$.rating":rating
//                     }
//                 })
//            }else{
//   
//         }catch(err){
//             
async rate(userID, productID, rating){
    try{
        // 1. Check if product exists
        const productToUpdate = await ProductModel.findById(productID);
        if(!productToUpdate){
            throw new Error("Product not found")
        }

        

    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }
}

async averageProductPricePerCategory(){
    try{
        const db=getDB();
        return await db.collection(this.collection)
            .aggregate([
                {
                    // Stage 1: Get Average price per category
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg:"$price"}
                    }
                }
            ]).toArray();
    }catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);    
    }
    
}
async delete(productId) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(productId);
      return deletedProduct;
    } catch (err) {
      throw err;
    }
  }
  
  async update(productId, updatedData) {
    try {
      const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updatedData, { new: true });
      return updatedProduct;
    } catch (err) {
      throw err;
    }
  
  
}

 async manageProdImg(proddata) {
        try {
            // const userdata = req.body;
            console.log('Data coming from put is:', proddata);
            const _id = proddata._id;
            const prodData = await ProductModel.findOne({ _id });
            // If user data is not found, return 404 Not Found
            if (!prodData) {
                return 'User Data Not Found';
            }
            prodData['imageUrl'] = proddata['imageUrl'];
            const updatedData = await prodData.save();

            return updatedData;
        } catch (err) {
            throw err;
        }
    } 

}

export default ProductRepository;
