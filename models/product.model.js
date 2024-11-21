const mongoose = require("mongoose");
const { Schema } = mongoose;
var id_implement = require("mongoose-sequence")(mongoose)

const productSchema = new Schema({
  productId: {
    type: Number,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
});

productSchema.plugin(id_implement,{id:"productId",inc_field:"productId"});

const Product = mongoose.model("products", productSchema);

module.exports = Product;
