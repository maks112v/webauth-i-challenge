const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../dbconfig");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "yay" });
});

router.get("/other", (req, res) => {
  res.status(200).json({ message: "Something else" });
});

module.exports = router;
