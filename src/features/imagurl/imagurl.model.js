import { ApplicationError } from '../../error-handler/applicationError.js';
import UserModel from '../user/user.model.js';

export default class imagurlModel {
  constructor(
    imageUrl,
    prodId,
    userId,
  ) {
    this.imageUrl = imageUrl;
    this.prodId = prodId;
    this.userId = userId;
  }

  static add(imagurl) {
    imagurl.id = imagurls.length + 1;
    imagurls.push(imagurl);
    return imagurl;
  }

  static get(id) {
    const imagurl = imagurls.find(
      (i) => i.id == id
    );
    return imagurl;
  }

  static getAll() {
    return imagurls;
  }

  static rateimagurl(userID, imagurlID, rating) {
    // 1. Validate user and imagurl
    const user = UserModel.getAll().find(
      (u) => u.id == userID
    );
    if (!user) {
      // user-defined error.
      throw new ApplicationError(
        'User not found',
        404
      );
    }

    // Validate imagurl
    const imagurl = imagurls.find(
      (p) => p.id == imagurlID
    );
    if (!imagurl) {
      throw new ApplicationError(
        'imagurl not found',
        400
      );
    }
  }
}

