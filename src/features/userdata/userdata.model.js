import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

let userdatats = [];

export default class userdatatModel {
  constructor(
    userId,
    shopname,
    address,
    category,
    fcinumber,
    phonenumber1,
    phonenumber2,
    gstnumber,
    aadharnomber,
    imageUrl,
    id
  ) {
    this._id = id;
    this.userId = userId;
    this.shopname = shopname;
    this.category = category;
    this.address = address;
    this.fcinumber = fcinumber;
    this.phonenumber1 = phonenumber1;
    this.phonenumber2 = phonenumber2;
    this.gstnumber = gstnumber;
    this.aadharnomber = aadharnomber;
    this.imageUrl = imageUrl;
  }

  static add(userdatat) {
    userdatat.id = userdatats.length + 1;
    userdatats.push(userdatat);
    return userdatat;
  }

  static get(userId) {
    const userdatat = userdatats.find((i) => i.userId == userId);
    return userdatat;
  }

  static getAll() {
    return userdatats;
  }

  static rateuserdatat(userID, userdatatID, rating) {
    // 1. Validate user and userdatat
    const user = UserModel.getAll().find(
      (u) => u._id == userID // Assuming UserModel returns objects with "_id" property
    );
    if (!user) {
      throw new ApplicationError("User not found", 404);
    }

    const userdatat = userdatats.find((p) => p.userId == userdatatID);
    if (!userdatat) {
      throw new ApplicationError("userdatat not found", 400);
    }

    // 2. Check if the user has already rated the userdatat
    const existingRating = userdatat.ratings.find((r) => r.userID == userID);
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      userdatat.ratings.push({
        userID: userID,
        rating: rating,
      });
    }
  }
}
