var express = require("express");
var router = express.Router();
var productSchema = require("../models/product.model");


// GET all products
router.get("/", async function (req, res, next) {
  let products = await productSchema.find({});
  res.send(products);
});

//Get product by productId
router.get("/:productId", async function (req, res, next) {
  try {
    const product = await productSchema.findOne({
      productId: req.params.productId,
    });
    if (!product) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
      });
    }
    return res.status(200).send({
      data: product,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

// Create Product Data
router.post("/", async function (req, res, next) {
  const { productName, description, price, stock } = req.body;
  const newProduct = new productSchema({
    productName,
    description,
    price,
    stock,
  });

  try {
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update product data
router.put("/:productId", async function (req, res, next) {
  let { productName, description, price, stock } = req.body;

  let product = await productSchema.findOneAndUpdate(
    { productId: req.params.productId },
    { productName, description, price, stock },
    { new: true }
  );
  res.send(product);
});

// Delete product
router.delete("/:productId", async function (req, res, next) {
  let product = await productSchema.findOneAndDelete({ productId: req.params.productId });

  res.send(product);
});

module.exports = router;