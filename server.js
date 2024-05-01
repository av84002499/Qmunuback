import express from 'express';
import swagger from 'swagger-ui-express';
import dotenv from "dotenv";
import menuRouter from './src/features/menu/menu.routes.js'
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import uploadRouter from './src/features/upload/upload.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import apiDocs from './swagger.json' assert { type: 'json' };
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import userdataRouter from './src/features/userdata/userdata.routes.js'; // Corrected import
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = express();
dotenv.config();

server.use((req, res, next) => {
   res.header(
    'Access-Control-Allow-Origin',
      'http://localhost:3000'
  );
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method == 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

server.use(express.json());
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use('/api/userdata', jwtAuth, userdataRouter); // Corrected middleware usage
server.use('/api/products', jwtAuth, productRouter);
server.use('/api/users', userRouter);
server.use('/api/menu', menuRouter);
server.use('/api/upload', uploadRouter);

server.get('/', (req, res) => {
  res.send('Quick Catalog APIs');
});

server.get("/uploads/:img", (req, res) => {
  const img = req.params.img;
  const filePath = path.join(__dirname, "./uploads", img);
  res.sendFile(filePath);
});

server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError){
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }
  res.status(500).send('Something went wrong, please try later');
});

server.use((req, res) => {
  res.status(404).send('API not found. Please check our documentation for more information at localhost:3200/api-docs');
});

server.listen(3200, () => {
  console.log('Server is running at 3200');
  connectUsingMongoose();
});
