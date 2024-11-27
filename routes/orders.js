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
router.get("/:id", async function (req, res, next) {
  try {
    const order = await orderSchema.findById(req.params.id);
    if (!order) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
      });
    }
    return res.status(200).send(order);
  } catch (error) {
    return res.status(500).send({
      message: "server error",
      success: false,
    });
  }
});

// Get products from specific order
router.get("/:id/products", async function (req, res, next) {
  try {
    const order = await orderSchema.findById(req.params.id);
    if (!order) {
      return res.status(404).send({
        message: "Order not found",
        success: false,
      });
    }

    const productDetails = [];
    for (const item of order.items) {
      const product = await productSchema.findOne({ productName: item.productName });
      if (product) {
        productDetails.push({
          productName: product.productName,
          quantity: item.quantity,
          price: product.price,
          subtotal: product.price * item.quantity
        });
      }
    }

    return res.status(200).send(productDetails);
  } catch (error) {
    return res.status(500).send({
      message: "Server error",
      error: error.message,
      success: false,
    });
  }
});

// Enhanced POST endpoint for Vue.js frontend
router.post("/", async function (req, res, next) {
  try {
    let FoundAllProduct = true;
    let HaveStock = true;
    let NotFound = [];
    let NoStock = [];
    
    // Destructure data from Vue.js frontend
    const { items, totalAmount } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).send({
        message: "Invalid order format. Items array is required",
        success: false
      });
    }

    // Validate each product
    for (const item of items) {
      const product = await productSchema.findOne({
        productName: item.productName,
      });
      
      if (!product) {
        FoundAllProduct = false;
        NotFound.push(item.productName);
        continue;
      }

      if (item.quantity < 1) {
        return res.status(400).send({ 
          message: "Invalid quantity",
          error: `Amount of product can't be lower than 0`,
          success: false
        });
      }

      if (product.stock < item.quantity) {
        HaveStock = false;
        NoStock.push(
          `Not enough stock for product ${item.productName}. There are only ${product.stock} left.`
        );
      }
    }

    if (!FoundAllProduct) {
      return res.status(404).send({
        message: "Please check again if productName is Correct.",
        error: `Product with name ${NotFound} not found`,
        success: false
      });
    }

    if (!HaveStock) {
      return res.status(400).send({ 
        message: `Please Create Order Again.`, 
        error: NoStock,
        success: false 
      });
    }

    // Create order object with frontend data
    const orderData = {
      items,
      totalAmount,
      orderDate: new Date(),
      status: 'pending'
    };

    // Save the order
    const order = new orderSchema(orderData);
    const savedOrder = await order.save();

    // Update product stock
    // for (const item of items) {
    //   const product = await productSchema.findOne({
    //     productName: item.productName,
    //   });
    //   product.stock -= item.quantity;
    //   await product.save();
    // }

    res.status(201).send({
      data: savedOrder,
      message: "Order created successfully",
      success: true
    });
    
  } catch (error) {
    res.status(500).send({
      message: "Error creating order",
      error: error.message,
      success: false
    });
  }
});

module.exports = router;
