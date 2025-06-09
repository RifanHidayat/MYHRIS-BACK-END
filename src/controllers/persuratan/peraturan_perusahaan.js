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

const table = "peraturan_perusahaan";
const tableDetail = "peraturan_perusahaan_employee";
module.exports = {
  async show(req, res) {
    console.log("-----peraturan perusahaan----------");
    var nama = req.body.nama;
    var emId = req.body.em_id;
    console.log("cek no hp");
    var database = req.query.database;
    var emId = req.headers.em_id;
    var branchId = req.headers.branch_id;
    console.log(req.headers);

    var query = `SELECT * FROM ${table} WHERE  status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids='' AND status='1' 
    AND (   branch_id LIKE '%${branchId
      .toString()
      .padStart(
        2,
        "0"
      )}%'  OR    branch_id LIKE '%${branchId}%' ) AND tanggal_berlaku <= CURDATE()
     `;
    try {
      const connection = await model.createConnection(database);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }
        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }

          connection.query(query, (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "gagal ambil data",
                  data: [],
                });
              });
              return;
            }

            records = results;
            if (records.length == 0) {
              return res.status(400).send({
                status: false,
                message: "Data  tidak ditemukan",
                data: [],
              });
            }

            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "Kombinasi email & password Anda Salah",
                    data: [],
                  });
                });
                return;
              }
              connection.end();
              console.log("Transaction completed successfully!");
              return res.status(200).send({
                status: true,
                message: "Kombinasi email & password Anda Salah",
                data: records,
              });
            });
          });
        });
      });
    } catch (e) {
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    }
  },

  async lastShow(req, res) {
    console.log("-----kirim tidak masuk kerja izin----------");
    var nama = req.body.nama;
    var emId = req.body.em_id;

    console.log("cek no hp");
    var database = req.query.database;

    var emId = req.headers.em_id;

    console.log(req.headers);

    var query = `SELECT * FROM ${table} WHERE  status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids='' ORDER BY id DESC LIMIT 1`;

    console.log(req.body);
    try {
      const connection = await model.createConnection(database);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }
        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }

          connection.query(query, (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "gagal ambil data",
                  data: [],
                });
              });
              return;
            }

            records = results;
            if (records.length == 0) {
              return res.status(400).send({
                status: false,
                message: "Data tidak ditemukan",
                data: [],
              });
            }

            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "Kombinasi email & password Anda Salah",
                    data: [],
                  });
                });
                return;
              }
              connection.end();
              console.log("Transaction completed successfully!");
              return res.status(200).send({
                status: true,
                message: "successfuly get data",
                data: records[0],
              });
            });
          });
        });
      });
    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    }
  },

  async checkData(req, res) {
    console.log("datawww");

    console.log(" cek data");
    var nama = req.body.nama;

    console.log("cek no h qqp");
    var database = req.query.database;

    var emId = req.headers.em_id;
    var branchId = req.headers.branch_id;

    console.log(req.headers);

    var query = `SELECT ${table}.* FROM ${database}_hrm.${table} LEFT JOIN ${tableDetail} ON ${table}.id=${tableDetail}.peraturan_perusahaan_id AND ${tableDetail}.em_id='${emId}'  WHERE 
       status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids='' AND status='1' 
        AND (   branch_id LIKE '%${branchId
          .toString()
          .padStart(
            2,
            "0"
          )}%'  OR    branch_id LIKE '%${branchId}%' ) AND ${table}.tanggal_berlaku <= CURDATE()
    AND ${tableDetail}.peraturan_perusahaan_id IS  NULL ORDER BY ${table}.id ASC LIMIT 1`;

    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const dataPerusahaan = await conn.query(query);

      if (dataPerusahaan.length == 0) {
        return res.status(200).send({
          status: false,
          message: "Data  tidak ditemukan",
          data: [],
        });
      }

      var queryCek = `SELECT * FROM ${tableDetail} WHERE em_id='${emId}' AND peraturan_perusahaan_id='${dataPerusahaan[0].id}'`;

      const results = await conn.query(queryCek);
      var isCheck = false;
      if (results.length > 0) {
        isChe
        ck = true;
      }

      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "Susccesfuly get data perusahan",
        is_check: isCheck,
        data: dataPerusahaan[0],
      });
    } catch (e) {
      console.error("errror,", e);
      if (conn) {
        await conn.rollback();
      }
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },
  async checkDataByEmployee(req, res) {
    console.log(" cek data EULAee  new");
    var nama = req.body.nama;
    var branchId = req.headers.branch_id;

    console.log("cek no hp");
    var database = req.query.database;

    var emId = req.headers.em_id;

    console.log(req.headers);

    var password = sha1(req.body.password);
    var email = req.body.email;
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [employee] = await conn.query(
        `SELECT em_id,branch_id FROM employee WHERE em_email='${email}' AND em_password='${password}'`
      );
      console.log("Query Result:", employee);
      if (employee.length == 0) {
        console.log("data tidak tersedia");
        await conn.commit();
        return res.status(400).send({
          status: false,
          message: "Kombinasi email & password Anda Salah",
          data: [],
        });
      }

      var query = `SELECT * FROM ${table} WHERE  status_transaksi='1' AND tipe='utama' AND status='1'  AND tanggal_berlaku <= CURDATE()
        AND (   branch_id LIKE '%${employee[0].branch_id
          .toString()
          .padStart(2, "0")}%'  OR    branch_id LIKE '%${
        employee[0].branch_id
      }%' )
     ORDER BY id DESC LIMIT 1`;
      const [dataPerusahaan] = await conn.query(query);
      if (dataPerusahaan.length == 0) {
        return res.status(200).send({
          status: true,
          message: "Susccesfuly get data perusahan",
          is_check: true,
          data: "",
        });
      }
      var queryCek = `SELECT * FROM ${tableDetail} WHERE em_id='${employee[0].em_id}' AND peraturan_perusahaan_id='${dataPerusahaan[0].id}'`;

      const [results] = await conn.query(queryCek);
      var isCheck = false;
      if (results.length > 0) {
        isCheck = true;
      }

      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "Susccesfuly get data perusahan",
        is_check: isCheck,
        data: dataPerusahaan[0],
      });
    } catch (e) {
      console.error("errror,", e);
      if (conn) {
        await conn.rollback();
      }
      return res.status(400).send({
        status: false,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async saveDataCheck(req, res) {
    console.log("-----kirim data --");
    var nama = req.body.nama;
    var emId = req.body.em_id;

    console.log("cek no hp");
    var database = req.query.database;
    var peruasturanPerusahaanId = req.body.peraturan_perusahaan_id;

    console.log(req.body);

    var query = `SELECT * FROM ${table} WHERE  status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids=''  ORDER BY id DESC LIMIT 1`;
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [records] = await conn.query(query);
      if (records.length == 0) {
        await conn.commit();
        return res.status(400).send({
          status: false,
          message: "Data  tidak ditemukan",
          data: [],
        });
      }
      var queryCek = `SELECT * FROM ${tableDetail} WHERE em_id='${emId}' AND peraturan_perusahaan_id='${peruasturanPerusahaanId}'`;
      const [results] = await conn.query(queryCek);
      var dataInsert = {
        peraturan_perusahaan_id: peruasturanPerusahaanId,
        em_id: emId,
      };
      console.log("data ", dataInsert);
      var queryInsert = `INSERT INTO ${tableDetail} SET ?`;

      if (results.length > 0) {
        await conn.commit();
        return res.status(400).send({
          status: false,
          message: "terjadi kesalahaan",
          data: [],
        });
      }

      const [insert] = await conn.query(queryInsert, [dataInsert]);
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "Susccesfuly  save data",
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error(e);
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) {
        await conn.release();
      }
    }
  },
};
