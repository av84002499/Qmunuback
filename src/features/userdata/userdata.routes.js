import express from "express";
import userdataController from "./userdata.controller.js";

const userdataRouter = express.Router();
const controller = new userdataController(); // Renamed to avoid conflict

userdataRouter.post("/", (req, res) => {
  controller.manageuserdata(req, res);
});

userdataRouter.post("/getuserdata", (req, res) => {
  controller.getUserDatas(req, res);
});

userdataRouter.delete("/:id", (req, res, next) => {
  controller.delete(req, res, next);
});

export default userdataRouter;
