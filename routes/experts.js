const express = require("express");
const Expert = require("../models/Expert");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let experts = await Expert.find();
    res.status(200).json(experts);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

router.post("/createExpert", async (req, res) => {
  let success = false;
  console.log("req sign up > ", req.body);
  let { email, password } = req.body;

  // Check Weather the user with this email exits already
  // console.log("req>", req.body);
  try {
    let user = await Expert.findOne({ email: email });
    let user2 = await User.findOne({ email: email });
    if (user || user2) {
      return res.status(200).send("Sorry a user with email already exits");
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hash(password, salt);
    // console.log("password>>", secPass);
    console.log("all set man");
    let expert = await Expert.create(req.body);

    const data = {
      expert: {
        id: expert.id,
      },
    };

    //res.json(user)
    success = true;
    res.json({ success, expert });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
