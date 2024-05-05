import ProductModel from './product.model.js';
import ProductRepository from './product.repository.js';

export default class ProductController {

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getMyProducts(req, res, next) {
    try {
	    console.log(req.body);
      const {ownerId} = req.body;
      const products = await this.productRepository.getByOwner({ownerId});
      res.status(200).send(products);
    } catch (err) {
      next(err);
    }

  }
  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      res.status(200).send(products);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }

  }

  async addProduct(req, res) {
    try {
      console.log(req.body);

      const { name, price, ownerId, sizes } = req.body;
      const newProduct = new ProductModel(name, parseFloat(price), ownerId, sizes, req.file.filename);
      const createdProduct = await this.productRepository.add(newProduct);
      res.status(201).send(createdProduct);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }


  async getOneProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        return res.status(200).send(product);
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async filterProducts(req, res) {
    try {
      const minPrice = req.query.minPrice;
      const id = req.query.id;
      const name = req.query.name;

      let filterOptions = {};
      if (minPrice) {
        filterOptions.minPrice = minPrice;
      }
      if (id) {
        filterOptions.id = id;
      }
      if (name) {
        filterOptions.name = name;
      }

      const result = await this.productRepository.filter(filterOptions);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async delete(req, res, next) {
    try {
      const productId = req.params.id;
      const deletedProduct = await this.productRepository.delete(productId);
      res.status(200).send(deletedProduct);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }

  async put(req, res, next) {
    try {
        const productId = req.params.id; 
        const updatedData = req.body; 
         const updatedProduct = await this.productRepository.update(productId, updatedData);
        if (!updatedProduct) {
            return res.status(404).send("Product not found");
        }
       res.status(200).send(updatedProduct);
    } catch (err) {
        console.error(err); 
        res.status(500).send("Internal Server Error");
    }
}




}










