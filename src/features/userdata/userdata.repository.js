import mongoose from "mongoose";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { userdataschema } from "./userdata.schema.js";

const userdataModel = mongoose.model("userdata", userdataschema);

class userdataRepository {
  constructor() {
    this.collection = "userdatas";
  }

  async getOne(userId) {
    try {
      const userdatas = await userdataModel.findOne({ userId });
      return userdatas;
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async delete(userdataId) {
    try {
      const deleteduserdata = await userdataModel.findByIdAndDelete(userdataId);
      return deleteduserdata;
    } catch (err) {
      throw err;
    }
  }

  async manageUserData(userdata) {
    try {
      // const userdata = req.body;
      // console.log('Data coming from put is:', userdata);
      const userId = userdata.userId;
      var userData = await userdataModel.findOne({ userId });

      // If user data is not found, return 404 Not Found
      if (!userData) {
        userData = new userdataModel(userdata);
      } else {
        // Update the user data fields
        for (const key in userdata) {
          if (userData[key] != userdata[key]) {
            userData[key] = userdata[key];
          }
        }
      }

      // Save the updated user data
      const updatedUserData = await userData.save();

      // Send the updated user data as response
      return updatedUserData;
    } catch (err) {
      throw err;
    }
  }

  async manageShopImg(userdata) {
    try {
      // const userdata = req.body;
      console.log("Data coming from put is:", userdata);
      const userId = userdata.userId;
      const userData = await userdataModel.findOne({ userId });
      // If user data is not found, return 404 Not Found
      if (!userData) {
        return "User Data Not Found";
      }
      userData["imageUrl"] = userdata["imageUrl"];
      const updatedUserData = await userData.save();

      return updatedUserData;
    } catch (err) {
      throw err;
    }
  }
}

export default userdataRepository;
