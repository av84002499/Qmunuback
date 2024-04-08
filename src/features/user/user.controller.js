import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "av96165607@gmail.com",
    pass: "uycn wsus scis cari",
  },
});

export default class UserController {

  constructor() {
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res, next) {
    const { newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    const userID = req.userID;
    try {
      await this.userRepository.resetPassword(userID, hashedPassword)
      res.status(200).send("Password is updated");
    } catch (err) {
      console.log(err);
      console.log("Passing error to middleware");
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return res.status(400).send('Incorrect Credentials');
      } 

      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign(
          {
            userID: user._id,
            email: user.email,
          },
          'YourSecretKey', // Use your own secret key for JWT
          {
            expiresIn: '1h',
          }
        );

        const response = {
          userID: user._id,
          name: user.name,
          email: user.email,
          token: token,
        }

        return res.status(200).send(response);
      } else {
        return res.status(400).send('Incorrect Credentials');
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  }

  async signUp(req, res, next) {
    const {
      name,
      email,
      password,
      type,
    } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new UserModel(
        name,
        email,
        hashedPassword,
        type
      );
      await this.userRepository.signUp(user);

      // Send confirmation email with link
      await this.sendConfirmationEmail(email, user._id);

      res.status(201).send({ message: 'Signup successful. Please check your email for confirmation.' });
    } catch (err) {
      next(err);
    }
  }

  async  verification (req, res, next) {
    const token = req.params.token;
    try {
      // Find the user by the verification token
      const user = await this.userRepository.findByVerificationToken(token);
      if (!user) {
        return res.status(400).send({ message: 'Invalid or expired token.' });
      }
      // Update user's account status to verified
      user.verified = true;
      await this.userRepository.updateUser(user);
      // Optionally: Redirect the user to a page confirming successful verification
      res.redirect('/verified');
    } catch (err) {
      next(err);
    }
  };

  async signUp(req, res, next) {
    const { name, email, password, type } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const verificationToken = generateVerificationToken(); // Implement this function
      const user = new UserModel(name, email, hashedPassword, type, verificationToken);
      await this.userRepository.signUp(user);
  
      // Send confirmation email with verification link
      const verificationLink = `${req.protocol}://${req.get('host')}/verify/${verificationToken}`;
      await this.sendConfirmationEmail(email, verificationLink);
  
      res.status(201).send({ message: 'Signup successful. Please check your email for confirmation.' });
    } catch (err) {
      next(err);
    }
  }
  
  async sendConfirmationEmail(email, verificationLink) {
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
      to: email,
      subject: 'Account Verification',
      html: `<p>Please click <a href="${verificationLink}">here</a> to verify your account.</p>`,
    });
    console.log("Message sent: %s", info.messageId);
  }
}
