const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const e = require("express");
// const faceApiService = require('./faceapiService');

var request = require("request");

const model = require("../../utils/models");
const utility = require("../../utils/utility");

pool.on("error", (err) => {
  console.error(err);
});
require("dotenv").config();

var ipServer = process.env.API_URL;
module.exports = {
  async cabang(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.headers.em_id;

    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction;
      const [results] = await conn.query(
        `SELECT * FROM employee WHERE em_id='${emId}'`
      );
      var branchidSplit = "".split(",");
      var emIds = "";

      for (var i = 0; i <= branchidSplit.length; i++) {
        emIds = `${emIds}"${branchidSplit[i]}",`;
      }
      var newEmids = "";

      if (emIds == "") {
        newEmids = `${results[0].branch_id}`;
      } else {
        newEmids = `${emIds}`.slice(0, -1);
      }

      const [branch] = await conn.query(`
                 SELECT * FROM branch WHERE code IN(${results[0].branch_access})
                 `);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Succsefully get branch",
        data: branch,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error ouy", e);
      return res.status(400).send({
        status: false,
        message: "ERRoe",
      });
    } finally {
      if (conn) await conn.release();
    }
  },
};
