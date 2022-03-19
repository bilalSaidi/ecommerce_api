const router = require("express").Router();
const User = require("../model/user_model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register

router.post("/register", async (req, res) => {
  //Hash the password and retype password
  const user_pass = CryptoJS.AES.encrypt(
    req.body.password,
    process.env.SECRET_KEY
  ).toString();
  // Create New User
  const user_repass = CryptoJS.AES.encrypt(
    req.body.retypepassword,
    process.env.SECRET_KEY
  ).toString();
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: user_pass,
    retypepassword: user_repass,
    isAdmin: req.body.isAdmin,
  });

  try {
    const exist_email = await User.findOne({ email: req.body.email });
    const exist_username = await User.findOne({ username: req.body.username });

    if (exist_email) {
      // check for existing email
      res.status(500).json("Email Already Have An Acount");
      console.log("email yes");
    } else if (exist_username) {
      // check for existing username
      res
        .status(500)
        .json("acount with username already exist try another one ");
    } else if (req.body.password !== req.body.retypepassword) {
      // check for password and retype password
      res.status(500).json("password and retype password must be equals");
    } else if (
      !exist_email &&
      !exist_username &&
      req.body.password === req.body.retypepassword
    ) {
      // Save The User in The Data Base
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const textpass = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      if (textpass !== req.body.password) {
        res.status(401).json("Wrong Credentials !");
      } else {
        const { password, retypepassword, ...sendinfoUser } = user._doc;
        const accessToken = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
          },
          process.env.SECRET_JWT,
          { expiresIn: "15d" }
        );
        res.status(200).json({ accessToken, ...sendinfoUser });
      }
    } else {
      res.status(401).json("Wrong Credentials !");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
