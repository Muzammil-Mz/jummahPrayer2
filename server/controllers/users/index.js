import userModel from "../../Models/Users/Users.js";
import express from "express";
const router = express.Router();

router.get("/getall", async (req, res) => {
  try {
    let getall = await userModel.find({});
    res.status(200).json(getall);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/getone/:id", async (req, res) => {
  try {
    let params = req.params.id;
    let getone = await userModel.findOne({ _id: params });
    res.status(200).json(getone);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    let userinput = req.body;
    let params = req.params.id;
    await userModel.updateOne({ _id: params }, { $set: userinput });
    res.status(200).json({ msg: "data updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/deleteone/:id", async (req, res) => {
  try {
    let params = req.params.id;
    let deleted = await userModel.deleteOne({ _id: params });
    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.delete("/deleteall", async (req, res) => {
  try {
    let del = await userModel.deleteMany({});
    res.status(200).json({ del });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/adduser", async (req, res) => {
  try {
    let add = req.body;
    await userModel.create(add);
    console.log(add);
    res.status(200).json({ msg: "user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
