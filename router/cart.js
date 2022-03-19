const router = require("express").Router();
const Cart = require("../model/cart_model");
const {
  VerifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("./checkToken");

// Add New Cart [Any User Can Create Cart ]

router.post("/", verifyToken, async (req, res) => {
  try {
    const saveCart = await new Cart(req.body).save();
    res.status(200).json(saveCart);
  } catch (err) {
    res.status(501).json(err);
  }
});

// User Can Update Delete See Only Cart That Belongs To Him
// UPDATE Cart

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(501).json(err);
  }
});

// DELETE Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    console.log(req.params.id);
    res.status(200).json(deletedCart);
  } catch (err) {
    res.status(501).json(err);
  }
});

// GET User Cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userCart = await Cart.find({ userId: req.params.userId });
    res.status(200).json(userCart);
  } catch (err) {
    res.status(501).json(err);
  }
});
// GET All Carts [Only Admin Allowedd ]
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(501).json(err);
  }
});
module.exports = router;
