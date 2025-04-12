import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    userVerified: {
      email: {
        type: String,
        default: false,
      },
      phone: {
        type: String,
        default: false,
      },
    },
    userVerifyToken: {
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", usersSchema, "users");
export default userModel;
