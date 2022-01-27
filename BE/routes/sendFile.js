const express = require("express");
const fs = require("fs");
const path = require("path");

const { pool } = require("../utils/mysql");
const { logger } = require("../utils/winston");
const { service_upload } = require("../utils/multer");
const { nameParser } = require("../utils/nameParser");

const router = express.Router();

router.post("/image/:image", async (req, res) => {
  const image = req.params.image;
  res.sendFile(path.join(__dirname, "../" + image));
  //   res.sendFile(path.join(__dirname, "../uploads/service/flower.png"));
});

module.exports = router;
