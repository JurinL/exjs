const mongoose = require("mongoose");
const { Schema } = mongoose;
var id_implement = require("mongoose-sequence")(mongoose);

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

orderSchema.plugin(id_implement, {inc_field: 'orderId'});
module.exports = mongoose.model("orders", orderSchema);
