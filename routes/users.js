var express = require("express");
var router = express.Router();
var User = require("../models/user.model");
const bcrypt = require("bcrypt");

// GET all users
router.get("/", async function (req, res, next) {
  let users = await User.find({});
  res.send(users);
});

// Get user by Id
router.get("/:id", async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send({
        message: "id Invalid",
        success: false,
      });
    }
    return res.status(200).send({
      data: user,
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

// Create User
router.post("/", async function (req, res, next) {
  const { username, password, name, surname, age, sex } = req.body;
  //const userId = await getNextSequenceValue("userId");
  const newUser = new User({
    username,
    password:await bcrypt.hash(password,10),
    name,
    surname,
    age,
    sex,
  });

  try {
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Update User data
router.put("/:id", async function (req, res, next) {
  let { name, surname, age, sex } = req.body;

  let user = await User.findByIdAndUpdate(
    req.params.id,
    { name, surname, age, sex },
    { new: true }
  );
  res.send(user);
});

// Delete User
router.delete("/:id", async function (req, res, next) {
  let user = await User.findByIdAndDelete(req.params.id);
  res.send(user);
});

module.exports = router;
