import userdataRepository from './userdata.repository.js';

export default class userdataController {

  constructor() {
    this.userdataRepository = new userdataRepository();
  }

  async getUserDatas(req, res) {
    try {
      // console.log(req.body);
      const { userId } = req.body;
      const userdatas = await this.userdataRepository.getOne(userId);
      res.status(200).send(userdatas);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }

  }

  async manageuserdata(req, res, next) {
    try {
      // console.log(req.body);
      const { shopname, address, fcinumber, phonenumber, gstnumber, aadharnumber, userId } = req.body;
      if (!shopname || !address || !fcinumber || !phonenumber || !gstnumber || !aadharnumber || !userId) {
        return res.status(400).send("All fields are required");
      }
      const userdataData = {shopname: shopname, address:address, fcinumber:fcinumber , phonenumber:phonenumber, gstnumber:gstnumber, aadharnumber:aadharnumber, userId:userId};
      const createduserdata = await this.userdataRepository.manageUserData(userdataData);
      res.status(201).send(createduserdata);
    } catch (err) {
      next(err);
    }
  }


  async delete(req, res, next) {
    try {
      const userId = req.params.id;
      const deleteduserdata = await this.userdataRepository.delete(userId);
      res.status(200).send(deleteduserdata);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }
}

