import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { userOtpSchema } from "./userotp.schema.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { ApplicationError } from "../../error-handler/applicationError.js";
dotenv.config();

// email config
const tarnsporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// creating model from schema.
const UserModel = mongoose.model("User", userSchema);
const UserOtpModel = mongoose.model("User OTP", userOtpSchema);

export default class UserOtpRepository {
  async sendOtp(email) {
    try {
      const presuer = await UserModel.findOne({ email: email });

      if (presuer) {
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const existEmail = await UserOtpModel.findOne({ email: email });

        if (existEmail) {
          const updateData = await UserOtpModel.findByIdAndUpdate(
            { _id: existEmail._id },
            {
              otp: OTP,
            },
            { new: true }
          );
          await updateData.save();

          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Sending Eamil For OTP Validation",
            text: `OTP:- ${OTP}`,
          };

          tarnsporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("email not send! error:", error);
            } else {
              console.log("Email sent", info.response);
              return info.response;
            }
          });
        } else {
          const saveOtpData = new UserOtpModel({
            email: email,
            otp: OTP,
          });

          await saveOtpData.save();
          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Sending Eamil For Otp Validation",
            text: `OTP:- ${OTP}`,
          };

          tarnsporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("error", error);
            } else {
              console.log("Email sent", info.response);
              return info.response;
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async validateOtp(email, otp) {
    try {
      if (!otp) {
        return null;
      }
      const userOTP = await UserOtpModel.findOne({
        email: email,
        otp: otp,
      });
      if (userOTP) {
        userOTP.otp = null;
        userOTP.save();
      }
      return userOTP;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
