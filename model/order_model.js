const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [
    { productId: { type: String, required: true } },
    { quantity: { type: Number, required: true } },
  ],
  amount: { type: Number, required: true },
  adress: { type: Object, required: true },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("order", orderSchema);
