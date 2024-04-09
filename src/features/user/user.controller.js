import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
  }
})

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
      const { email, password, } = req.body;

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

  async userOtpSend(req, res) {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }


    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email: email });


            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:- ${OTP}`
                }


                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })

            } else {

                const saveOtpData = new userotp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Eamil For Otp Validation",
                    text: `OTP:- ${OTP}`
                }

                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            }
        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}

async  signIn2(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ error: "Please enter your OTP and email" });
    }

    const otpVerification = await userotp.findOne({ email: email });

    if (otpVerification && otpVerification.otp === otp) {
      const user = await users.findOne({ email: email });

      if (user) {
        const token = jwt.sign(
          {
            userID: user._id,
            email: user.email,
          },
          'AIb6d35fvJM4O9pXqXQNla2jBCH9kuLz', 
          {
            expiresIn: '1h', // 
          }
        );

        
        const response = {
          userID: user._id,
          name: user.name, 
          email: user.email,
          token: token,
        };

        return res.status(200).json(response);
      } else {
        return res.status(400).json({ error: 'Incorrect credentials' });
      }
    } else {
      return res.status(400).json({ error: 'OTP verification failed' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

}
