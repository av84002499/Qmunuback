import ProductRepository from '../product/product.repository.js';
import userdataRepository from '../userdata/userdata.repository.js';

export default class MenuController {

  constructor() {
    this.productRepository = new ProductRepository();
    this.userdataRepository = new userdataRepository();
  }

  async getMenu(req, res, next) {
    try {
      const ownerId = req.params.id;
      const products = await this.productRepository.getByOwner({ownerId});
      const userId = ownerId;
      const shopDtl = await this.userdataRepository.getOne(userId)
      const results = {shopDtl: shopDtl, products:products}
      res.status(200).send(results);
    } catch (err) {
      next(err);
    }
  }
  
}










