const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  orderDate: Date,
  status: String
});

module.exports = mongoose.model("orders", orderSchema);
