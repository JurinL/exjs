var express = require("express");
var router = express.Router();
const Users = require("../models/user.model");
const bcrypt = require("bcrypt");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", async function (req, res, next) {
  try {
    let { password, username } = req.body;
    let user = await Users.findOne({
      username: username,
    });
    if (!user) {
      return res.status(500).send({
        message: "login fail",
        success: false,
      });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(500).send({
        message: "login fail",
        success: false,
      });
    }
    const { userId, name, surname, age, sex } = user;
    return res.status(201).send({
      data: { userId, name, surname, age, sex },
      message: "login success",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: "login fail",
      success: false,
    });
  }
});

module.exports = router;
