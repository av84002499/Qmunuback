import { ApplicationError } from '../../error-handler/applicationError.js';
import UserModel from '../user/user.model.js';

export default class ProductModel {
  constructor(
    name,
    price,
    ownerId,
    sizes,
    imageUrl,
    id
  ) {
    this._id = id;
    this.name = name;
    this.sizes = sizes;
    this.imageUrl = imageUrl;
    this.price = price;
    this.ownerId = ownerId;
  }

  static add(product) {
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  static get(id) {
    const product = products.find(
      (i) => i.id == id
    );
    return product;
  }

  static getAll() {
    return products;
  }

  static rateProduct(userID, productID, rating) {
    // 1. Validate user and product
    const user = UserModel.getAll().find(
      (u) => u.id == userID
    );
    if (!user) {
      // user-defined error.
      throw new ApplicationError(
        'User not found',
        404
      );
    }

    // Validate Product
    const product = products.find(
      (p) => p.id == productID
    );
    if (!product) {
      throw new ApplicationError(
        'Product not found',
        400
      );
    }
  }
}

var products = [
  new ProductModel(
    1,
    'Product 1',
    'Description for Product 10',
    19.99,
    'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
    'Category1'
  ),
  new ProductModel(
    2,
    'Product 2',
    'Description for Product 2',
    29.99,
    'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
    'Category2',
    ['M', 'XL']
  ),
  new ProductModel(
    3,
    'Product 3',
    'Description for Product 3',
    39.99,
    'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
    'Category3',
    ['M', 'XL', 'S']
  ),
];
