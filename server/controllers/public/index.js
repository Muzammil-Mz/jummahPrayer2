import express from "express";
import config from "config";
import bcrypt from "bcrypt";
import userModel from "../../Models/Users/Users.js";
import sendSms from "../../utils/sendSms.js";
import sendEmail from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken"
const router = express.Router();
const URL = config.get("SERVER_URL");
const JWT_SECRET = config.get("JWT_SECRET");

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;
    console.log(fullName, email, password, phone);
    const emailFind = await userModel.findOne({ email });
    if (emailFind) {
      return res.status(400).json({ msg: "mail already exists" });
    }
    let hashPass = await bcrypt.hash(password, 10);
    const emailToken = Math.random().toString(36).substring(2);  
    const phoneToken = Math.random().toString(36).substring(2);
    console.log(emailToken, phoneToken);

    const newUser = {
      fullName,
      email,
      phone,
      password: hashPass,
      userVerifyToken: {
        email: emailToken,
        phone: phoneToken,
      },
    };

    await userModel.create(newUser);

    await sendEmail({
      subject: "email Verfication",
      to: email,
      html: `<h1>Click Link below to verify your email</h1>`,
      text: `${URL}/api/public/emailVerify/${emailToken}`,
    });

    let smsData = {
      body: `please verify phone for masjid,${URL}/api/public/phoneverify/${phoneToken}`,
      to: phone,
    };
    sendSms(smsData);

    console.log(`${URL}/api/public/emailverify/${emailToken}`);
    console.log(
      `please verify phone ${URL}/api/public/phoneverify/${phoneToken}`
    );

    res.status(200).json({
      msg: "user registered successfully. please verify phone and email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "invalid credentials" });
    }
    if (!user.userVerified.email) {
      return res.status(400).json({ msg: "please verify your email before logging in" });
    }
    if (!user.userVerified.phone) {
      return res.status(400).json({ msg: "please verify phone before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "invalid credentials" });
    }

    const token = jwt.sign({ user: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ msg: "user logged in successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});


router.get("/emailverify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ "userVerifyToken.email": token });
    if (!user) {
      return res.status(400).json({ msg: "invalid email verfifcation token" });
    }

    user.userVerified.email = true;
    user.userVerifyToken.email = null;
    await user.save();
    res.status(200).json({ msg: "email verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/phoneverify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ "userVerifyToken.phone": token });
    if (!user) {
      return res.status(400).json({ msg: "invalid phone verfication toke" });
    }

    user.userVerified.phone = true;
    user.userVerifyToken.phone = null;
    await user.save();
    res.status(200).json({ msg: "phone verified sccesssfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});
export default router;
