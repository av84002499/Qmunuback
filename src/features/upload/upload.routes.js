// 1. Import express.
import express from 'express';
import uploadController from './upload.controller.js';
import { upload } from '../../middlewares/fileupload.middleware.js';

// 2. Initialize Express router.
const uploadRouter = express.Router();
const controller = new uploadController();
// All the paths to controller methods.

uploadRouter.post('/shopimg', upload.single('imageUrl'), (req, res, next) => {
    controller.manageShopImg(req, res, next);
  });
uploadRouter.post('/prodimg', upload.single('imageUrl'), (req, res, next) => {
    controller.manageProdImg(req, res, next);
  });

export default uploadRouter;

