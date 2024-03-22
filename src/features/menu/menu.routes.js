// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import MenuController from './menu.controller.js';

// 2. Initialize Express router.
const menuRouter = express.Router();

const menuController = new MenuController();

menuRouter.get(
  '/:id',
  (req, res, next)=>{
    menuController.getMenu(req, res, next)
} );

export default menuRouter;
