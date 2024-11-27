var express = require("express");
var router = express.Router();
var productSchema = require("../models/product.model");

// GET all products
router.get("/", async function (req, res, next) {
  let products = await productSchema.find({});
  res.send(products);
});

//Get product by productId
router.get("/:id", async function (req, res, next) {
  try {
    const product = await productSchema.findById(req.params.id);
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
    if (newProduct.price < 0 || newProduct.stock < 0) {
      return res
        .status(400)
        .send({ error: "Product price or stock can't be lower than 1" });
    }
    await newProduct.save();
    res
      .status(201)
      .send({ message: "Create Product Success!", data: newProduct });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update product data
router.put("/:id", async function (req, res, next) {
  let { productName, description, price, stock } = req.body;

  let product = await productSchema.findByIdAndUpdate(
    req.params.id,
    { productName, description, price, stock },
    { new: true }
  );
  res.send(product);
});

// Delete product
router.delete("/:id", async function (req, res, next) {
  let product = await productSchema.findByIdAndDelete(req.params.id);

  res.send(product);
});

module.exports = router;
