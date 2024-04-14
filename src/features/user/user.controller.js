import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import UserOtpRepository from "./userOtp.repository.js";
import nodemailer from "nodemailer";

// email config
const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
    this.userOtpRepository = new UserOtpRepository();
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const userID = req.userID;
    try {
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is updated");
    } catch (err) {
      console.log(err);
      console.log("Passing error to middleware");
      next(err);
    }
  }
  
  async signUp(req, res, next) {
    const { name, email, password, type } = req.body;
    try {
      // Check if the email already exists in the database
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).send("Email already exists");
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(name, email, hashedPassword, type);
      await this.userRepository.signUp(user);
  
      // Send email notification
      await tarnsporter.sendMail({
        from: '"Your Name" <your-email@example.com>',
        to: email,
        subject: "Registration Successful",
        text: "You have successfully registered.",

      });
  
      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }
  

  async signIn(req, res, next) {
    try {
      // 1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        // 2. Compare password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // 3. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
            {
              expiresIn: "1h",
            }
          );

          // 4. Create response
          const response = {
            userID: user._id,
            name: user.name,
            email: user.email,
            token: token,
          };
          // 5. Send response.
          return res.status(200).send(response);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async signInWithOTP(req, res, next) {
    try {
      // 1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Email not found");
      } else {
        // 2. Validate OTP
        const { email, otp } = req.body;
        const result = await this.userOtpRepository.validateOtp(email, otp);
        if (result) {
          // 3. Create token.
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            "AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz",
            {
              expiresIn: "1h",
            }
          );

          // 4. Create response
          const response = {
            userID: user._id,
            name: user.name,
            email: user.email,
            token: token,
          };
          // 5. Send response.
          return res.status(200).send(response);
        } else {
          return res.status(400).send("Invalid OTP");
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
  async resetPasswordWithOTP(req, res, next) {
    try {
      console.log(req.body);
      // 1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      if (!user) {
        return res.status(400).send("Email not found");
      } else {
        // 2. Validate OTP
        const { email, otp, newPassword } = req.body;
        const result = await this.userOtpRepository.validateOtp(email, otp);
        console.log("result:", result);
        if (result) {
          const hashedPassword = await bcrypt.hash(newPassword, 12);
          const userID = user._id;
          const response = await this.userRepository.resetPassword(
            userID,
            hashedPassword
          );
          res.status(200).send({ response: "Password is updated" });
        } else {
          return res.status(400).send("Invalid OTP");
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const response = this.userOtpRepository.sendOtp(email);
      if (!response) {
        return res.status(400).send("Invalid Details");
      }
      return res.status(200).send("OTP has been sent to your mail");
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
