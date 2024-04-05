import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  static async getAll() {
    try {
      const db = await getDB();
      return await db.collection("users").find({}).toArray();
    } catch (error) {
      throw new ApplicationError("Error fetching users", 500);
    }
  }
}
