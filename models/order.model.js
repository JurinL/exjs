const mongoose = require("mongoose");
const { Schema } = mongoose;
var id_implement = require("mongoose-sequence")(mongoose)

const productordersSchema = new Schema({
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
});

const orderSchema = new Schema(
  {
    orderId: { type: Number, unique: true },
    buyer_name: { type: String },
    products: [productordersSchema],
    total: { type: Number },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(id_implement,{id:"orderId",inc_field:"orderId"});

module.exports = mongoose.model("orders", orderSchema);
