import UserModel from './user.model.js';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    const { email, password, otp } = req.body;

    if (!email || (!password && !otp)) {
      return res.status(400).json({ error: "Please provide email and either password or OTP" });
    }

    try {
      let user;

      if (password) {
        // Email and password provided, attempt login
        user = await UserModel.findOne({ email });

        if (!user) {
          return res.status(400).send('Incorrect Credentials');
        } 

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
          return res.status(400).send('Incorrect Credentials');
        }
      } else if (otp) {
        // OTP provided, attempt OTP verification
        const otpVerification = await UserOTP.findOne({ email });

        if (!otpVerification || otpVerification.otp !== otp) {
          return res.status(400).json({ error: "Invalid OTP" });
        }

        user = await UserModel.findOne({ email });
        if (!user) {
          return res.status(400).json({ error: "User not found" });
        }
      } else {
        return res.status(400).json({ error: "Please provide password or OTP" });
      }

      // Generate token
      const token = jwt.sign(
        { userID: user._id, email: user.email },
        'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz',
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: "User Login Successfully Done", userToken: token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async userOtpSend(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Please Enter Your Email" })
    }

    try {
      const preuser = await UserModel.findOne({ email });

      if (!preuser) {
        return res.status(400).json({ error: "This User Does Not Exist In Our Database" });
      }

      const OTP = Math.floor(100000 + Math.random() * 900000);

      const existEmail = await UserOTP.findOne({ email });

      if (existEmail) {
        existEmail.otp = OTP;
        await existEmail.save();
      } else {
        const saveOtpData = new UserOTP({
          email,
          otp: OTP
        });
        await saveOtpData.save();
      }

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Sending Email For OTP Validation",
        text: `OTP:- ${OTP}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(400).json({ error: "Email not sent" });
        } else {
          console.log("Email sent", info.response);
          return res.status(200).json({ message: "Email sent Successfully" });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Invalid Details", error });
    }
  }
}
