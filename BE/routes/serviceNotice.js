const express = require("express");
const fs = require("fs");
const path = require("path");

const { pool } = require("../utils/mysql");
const { logger } = require("../utils/winston");
const { service_upload } = require("../utils/multer");
const { nameParser } = require("../utils/nameParser");

const router = express.Router();

// service_notice write.
router.post("/service", service_upload.single("service_notice_image"), async (req, res) => {
  const { title, context, fixed, attachment } = req.body;
  const rename = Date() + attachment;
  const path = "uploads/service/" + rename;

  try {
    if (req.body.attachment) {
      nameParser("uploads/service", "uploads/service", attachment, rename);
      const sql = `INSERT INTO service_notice ( title, context, fixed, attachment) VALUES(?, ?, ?, ?);`;
      const data = await pool.query(sql, [title, context, fixed, path]);
    } else {
      const sql = `INSERT INTO service_notice ( title, context, fixed) VALUES(?, ?, ?);`;
      const data = await pool.query(sql, [title, context, fixed]);
    }
    logger.info("[INFO] POST /service_notice/write");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("POST /insert Error" + error);
    return res.json(error);
  }
});

// service_notice update.

// params로 id 받는 방식
// router.put("/:id", upload.single("attachment"), async (req, res) => {
// const id = req.params.id;
// json객체로 id 받는 방식
router.put("/service/:id", service_upload.single("service_notice_image"), async (req, res) => {
  const id = req.params.id;
  const { title, context, fixed, attachment } = req.body;
  const rename = Date() + attachment;
  const path = "uploads/service/" + rename;
  try {
    if (req.body.attachment) {
      nameParser("uploads/service", "uploads/service", attachment, rename);
      const sql = `UPDATE service_notice SET title=?, context=?, fixed=?, attachment=? WHERE id=?;`;
      const data = await pool.query(sql, [title, context, fixed, path, id]);
    } else {
      const sql = `UPDATE service_notice SET title=?, context=?, fixed=? WHERE id=?;`;
      const data = await pool.query(sql, [title, context, fixed, id]);
    }
    logger.info("[INFO] PATCH /service_notice/update");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("POST /update Error" + error);
    return res.json(error);
  }
});

// service_notice delete
router.delete("/service/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const sql = `DELETE FROM service_notice WHERE id=?;`;
    const data = await pool.query(sql, [id]);

    logger.info("[INFO] DELETE /service_notice/delete");
    return res.json({ result: "ok" });
  } catch (error) {
    logger.error("GET /delete Error" + error);
    return res.json(error);
  }
});

// service_notice Detail
router.get("/service/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const sql = `SELECT * FROM service_notice WHERE ID = ?;`;
    const data = await pool.query(sql, [id]);
    const result = data[0];

    // 첨부 파일은 어떻게 보내야할까..?

    logger.info("[INFO] GET /service_notice/detail");
    return res.json(result);
  } catch (error) {
    logger.error("GET /select Error" + error);
    return res.json(error);
  }
});

// service_notice list

router.get("/service", async (req, res) => {
  try {
    // front에서 필요한 부분만 보내도록 쿼리 수정가능

    // const { page } = req.query;
    const sql = `SELECT * FROM service_notice;`;
    const data = await pool.query(sql);
    // const result = data[0].slice((page - 1) * 10, page * 10);
    const result = data[0];

    logger.info("[INFO] GET /service_notice/list");
    return res.json(result);
  } catch (error) {
    logger.error("GET /select Error" + error);
    return res.json(error);
  }
});

router.get("/service/:id/download", async (req, res) => {
  const id = req.params.id;

  try {
    const sql = `SELECT attachment FROM service_notice WHERE id=?`;
    const data = await pool.query(sql, [id]);
    const filepath = data[0][0].attachment;

    console.log(filepath);

    logger.info("GET /service_notice/:id/download Success");
    return res.download(path.join(__dirname, filepath));
  } catch (error) {
    logger.error("GET Fail " + error);
    return res.send("Fail");
  }
});

module.exports = router;
