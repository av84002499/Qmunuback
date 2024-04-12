// Manage routes/paths to ProductController

// 1. Import express.
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// 2. Initialize Express router.
const userRouter = express.Router();

const userController = new UserController();

// All the paths to controller methods.

userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.post("/signinWithOTP", (req, res) => {
  userController.signInWithOTP(req, res);
});

userRouter.put("/resetPassword", jwtAuth, (req, res, next) => {
  userController.resetPassword(req, res, next);
});
userRouter.post("/resetPasswordWithOTP", (req, res, next) => {
  userController.resetPasswordWithOTP(req, res, next);
});

userRouter.post("/sendotp", (req, res, next) => {
  userController.sendOtp(req, res, next);
});

export default userRouter;
