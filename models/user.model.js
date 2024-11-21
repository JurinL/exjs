const mongoose = require("mongoose");
const { Schema } = mongoose;
var id_implement = require("mongoose-sequence")(mongoose)

const userSchema = new Schema({
  userId: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
});

userSchema.plugin(id_implement,{id:"userId",inc_field:"userId"});

const User = mongoose.model("users", userSchema);

module.exports = User;
