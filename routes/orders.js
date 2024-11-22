var express = require("express");
var router = express.Router();
var orderSchema = require("../models/order.model");
var productSchema = require("../models/product.model");

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
  const { products } = req.body;
  try {
    let FoundAllProduct = true;
    let HaveStock = true;
    let NotFound = [];
    let NoStock = [];
    for (const item of products) {
      const product = await productSchema.findOne({
        productName: item.productName,
      });
      if (!product) {
        FoundAllProduct = false;
        NotFound.push(item.productName);
        continue;
      }
      if (item.amount < 1) {
        return res
          .status(400)
          .send({ error: `Amount of product can't be lower than 0` });
      }
      if (product.stock < item.amount) {
        HaveStock = false;
        NoStock.push(
          `Not enough stock for product ${item.productName}. There are only ${product.stock} left.`
        );
      }
    }
    if (FoundAllProduct == false) {
      return res.status(404).send({
        message: "Please check again if productName is Correct.",
        error: `Product with name ${NotFound} not found`,
      });
    }
    if (HaveStock == false) {
      return res
        .status(400)
        .send({ message: `Please Create Order Again.`, error: NoStock });
    }

    // Create the order
    const newOrder = new orderSchema({ products });
    await newOrder.save();

    // Update the stock for each product
    for (const item of products) {
      const product = await productSchema.findOne({
        productName: item.productName,
      });
      product.stock -= item.amount;
      await product.save();
    }

    res.status(201).send(newOrder);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
