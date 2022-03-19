const router = require("express").Router();
const {
  verifyTokenAndAuthorization,
  VerifyTokenAndAdmin,
} = require("./checkToken");
const User = require("../model/user_model");
// UPDATE USER

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    const { password, retypepassword, ...sendInfoUpdate } = updateUser._doc;
    res.status(200).json(sendInfoUpdate);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE USER

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User Deleted");
  } catch {
    res.status(500).json(err);
  }
});

// GET ALL USERS
router.get("/allusers", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const getUsers = await User.find();
    const sendInfoUsers = [];
    getUsers.forEach((user) => {
      const { password, retypepassword, ...sendInfoUser } = user._doc;
      sendInfoUsers.push(sendInfoUser);
    });
    res.status(200).json(sendInfoUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER STATS
router.get("/statsusers", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const date = new Date();

    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET USER
router.get("/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    const { password, retypepassword, ...sendInfoUser } = getUser._doc;

    res.status(200).json(sendInfoUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
