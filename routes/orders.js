var express = require("express");
var router = express.Router();
var orderSchema = require("../models/order.model");
var productSchema = require("../models/product.model")

// GET all orders
router.get("/", async function (req, res, next) {
  let orders = await orderSchema.find({});
  res.send(orders);
});

//Get order by orderId
router.get("/:orderId", async function (req, res, next) {
  try {
    const order = await orderSchema.findOne({
      orderId: req.params.orderId,
    });
    if (!order) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
      });
    }
    return res.status(200).send({
      data: order,
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

// Create order Data
router.post("/", async function (req, res, next) {
  const { buyer_name, products } = req.body;
  
  const neworder = new orderSchema({
    buyer_name,
    products,
  });

  try {
    await neworder.save();
    res.status(201).send(neworder);
  } catch (error) {
    res.status(400).send(error);
  }
  const product = await productSchema.findOne({
    productName: req.params.products.productName,
  });
  if (!product) {
    return res.status(400).send({
      message: "id Invalid",
      success: false,
    });
  }
});

module.exports = router;
