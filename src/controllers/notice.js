const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const utility = require("./../utils/utility");
const e = require("express");

var request = require("request");

const model = require("../utils/models");
require("dotenv").config();

var ipServer = process.env.API_URL;
pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  async notice(req, res) {
    var database = req.query.database;
    console.log("database ", database);
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var emId = req.headers.em_id;
    var branchId = req.headers.branch_id;

    url = `SELECT 
    n.*, 
    CASE 
        WHEN v.notice_id IS NOT NULL THEN 1 
        ELSE 0 
    END AS is_view
FROM notice n
LEFT JOIN notice_view v ON v.notice_id = n.id
WHERE n.branch_id LIKE '%${branchId}%' AND n.begin_date <= CURDATE() AND n.end_date >= CURDATE()
`;

    console.log("url accouncemnt", url);

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

        connection.query(url, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: "gagal ambil data",
                data: [],
              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
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
              data: results,
            });
          });
        });
      });
    });
  },

  async updateNotice(req, res) {
      var database = req.query.database;
      var emId = req.body.em_id;
      var letterId = req.body.notice_id;
    
      try {
        const connection = await model.createConnection(database);
        connection.connect((err) => {
          if (err) {
            console.error("Error connecting to the database:", err);
            return res.status(500).send({ status: false, message: "Koneksi gagal" });
          }
    
          const queryInsert = `
            INSERT INTO notice_view (notice_id, em_id) 
            VALUES (?, ?)`;
  
          console.log('ini em_id ',emId);
          connection.query(queryInsert, [letterId, emId], (err, result) => {
            connection.end();
            // console.log(queryInsert);
            if (err) {
              console.error("Error inserting into notice_view:", err);
              return res.status(400).send({ status: false, message: "Gagal update status" });
            }
    
            return res.status(200).send({ status: true, message: "Surat peringatan sudah dibaca" });
          });
        });
      } catch (e) {
        return res.status(500).send({ status: false, message: "Terjadi kesalahan server" });
      }
    },

  async savePolling(req, res) {
    var database = req.query.database;
    console.log("database ", database);
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var emId = req.headers.em_id;
    var idPolling = req.body.polling_id;

    var idPertanyaan = req.body.pertanyaan_id;

    var deleteurl = `DELETE FROM  notice_question_polling_employee WHERE em_id='${emId}' AND notice_question_id='${idPertanyaan}' `;

    url = `INSERT INTO  notice_question_polling_employee (em_id,notice_question_id,notice_question_polling_id) VALUES ('${emId}','${idPertanyaan}','${idPolling}')`;

    console.log("url accouncemnt", url);

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

        connection.query(deleteurl, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: "gagal ambil data",
                data: [],
              });
            });
            return;
          }
          connection.query(url, (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "gagal ambil data",
                  data: [],
                });
              });
              return;
            }
            records = results;
            if (records.length == 0) {
              return res.status(400).send({
                status: true,
                message: "Kombinasi email & password Anda Salah",
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
                data: results,
              });
            });
          });
        });
      });
    });
  },
  async detailNoticePolling(req, res) {
    var database = req.query.database;
    console.log("database ", database);
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var emId = req.headers.em_id;
    var questionId = req.body.id;
    var isCheckedEmployee = false;

    var idPolling = "";
    console.log(req.headers);

    var url = `SELECT notice_question_polling.* ,(SELECT COUNT(*) FROM notice_question_polling_employee 
        WHERE notice_question_polling_id=notice_question_polling.id)  AS total_karyawan FROM  notice_question_polling WHERE notice_question_id='${questionId}'`;

    console.log("url accouncemnt", url);

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

        console.log();

        connection.query(
          `SELECT * FROM notice_question_polling_employee WHERE notice_question_id='${questionId}' AND em_id='${emId}'
            `,
          (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "gagal ambil data",
                  data: [],
                });
              });
              return;
            }

            console.log(results);
            if (results.length > 0) {
              isCheckedEmployee = true;
              idPolling = results[0]["notice_question_polling_id"];
            } else {
              isCheckedEmployee == false;
              idPolling = "0";
            }

            connection.query(url, (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "gagal ambil data",
                    data: [],
                  });
                });
                return;
              }
              records = results;
              if (records.length == 0) {
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
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
                  message: "salah",
                  is_polling: isCheckedEmployee,
                  id_polling: idPolling,
                  data: results,
                });
              });
            });
          }
        );
      });
    });
  },

  async detailNoticePollingEmployee(req, res) {
    var database = req.query.database;
    console.log("database ", database);
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var emId = req.headers.em_id;
    var questionId = req.query.polling_id;
    console.log("oasdfs ", req.params);
    var finalList = [];

    var url = `SELECT employee.* FROM notice_question_polling_employee JOIN employee ON employee.em_id= notice_question_polling_employee.em_id WHERE notice_question_polling_id='${questionId}'`;

    console.log("url accouncemnt", url);

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

        connection.query(url, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: "gagal ambil data",
                data: [],
              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
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
              data: results,
            });
          });
        });
      });
    });
  },


};
