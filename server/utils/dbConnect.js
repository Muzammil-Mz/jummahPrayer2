import config from "config";
import mongoose from "mongoose";

const  dbConnect = async () => {
  try {
   
    await mongoose.connect(config.get("DB_URL"));
    console.log("db connected successfully");
  } catch (error) {
    console.log(error);
  }
};

dbConnect();
