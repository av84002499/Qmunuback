// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import ProductController from './product.controller.js';
import { upload } from '../../middlewares/fileupload.middleware.js';

// 2. Initialize Express router.
const productRouter = express.Router();

const productController = new ProductController();

// All the paths to controller methods.
// localhost/api/products

// localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1
 
productRouter.get(
  '/filter',
  (req, res)=>{
    productController.filterProducts(req, res)
} 
);
productRouter.get(
  '/',
  (req, res)=>{
    productController.getAllProducts(req, res)
} 
);
productRouter.post(
  '/',upload.single('imageUrl'),
  (req, res)=>{
    productController.addProduct(req, res)
} 
);
productRouter.post('/myProducts',(req, res, next)=>{
    productController.getMyProducts(req, res, next)
} 
);

productRouter.get("/averagePrice", (req, res, next)=>{
  productController.averagePrice(req, res)
});



productRouter.delete('/:id', (req, res, next)=>{
  productController.delete(req, res, next)
});

productRouter.put('/:id', (req, res, next)=>{
  productController.put(req, res, next)
});



export default productRouter;
