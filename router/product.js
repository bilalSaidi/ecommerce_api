const router = require("express").Router();
const Product = require("../model/product_model");
const { VerifyTokenAndAdmin } = require("./checkToken");

// Add New Product

router.post("/", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const saveProduct = await new Product(req.body).save();
    res.status(200).json(saveProduct);
  } catch (err) {
    res.status(501).json(err);
  }
});

// UPDATE PRODUCT

router.put("/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(501).json(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(501).json(err);
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json(allProducts);
  } catch (err) {
    res.status(501).json(err);
  }
});
// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const singleProduct = await Product.findById(req.params.id);
    res.status(200).json(singleProduct);
  } catch (err) {
    res.status(501).json(err);
  }
});
module.exports = router;
