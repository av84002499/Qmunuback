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
  
      // Send confirmation email
      await this.sendConfirmationEmail(email);
  
      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }
  
  async sendConfirmationEmail(email) {
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // Sender address
      to: email, // Receiver address
      subject: 'Welcome to Our Website', // Subject line
      text: 'Thank you for registering with us!', // Plain text body
      html: '<b>Thank you for registering with us!</b>', // HTML body
    });
  
    console.log('Confirmation email sent to:', email);
    console.log('Message sent: %s', info.messageId);
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
          'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',
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
}
