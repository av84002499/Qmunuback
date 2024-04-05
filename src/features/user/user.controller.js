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

      // Send confirmation email with link
      await this.sendConfirmationEmail(email, user._id);

      res.status(201).send({ message: 'Signup successful. Please check your email for confirmation.' });
    } catch (err) {
      next(err);
    }
}

async confirmSignUp(req, res, next) {
  const { token } = req.query;
  try {
      const decoded = jwt.verify(token, 'yAIb6d35fvJM4O9pXqXQNla2jBCH9kuLz');
      const userId = decoded.userId;
      // Assuming you have a method to update the user's status in the database to indicate that the email is confirmed
      await this.userRepository.confirmEmail(userId);
      const { email } = await this.userRepository.getUserById(userId); // Assuming you have a method to get user details by userId
      const confirmationLink = `https://new-sage-nine.vercel.app/userprofile?email=${encodeURIComponent(email)}`; // Construct the confirmation link with email as query parameter
      res.redirect(confirmationLink); // Redirect to user profile page with email as query parameter
  } catch (err) {
      next(err);
  }
}

// Assuming this method is called when the user clicks the confirmation link
async handleConfirmationLink(req, res, next) {
  const { email } = req.query;
  try {
      // Auto-login logic here using the provided email and possibly password
      // Redirect the user to their profile page after successful login
      res.redirect(`https://new-sage-nine.vercel.app/userprofile?email=${encodeURIComponent(email)}`);
  } catch (err) {
      next(err);
  }
}


async sendConfirmationEmail(email, userId) {
    const token = jwt.sign({ userId }, 'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz', { expiresIn: '1h' }); // Create a token containing user ID
    const confirmationLink = `https://new-sage-nine.vercel.app/Signin`; // Construct the confirmation link

    // Send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // Sender address
        to: email, // Receiver address
        subject: 'Welcome to Our Website', // Subject line
        text: `Thank you for registering with us! Please click on the following link to complete your registration: ${confirmationLink}`, // Plain text body
        html: `<b>Thank you for registering with us!</b> Please click <a href="${confirmationLink}">here</a> to complete your registration.`, // HTML body
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
