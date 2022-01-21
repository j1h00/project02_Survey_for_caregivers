const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { logo_upload } = require("../utils/multer");
const { pool } = require("../utils/mysql");
const { logger } = require("../utils/winston");
const { nameParser } = require("../utils/nameParser");
const { verifyToken } = require("../utils/jwt");

// const createRandomNumber = () => {
//   return Math.floor(Math.random() * 10000000) % 1000000;
// };

router.post("/join", logo_upload.single("logo_image"), async (req, res) => {
  const logo_rename = Date.now() + req.body.logo_name;
  const logo_path = "uploads/" + logo_rename;

  const { email, password, name, business_number, phone } = req.body;

  nameParser("uploads", "uploads", req.body.logo_name, logo_rename);

  // fs.rename("uploads/" + req.body.logo_name, "uploads/" + logo_rename, (err) =>{
  //   if(err){
  //     logger.error("Fail Rename" + err);
  //   }
  // });

  try {
    if (req.body.logo_name) {
      const sql = `INSERT INTO hospital_info ( email, password, name, business_number, phone, logo_image) VALUES(?, ?, ?, ?, ?, ?);`;
      const data = await pool.query(sql, [
        email,
        password,
        name,
        business_number,
        phone,
        logo_path,
      ]);
    } else {
      const sql = `INSERT INTO hospital_info ( email, password, name, business_number, phone) VALUES(?, ?, ?, ?, ?);`;
      const data = await pool.query(sql, [email, password, name, business_number, phone]);
    }
    logger.info("GET /join");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("POST /join Error" + error);
    return res.json(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const sql = `SELECT id, email, password, code FROM hospital_info WHERE email=?`;
    const data = await pool.query(sql, [email]);
    const UserId = data[0][0].id;
    const code = data[0][0].code;
    const hashedPassword = await hashPassword(data[0][0].password);
    const compareResult = await comparePassword(password, hashedPassword);
    if (!data[0][0]) {
      logger.info("[INFO] POST /login");
      return res.json({ result: "인증키 발급실패 : 존재하지 않는 아이디 입니다." });
    }
    if (!compareResult) {
      logger.info("[INFO] POST /login");
      return res.json({ result: "인증키 발급실패 : 비밀번호를 확인해 주세요." });
    }
    const token = jwt.sign(
      {
        id: UserId,
      },
      "ssafy",
      { expiresIn: "24h" }
    );
    // console.log(token);
    logger.info("[INFO] POST /login");
    return res.json({ result: "ok", id: UserId, code: code, token: token });
  } catch (error) {
    logger.error("POST /login Error" + error);
    console.log("POST /login Error" + error);
    return res.json(error);
  }
});

router.post("/emailCheck", async (req, res) => {
  const email = req.body.email;
  try {
    const sql = `SELECT EXISTS(SELECT * FROM hospital_info where email = ? ) as isHava;`;
    const data = await pool.query(sql, [email]);
    console.log(data[0][0].isHava);
    if (data[0][0].isHava == 1) {
      logger.info("[INFO] POST /emailCheck");
      return res.json({ result: "notok" });
    } else {
      logger.info("[INFO] POST /emailCheck");
      return res.json({ result: "ok" });
    }
  } catch (error) {
    logger.error("POST /emailCheck Error" + error);
    console.log("POST /emailCheck Error" + error);
    return res.json(error);
  }
});

router.post("/bnNumberCheck", async (req, res) => {
  const business_number = req.body.business_number;
  try {
    const sql = `SELECT EXISTS(SELECT * FROM hospital_info where business_number = ? ) as isHava;`;
    const data = await pool.query(sql, [business_number]);
    console.log(data[0][0].isHava);
    if (data[0][0].isHava == 1) {
      logger.info("[INFO] POST /bnNumberCheck");
      return res.json({ result: "notok" });
    } else {
      logger.info("[INFO] POST /bnNumberCheck");
      return res.json({ result: "ok" });
    }
  } catch (error) {
    logger.error("POST /bnNumberCheck Error" + error);
    console.log("POST /bnNumberCheck Error" + error);
    return res.json(error);
  }
});

module.exports = router;
