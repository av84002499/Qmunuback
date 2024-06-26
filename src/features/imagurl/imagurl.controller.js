import UserdataRepository from "../userdata/userdata.repository.js";
import ProductRepository from "../product/product.repository.js";

export default class ImagurlController {
    constructor() {
        this.userdataRepository = new UserdataRepository();
        this.productRepository = new ProductRepository();
    }

    async manageShopImg(req, res, next) {
        try {
            console.log(req.body);
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).send("User not found!");
            }
            let userdataData = { userId: userId };
            if (req.file) {
                userdataData.imageUrl = req.file.filename;
            }
            const updatedUserData = await this.userdataRepository.manageShopImg(userdataData);
            res.status(200).send(updatedUserData);
        } catch (err) {
            next(err);
        }
    }

    async manageProdImg(req, res, next) {
        try {
            console.log('request Body:', req.body);
            const { prodId } = req.body;
            if (!prodId) {
                return res.status(400).send("Product not found!");
            }
            let prodData = { _id: prodId };
            if (req.file) {
                prodData.imageUrl = req.file.filename;
            }
            const updatedData = await this.productRepository.manageProdImg(prodData);
            res.status(200).send(updatedData);
        } catch (err) {
            next(err);
        }
    }
}
