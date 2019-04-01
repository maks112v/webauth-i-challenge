const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../dbconfig");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "yay" });
});

router.post("/", async (req, res) => {
  
});

router.post("/", async (req, res) => {
  try {
    let user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    console.log(user.password);
    const result = await db('users').insert(req.body);
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json(error)
  }
});

module.exports = router;
