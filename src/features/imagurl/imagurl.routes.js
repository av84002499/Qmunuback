// 1. Import express.
import express from 'express';
import ImagurlController from './imagurl.controller.js'; // Ensure the correct import path and case sensitivity
import { upload } from '../../middlewares/fileupload.middleware.js'; // Ensure the correct import path

// 2. Initialize Express router.
const imagurlRouter = express.Router();
const controller = new ImagurlController(); // Ensure the controller class name matches your import

// Define routes for handling image uploads
imagurlRouter.post('/shopimg', upload.single('imageUrl'), (req, res, next) => {
    controller.manageShopImg(req, res, next); // Ensure the method name matches your controller
});

imagurlRouter.post('/prodimg', upload.single('imageUrl'), (req, res, next) => {
    controller.manageProdImg(req, res, next); // Ensure the method name matches your controller
});

export default imagurlRouter;
