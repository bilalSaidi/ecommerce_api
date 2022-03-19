const router = require("express").Router();
const Order = require("../model/order_model");
const {
  VerifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./checkToken");

// Create Order

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orderCreated = await new Order(req.body).save();
    res.status(200).json(orderCreated);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE Order [Only Admin Allowed To Update The Order]

router.put("/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(501).json(err);
  }
});

// DELETE Order [Only Admin Allowed To Delete The Order ]
router.delete("/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedOrder);
  } catch (err) {
    res.status(501).json(err);
  }
});

// GET All Orders [Only Admin Allowedd ]
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(501).json(err);
  }
});
// GET User Order
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const userOrder = await Order.find({ userId: req.params.userId });
    res.status(200).json(userOrder);
  } catch (err) {
    res.status(501).json(err);
  }
});

// Get Monthly Incom [Only Admin Allowed ]
router.get("/incom", VerifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(lastMonth.setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      { $project: { month: { $month: "$createdAt" }, sales: "$amount" } },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);
  } catch (err) {
    res.status(501).json(err);
  }
});
module.exports = router;
