const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const e = require("express");
const crypto = require("crypto");
// var https = require('https');
// const faceApiService = require('./faceapiService');
const model = require("../utils/models");
const _apiUrl = "https://faceapi.mxface.ai/api/v3/face/";
const _subscriptionKey = "YOpA1lpSxJDLTPbWIz-oxXMU0jLil1363"; //change subscription key
var request = require("request");
API_TOKEN = "d5ad23d418674fa2a3165c02e022280c";
var remoteDirectory = "public_html/7H202305001";

var username = "aplikasioperasionalsiscom";
var password = "siscom@ptshaninformasi#2022@";
var auth = "Basic " + Buffer.from(username + ":" + password).toString("base64");
const https = require("https");
const querystring = require("querystring");
const utility = require("./../utils/utility");

require("dotenv").config();

const axios = require("axios");

var ipServer = process.env.API_URL;

pool.on("error", (err) => {
  console.error(err);
});
const SftpClient = require("ssh2-sftp-client");
const sftp = new SftpClient();
const { emit } = require("process");
const lembur = require("./lembur");
const configSftp = {
  host: "imagehris.siscom.id",
  port: 3322, // Default SFTP port is 22
  username: "siscom",
  password: "siscom!@#$%",
};

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

    url = `SELECT notice.*,notice_question.name as pertanyaan,notice_question.id as id_pertanyaan
    
    
    
    
    
    
    
    
    
    
    
    FROM notice LEFT JOIN notice_question ON notice_question.notice_id=notice.id WHERE em_ids LIKE '%${emId}%' OR em_ids=''`;

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
  async allData(req, res) {
    var database = req.query.database;
    console.log("database ", database);
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");

    console.log("periode terbaru", req.query);
    var query_global = `SELECT * FROM ${getTableName}`;
    var query_departemen = `SELECT * FROM department`;
    var query_place = `SELECT * FROM places_coordinate WHERE isActive='1'`;

    var url;
    if (getTableName == "all_department") {
      url = query_departemen;
    } else if (getTableName == "places_coordinate") {
      url = query_place;
    } else if (getTableName == "emp_claim") {
      url = `SELECT emp_claim.*,cost.name as name FROM emp_claim JOIN ${database}_hrm.cost  ON  emp_claim.cost_id=cost.id `;
    } else {
      url = query_global;
    }

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
    // let name_url = req.originalUrl;
    // var getTableName = name_url.substring(name_url.lastIndexOf("/") + 1);

    // var query_global = `SELECT * FROM ${getTableName}`;
    // var query_departemen = `SELECT * FROM department`;
    // var query_place = `SELECT * FROM places_coordinate WHERE isActive='1'`;

    // var url;
    // if (getTableName == "all_department") {
    //   url = query_departemen;
    // } else if (getTableName == "places_coordinate") {
    //   url = query_place;
    // } else {
    //   url = query_global;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     url,
    //     function (error, results) {
    //       connection.release();
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // })hrm;
  },
  async overtime(req, res) {
    var database = req.query.database;
    console.log("database ", database);
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var query_global = `SELECT * FROM ${getTableName}`;
    var query_departemen = `SELECT * FROM department`;
    var query_place = `SELECT * FROM places_coordinate WHERE isActive='1'`;

    var url;
    if (getTableName == "all_department") {
      url = query_departemen;
    } else if (getTableName == "places_coordinate") {
      url = query_place;
    } else if (getTableName == "emp_claim") {
      url = `SELECT emp_claim.*,cost.name as name FROM emp_claim JOIN ${database}_hrm.cost  ON  emp_claim.cost_id=cost.id `;
    } else {
      url = query_global;
    }

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

        connection.query(
          `SELECT * FROM ${database}_hrm.overtime  WHERE aktif='Y'`,
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
          }
        );
      });
    });
    // let name_url = req.originalUrl;
    // var getTableName = name_url.substring(name_url.lastIndexOf("/") + 1);

    // var query_global = `SELECT * FROM ${getTableName}`;
    // var query_departemen = `SELECT * FROM department`;
    // var query_place = `SELECT * FROM places_coordinate WHERE isActive='1'`;

    // var url;
    // if (getTableName == "all_department") {
    //   url = query_departemen;
    // } else if (getTableName == "places_coordinate") {
    //   url = query_place;
    // } else {
    //   url = query_global;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     url,
    //     function (error, results) {
    //       connection.release();
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // })hrm;
  },

  async cari_informasi_employee(req, res) {
    console.log("-----function cari informasi employee----------");
    var database = req.query.database;
    const connection = await model.createConnection(database);
    var dep_id = req.body.dep_id;
    var branchId = req.headers.branch_id;

    var query1 = ` SELECT * FROM ${database}_hrm.employee JOIN branch ON employee.branch_id=branch.id WHERE branch_id=${branchId} AND STATUS='ACTIVE'  `;
    var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND branch_id=${branchId} AND status='ACTIVE'`;

    var url;
    if (dep_id == "0" || dep_id == 0) {
      url = query1;
      console.log(query1);
    } else {
      url = query2;
      console.log(query2);
    }
    //-----begin check koneksi----
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
        //-------end check koneksi-----

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
    // var dep_id = req.body.dep_id;

    // var query1 = `SELECT * FROM ${database}_hrm.employee WHERE status='ACTIVE'`;
    // var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND status='ACTIVE'`;

    // var url;
    // if (dep_id == "0" || dep_id == 0) {
    //   url = query1;
    // } else {
    //   url = query2;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     url,
    //     function (error, results) {
    //       connection.release();
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },
  async info_sisa_kontrak(req, res) {
    console.log("-----sisa kontrak---------");
    var database = req.query.database;
    var branchId = req.headers.branch_id;

    const connection = await model.createConnection(database);
    var reminder = req.body.reminder;

    console.log();
    var query1 = ` 
    SELECT CURDATE(), TBL.em_id, ADDDATE(TBL.end_date, INTERVAL - 60 DAY),
    DATEDIFF(TBL.end_date, CURDATE()) AS sisa_kontrak, e.full_name, e.em_image, TBL.em_id, TBL.description, 
    TBL.begin_date, TBL.end_date, TBL.remark, e.status  
    FROM (SELECT MAX(h.nokey) AS nokey, h.em_id, MAX(h.begin_date) AS begin_date, 
    MAX(h.end_date) AS end_date, MAX(h.description) AS description, MAX(h.remark) AS remark    
    FROM employee_history h WHERE h.status = 1 GROUP BY h.em_id) TBL 
    JOIN employee e ON e.em_id = TBL.em_id 
    WHERE ADDDATE(TBL.end_date, INTERVAL - 60 DAY) <= CURDATE()  AND DATEDIFF(TBL.end_date, CURDATE())>0
    AND e.status = 'ACTIVE' AND e.em_status != 'PERMANENT' AND branch_id=${branchId} ORDER BY TBL.end_date
    
    `;
    //-----begin check koneksi----
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
        //-------end check koneksi-----

        connection.query(
          "SELECT * FROM sysdata WHERE kode='015'",
          (err, sysdata) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }

            query1 = ` 
            SELECT CURDATE(), TBL.em_id, ADDDATE(TBL.end_date, INTERVAL - ${sysdata[0].name} DAY),
            DATEDIFF(TBL.end_date, CURDATE()) AS sisa_kontrak, e.full_name, e.em_image, TBL.em_id, TBL.description, 
            TBL.begin_date, TBL.end_date, TBL.remark, e.status  
            FROM (SELECT MAX(h.nokey) AS nokey, h.em_id, MAX(h.begin_date) AS begin_date, 
            MAX(h.end_date) AS end_date, MAX(h.description) AS description, MAX(h.remark) AS remark    
            FROM employee_history h WHERE h.status = 1 GROUP BY h.em_id) TBL 
            JOIN employee e ON e.em_id = TBL.em_id 
            WHERE ADDDATE(TBL.end_date, INTERVAL - ${sysdata[0].name} DAY) <= CURDATE()  AND DATEDIFF(TBL.end_date, CURDATE())>0
            AND e.status = 'ACTIVE' AND e.em_status != 'PERMANENT' ORDER BY TBL.end_date
            
            `;

            connection.query(query1, (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi kesahalan",
                    data: [],
                  });
                });
                return;
              }

              if (results.length == 0) {
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              }
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: false,
                      message: "Terjadi kesalahan",
                      data: [],
                    });
                  });
                  return;
                }
                connection.end();
                console.log("Transaction completed successfully!");
                return res.status(200).send({
                  status: true,
                  message: "Successfuly get data",
                  data: results,
                });
              });
            });
          }
        );
      });
    });
  },

  // async surtKontrak(req, res) {
  //   console.log('-----sisa kontrak---------')
  //   var database = req.query.database;

  //   const connection = await model.createConnection(database);
  //   var reminder = req.body.reminder;
  //   var emId=req.headers.em_id;

  //   console.log()
  //   var query1 = `
  //   SELECT nomor,tgl_ajuan as tgl,jenis_perjanjian FROM perjanjian_kerja WHERE em_id='${emId}'

  //   `
  //   ;

  //   //-----begin check koneksi----
  //   connection.connect((err) => {
  //     if (err) {
  //       console.error('Error connecting to the database:', err);
  //       return;
  //     }
  //     connection.beginTransaction((err) => {
  //       if (err) {
  //         console.error('Error beginning transaction:', err);
  //         connection.end();
  //         return;
  //       }
  //       //-------end check koneksi-----

  //       connection.query(query1, (err, results) => {
  //         if (err) {
  //           console.error('Error executing SELECT statement:', err);
  //           connection.rollback(() => {
  //             connection.end();
  //             return res.status(400).send({
  //               status: false,
  //               message: 'Terjadi kesahalan',
  //               data: []

  //             });
  //           });
  //           return;
  //         }

  //         connection.query("SELECT * FROM sysdata WHERE kode='015'", (err, sysdata) => {
  //           if (err) {
  //             console.error('Error executing SELECT statement:', err);
  //             connection.rollback(() => {
  //               connection.end();
  //               return res.status(400).send({
  //                 status: false,
  //                 message: 'Terjadi kesahalan',
  //                 data: []

  //               });
  //             });
  //             return;
  //           }

  //         if (results.length == 0) {
  //           return res.status(400).send({
  //             status: false,
  //             message: "Terjadi kesalahan",
  //             data: []

  //           });
  //         }
  //         connection.commit((err) => {
  //           if (err) {
  //             console.error('Error committing transaction:', err);
  //             connection.rollback(() => {
  //               connection.end();
  //               return res.status(400).send({
  //                 status: false,
  //                 message: "Terjadi kesalahan",
  //                 data: []

  //               });
  //             });
  //             return;
  //           }
  //           connection.end();
  //           console.log('Transaction completed successfully!');
  //           return res.status(200).send({
  //             status: true,
  //             message: "Successfuly get data",
  //             data: results

  //           });

  //         });
  //       });

  //     });
  //   });

  // });
  // },

  async surtKontrak(req, res) {
    console.log("-----sisa kontrak---------");
    var database = req.query.database;

    const connection = await model.createConnection(database);
    var reminder = req.body.reminder;
    var emId = req.headers.em_id;

    console.log();
    var query1 = ` 
    SELECT em_nid AS nik,employee_history.end_date,perjanjian_kerja.id,employee.full_name,employee.file_esign, places_coordinate.place AS lokasi, nomor,tgl_ajuan AS tgl,jenis_perjanjian,tgl_berlaku,posisi,catatan FROM 
    perjanjian_kerja LEFT JOIN  places_coordinate ON places_coordinate.id=perjanjian_kerja.lokasi JOIN employee ON employee.em_id=perjanjian_kerja.em_id  LEFT JOIN employee_history ON employee_history.description=perjanjian_kerja.jenis_perjanjian AND employee_history.em_id=perjanjian_kerja.em_id  WHERE perjanjian_kerja.em_id='${emId}'
    
    `;
    //-----begin check koneksi----
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
        //-------end check koneksi-----

        connection.query(query1, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: "Terjadi kesahalan",
                data: [],
              });
            });
            return;
          }

          connection.query(
            "SELECT * FROM sysdata WHERE kode='015'",
            (err, sysdata) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi kesahalan",
                    data: [],
                  });
                });
                return;
              }

              if (results.length == 0) {
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              }
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: false,
                      message: "Terjadi kesalahan",
                      data: [],
                    });
                  });
                  return;
                }
                connection.end();
                console.log("Transaction completed successfully!");
                return res.status(200).send({
                  status: true,
                  message: "Successfuly get data",
                  data: results,
                });
              });
            }
          );
        });
      });
    });
  },

  async suratKontrakPdf(req, res) {
    console.log("----detail kontrak---------");
    var database = req.query.database;

    const connection = await model.createConnection(database);
    var reminder = req.body.reminder;
    var emId = req.headers.em_id;
    var id = req.params.id;

    console.log();
    var query1 = ` 
    SELECT * FROM perjanjian_kerja_keterangan WHERE perjanjian_kerja_id='${id}'`;
    console.log(query1);
    //-----begin check koneksi----
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
        //-------end check koneksi-----

        connection.query(query1, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: "Terjadi kesahalan",
                data: [],
              });
            });
            return;
          }
          if (results.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: [],
            });
          }
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results,
            });
          });
        });
      });
    });
  },
  //   async suratKontrakPdf(req, res) {
  //     const fs = require('fs');

  //     async function downloadImage(url) {
  //       const response = await axios.get(url, { responseType: 'arraybuffer' });
  //       return Buffer.from(response.data, 'binary');
  //     }

  //     // Membuat dokumen PDF baru
  //     const PDFDocument = require('pdfkit');
  //     const doc = new PDFDocument({
  //       size: 'A4', // Set page size to A4
  //       margin: 20 // Optional, sets global margin for all pages
  //     });

  //     doc.pipe(fs.createWriteStream('positioned_text.pdf'));

  //     const lineWidth = 1; // Line thickness

  //     const startX = 50; // Starting X position (left margin)
  //     const startY = 200; // Starting Y position (vertical position)
  //     const endX = 550;  // Ending X position (right margin)

  //     const marginTop =150;  // Top margin
  //     const marginLeft = 40; // Left margin
  //     const marginRight = 40; // Right margin

  // // Adjust width to account for horizontal margin
  // const textWidth = doc.page.width - marginLeft - marginRight;
  //     // Set header untuk file PDF
  //     res.setHeader('Content-Type', 'application/pdf');
  //     res.setHeader('Content-Disposition', 'inline; filename="output.pdf"');

  //     // Mengarahkan output ke response (bukan ke file)
  //     doc.pipe(res);

  //     // Menambahkan konten PDF
  //     doc.fontSize(25).text('PT SINAR ARTHA MULIA',  {
  //       align: 'center',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin)
  //       y:200,

  //     });
  //     doc.fontSize(12).text('MECHANICAL ELECTRICAL AND AIR CONDITIONING CONTRACTORS.', {
  //       align: 'center',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin)

  //     });
  //     doc.fontSize(10).text('komplek artha Gading Niaga G NO. 11 Kelapa Gading Barat, Kelapa Gading  - Jakarta Utara 14240',{
  //       align: 'center',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin)

  //     });

  //     doc.fillColor('white').fontSize(15).text('-',{});

  //     doc.fillColor('black').fontSize(15).text('Pasal 1',{
  //       align: 'center',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin)

  //     });

  //     doc.fillColor('black').fontSize(15).text('Surat Kerja',{
  //       align: 'center',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin)

  //     });
  //     doc.fillColor('white').fontSize(15).text('-',{});
  //     doc.fillColor('white').fontSize(15).text('-',{});

  //     doc.fillColor('black').fontSize(12).text('Perjanjian Kerja mengikat 2(dua) belah , yaitu:',{
  //       align: 'left',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin),
  //       height:10,

  //     });
  //     doc.fillColor('black').fontSize(12).text('          Nama :',{
  //       align: 'left',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin),
  //       height:20,

  //     });
  //     doc.fillColor('black').fontSize(12).text('          NIK:',{
  //       align: 'left',  // Menyusun teks di tengah secara horizontal
  //       valign: 'top',    // Menyusun teks di bagian atas halaman (vertikal, bisa diubah)
  //       width: doc.page.width - 40, // Lebar area teks (opsional untuk memberi margin),
  //       height:20,

  //     });

  //     doc.fillColor('white').fontSize(15).text('-',{});
  //     doc.fontSize(15).text('',{});
  //     doc.fontSize(15).text('',{});

  //     doc.strokeColor('black').lineWidth(lineWidth);
  //     // Draw the line
  //     // doc.moveTo(startX, 90).lineTo(endX, 90).stroke();
  //     // doc.moveTo(startX, 92).lineTo(endX, 92).stroke();

  //     // const textWidthPasal = doc.widthOfString("Pasal 1");
  //     // const xPasal = (doc.page.width - textWidthPasal) / 2;  // Horizontal center
  //     // doc.fontSize(15).text('PASAL 1', xPasal,120,);

  //     // Menyelesaikan dokumen PDF

  //     doc.end();

  //   // async suratKontrakPdf(req,res) {
  //   //   try {
  //   //     const puppeteer = require('puppeteer');
  //   //     // Mengambil data dari database
  //   //    // const users = await getDataFromDatabase();

  //   //     // Membuat HTML dengan data yang diambil dari database
  //   //     let userListHtml = '';

  //   //     const htmlContent = `
  //   //       <html>
  //   //         <head>
  //   //           <title>Users List</title>
  //   //           <style>
  //   //             body { font-family: Arial, sans-serif; padding: 20px; }
  //   //             table { width: 100%; border-collapse: collapse; }
  //   //             th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
  //   //             th { background-color: #f2f2f2; }
  //   //           </style>
  //   //         </head>
  //   //         <body>
  //   //           <h1>User List</h1>
  //   //           <table>
  //   //             <tr>
  //   //               <th>Name</th>
  //   //               <th>Email</th>
  //   //             </tr>
  //   //            Rifan
  //   //           </table>
  //   //         </body>
  //   //       </html>
  //   //     `;

  //   //     // Meluncurkan browser Puppeteer
  //   //     const browser = await puppeteer.launch();
  //   //     const page = await browser.newPage();

  //   //     // Set halaman dengan HTML yang telah dihasilkan
  //   //     await page.setContent(htmlContent);

  //   //     // Membuat PDF dari HTML
  //   //     await page.pdf({ path: 'users-list.pdf', format: 'A4' });

  //   //     // Menutup browser
  //   //     await browser.close();

  //   //     console.log('PDF Created Successfully!');
  //   //   } catch (err) {
  //   //     console.error('Error generating PDF:', err);
  //   //   } finally {
  //   //    // connection.end();  // Menutup koneksi database
  //   //   }
  //   // },

  //   },
  async informasi_employee_ultah(req, res) {
    console.log("-----informasi employee ulang tahun----------");
    var dateNow = req.body.dateNow;

    var database = req.query.database;
    var branchId = req.headers.branch_id;
    const connection = await model.createConnection(database);

    var query1 = `SELECT em_id,full_name, job_title, em_birthday, em_mobile, em_image FROM employee WHERE DATE_FORMAT(em_birthday, '%m')=DATE_FORMAT('${dateNow}', '%m') AND employee.status='ACTIVE' AND branch_id=${branchId} ORDER BY DATE_FORMAT(em_birthday, "%d") ASC`;
    //-----begin check koneksi----
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
        //-------end check koneksi-----

        connection.query(query1, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: "Terjadi kesahalan",
                data: [],
              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: [],
            });
          }
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              });
              return;
            }

            console.log("Transaction completed successfully!");
            res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results,
            });
            connection.end();
          });
        });
      });
    });

    // var query1 = `SELECT em_id FROM ${database}_hrm.employee WHERE DATE_FORMAT(em_birthday, '%m-%d')=DATE_FORMAT('${dateNow}', '%m-%d')`;
    // var query1 = `SELECT em_id,full_name, job_title, em_birthday, em_mobile, em_image FROM ${database}_hrm.employee WHERE DATE_FORMAT(em_birthday, '%m')=DATE_FORMAT('${dateNow}', '%m') AND ${database}_hrm.employee.status='ACTIVE' ORDER BY DATE_FORMAT(em_birthday, "%d") ASC`;

    // let proses1 = new Promise(function (myResolve, myReject) {
    //   pool.getConnection(function (err, connection) {
    //     if (err) console.log(err);
    //     connection.query(
    //       query1,
    //       function (error, results) {
    //         connection.release();
    //         if (error != null) console.log(error)
    //         myResolve(results);
    //       }
    //     );
    //   });
    // });
    // proses1.then(
    //   function (value) {

    //     var listReport = value;

    //     var query2 = `SELECT full_name, job_title, em_birthday, em_mobile, em_image FROM ${database}_hrm.employee WHERE em_id=?`;
    //     const getInfo = (t) => {
    //       return new Promise((resolve, reject) => {
    //         pool.getConnection(function (err, connection) {
    //           if (err) console.log(err);
    //           connection.query(
    //             query2, [t],
    //             function (error, results) {
    //               connection.release();
    //               if (error != null) console.log(error)
    //               resolve(results[0])
    //             }
    //           );
    //         });

    //       })
    //     }

    //     var response = [];

    //     listReport.map((value) => {
    //       response.push(getInfo(value['em_id']))
    //     })

    //     Promise.all(response)
    //       .then(response => {
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil data employee ultah!",
    //           data: response,
    //         });
    //       });

    //   },
    // );
  },

  informasi_wa_atasan(req, res) {
    console.log("-----informasi wa atasan----------");
    const mysql = require("mysql");
    var database = req.query.database;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var kode = req.body.kode;
    var script1 = `SELECT em_report_to FROM ${database}_hrm.employee WHERE em_id='${em_id}'`;
    var script2 = `SELECT em_report_to, em_report2_to FROM ${database}_hrm.employee WHERE em_id='${em_id}'`;

    var url;
    if (kode == "1") {
      url = script1;
      jalan1();
    } else if (kode == "2") {
      url = script2;
      jalan2();
    }

    function jalan1() {
      let proses1 = new Promise(function (myResolve, myReject) {
        poolDynamic.getConnection(function (err, connection) {
          if (err) console.log(err);
          connection.query(url, function (error, results) {
            connection.release();
            if (error != null) console.log(error);
            var allAtasan = `${results[0].em_report_to}`;
            myResolve(allAtasan);
          });
        });
      });
      proses1.then(function (value) {
        let listReport = value.split(",");
        listReport = listReport.filter((item) => item);

        var script2 = `SELECT * FROM ${database}_hrm.employee WHERE em_id=?`;
        const getInfo = (t) => {
          return new Promise((resolve, reject) => {
            poolDynamic.getConnection(function (err, connection) {
              if (err) console.log(err);
              connection.query(script2, [t], function (error, results) {
                connection.release();
                if (error != null) console.log(error);
                resolve(results[0]);
              });
            });
          });
        };

        var response = [];

        listReport.map((value) => {
          response.push(getInfo(value));
        });

        Promise.all(response).then((response) => {
          res.send({
            status: true,
            message: "Berhasil ambil data level 2!",
            data: response,
          });
        });
      });
    }

    function jalan2() {
      let proses1 = new Promise(function (myResolve, myReject) {
        poolDynamic.getConnection(function (err, connection) {
          if (err) console.log(err);
          connection.query(url, function (error, results) {
            connection.release();
            if (error != null) console.log(error);
            var allAtasan = ``;
            var allAtasan = `${results[0].em_report_to},${results[0].em_report2_to}`;
            myResolve(allAtasan);
          });
        });
      });

      proses1.then(function (value) {
        let listReport = value.split(",");
        listReport = listReport.filter((item) => item);
        var script2 = `SELECT * FROM ${database}_hrm.employee WHERE em_id=?`;
        const getInfo = (t) => {
          return new Promise((resolve, reject) => {
            poolDynamic.getConnection(function (err, connection) {
              if (err) console.log(err);
              connection.query(script2, [t], function (error, results) {
                connection.release();
                if (error != null) console.log(error);
                resolve(results[0]);
              });
            });
          });
        };

        var response = [];
        listReport.map((value) => {
          response.push(getInfo(value));
        });

        Promise.all(response).then((response) => {
          res.send({
            status: true,
            message: "Berhasil ambil data level 2!",
            data: response,
          });
        });
      });
    }
  },

  //   async empoyeeDelegasi(req, res) {
  //   console.log('-----where once----------')
  //   let name_url = req.originalUrl;
  //   var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
  //   var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database="+req.query.database,"");
  //   var value = req.body.val;
  //   var cari = req.body.cari;
  //   var database=req.query.database;

  //   const connection=await model.createConnection(database);
  //   connection.connect((err) => {
  //     if (err) {
  //       console.error('Error connecting to the database:', err);
  //       return;
  //     }
  //     connection.beginTransaction((err) => {
  //       if (err) {
  //         console.error('Error beginning transaction:', err);
  //         connection.end();
  //         return;
  //       }
  //  //-------end check koneksi-----
  //           connection.query( `SELECT designation.level,employee.* FROM employee JOIN designation ON designation.id=employee.des_id  WHERE dep_group_id='${req.body.dep_group_id}' AND (designation.level<(SELECT designation.level FROM employee JOIN designation ON designation.id=employee.des_id  WHERE employee.em_id='${req.body.em_id}'))
  //           `, (err, results) => {
  //             if (err) {
  //               console.error('Error executing SELECT statement:', err);
  //               connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                   status: false,
  //                   message: 'Terjadi kesahalan',
  //                   data:[]

  //                 });
  //               });
  //               return;
  //             }
  //             records = results;
  //             if (records.length==0){
  //               return res.status(400).send({
  //                 status: false,
  //                           message: "Terjadi kesalahan",
  //                 data:[]

  //               });
  //             }
  //             connection.commit((err) => {
  //               if (err) {
  //                 console.error('Error committing transaction:', err);
  //                 connection.rollback(() => {
  //                   connection.end();
  //                   return res.status(400).send({
  //                     status: false,
  //                     message: "Terjadi kesalahan",
  //                     data:[]

  //                   });
  //                 });
  //                 return;
  //               }
  //               connection.end();
  //               console.log('Transaction completed successfully!');
  //               return res.status(200).send({
  //                 status: true,
  //                 message: "Successfuly get data",
  //                 data:results

  //               });

  //             });
  //           });

  //       });
  //     });
  // },

  async empoyeeDelegasi(req, res) {
    console.log("-----where once----------");
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var convert2 = convert1
      .substring(convert1.lastIndexOf("-") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var value = req.body.val;
    var cari = req.body.cari;
    var database = req.query.database;

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
        //-------end check koneksi-----
        connection.query(
          `SELECT em_report_to,em_report2_to FROM employee WHERE em_id ='${req.body.em_id}'`,
          (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }
            records = results;
            if (records.length == 0) {
              return res.status(400).send({
                status: false,
                message: "data empty",
                data: [],
              });
            }
            var data1 = records[0]["em_report_to"].split(",");
            var data2 = records[0]["em_report2_to"].split(",");
            var finalData = data1.concat(data2);
            connection.query(
              `SELECT *  FROM employee WHERE em_id IN (?)`,
              [finalData],
              (err, results) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: false,
                      message: "Terjadi kesahalan",
                      data: [],
                    });
                  });
                  return;
                }

                var employee = results;
                connection.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: false,
                        message: "error commit",

                        data: [],
                      });
                    });
                    return;
                  }
                  connection.end();
                  console.log("Transaction completed successfully!");
                  return res.status(200).send({
                    status: true,
                    message: "Successfuly get data",
                    data: employee,
                  });
                });
              }
            );
          }
        );
      });
    });
  },
  async whereOnce(req, res) {
    console.log("-----where once----------");
    let name_url = req.originalUrl;

    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");

    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1);
    console.log(convert2);
    var value = req.body.val;
    var cari = req.body.cari;
    var database = req.query.database;
    var query = "";
    console.log(req.query);

    var startDate = req.query.start_periode;
    var endDate = req.query.end_periode;
    var array = endDate.split("-");
    const connection = await model.createConnection(database);
    var databseDinamik = `${database}_hrm${array[0].substring(
      2,
      4
    )}${array[1].padStart(2, "0")}`;

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     `SELECT * FROM ${convert2} WHERE ${value}='${cari}';`,
    //     function (error, results) {

    //       if (error != null) console.log(error)
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );
    //   connection.release();
    // });

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
        query = `SELECT * FROM ${convert2} WHERE ${value}='${cari}' `;

        if (convert2 == "assign_leave") {
          // query = `SELECT em_id,(total_day+adjust_cuti) as total_day,(terpakai) as terpakai FROM ${convert2} WHERE ${value}='${cari}'  ORDER BY dateyear DESC `;
          query = `
        SELECT 
        em_id,
        (saldo_cut_off+saldo_cuti_bulan_lalu+saldo_cuti_tahun_lalu+perolehan_cuti-expired_cuti) as total_day,IFNULL((terpakai+terpakai_cuti_tahun_lalu) ,0 )   as terpakai FROM ${databseDinamik}.${convert2} WHERE ${value}='${cari}'  ORDER BY em_id ASC `;
        }

        //-------end check koneksi-----

        connection.query(query, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: "Terjadi kesahalan",
                data: [],
              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: [],
            });
          }
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results,
            });
          });
        });
      });
    });
  },
  async whereTwo(req, res) {
    console.log("-----where two----------");
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.start_periode, "");
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1);
    var value1 = req.body.val1;
    var cari1 = req.body.cari1;
    var value2 = req.body.val2;
    var cari2 = req.body.cari2;
    var database = req.query.database;
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
        //-------end check koneksi-----

        connection.query(
          `SELECT * FROM ${convert2} WHERE ${value}='${cari}'`,
          (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }
            records = results;
            if (records.length == 0) {
              return res.status(400).send({
                status: false,
                message: "Terjadi kesalahan",
                data: [],
              });
            }
            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi kesalahan",
                    data: [],
                  });
                });
                return;
              }
              connection.end();
              console.log("Transaction completed successfully!");
              return res.status(200).send({
                status: true,
                message: "Successfuly get data",
                data: results,
              });
            });
          }
        );
      });
    });

    // pool.getConnection(function (err, connection) {

    //   if (err) console.log(err);
    //   connection.query(
    //     `SELECT * FROM ${convert2} WHERE ${value1}='${cari1}' AND ${value2}='${cari2}';`,
    //     function (error, results) {
    //       connection.release();
    //       if (error != null) console.log(error)
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },

  async setting_shift(req, res) {
    console.log("-----setting shift----------");
    var database = req.query.database;
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
        //-------end check koneksi-----

        connection.query(
          `SELECT * FROM shift WHERE default_shift='1'`,
          (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }
            records = results;
            if (records.length == 0) {
              return res.status(400).send({
                status: false,
                message: "Terjadi kesalahan",
                data: [],
              });
            }
            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi kesalahan",
                    data: [],
                  });
                });
                return;
              }
              connection.end();
              console.log("Transaction completed successfully!");
              return res.status(200).send({
                status: true,
                message: "Successfuly get data",
                data: results,
              });
            });
          }
        );
      });
    });

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);;
    //   connection.query(
    //     `SELECT * FROM shift WHERE default_shift='1';`,
    //     function (error, results) {
    //       connection.release();
    //       if (error) console.log(error);
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },

  banner_from_finance(req, res) {
    console.log("-----banneer from finance----------");
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: "sis_admin",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT img,url,seq FROM banner WHERE stsrec = 'A' OR (begin_date>= date(now()) AND end_date <= date(now())) ORDER BY seq`,
        function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
      connection.release();
    });
  },

  historyData(req, res) {
    console.log(
      "-----hoistory data dengan start periode and periode----------"
    );
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");

    console.log(convert1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1);

    console.log("convert 2", convert2);

    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var branchId = req.headers.branch_id;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      timezone: "+00:00",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    console.log("history absen");
    console.log(namaDatabaseDynamic);

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: [],
        });
      } else {
        var url;
        if (
          convert2 == "emp_labor" ||
          convert2 == "emp_leave" ||
          convert2 == "emp_claim"
        ) {
          if (convert2 == "emp_labor") {
            url = ` 
            SELECT emp_labor.status as leave_status, emp_labor.*,overtime.name as type,overtime.dinilai FROM ${startPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND status_transaksi=1 AND (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')  AND branch_id='${branchId}'  ORDER BY id DESC`;

            if (
              montStart < monthEnd ||
              date1.getFullYear() < date2.getFullYear()
            ) {
              url = `
              SELECT emp_labor.id as idd, emp_labor.status as leave_status, emp_labor.*,overtime.name as type ,overtime.dinilai FROM ${startPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND status_transaksi=1  AND (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}'  AND branch_id='${branchId}')   
              UNION ALL
              SELECT emp_labor.id as idd, emp_labor.status as leave_status, emp_labor.*,overtime.name as type ,overtime.dinilai FROM ${endPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND status_transaksi=1 AND (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}'  AND branch_id='${branchId}') 
              ORDER BY idd
              `;
            }
          } else if (convert2 == "emp_claim") {
            url = `SELECT emp_claim.*,cost.name as name  FROM  ${startPeriodeDynamic}.emp_claim JOIN ${database}_hrm.cost  ON cost.id=emp_claim.cost_id WHERE em_id='${em_id}' AND  status_transaksi=1 AND (tgl_ajuan>='${startPeriode}' AND tgl_ajuan<='${endPeriode}') `;

            if (
              montStart < monthEnd ||
              date1.getFullYear() < date2.getFullYear()
            ) {
              url = `
              SELECT emp_claim.id as idd, emp_claim.*,cost.name as name  FROM  ${startPeriodeDynamic}.emp_claim JOIN ${database}_hrm.cost  ON cost.id=emp_claim.cost_id WHERE em_id='${em_id}' AND  status_transaksi=1  AND (tgl_ajuan>='${startPeriode}' AND tgl_ajuan<='${endPeriode}')    
              UNION ALL
              SELECT emp_claim.id as idd, emp_claim.*,cost.name as name  FROM  ${startPeriodeDynamic}.emp_claim JOIN ${database}_hrm.cost  ON cost.id=emp_claim.cost_id WHERE em_id='${em_id}' AND  status_transaksi=1 AND (tgl_ajuan>='${startPeriode}' AND tgl_ajuan<='${endPeriode}') 
              ORDER BY idd
              `;
            }
          } else {
            url = `SELECT * FROM ${convert2} WHERE em_id='${em_id}' ORDER BY id DESC`;
          }
        } else {
          url = `SELECT * FROM ${convert2} WHERE em_id='${em_id}' ORDER BY id DESC`;
        }

        console.log("new ", url);
        connection.query(url, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        });
      }
    });
  },

  emp_leave_load_izin(req, res) {
    console.log("-----Load izin dengan periode----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var query = `SELECT a.*, b.name, b.category, b.leave_day, b.status, b.cut_leave,b.input_time,b.backdate as back_date FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.em_id='${em_id}' AND a.ajuan IN ('2','3','4') AND a.status_transaksi='1' 
    AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'
    ORDER BY id DESC;`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query = `SELECT  a.id as idd,
      a.*, b.name, b.category, b.leave_day, b.status, b.cut_leave,b.input_time,b.backdate as back_date FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.em_id='${em_id}' AND a.ajuan IN ('2','3','4') AND a.status_transaksi='1' 
      AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'
      UNION ALL
      SELECT c.id as idd,
      c.*, d.name, d.category, d.leave_day, d.status, d.cut_leave,d.input_time,d.backdate as back_date FROM ${endPeriodeDynamic}.emp_leave c JOIN ${database}_hrm.leave_types d ON c.typeid=d.id WHERE c.em_id='${em_id}' AND c.ajuan IN ('2','3','4') AND c.status_transaksi='1'
      AND c.atten_date>='${startPeriode}' AND c.atten_date<='${endPeriode}'
      ORDER BY idd DESC
      `;
    }

    console.log(req.query);

    console.log(date1);
    console.log(date2);
    console.log("new ", query);
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: [],
        });
      } else {
        connection.query(query, function (error, results) {
          connection.release();
          if (error != null) console.log(error);

          console.log(query);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            jumlah_data: results.length,
            data: results,
          });
        });
      }
    });
  },
  empIzinCategori(req, res) {
    console.log("-----Load izin----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var typeId = req.body.type_id;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: [],
        });
      } else {
        connection.query(
          `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor JOIN ${database}_hrm.leave_types ON leave_types.id=emp_labor.typeId WHERE em_id='${em_id}' AND emp_labor.typeId='${typeId}'
          UNION ALL
          SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types ON leave_types.id=emp_leave.typeId WHERE em_id='${em_id}' AND emp_leave.typeId='${typeId}'
          `,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error);
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_data: results.length,
              data: results,
            });
          }
        );
      }
    });
  },

  emp_leave_load_dinasluar(req, res) {
    console.log("-----hoistory dinas luar dengan periode----------");
    var database = req.query.database;

    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var url = `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='4' AND status_transaksi='1' AND atten_date>='${startPeriode}' AND atten_date<='${endPeriode}' ORDER BY id DESC;`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      url = `
      SELECT emp_leave.id as idd,emp_leave.* FROM ${startPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='4' AND status_transaksi='1' AND atten_date>='${startPeriode}' AND atten_date<='${endPeriode}' 

      UNION ALL

      SELECT emp_leave. id as  idd,emp_leave.* FROM ${endPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='4' AND status_transaksi='1' AND atten_date>='${startPeriode}' AND atten_date<='${endPeriode}'
      
      ORDER BY idd DESC
      `;
    }

    console.log(url);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: [],
        });
      } else {
        connection.query(url, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            jumlah_data: results.length,
            data: results,
          });
        });
      }
    });
  },

  historyAjuanTidakMasukKerja(req, res) {
    console.log("-----hoistory ajuan tidak masuk kerja----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var ajuan = req.body.ajuan;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    // var array1=startPeriode.split('-')
    // var array2=endPeriode.split('-')

    // const startPeriodeDynamic=`${database}_hrm${array1[0].substring(2,4)}${array1[1]}`
    // const endPeriodeDynamic=`${database}_hrm${array2[1].substring(2,4)}${array1[1]}`
    var queryCuti = ` SELECT a.*, b.name, b.id as id_type FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${em_id}'  
    AND a.status_transaksi='1'  AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' AND cut_leave='1' ORDER BY a.id DESC `;

    // let date1 = new Date(startPeriode);
    // let date2 = new Date(endPeriode);

    // if (date1 > date2) {
    //   query=` SELECT a.*, b.name, b.id as id_type FROM ${startPeriodeDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${em_id}'  AND a.status_transaksi='1' AND  a.atten_date>='${startPeriode}'

    //   UNION

    //   SELECT c.*, d.name, b.id as id_type FROM ${endPeriodeDynamic}.emp_leave c INNER JOIN ${database}_hrm.leave_types as d ON c.typeid=d.id WHERE c.em_id='${em_id}'  AND c.status_transaksi='1' AND  c.atten_date<='${endPeriode}'

    //   ORDER BY id DESC`

    // }
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var queryCuti = ` SELECT a.*, b.name, b.id as id_type FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${em_id}' 
     AND a.status_transaksi='1'  AND  b.cut_leave='1'
    AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'
    ORDER BY a.id DESC`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      queryCuti = `
      SELECT a.id as idd,a.*, b.name, b.id as id_type FROM ${startPeriodeDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${em_id}'  AND a.status_transaksi='1'
      AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' AND b.cut_leave='1'
  
      UNION ALL
      SELECT a.id as idd,a.*, b.name, b.id as id_type FROM ${endPeriodeDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${em_id}'  AND a.status_transaksi='1' 
      AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  AND b.cut_leave='1'

      `;
    }
    console.log(queryCuti);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: [],
        });
      } else {
        console.log(queryCuti);
        connection.query(queryCuti, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.status(200).send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        });
      }
    });
  },
  async historyPermintaanKandidat(req, res) {
    var database = req.query.database;
    console.log("-----history permintaan kandidat----------");
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var status = req.body.status;

    var script1 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' ORDER BY a.nomor_ajuan DESC`;
    var script2 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' AND c.id='${status}' ORDER BY a.nomor_ajuan DESC`;

    var url;
    if (status == "0") {
      url = script1;
    } else {
      url = script2;
    }

    const connection = await model.createConnection(database);
    var dep_id = req.body.dep_id;

    // var query1 = `SELECT * FROM ${database}_hrm.employee WHERE status='ACTIVE'`;
    // var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND status='ACTIVE'`;

    // var url;
    // if (dep_id == "0" || dep_id == 0) {
    //   url = query1;
    // } else {
    //   url = query2;
    // }
    //-----begin check koneksi----
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
        //-------end check koneksi-----

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
            return res.status(200).send({
              status: true,
              message: "data kosong",
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

    // var bulan = req.body.bulan;
    // var tahun = req.body.tahun;
    // var status = req.body.status;

    // var script1 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' ORDER BY a.nomor_ajuan DESC`;
    // var script2 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' AND c.id='${status}' ORDER BY a.nomor_ajuan DESC`;

    // var url;
    // if (status == "0") {
    //   url = script1;
    // } else {
    //   url = script2;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) {
    //     res.send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.query(
    //       url,
    //       function (error, results) {
    //         if (error != null) console.log(error)
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil data!",
    //           data: results
    //         });
    //       }
    //     );
    //     connection.release();
    //   }
    // });
  },

  getMenuDashboard(req, res) {
    console.log("-----get menu dashbopard----------");
    console.log(req.query.database);
    var database = req.query.database;
    var dbmaster = `${database}_hrm`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
        `SELECT * FROM modul WHERE status= 1;`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          var modul = results;
          connection.query(
            // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
            `SELECT * FROM menu;`,
            function (error, menulist) {
              if (error != null) console.log(error);
              var menu = menulist;
              var idx = 0;
              var finalData = [];
              for (var i = 0; i < modul.length; i++) {
                var menuConvert = [];
                for (var j = 0; j < menu.length; j++) {
                  if (menu[j].id_modul == modul[i].id_modul) {
                    var filMenu = {
                      id_menu: menu[j].id_menu,
                      nama_menu: menu[j].nama_menu,
                      gambar: menu[j].gambar,
                      url: menu[j].url,
                    };
                    menuConvert.push(filMenu);
                  }
                }
                var data = {
                  index: idx,
                  nama_modul: modul[i].nama_modul,
                  status: false,
                  menu: menuConvert,
                };
                idx = idx + 1;
                finalData.push(data);
              }
              res.send({
                status: true,
                message: "Berhasil ambil data!",
                data: finalData,
              });
            }
          );
        }
      );
    });
  },
  showMenuDashboard(req, res) {
    console.log("-----show menu dashboard----------");
    var database = req.query.database;
    var dbmaster = `${database}_hrm`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var emId = req.query.em_id;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
        `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}' AND menu_dashboard.default='1'`,
        // `SELECT * FROM menu_dashboard`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          if (results.length > 0) {
            var modulStatic = [
              {
                status: 0,
                nama_modul: "Menu Utama",
              },
              {
                status: 1,
                nama_modul: "Payroll",
              },
            ];
            var menu = results;
            var idx = 0;
            var finalData = [];
            for (var i = 0; i < modulStatic.length; i++) {
              var menuConvert = [];
              for (var j = 0; j < menu.length; j++) {
                if (menu[j].status == modulStatic[i].status) {
                  var filMenu = {
                    id: menu[j].id,
                    nama: menu[j].nama,
                    url: menu[j].url,
                    gambar: menu[j].gambar,
                  };
                  menuConvert.push(filMenu);
                }
              }
              var data = {
                index: idx,
                nama_modul: modulStatic[i].nama_modul,
                status: false,
                menu: menuConvert,
              };
              idx = idx + 1;
              finalData.push(data);
            }
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: finalData,
            });
          } else {
            connection.query(
              // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
              //  `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
              "SELECT * FROM  menu_dashboard WHERE  `default`=1 ",
              function (error, results) {
                if (error != null) console.log(error);

                var modulStatic = [
                  {
                    status: 0,
                    nama_modul: "Menu Utama",
                  },
                  {
                    status: 1,
                    nama_modul: "Payroll",
                  },
                ];
                var menu = results;
                var idx = 0;
                var finalData = [];
                for (var i = 0; i < modulStatic.length; i++) {
                  var menuConvert = [];
                  for (var j = 0; j < menu.length; j++) {
                    if (menu[j].status == modulStatic[i].status) {
                      var filMenu = {
                        id: menu[j].id,
                        nama: menu[j].nama,
                        url: menu[j].url,
                        gambar: menu[j].gambar,
                      };
                      menuConvert.push(filMenu);
                    }
                  }
                  var data = {
                    index: idx,
                    nama_modul: modulStatic[i].nama_modul,
                    status: false,
                    menu: menuConvert,
                  };
                  idx = idx + 1;
                  finalData.push(data);
                }
                res.send({
                  status: true,
                  message: "Berhasil ambil data!",
                  data: finalData,
                });
              }
            );
          }
        }
      );
    });
  },
  showMenuDashboardUtama(req, res) {
    console.log("-----show menu dashboard----------");
    var database = req.query.database;
    var dbmaster = `${database}_hrm`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var emId = req.query.em_id;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
        `SELECT * FROM menu_dashboard_utama_user JOIN menu_dashboard_utama ON menu_dashboard_utama.id = menu_dashboard_utama_user.menu_id  WHERE menu_dashboard_utama_user.em_id='${emId}'`,
        // `SELECT * FROM menu_dashboard`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          if (results.length > 0) {
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          } else {
            connection.query(
              // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
              //  `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
              `SELECT * FROM menu_dashboard_utama`,
              function (error, results) {
                if (error != null) console.log(error);

                res.send({
                  status: true,
                  message: "Berhasil ambil data!",
                  data: results,
                });
              }
            );
          }
        }
      );
    });
  },

  // showMenuDashboard(req, res) {
  //   console.log('-----show menu dashboard----------')
  //   var database=req.query.database;
  //   var dbmaster=`${database}_hrm`

  //   const configDynamic = {
  //     multipleStatements: true,
  //                host: ipServer,//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: dbmaster,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);
  //   var emId=req.query.em_id;
  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) console.log(err);
  //     connection.query(
  //       // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
  //        `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
  //       //`SELECT * FROM menu_dashboard`,
  //       function (error, results) {
  //         connection.release();

  //       if (results.length>0){
  //         if (error != null) console.log(error)
  //         var modulStatic = [
  //           {
  //             "status": 0,
  //             "nama_modul": "Menu Utama",
  //           },
  //           {
  //             "status": 1,
  //             "nama_modul": "Payroll",
  //           }
  //         ];
  //         var menu = results;
  //         var idx = 0;
  //         var finalData = [];
  //         for (var i = 0; i < modulStatic.length; i++) {
  //           var menuConvert = [];
  //           for (var j = 0; j < menu.length; j++) {
  //             if (menu[j].status == modulStatic[i].status) {
  //               var filMenu = {
  //                 'id': menu[j].id,
  //                 'nama': menu[j].nama,
  //                 'url': menu[j].url,
  //                 'gambar': menu[j].gambar
  //               }
  //               menuConvert.push(filMenu)
  //             }
  //           }
  //           var data = {
  //             'index': idx,
  //             'nama_modul': modulStatic[i].nama_modul,
  //             'status': false,
  //             'menu': menuConvert,
  //           };
  //           idx = idx + 1;
  //           finalData.push(data);
  //         }
  //         res.send({
  //           status: true,
  //           message: "Berhasil ambil data!",
  //           data: finalData,
  //         });

  //       }else{
  //         connection.query(
  //           // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
  //           //  `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
  //           `SELECT * FROM menu_dashboard`,
  //           function (error, results) {
  //             connection.release();

  //             if (error != null) console.log(error)
  //             var modulStatic = [
  //               {
  //                 "status": 0,
  //                 "nama_modul": "Menu Utama",
  //               },
  //               {
  //                 "status": 1,
  //                 "nama_modul": "Payroll",
  //               }
  //             ];
  //             var menu = results;
  //             var idx = 0;
  //             var finalData = [];
  //             for (var i = 0; i < modulStatic.length; i++) {
  //               var menuConvert = [];
  //               for (var j = 0; j < menu.length; j++) {
  //                 if (menu[j].status == modulStatic[i].status) {
  //                   var filMenu = {
  //                     'id': menu[j].id,
  //                     'nama': menu[j].nama,
  //                     'url': menu[j].url,
  //                     'gambar': menu[j].gambar
  //                   }
  //                   menuConvert.push(filMenu)
  //                 }
  //               }
  //               var data = {
  //                 'index': idx,
  //                 'nama_modul': modulStatic[i].nama_modul,
  //                 'status': false,
  //                 'menu': menuConvert,
  //               };
  //               idx = idx + 1;
  //               finalData.push(data);
  //             }
  //             res.send({
  //               status: true,
  //               message: "Berhasil ambil data!",
  //               data: finalData,
  //             });

  //           }
  //         );

  //       }

  //       }
  //     );

  //   });
  // },
  insertData(req, res) {
    console.log("-----insert data tugas luar----------");
    console.log("data absen ", req.body);
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1);

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;
    console.log("em_id", req.body);
    console.log("em_id 1", req.query);
    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;

    var script = `INSERT INTO ${nameTable} SET ?`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy,
    };

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.release();
        if (
          nameTable == "emp_labor" ||
          nameTable == "emp_leave" ||
          nameTable == "emp_claim"
        ) {
          if (nameTable == "emp_claim") {
            delete bodyValue.atten_date;
            delete bodyValue.approve_status;
          }
          connection.query(
            `SELECT * FROM ${nameTable} WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
            function (error, results) {
              if (results.length == 0) {
                connection.query(
                  script,
                  [bodyValue],
                  function (error, results) {
                    if (error != null) console.log(error);
                    connection.query(
                      `INSERT INTO logs_actvity SET ?;`,
                      [dataInsertLog],
                      function (error) {
                        if (error != null) console.log(error);
                      }
                    );
                    res.send({
                      status: true,
                      message: "Berhasil berhasil di tambah!",
                    });
                  }
                );
              } else {
                res.send({
                  status: false,
                  message: "ulang",
                  data: results,
                });
              }
            }
          );
        } else {
          connection.query(script, [bodyValue], function (error, results) {
            if (error != null) console.log(error);
            connection.query(
              `INSERT INTO logs_actvity SET ?;`,
              [dataInsertLog],
              function (error) {
                if (error != null) console.log(error);
              }
            );
            res.send({
              status: true,
              message: "Berhasil berhasil di tambah!",
            });
          });
        }
      }
    });
  },
  async approvalTransaksiNew(req, res) {
    try {
      //aproval tugas luar,dinas luar,cuti,lembur,izin
      //console.log()
      console.log("-----approaval transaksi ----------");
      var database = req.query.database;
      let name_url = req.originalUrl;
      var convert1 = name_url
        .substring(name_url.lastIndexOf("/") + 1)
        .replace("?database=" + req.query.database, "")
        .replace("&start_periode=" + req.query.start_periode, "")
        .replace("&end_periode=" + req.query.end_periode, "");
      var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1);

      var nameTable = name_url
        .substring(name_url.lastIndexOf("/") + 1)
        .replace("?database=" + req.query.database, "")
        .replace("&start_periode=" + req.query.start_periode, "")
        .replace("&end_periode=" + req.query.end_periode, "");
      var nameWhere = req.body.val;
      var cariWhere = req.body.cari;
      var menu_name = req.body.menu_name;
      var activity_name = req.body.activity_name;
      var atten_date = req.body.atten_date;
      var createdBy = req.body.created_by;
      var bodyStatusFinal =
        req.body.status == undefined ? req.body.leave_status : req.body.status;
      var bodyValue = req.body;
      var emId = req.body.em_id;
      var approveId =
        req.body.approve_id == undefined
          ? req.body.apply_id
          : req.body.approve_id;
      var leaveTypes =
        req.body.leave_type == undefined ? "" : req.body.leave_type;
      var typeId = req.body.typeid == undefined ? "" : req.body.typeid;
      console.log("data approval ", req.body);
      var tasks = req.body.tasks;
      console.log("task  ", tasks);
      var totalPersentase = req.body.total_persentase;

      delete bodyValue.val;
      delete bodyValue.cari;

      delete bodyValue.menu_name;
      delete bodyValue.activity_name;

      delete bodyValue.created_by;

      delete bodyValue.total_persentase;
      delete bodyValue.tasks;

      console.log(menu_name);
      // return;
      if (menu_name == "Lembur" || menu_name == "Tugas Luar") {
        nameTable = "emp_labor";
      }

      if (
        menu_name == "Sakit" ||
        menu_name.includes("LEAVE") ||
        menu_name.includes("EARLY OUT PERMIT") ||
        menu_name == "Izin" ||
        menu_name == "Cuti" ||
        leaveTypes == "FULLDAY" ||
        leaveTypes == "FULL DAY" ||
        leaveTypes == "HALFDAY" ||
        leaveTypes == "HALF" ||
        menu_name == "Dinas Luar"
      ) {
        nameTable = "emp_leave";

        console.log("masuk sini ", nameTable);
      }
      if (nameTable == "emp_claim") {
        delete bodyValue.atten_date;
      }

      var script = `UPDATE ${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;

      console.log(script);

      var dataInsertLog = {
        menu_name: menu_name,
        activity_name: activity_name,
        acttivity_script: script,
        createdUserID: createdBy,
      };

      console.log(req.body);

      var array = [];
      try {
        array = atten_date.split("-");
      } catch (error) {
        array = req.body.start_date.split("-");
      }
      const getTahun = array[0];
      const getBulan = array[1];

      const tahun = `${getTahun}`;
      const convertYear = tahun.substring(2, 4);
      var convertBulan;
      if (getBulan.length == 1) {
        convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
      } else {
        convertBulan = getBulan;
      }
      let namaTransaksi = "";
      let urlTransaksi = "";
      const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

      console.log(namaDatabaseDynamic);
      const databaseMaster = `${database}_hrm`;
      var script = `UPDATE ${namaDatabaseDynamic}.${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;
      var getDataTransaksi = `SELECT * FROM  ${namaDatabaseDynamic}. ${nameTable}  WHERE ${nameWhere} = '${cariWhere}'`;

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

          connection.query(
            `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?;`,
            [dataInsertLog],
            (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "gaga ambil data",
                    data: [],
                  });
                });
                return;
              }

              connection.query(getDataTransaksi, (err, transaksi) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: "gaga ambil data",
                      data: [],
                    });
                  });
                  return;
                }
                connection.query(
                  `SELECT IFNULL(name,'') as name FROM ${database}_hrm.sysdata WHERE KODE IN ('022','023','013','044')`,
                  (err, sysdata) => {
                    if (err) {
                      console.error("Error executing SELECT statement:", err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: "gaga ambil data",
                          data: [],
                        });
                      });
                      return;
                    }

                    if (
                      (menu_name == "Lembur" &&
                        sysdata[0].name == "1" &&
                        bodyStatusFinal == "Approve") ||
                      (menu_name == "Lembur" &&
                        sysdata[0].name == "2" &&
                        bodyStatusFinal == "Approve2")
                    ) {
                      for (var i = 0; i < tasks.length; i++) {
                        connection.query(
                          `UPDATE ${namaDatabaseDynamic}.emp_labor_task SET persentase='${tasks[i]["persentase"]}' WHERE id='${tasks[i]["id"]}' `,
                          (err, employeeApproved) => {
                            if (err) {
                              console.error(
                                "Error executing SELECT statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "gaga ambil data",
                                  data: [],
                                });
                              });
                              return;
                            }
                          }
                        );
                      }

                      if (tasks.length > 0) {
                        console.log("Persentase ", totalPersentase);
                        console.log("nilai data ", sysdata[3].name);

                        if (
                          parseFloat(totalPersentase.toString()) <
                          parseFloat(sysdata[3].name.toString())
                        ) {
                          console.log("masuk sini");

                          if (sysdata[0].name == "2") {
                            bodyValue.approve2_status = "Rejected";
                            bodyStatusFinal = "Rejected";
                            bodyValue.status = "Rejected";
                          } else {
                            bodyValue.approve_status = "Rejected";
                            bodyValue.status = "Rejected";
                            bodyStatusFinal = "Rejected";
                          }
                        } else {
                          if (sysdata[0].name == "2") {
                            bodyStatusFinal = "Approve2";
                            bodyValue.approve2_status = "Approve";
                            bodyValue.status = "Approve2";
                          } else {
                            bodyStatusFinal = "Approve";
                            bodyValue.approve_status = "Approve";
                            bodyValue.status = "Approve";
                          }
                        }
                      }
                    }
                    console.log(bodyValue);

                    connection.query(script, [bodyValue], (err, results) => {
                      if (err) {
                        console.error("Error executing SELECT statement:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: "gaga ambil data",
                            data: [],
                          });
                        });
                        return;
                      }

                      connection.query(
                        `SELECT * FROM ${database}_hrm.leave_types WHERE id='${typeId}'`,
                        (err, leaveTypes) => {
                          if (err) {
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "gaga ambil data",
                                data: [],
                              });
                            });
                            return;
                          }

                          console.log("leave", leaveTypes);

                          connection.query(
                            `SELECT * FROM employee WHERE em_id='${emId}'`,
                            (err, employee) => {
                              if (err) {
                                console.error(
                                  "Error executing SELECT statement:",
                                  err
                                );
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: "gaga ambil data",
                                    data: [],
                                  });
                                });
                                return;
                              }

                              connection.query(
                                `SELECT * FROM employee WHERE em_id='${approveId}'`,
                                (err, employeeApproved) => {
                                  if (err) {
                                    console.error(
                                      "Error executing SELECT statement:",
                                      err
                                    );
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: "gaga ambil data",
                                        data: [],
                                      });
                                    });
                                    return;
                                  }

                                  /*
                    
                    kode 013 singgle atau multi
                    kode 022 peneriama notifikasi reject
                    kode 023 peneriaman notifikasi approve
                    
                    */

                                  if (menu_name == "Lembur") {
                                    namaTransaksi = "Lembur";
                                    urlTransaksi = "Lembur";
                                  }

                                  if (leaveTypes.length > 0) {
                                    if (
                                      leaveTypes[0].status == "2" ||
                                      leaveTypes[0].status == 2
                                    ) {
                                      namaTransaksi = "Sakit";
                                      urlTransaksi = "sakit";
                                    }
                                    if (
                                      leaveTypes[0].status == "1" ||
                                      leaveTypes[0].status == 1
                                    ) {
                                      namaTransaksi = "Cuti";
                                      urlTransaksi = "Cuti";
                                    }

                                    if (
                                      leaveTypes[0].status == "3" ||
                                      leaveTypes[0].status == 3
                                    ) {
                                      namaTransaksi = "Izin";
                                      urlTransaksi = "Izin";
                                    }
                                  }

                                  if (menu_name == "Tugas Luar") {
                                    namaTransaksi = "Tugas Luar";
                                    urlTransaksi = "TugasLuar";
                                  }

                                  if (menu_name == "Dinas Luar") {
                                    namaTransaksi = "Dinas Luar";
                                    urlTransaksi = "DinasLuar";
                                  }

                                  if (menu_name == "emp_claim") {
                                    namaTransaksi = "Klaim";
                                    urlTransaksi = "Klaim";
                                  }

                                  if (menu_name == "Surat Peringatan") {
                                    namaTransaksi = "Surat Peringatan";
                                    urlTransaksi = "Surat Peringatan";
                                  }

                                  // alur 1  approval
                                  // if (sysdata[0].name=="1" ||sysdata[0].name==1){
                                  // //ketika approve
                                  // if (bodyStatusFinal=='Approve' || bodyStatusFinal=='Approve'){
                                  // var listData=sysdata[2].name.toString().split(',')
                                  //   for (var i=0;i<listData.length;i++){
                                  //     if (listData[i]!=''){
                                  //     var title='';
                                  //     var deskripsi='';
                                  //     title=`Approval ${namaTransaksi}`
                                  //     deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`
                                  //     connection.query(
                                  //       `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                  //       (err, employee) => {
                                  //       if (err) {
                                  //         console.error('Error executing SELECT statement:', err);
                                  //         connection.rollback(() => {
                                  //           connection.end();
                                  //           return res.status(400).send({
                                  //             status: true,
                                  //             message: 'gaga ambil data',
                                  //             data:[]

                                  //           });
                                  //         });
                                  //         return;
                                  //       }

                                  //     connection.query(
                                  //       `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0,'${emId}','${transaksi[0].id}')`,
                                  //       (err, results) => {
                                  //       if (err) {
                                  //         console.error('Error executing SELECT statement:', err);
                                  //         connection.rollback(() => {
                                  //           connection.end();
                                  //           return res.status(400).send({
                                  //             status: true,
                                  //             message: 'gaga ambil data',
                                  //             data:[]

                                  //           });
                                  //         });
                                  //         return;
                                  //       }

                                  //         utility.notifikasi(employee[0].token_notif,title,message)
                                  //     });
                                  //   });

                                  // }

                                  //   }

                                  //   //jika approve
                                  // }
                                  // //ketika rejected
                                  // if (bodyStatusFinal=='Rejected' || bodyStatusFinal=='Rejected'){
                                  //   console.log("Masuk reject query")
                                  //   var listData=sysdata[1].name.toString().split(',')

                                  //     for (var i=0;i<listData.length;i++){
                                  //       console.log("Masuk reject query 1")
                                  //       console.log(namaTransaksi)

                                  //       if (listData[i]!=''){
                                  //       title=`Rejection ${namaTransaksi}`
                                  //       deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`

                                  //       connection.query(
                                  //         `SELECT  * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                  //         (err, employee) => {
                                  //         if (err) {
                                  //           console.error('Error executing SELECT statement:', err);
                                  //           connection.rollback(() => {
                                  //             connection.end();
                                  //             return res.status(400).send({
                                  //               status: true,
                                  //               message: 'gaga ambil data',
                                  //               data:[]

                                  //             });
                                  //           });
                                  //           return;
                                  //         }
                                  //       connection.query(
                                  //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0,'${emId}','${transaksi[0].id}')`,
                                  //        (err, results) => {
                                  //         if (err) {
                                  //           console.error('Error executing SELECT statement:', err);
                                  //           connection.rollback(() => {
                                  //             connection.end();
                                  //             return res.status(400).send({
                                  //               status: true,
                                  //               message: 'gaga ambil data',
                                  //               data:[]

                                  //             });
                                  //           });
                                  //           return;
                                  //         }     });

                                  //           utility.notifikasi(employee[0].token_notif,title,message)
                                  //       });

                                  //     }

                                  //   }

                                  //     //jika approve

                                  //   }
                                  // }

                                  // alur 2  approval
                                  // console.log('sys data',sysdata)
                                  // if (sysdata[0].name=="2" ||sysdata[0].name==2){
                                  // //keti approve
                                  // if (bodyStatusFinal=='Approve2' || bodyStatusFinal=='Approve2'){
                                  // console.log('data  em id approve',sysdata[2].toString())
                                  //  var listData=sysdata[2].name.toString().split(',')
                                  // console.log('data  em id approve',listData)

                                  //   for (var i=0;i<listData.length;i++){
                                  //     console.log('proses ',i,listData[i])

                                  //     if (listData[i]!=''){

                                  //       var title='';
                                  //       var deskripsi='';
                                  //       console.log(listData[i])
                                  //       title=`Approval ${namaTransaksi}`
                                  //       deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`
                                  //       connection.query(
                                  //         `SELECT *  FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                  //         (err, employee) => {
                                  //         if (err) {
                                  //           console.error('Error executing SELECT statement:', err);
                                  //           connection.rollback(() => {
                                  //             connection.end();
                                  //             return res.status(400).send({
                                  //               status: true,
                                  //               message: 'gaga ambil data',
                                  //               data:[]

                                  //             });
                                  //           });
                                  //           return;
                                  //         }

                                  //       connection.query(
                                  //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi
                                  //         }',CURDATE(),CURTIME(),1,0,'${emId}','${transaksi[0].id}')`,

                                  //         (err, results) => {
                                  //         if (err) {
                                  //           console.error('Error executing SELECT statement:', err);
                                  //           connection.rollback(() => {
                                  //             connection.end();
                                  //             return res.status(400).send({
                                  //               status: true,
                                  //               message: 'gaga ambil data',
                                  //               data:[]

                                  //             });
                                  //           });
                                  //           return;
                                  //         }
                                  //          console.log("employee id ",listData[i])
                                  //           utility.notifikasi(employee[0].token_notif,title,deskripsi)
                                  //       });

                                  //       });

                                  //     }

                                  //   }
                                  //   //jika approve

                                  // }

                                  // //keti approve
                                  // if (bodyStatusFinal=='Rejected' || bodyStatusFinal=='Rejected'){
                                  //   var listData=sysdata[1].name.toString().split(',')

                                  //     for (var i=0;i<listData.length;i++){

                                  //     if (listData[i]!=''){

                                  //       title=`Rejection ${namaTransaksi}`
                                  //       deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`

                                  //       connection.query(
                                  //         `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                  //         (err, employee) => {
                                  //         if (err) {
                                  //           console.error('Error executing SELECT statement:', err);
                                  //           connection.rollback(() => {
                                  //             connection.end();
                                  //             return res.status(400).send({
                                  //               status: true,
                                  //               message: 'gaga ambil data',
                                  //               data:[]

                                  //             });
                                  //           });
                                  //           return;
                                  //         }
                                  //       connection.query(
                                  //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0,0,'${emId}','${transaksi[0].id}')`,
                                  //        (err, results) => {
                                  //         if (err) {
                                  //           console.error('Error executing SELECT statement:', err);
                                  //           connection.rollback(() => {
                                  //             connection.end();
                                  //             return res.status(400).send({
                                  //               status: true,
                                  //               message: 'gaga ambil data',
                                  //               data:[]

                                  //             });
                                  //           });
                                  //           return;
                                  //         }

                                  //           utility.notifikasi(employee[0].token_notif,title,deskripsi)
                                  //       });

                                  //       });
                                  //     }

                                  //     }
                                  //     //jika approve

                                  //   }

                                  // }

                                  connection.commit((err) => {
                                    if (err) {
                                      CURTIME(), 1, 0;
                                      console.error(
                                        "Error committing transaction:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "Gagal ambil data",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }

                                    connection.end();
                                    console.log(
                                      "Transaction completed successfully!"
                                    );
                                    return res.status(200).send({
                                      status: true,
                                      message: "Data berhasil di ambil",
                                      // data:records
                                    });
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    });
                  }
                );
              });
            }
          );
        });
      });
    } catch (e) {}
  },

  async approvalTransaksi(req, res) {
    try {
      // delete bodyValue.konsekuensi;
      // delete bodyValue.status_pengajuan;
      //aproval tugas luar,dinas luar,cuti,lembur,izin
      //console.log()
      console.log("-----approaval transaksi ----------");
      var database = req.query.database;
      let name_url = req.originalUrl;
      var convert1 = name_url
        .substring(name_url.lastIndexOf("/") + 1)
        .replace("?database=" + req.query.database, "")
        .replace("&start_periode=" + req.query.start_periode, "")
        .replace("&end_periode=" + req.query.end_periode, "");
      var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1);

      var nameTable = name_url
        .substring(name_url.lastIndexOf("/") + 1)
        .replace("?database=" + req.query.database, "")
        .replace("&start_periode=" + req.query.start_periode, "")
        .replace("&end_periode=" + req.query.end_periode, "");
      var nameWhere = req.body.val;
      var cariWhere = req.body.cari;
      var menu_name = req.body.menu_name;
      var activity_name = req.body.activity_name;
      var atten_date = req.body.atten_date;
      var createdBy = req.body.created_by;
      var bodyStatusFinal =
        req.body.status == undefined ? req.body.leave_status : req.body.status;
      var bodyValue = req.body;
      var emId = req.body.em_id;
      var approveId =
        req.body.approve_id == undefined
          ? req.body.apply_id
          : req.body.approve_id;
      var leaveTypes =
        req.body.leave_type == undefined ? "" : req.body.leave_type;
      var typeId = req.body.typeid == undefined ? "" : req.body.typeid;
      console.log("data approval ", req.body);
      delete bodyValue.val;
      delete bodyValue.cari;
      delete bodyValue.menu_name;
      delete bodyValue.activity_name;
      delete bodyValue.created_by;
      var jenisTrabsaksi = "";
      var tipeSurat = req.body.tipe_surat;
      var konsekuensi = req.body.konsekuensi;

      console.log(menu_name);
      // return;
      if (menu_name == "Lembur" || menu_name == "Tugas Luar") {
        nameTable = "emp_labor";
        delete bodyValue.tasks;
        delete bodyValue.total_persentase;
      }

      if (
        menu_name == "Sakit" ||
        menu_name.includes("LEAVE") ||
        menu_name.includes("EARLY OUT PERMIT") ||
        menu_name == "Izin" ||
        menu_name == "Cuti" ||
        leaveTypes == "FULLDAY" ||
        leaveTypes == "FULL DAY" ||
        leaveTypes == "HALFDAY" ||
        leaveTypes == "HALF" ||
        menu_name == "Dinas Luar"
      ) {
        delete bodyValue.konsekuensi;
        nameTable = "emp_leave";
        console.log("masuk sini ", nameTable);
      }
      if (nameTable == "emp_claim") {
        delete bodyValue.atten_date;
      }

      var alasanReject =
        req.body.alasan_reject == undefined ? "" : req.body.alasan_reject;

      var script = `UPDATE ${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;

      console.log(script);

      var dataInsertLog = {
        menu_name: menu_name,
        activity_name: activity_name,
        acttivity_script: script,
        createdUserID: createdBy,
      };

      console.log(req.body);

      var array = [];
      try {
        array = atten_date.split("-");
      } catch (error) {
        array = req.body.start_date.split("-");
      }
      const getTahun = array[0];
      const getBulan = array[1];

      const tahun = `${getTahun}`;
      const convertYear = tahun.substring(2, 4);
      var convertBulan;
      if (getBulan.length == 1) {
        convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
      } else {
        convertBulan = getBulan;
      }
      let namaTransaksi = "";
      let urlTransaksi = "";
      const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

      console.log(namaDatabaseDynamic);
      const databaseMaster = `${database}_hrm`;
      var script = `UPDATE ${namaDatabaseDynamic}.${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;
      var getDataTransaksi = `SELECT * FROM  ${namaDatabaseDynamic}.${nameTable}  WHERE ${nameWhere} = '${cariWhere}'`;

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

          connection.query(
            `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?`,
            [dataInsertLog],
            (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "gaga ambil data",
                    data: [],
                  });
                });
                return;
              }

              connection.query(getDataTransaksi, (err, transaksi) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: "gaga ambil data",
                      data: [],
                    });
                  });
                  return;
                }
                connection.query(
                  `SELECT IFNULL(name,'') as name FROM ${database}_hrm.sysdata WHERE KODE IN ('022','023','013','044')`,
                  (err, sysdata) => {
                    if (err) {
                      console.error("Error executing SELECT statement:", err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: "gaga ambil data",
                          data: [],
                        });
                      });
                      return;
                    }

                    connection.query(script, [bodyValue], (err, results) => {
                      if (err) {
                        console.error("Error executing SELECT statement:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: "gaga ambil data",
                            data: [],
                          });
                        });
                        return;
                      }

                      connection.query(
                        `SELECT * FROM ${database}_hrm.leave_types WHERE id='${typeId}'`,
                        (err, leaveTypes) => {
                          if (err) {
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "gaga ambil data",
                                data: [],
                              });
                            });
                            return;
                          }

                          console.log("leave", leaveTypes);

                          connection.query(
                            `SELECT * FROM employee WHERE em_id='${emId}'`,
                            (err, employee) => {
                              if (err) {
                                console.error(
                                  "Error executing SELECT statement:",
                                  err
                                );
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: "gaga ambil data",
                                    data: [],
                                  });
                                });
                                return;
                              }

                              connection.query(
                                `SELECT * FROM employee WHERE em_id='${approveId}'`,
                                (err, employeeApproved) => {
                                  if (err) {
                                    console.error(
                                      "Error executing SELECT statement:",
                                      err
                                    );
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: "gaga ambil data",
                                        data: [],
                                      });
                                    });
                                    return;
                                  }

                                  console.log(
                                    "--------Surat Teguran || Surat Peringatan-----------"
                                  );
                                  if (tipeSurat == "teguran_lisan") {
                                    connection.query(
                                      `    SELECT * FROM teguran_lisan WHERE MONTH(tgl_surat) = MONTH(CURRENT_DATE) AND YEAR(tgl_surat) = YEAR(CURRENT_DATE)`,
                                      (err, teguranLisan) => {
                                        if (err) {
                                          console.error(
                                            "Error executing SELECT statement:",
                                            err
                                          );
                                          connection.rollback(() => {
                                            connection.end();
                                            return res.status(400).send({
                                              status: true,
                                              message: "gaga ambil data",
                                              data: [],
                                            });
                                          });
                                          return;
                                        }
                                        var nomorLb = `LI20${convertYear}${convertBulan}`;
                                        if (teguranLisan.length > 0) {
                                          var text = teguranLisan[0]["nomor"];
                                          var nomor =
                                            parseInt(text.substring(8, 13)) + 1;
                                          var nomorStr = String(nomor).padStart(
                                            4,
                                            "0"
                                          );
                                          nomorLb = nomorLb + nomorStr;
                                        } else {
                                          var nomor = 1;
                                          var nomorStr = String(nomor).padStart(
                                            4,
                                            "0"
                                          );
                                          nomorLb = nomorLb + nomorStr;
                                        }

                                        connection.query(
                                          `INSERT INTO teguran_lisan (
                                            nomor,
                                            nomor_surat,
                                            hal,
                                            tgl_surat,
                                            em_id,
                                            letter_id,
                                            eff_date,
                                            pelanggaran,
                                            status,
                                            diterbitkan_oleh) VALUE(
                                            '${nomorLb}',
                                            '009/HRD/TeguranLisan/${nomorStr}',
                                            'Teguran Lisan',
                                            '${utility.dateNow2()}',
                                            '${emId}',
                                            '9',
                                            '${utility.dateNow2()}',
                                            '${alasanReject}',
                                            'Pending',
                                            '${approveId}')`,
                                          (err, teguranLisan) => {
                                            if (err) {
                                              console.error(
                                                "Error executing SELECT statement:",
                                                err
                                              );
                                              connection.rollback(() => {
                                                connection.end();
                                                return res.status(400).send({
                                                  status: true,
                                                  message: "gaga ambil data",
                                                  data: [],
                                                });
                                              });
                                              return;
                                            }
                                            // console.log(
                                            //   `SELECT * FROM ${namaDatabaseDynamic}.${nameTable} WHERE ${nameWhere} = '${cariWhere}'`
                                            // );
                                            // connection.query(
                                            //   `SELECT * FROM ${namaDatabaseDynamic}.${nameTable} WHERE ${nameWhere} = '${cariWhere}'`
                                            // )

                                            var konsekuensiArray =
                                              konsekuensi.split(",");
                                            console.log(konsekuensiArray);
                                            console.log(teguranLisan);

                                            for (
                                              var i = 0;
                                              i < konsekuensiArray.length;
                                              i++
                                            ) {
                                              var data =
                                                konsekuensiArray[i].trim();
                                              console.log(data);
                                              console.log(
                                                `INSERT INTO teguran_lisan_detail (teguran_lisan_id,name) VALUE('${teguranLisan.insertId}','${data}')`
                                              );
                                              connection.query(
                                                `INSERT INTO teguran_lisan_detail (teguran_lisan_id, name) VALUE('${teguranLisan.insertId}', '${data}')`,
                                                (err) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing detail query:",
                                                      err
                                                    );
                                                    return connection.rollback(
                                                      () => {
                                                        connection.end();
                                                        return res
                                                          .status(400)
                                                          .json({
                                                            status: false,
                                                            message:
                                                              "Gagal menyimpan detail",
                                                          });
                                                      }
                                                    );
                                                  }

                                                  connection.commit((err) => {
                                                    if (err) {
                                                      console.error(
                                                        "Commit failed:",
                                                        err
                                                      );
                                                      return connection.rollback(
                                                        () => {
                                                          connection.end();
                                                          return res
                                                            .status(400)
                                                            .json({
                                                              status: false,
                                                              message:
                                                                "Gagal menyimpan data",
                                                            });
                                                        }
                                                      );
                                                    }

                                                    connection.end();
                                                    return res
                                                      .status(200)
                                                      .json({
                                                        status: true,
                                                        message:
                                                          "Data berhasil disimpan",
                                                      });
                                                  });
                                                }
                                              );
                                            }
                                          }
                                        );
                                      }
                                    );
                                  }

                                  if (tipeSurat == "surat_peringatan") {
                                    connection.query(
                                      `SELECT * FROM employee_letter WHERE exp_date<=CURDATE() AND em_id='${emId}' ORDER BY id DESC`,
                                      (err, suratPeringatan) => {
                                        if (err) {
                                          console.error(
                                            "Error executing SELECT statement:",
                                            err
                                          );
                                          connection.rollback(() => {
                                            connection.end();
                                            return res.status(400).send({
                                              status: true,
                                              message: "gaga ambil data",
                                              data: [],
                                            });
                                          });
                                          return;
                                        }
                                        var letterId = "2";

                                        if (suratPeringatan.length > 0) {
                                          var letterIdTemp =
                                            suratPeringatan[0]["letter_id"];
                                          if (
                                            letterIdTemp == "2" ||
                                            letterIdTemp == 2
                                          ) {
                                            letterId = "3";
                                          }
                                          if (
                                            letterIdTemp == "3" ||
                                            letterIdTemp == 3
                                          ) {
                                            letterId = "4";
                                          }
                                        }

                                        connection.query(
                                          `SELECT * FROM employee_letter WHERE MONTH(tgl_surat) = MONTH(CURRENT_DATE) AND YEAR(tgl_surat) = YEAR(CURRENT_DATE)`,
                                          (err, teguranLisan) => {
                                            if (err) {
                                              console.error(
                                                "Error executing SELECT statement:",
                                                err
                                              );
                                              connection.rollback(() => {
                                                connection.end();
                                                return res.status(400).send({
                                                  status: true,
                                                  message: "gaga ambil data",
                                                  data: [],
                                                });
                                              });
                                              return;
                                            }
                                            var nomorLb = `SP20${convertYear}${convertBulan}`;
                                            if (teguranLisan.length > 0) {
                                              var text =
                                                teguranLisan[0]["nomor"];
                                              var nomor =
                                                parseInt(
                                                  text.substring(8, 13)
                                                ) + 1;
                                              var nomorStr = String(
                                                nomor
                                              ).padStart(4, "0");
                                              nomorLb = nomorLb + nomorStr;
                                            } else {
                                              var nomor = 1;
                                              var nomorStr = String(
                                                nomor
                                              ).padStart(4, "0");
                                              nomorLb = nomorLb + nomorStr;
                                            }

                                            connection.query(
                                              `INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,alasan,status) VALUE('${nomorLb}','${utility.dateNow2()}','${emId}','2','${utility.dateNow2()}','${alasanReject}','Pending')`,
                                              (err, teguranLisan) => {
                                                if (err) {
                                                  console.error(
                                                    "Error executing SELECT statement:",
                                                    err
                                                  );
                                                  connection.rollback(() => {
                                                    connection.end();
                                                    return res
                                                      .status(400)
                                                      .send({
                                                        status: true,
                                                        message:
                                                          "gaga ambil data",
                                                        data: [],
                                                      });
                                                  });
                                                  return;
                                                }

                                                var konsekuensiArray =
                                              konsekuensi.split(",");
                                                for (
                                                  var i = 0;
                                                  i < konsekuensiArray.length;
                                                  i++
                                                ) {
                                                  var data = konsekuensiArray[i].trim();
                                                  connection.query(
                                                    `INSERT INTO employee_letter_reason (employee_letter_id_id,name) VALUE('${teguranLisan.insertId}','${data}')`,
                                                    (
                                                      err,
                                                      teguranLisanDetail
                                                    ) => {
                                                      if (err) {
                                                        console.error(
                                                          "Error executing SELECT statement:",
                                                          err
                                                        );
                                                        connection.rollback(
                                                          () => {
                                                            connection.end();
                                                            return res
                                                              .status(400)
                                                              .send({
                                                                status: true,
                                                                message:
                                                                  "gaga ambil data",
                                                                data: [],
                                                              });
                                                          }
                                                        );
                                                        return;
                                                      }
                                                    }
                                                  );
                                                }
                                              }
                                            );
                                          }
                                        );
                                      }
                                    );
                                  }
                                  // }

                                  if (menu_name == "Lembur") {
                                    namaTransaksi = "Lembur";
                                    urlTransaksi = "Lembur";
                                  }

                                  if (leaveTypes.length > 0) {
                                    if (
                                      leaveTypes[0].status == "2" ||
                                      leaveTypes[0].status == 2
                                    ) {
                                      namaTransaksi = "Sakit";
                                      urlTransaksi = "sakit";
                                    }
                                    if (
                                      leaveTypes[0].status == "1" ||
                                      leaveTypes[0].status == 1
                                    ) {
                                      namaTransaksi = "Cuti";
                                      urlTransaksi = "Cuti";
                                    }

                                    if (
                                      leaveTypes[0].status == "3" ||
                                      leaveTypes[0].status == 3
                                    ) {
                                      namaTransaksi = "Izin";
                                      urlTransaksi = "Izin";
                                    }
                                  }

                                  if (menu_name == "Tugas Luar") {
                                    namaTransaksi = "Tugas Luar";
                                    urlTransaksi = "TugasLuar";
                                  }

                                  if (menu_name == "Dinas Luar") {
                                    namaTransaksi = "Dinas Luar";
                                    urlTransaksi = "DinasLuar";
                                  }

                                  if (menu_name == "emp_claim") {
                                    namaTransaksi = "Klaim";
                                    urlTransaksi = "Klaim";
                                  }

                                  if (menu_name == "Surat Peringatan") {
                                    namaTransaksi = "Surat Peringatan";
                                    urlTransaksi = "Surat Peringatan";
                                  }

                                  // alur 1  approval
                                  if (
                                    sysdata[0].name == "1" ||
                                    sysdata[0].name == 1
                                  ) {
                                    //ketika approve
                                    if (
                                      bodyStatusFinal == "Approve" ||
                                      bodyStatusFinal == "Approve"
                                    ) {
                                      var listData = sysdata[2].name
                                        .toString()
                                        .split(",");
                                      for (
                                        var i = 0;
                                        i < listData.length;
                                        i++
                                      ) {
                                        if (listData[i] != "") {
                                          var title = "";
                                          var deskripsi = "";
                                          title = `Approval ${namaTransaksi}`;
                                          deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`;
                                          connection.query(
                                            `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                            (err, employee) => {
                                              if (err) {
                                                console.error(
                                                  "Error executing SELECT statement:",
                                                  err
                                                );
                                                connection.rollback(() => {
                                                  connection.end();
                                                  return res.status(400).send({
                                                    status: true,
                                                    message: "gaga ambil data",
                                                    data: [],
                                                  });
                                                });
                                                return;
                                              }

                                              connection.query(
                                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0,'${emId}','${transaksi[0].id}')`,
                                                (err, results) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing SELECT statement:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "gaga ambil data",
                                                          data: [],
                                                        });
                                                    });
                                                    return;
                                                  }

                                                  // utility.notifikasi(employee[0].token_notif,title,message)
                                                }
                                              );
                                            }
                                          );
                                        }
                                      }

                                      //jika approve
                                    }
                                    //ketika rejected
                                    if (
                                      bodyStatusFinal == "Rejected" ||
                                      bodyStatusFinal == "Rejected"
                                    ) {
                                      console.log("Masuk reject query");
                                      var listData = sysdata[1].name
                                        .toString()
                                        .split(",");

                                      for (
                                        var i = 0;
                                        i < listData.length;
                                        i++
                                      ) {
                                        console.log("Masuk reject query 1");
                                        console.log(namaTransaksi);

                                        if (listData[i] != "") {
                                          title = `Rejection ${namaTransaksi}`;
                                          deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`;

                                          connection.query(
                                            `SELECT  * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                            (err, employee) => {
                                              if (err) {
                                                console.error(
                                                  "Error executing SELECT statement:",
                                                  err
                                                );
                                                connection.rollback(() => {
                                                  connection.end();
                                                  return res.status(400).send({
                                                    status: true,
                                                    message: "gaga ambil data",
                                                    data: [],
                                                  });
                                                });
                                                return;
                                              }
                                              connection.query(
                                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0,'${emId}','${transaksi[0].id}')`,
                                                (err, results) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing SELECT statement:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "gaga ambil data",
                                                          data: [],
                                                        });
                                                    });
                                                    return;
                                                  }
                                                }
                                              );

                                              // utility.notifikasi(employee[0].token_notif,title,message)
                                            }
                                          );
                                        }
                                      }

                                      //jika approve
                                    }
                                  }

                                  // alur 2  approval
                                  console.log("sys data", sysdata);
                                  if (
                                    sysdata[0].name == "2" ||
                                    sysdata[0].name == 2
                                  ) {
                                    //keti approve
                                    if (
                                      bodyStatusFinal == "Approve2" ||
                                      bodyStatusFinal == "Approve2"
                                    ) {
                                      console.log(
                                        "data  em id approve",
                                        sysdata[2].toString()
                                      );
                                      var listData = sysdata[2].name
                                        .toString()
                                        .split(",");
                                      console.log(
                                        "data  em id approve",
                                        listData
                                      );

                                      for (
                                        var i = 0;
                                        i < listData.length;
                                        i++
                                      ) {
                                        console.log("proses ", i, listData[i]);

                                        if (listData[i] != "") {
                                          var title = "";
                                          var deskripsi = "";
                                          console.log(listData[i]);
                                          title = `Approval ${namaTransaksi}`;
                                          deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`;
                                          connection.query(
                                            `SELECT *  FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                            (err, employee) => {
                                              if (err) {
                                                console.error(
                                                  "Error executing SELECT statement:",
                                                  err
                                                );
                                                connection.rollback(() => {
                                                  connection.end();
                                                  return res.status(400).send({
                                                    status: true,
                                                    message: "gaga ambil data",
                                                    data: [],
                                                  });
                                                });
                                                return;
                                              }

                                              connection.query(
                                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0,'${emId}','${transaksi[0].id}')`,

                                                (err, results) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing SELECT statement:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "gaga ambil data",
                                                          data: [],
                                                        });
                                                    });
                                                    return;
                                                  }
                                                  console.log(
                                                    "employee id ",
                                                    listData[i]
                                                  );
                                                  // utility.notifikasi(employee[0].token_notif,title,deskripsi)
                                                }
                                              );
                                            }
                                          );
                                        }
                                      }
                                      //jika approve
                                    }

                                    //keti approve
                                    if (
                                      bodyStatusFinal == "Rejected" ||
                                      bodyStatusFinal == "Rejected"
                                    ) {
                                      var listData = sysdata[1].name
                                        .toString()
                                        .split(",");

                                      for (
                                        var i = 0;
                                        i < listData.length;
                                        i++
                                      ) {
                                        if (listData[i] != "") {
                                          title = `Rejection ${namaTransaksi}`;
                                          deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`;

                                          connection.query(
                                            `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                                            (err, employee) => {
                                              if (err) {
                                                console.error(
                                                  "Error executing SELECT statement:",
                                                  err
                                                );
                                                connection.rollback(() => {
                                                  connection.end();
                                                  return res.status(400).send({
                                                    status: true,
                                                    message: "gaga ambil data",
                                                    data: [],
                                                  });
                                                });
                                                return;
                                              }
                                              connection.query(
                                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0,0,'${emId}','${transaksi[0].id}')`,
                                                (err, results) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing SELECT statement:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "gaga ambil data",
                                                          data: [],
                                                        });
                                                    });
                                                    return;
                                                  }

                                                  //    utility.notifikasi(employee[0].token_notif,title,deskripsi)
                                                }
                                              );
                                            }
                                          );
                                        }
                                      }
                                      //jika approve
                                    }
                                  }

                                  connection.commit((err) => {
                                    if (err) {
                                      CURTIME(), 1, 0;
                                      console.error(
                                        "Error committing transaction:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "Gagal ambil data",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }

                                    // connection.end();
                                    // console.log(
                                    //   "Transaction completed successfully!"
                                    // );
                                    // return res.status(200).send({
                                    //   status: true,
                                    //   message: "Data berhasil di ambil",
                                    //   // data:records
                                    // });
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    });
                  }
                );
              });
            }
          );
        });
      });
    } catch (e) {
      console.log(e);
    }
  },

  async edit_face(req, res) {
    //     console.log("sftp")
    //     const SftpClient = require('ssh2-sftp-client');
    // const config = {
    //   host: 'kantor.siscom.id',
    //   port: 3322, // Default SFTP port is 22
    //   username: 'siscom',
    //   password: 'siscom!@#$%'
    // };

    //     const localFilePath = 'public/file_cuti/IMG-20220914-WA0004.jpg';
    //     const remoteFilePath = 'public_html/7H202305001/dpi/foto_profile/regis_SIS20221039.png';
    //     const sftp = new SftpClient();

    //    sftp.connect(config)
    //   .then(() => {
    //     // SFTP connection successful
    //     return sftp.put(localFilePath, remoteFilePath);
    //   })
    //   .then(() => {
    //     console.log('File uploaded successfully!');
    //     sftp.end(); // Disconnect after the upload is complete
    //   })
    //   .catch(err => {
    //     console.error('Error:', err);
    //     sftp.end(); // Disconnect if an error occurs
    //   });
    //   sftp.end();

    console.log("-----edit face registration----------");
    var database = req.query.database;
    var dbmaster = `${database}_hrm`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    const { file } = req.files;
    const nameFile = "regis_" + req.body.em_id + ".png";
    //stftp
    const remoteFilePath = `${remoteDirectory}/${database}/face_recog/${nameFile}`;
    sftp
      .connect(configSftp)
      .then(() => {
        // SFTP connection successful
        return sftp.put(file.data, remoteFilePath);
      })
      .then(() => {
        console.log("berhasil upload image");
        poolDynamic.getConnection(function (err, connection) {
          if (err) {
            console.log(err);
            return res.send({
              status: false,
              message: "Gagal registrasi wajah",
            });
          }

          connection.query(
            `UPDATE employee SET file_face='${nameFile}' WHERE em_id='${req.body.em_id}'`,
            function (error, results) {
              if (error) {
                console.log(error);
                return res.send({
                  status: false,
                  message: "Gagal registrasi wajah",
                });
              }
              return res.send({
                status: true,
                message: "Berhasil update data!",
              });
            }
          );
          connection.release();
        });
        sftp.end(); // Disconnect after the upload is complete
      })
      .catch((err) => {
        sftp.end(); // Disconnect if an error occurs
        console.log(`gagal upload image ${err}`);
        return res.send({
          status: false,
          message: "Gagal registrasi wajah",
        });
      });
    sftp.end();
    // return  res.send({
    //   status: true,
    //   message: "Berhasil update data!",

    // });

    // var options = {
    //   url: _apiUrl + "detect",
    //   method: 'POST',
    //   headers: {
    //     'subscriptionkey': _subscriptionKey,
    //     'Content-Type': 'application/json'
    //   },
    //   json: {
    //     encoded_image: base64String1
    //   },
    //   rejectUnauthorized: false,
    // };
    // request(options, function (error, response) {
    //   console.log(response.statusCode);
    //   if (error) {
    //     console.log(error)
    //   }
    //   else {

    //     if (response.statusCode == 200) {

    //       var faces = response.body.faces;
    //       if (faces.length == 1) {
    //         fs.writeFileSync("public/face_recog/" + nameFile, file.data);
    //         poolDynamic.getConnection(function (err, connection) {
    //           if (err) console.log(err);;
    //           connection.query(
    //             `UPDATE employee SET file_face='${nameFile}' WHERE em_id='${req.body.em_id}'`,
    //             function (error, results) {
    //               res.send({
    //                 status: true,
    //                 message: "Berhasil update data!",

    //               });
    //             }
    //           );
    //           connection.release();
    //         });

    //       } else {
    //         res.send({
    //           status: false,
    //           message: "Gagal registrasi wajah",
    //         });

    //       }

    //     }
    //     else {
    //       console.log("gaga registrasi")
    //       res.send({
    //         status: false,
    //         message: "Gagal registrasi wajah",
    //       });
    //     }
    //   }
    // });
  },
  // async edit_face(req,res){

  //   const { face1 } = req.files;
  //   const { face2 } = req.files;
  //   var formdata = new FormData();
  //   formdata.append("face1", face1, "file");
  //   formdata.append("face2", face2, "file");

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: 'follow'
  //   };
  //   var myHeaders = new Headers();

  //   myHeaders.append("token", API_TOKEN);

  //   fetch("https://api.luxand.cloud/photo/landmarks", requestOptions)
  //     .then(response =>{
  //       response.json()
  //       console.log(response.json());
  //     })
  //     .then(result => {
  //       console.log("berhasil")
  //       callback(result)
  //     })
  //     .catch(error => console.log('error', error));
  // },

  async get_face_mx(req, res) {
    console.log("-----get face registration----------");
    const { file } = req.files;
    const nameFile = "regis_" + req.body.em_id + ".png";

    const fs = require("fs");
    const file_local = fs.readFileSync("public/face_recog/" + nameFile);

    console.log("file Local " + file_local.data);
    // var image1 =  fs.readFileSync(file.data);

    const base64String1 = Buffer(file.data).toString("base64");
    const base64String2 = Buffer(file_local).toString("base64");

    var optionsFaceCompare = {
      url: _apiUrl + "verify",
      method: "POST",
      headers: {
        subscriptionkey: _subscriptionKey,
        "Content-Type": "application/json",
      },
      json: {
        encoded_image1: base64String1,
        encoded_image2: base64String2,
      },
    };
    request(optionsFaceCompare, function (error, response) {
      console.log("Response /verify");
      if (error) {
        res.send({
          status: false,
          message: "wajah tidak terverifikasi",
        });
      } else {
        if (response.body.statusCode == 400) {
          res.send({
            status: false,
            message: "wajah tidak terverifikasi",
          });
        } else {
          if (response.body.matchedFaces[0].matchResult == 1)
            res.send({
              status: true,
              message: "wajah terverifikasi",
            });
          else
            res.send({
              status: false,
              message: "wajah tidak terverifikasi",
            });
        }
      }
    });
  },

  // async edit_face(req, res) {

  //   const { file } = req.files;
  //   var fs = require("fs");
  //   var nameFile = "regis_" + req.body.em_id + ".png";
  //   fs.writeFileSync("public/face_recog/" + nameFile, file.data);

  //   // const file = Buffer.from(req.body.image, 'base64');

  //   const em_id = req.body.em_id;
  //   const result = await faceApiService.registration(file.data);

  //   pool.getConnection(function (err, connection) {
  //     if (err) console.log(err);
  //     var message = result["message"];
  //     var data_image = result["data_image"];
  //     if (message == "tidakvalid") {
  //       res.send({
  //         status: false,
  //         message: "Gagal registrasi wajah",
  //       });
  //     } else {
  //       connection.query(
  //         `UPDATE employee SET file_face='${nameFile}' WHERE em_id='${em_id}'`,
  //         function (error, results) {
  //           res.send({
  //             status: true,
  //             message: "Berhasil update data!",
  //             data: results,
  //           });
  //         }
  //       );
  //     }
  //     connection.release();
  //   });
  // },

  // async get_face(req, res) {
  //   const { file } = req.files;
  //   const em_id = req.body.em_id;
  //   const fs = require('fs');
  //   var nameFile = "regis_" + em_id + ".png";
  //   const file_local = fs.readFileSync("public/face_recog/" + nameFile);
  //   const result = await faceApiService.detection(file.data, em_id, file_local);
  //   // const result = await faceApiService.detection(file, em_id);
  //   if (result == em_id)
  //     res.send({
  //       status: true,
  //       message: "wajah terverifikasi",
  //     });
  //   else
  //     res.send({
  //       status: false,
  //       message: "wajah tidak terverifikasi",
  //     });
  // },

  async editData(req, res) {
    console.log("-----edit data izin ----------");
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1);
    var nameWhere = req.body.val;
    var cariWhere = req.body.cari;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var atten_date = req.body.atten_date;
    var createdBy = req.body.created_by;
    var bodyValue = req.body;
    delete bodyValue.val;
    delete bodyValue.cari;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    delete bodyValue.type;

    console.log(req.body);

    console.log(script);
    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy,
    };
    console.log(req.body);
    // BATAL PENGAJUAN BERMASALAH
    // var array = atten_date.split("-");
    var array = [];
    try {
      array = utility.dateNow2().split("-");
    } catch (error) {
      array = req.body.start_date.split("-");
    }
    const getTahun = array[0];
    const getBulan = array[1];

    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getBulan.length == 1) {
      convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
    } else {
      convertBulan = getBulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var script = `UPDATE ${namaDatabaseDynamic}.${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;

    console.log(script);
    // const namaDatabaseDynamic = `${database}_test2208`;
    console.log(req.body);
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (nameTable == "emp_claim") {
        delete bodyValue.atten_date;
      }
      if (err) console.log(err);
      connection.query(script, [bodyValue], function (error, results) {
        console.log(error);
        connection.release();
        if (error != null)
          connection.query(
            `INSERT INTO logs_actvity SET ?;`,
            [dataInsertLog],
            function (error) {
              if (error != null) console.log(error);
            }
          );

        res.send({
          status: true,
          message: "Berhasil di update!",
          data: results,
        });
      });
    });
  },
  async approveWfh(req, res) {
    console.log("-----edit data ----------");
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1);
    var nameWhere = req.body.val;
    var cariWhere = req.body.cari;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var atten_date = req.body.atten_date;
    var createdBy = req.body.created_by;
    var bodyValue = req.body;
    delete bodyValue.val;
    delete bodyValue.cari;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;

    var nomorAjuan = req.body.nomor_ajuan;

    console.log(req.body);

    var script = `UPDATE ${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy,
    };
    console.log(req.body);
    // BATAL PENGAJUAN BERMASALAH
    // var array = atten_date.split("-");
    var array = [];
    try {
      array = atten_date.split("-");
    } catch (error) {
      array = req.body.start_date.split("-");
    }
    const getTahun = array[0];
    const getBulan = array[1];

    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getBulan.length == 1) {
      convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
    } else {
      convertBulan = getBulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    // const poolDynamic = mysql.createPool(configDynamic);

    try {
      var database = req.query.database;
      const connection = await model.createConnection(database);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database1:", err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }
          connection.query(
            `UPDATE ${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`,
            [dataInsertLog],
            (err, empLabor) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi Kesalahan",
                    data: [],
                  });
                });
                return;
              }

              connection.query(
                `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?;`,
                [dataInsertLog],
                (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: false,
                        message: "Terjadi Kesalahan",
                        data: [],
                      });
                    });
                    return;
                  }

                  connection.query(
                    `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan='${nomorAjuan}'`,
                    [dataInsertLog],
                    (err, empLabor) => {
                      if (err) {
                        console.error("Error executing SELECT statement:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: false,
                            message: "Terjadi Kesalahan",
                            data: [],
                          });
                        });
                        return;
                      }
                      connection.query(
                        `INSERT attendance`,
                        [dataInsertLog],
                        (err, results) => {
                          if (err) {
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: false,
                                message: "Terjadi Kesalahan",
                                data: [],
                              });
                            });
                            return;
                          }
                          //proses memasukan data
                          connection.commit((err) => {
                            if (err) {
                              console.error(
                                "Error committing transaction:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: false,
                                  message: "gagal pengajuan",
                                  data: [],
                                });
                              });
                              return;
                            }
                            connection.end();
                            console.log(
                              "Transaction completed successfully! 2"
                            );
                            return res.status(200).send({
                              status: true,
                              message: "BErhasil pengajuan",
                              data: records,
                            });
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    }

    // poolDynamic.getConnection(function (err, connection) {
    //   if (nameTable == "emp_claim") {
    //     delete bodyValue.atten_date;
    //   }
    //   if (err) console.log(err);
    //   connection.query(
    //     script,
    //     [bodyValue],
    //     function (error, results) {
    //       connection.release();
    //       if (error != null) console.log(error)
    //       connection.query(
    //         `INSERT INTO logs_actvity SET ?;`,
    //         [dataInsertLog],
    //         function (error,) {
    //           if (error != null) console.log(error)
    //           connection.query(
    //             `INSERT INTO logs_actvity SET ?;`,
    //             [dataInsertLog],
    //             function (error,) {
    //               if (error != null) console.log(error)

    //             }
    //           );

    //         }
    //       );

    //       res.send({
    //         status: true,
    //         message: "Berhasil di update!",
    //         data: results
    //       });
    //     }
    //   );

    // });
  },
  deleteData(req, res) {
    console.log("-----delete data----------");
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1);
    var nameWhere = req.body.val;
    var cariWhere = req.body.cari;
    var createdBy = req.body.created_by;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var atten_date = req.body.atten_date;
    var script = `DELETE FROM ${nameTable} WHERE ${nameWhere}='${cariWhere}'`;

    var dataInsert = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy,
    };

    var getTahun;
    var getBulan;

    if (nameTable == "emp_leave") {
      var array = req.body.start_date.split("-");
      getTahun = array[0];
      getBulan = array[1];
    } else {
      var array = atten_date.split("-");
      getTahun = array[0];
      getBulan = array[1];
    }

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(script, function (error, results) {
        connection.release();
        if (error != null) console.log(error);
        connection.query(
          `INSERT INTO logs_actvity SET ?;`,
          [dataInsert],
          function (error) {
            if (error != null) console.log(error);
          }
        );
        res.send({
          status: true,
          message: "Berhasil di hapus!",
        });
      });
    });
  },
  edit_foto_user(req, res) {
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    // upload gambar
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    var randomstring = require("randomstring");
    var fs = require("fs");
    var image = req.body.base64_foto_profile;
    var bitmap = Buffer.from(image, "base64");
    var stringRandom = randomstring.generate(5);
    var nameFile = stringRandom + date + month + year + hour + menit + ".png";
    fs.writeFileSync("public/foto_profile/" + nameFile, bitmap);

    const remoteFilePath = `${remoteDirectory}/${database}/foto_profile/${nameFile}`;
    sftp
      .connect(configSftp)
      .then(() => {
        // SFTP connection successful
        return sftp.put(bitmap, remoteFilePath);
      })
      .then(() => {
        console.log("berhasil upload image");

        sftp.end(); // Disconnect after the upload is complete
      })
      .catch((err) => {
        console.log(`gagal upload image ${err}`);
        res.send({
          status: false,
          message: "Gagal registrasi wajah",
        });
        sftp.end(); // Disconnect if an error occurs
      });
    sftp.end();

    var em_id = req.body.em_id;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;

    var script = `UPDATE employee SET em_image='${nameFile}' WHERE em_id='${em_id}'`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: em_id,
    };

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(script, function (error, results) {
        connection.release();
        if (error != null) console.log(error);
        res.send({
          status: true,
          message: "Berhasil di update!",
          nama_file: nameFile,
        });
      });
    });
  },
  //   edit_foto_user(req, res) {
  //     console.log('-----edit foto user----------')
  // var database=req.query.database;
  //         // upload gambar
  //         let ts = Date.now();
  //         let date_ob = new Date(ts);
  //         let date = date_ob.getDate();
  //         let month = date_ob.getMonth() + 1;
  //         let year = date_ob.getFullYear();
  //         let hour = date_ob.getHours();
  //         let menit = date_ob.getMinutes();
  //         var randomstring = require("randomstring");
  //         var fs = require("fs");
  //         var image = req.body.base64_foto_profile;
  //         var bitmap = Buffer.from(image, 'base64');
  //         var stringRandom = randomstring.generate(5);
  //         var nameFile = stringRandom + date + month + year + hour + menit + ".png";
  //         fs.writeFileSync("public/foto_profile/" + nameFile, bitmap);

  //         var em_id = req.body.em_id;
  //         var menu_name = req.body.menu_name;
  //         var activity_name = req.body.activity_name;

  //         var script = `UPDATE employee SET em_image='${nameFile}' WHERE em_id='${em_id}'`;

  //         var dataInsertLog = {
  //           menu_name: menu_name,
  //           activity_name: activity_name,
  //           acttivity_script: script,
  //           createdUserID: em_id
  //         }

  //     const remoteFilePath = `${remoteDirectory}/${database}/foto_profile/${nameFile}`;
  //     sftp.connect(configSftp)
  //    .then(() => {
  //      // SFTP connection successful
  //      return sftp.put(file.data, remoteFilePath);
  //    })
  //    .then(() => {

  //      poolDynamic.getConnection(function (err, connection) {

  //        if (err) console.log(err);
  //        connection.query(
  //          script,
  //          function (error, results) {
  //            connection.release();
  //            if (error != null) console.log(error)
  //            res.send({
  //              status: true,
  //              message: "Berhasil di update!",
  //              nama_file: nameFile,
  //            });
  //          }
  //        );
  //        connection.release();
  //      });
  //      sftp.end(); // Disconnect after the upload is complete
  //    })
  //    .catch(err => {
  //      console.log(`gagal upload image ${err}`)
  //      res.send({
  //        status: false,
  //        message: "gagal update foto profile",
  //      });
  //      sftp.end(); // Disconnect if an error occurs
  //    });
  //    sftp.end();

  //   },
  // slip_gaji(req, res) {
  //   var database=req.query.database
  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: ipServer,//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${database}_hrm`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   console.log('-----Slip gaji----------')
  //   var em_id = req.body.em_id;
  //   var tahun = req.body.tahun;
  //  poolDynamic.getConnection(function (err, connection) {
  //     if (err) console.log(err);;
  //     connection.query(
  //       `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}' AND payroll='Y' ORDER BY initial`,
  //       function (error, results) {
  //         if (error) {
  //           res.send({
  //             status: false,
  //             message: "Periode tidak di temukan"
  //           });
  //         } else {
  //           var list_pendapatan = [];
  //           var list_pemotongan = [];

  //           results.forEach((el) => {
  //              //dycrip
  //             //  if (el['value03']=='0' || el['value03']==null || el['value03']=='' ){
  //             //  }else{
  //             //    var request = http.request({'hostname': `https://myhris.siscom.id/custom/${database}/api/decrypt?aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@&nilai=${el['value03']}&keycode=${el['keycode03']}`,
  //             //    'auth': 'aplikasioperasionalsiscom:siscom@ptshaninformasi#2022@'
  //             //   },
  //             //   function (response) {
  //             //     console.log('STATUS: ' + response.statusCode);
  //             //     console.log('HEADERS: ' + JSON.stringify(response.headers));
  //             //     response.setEncoding('utf8');
  //             //     response.on('data', function (chunk) {
  //             //       console.log('BODY: ' + chunk);
  //             //     });
  //             //   });

  //             //   request.end();

  //             //  }

  //             //  if (el.type=="D"){
  //             //   list_pendapatan.push(el);

  //             //  }else if (el.type=='C'){
  //             //   list_pendapatan.push(el);

  //             //  }

  //           });

  //           // results.forEach((el) => {
  //           //   if (el.type == "C") {
  //           //     list_pemotongan.push(el);
  //           //   }
  //           // });

  //           res.send({
  //             status: true,
  //             message: "Berhasil ambil data!",
  //             data_pendapatan: list_pendapatan,
  //             data_pemotongan: list_pemotongan,
  //           });
  //         }
  //       }
  //     );
  //     connection.release();
  //   });

  //   function decryptData(nilai, keycode) {
  //     const params = {
  //       nilai: `${nilai}`,
  //       key2: '${keyCode}',
  //     };

  //     // Convert the parameters to a query string
  //     const paramString = querystring.stringify(params);

  //     // The URL you want to send the GET request to, with the parameters appended
  //     const url = `https://example.com/path?${paramString}`;

  //     // Basic Authentication credentials
  //     const username = 'your_username';
  //     const password = 'your_password';
  //     const auth = Buffer.from(`${username}:${password}`).toString('base64');
  //     const headers = {
  //       'Authorization': `Basic ${auth}`,
  //     };

  //     // Set up the request options
  //     const options = {
  //       method: 'GET',
  //       headers: headers,
  //     };

  //     // Send the GET request
  //     const req = https.request(url, options, (res) => {
  //       let data = '';

  //       // Accumulate the response data
  //       res.on('data', (chunk) => {
  //         data += chunk;
  //       });

  //       // Process the response data
  //       res.on('end', () => {
  //         console.log(data);
  //         // Do something with the response data
  //       });
  //     });

  //     req.on('error', (error) => {
  //       console.error(`Error: ${error.message}`);
  //     });

  //     req.end();

  //   }
  // },

  async slip_gaji(req, res) {
    var database = req.query.database;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql2/promise");
    const poolDynamic = mysql.createPool(configDynamic);

    const connection = await poolDynamic.getConnection();
    var em_id = req.body.em_id;
    var tahun = req.body.tahun;

    const [results] = await connection.query(
      `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}' AND payroll='Y' ORDER BY initial`
    );
    var list_pendapatan = [];
    var list_pemotongan = [];

    for (const el of results) {
      try {
        //value 1
        if (
          el["value01"] == "0" ||
          el["value01"] == "" ||
          el["value01"] == null ||
          el["value01"] > 0
        ) {
          el["value01"] = "0";
        } else {
          var output01 = await decryptData(
            el["value01"],
            el["keycode01"],
            database
          );
          el["value01"] = output01;
        }
        //value 2
        if (
          el["value02"] == "0" ||
          el["value02"] == "" ||
          el["value02"] == null ||
          el["value02"] > 0
        ) {
          el["value02"] = "0";
        } else {
          var output02 = await decryptData(
            el["value02"],
            el["keycode02"],
            database
          );
          el["value02"] = output02;
        }

        //value 3
        if (
          el["value03"] == "0" ||
          el["value03"] == "" ||
          el["value03"] == null ||
          el["value03"] > 0
        ) {
          el["value03"] = "0";
        } else {
          var output03 = await decryptData(
            el["value03"],
            el["keycode03"],
            database
          );
          el["value03"] = output03;
        }

        //value 4
        if (
          el["value04"] == "0" ||
          el["value04"] == "" ||
          el["value04"] == null ||
          el["value04"] > 0
        ) {
          el["value04"] = "0";
        } else {
          var output04 = await decryptData(
            el["value04"],
            el["keycode04"],
            database
          );
          el["value04"] = output04;
        }
        //value 0
        if (
          el["value05"] == "0" ||
          el["value05"] == "" ||
          el["value05"] == null ||
          el["value05"] > 0
        ) {
          el["value05"] = "0";
        } else {
          var output05 = await decryptData(
            el["value05"],
            el["keycode05"],
            database
          );
          el["value05"] = output04;
        }
        //value 0
        if (
          el["value06"] == "0" ||
          el["value06"] == "" ||
          el["value06"] == null ||
          el["value06"] > 0
        ) {
          el["value06"] = "0";
        } else {
          var output06 = await decryptData(
            el["value06"],
            el["keycode06"],
            database
          );
          el["value06"] = output06;
        }

        //value 0
        if (
          el["value07"] == "0" ||
          el["value07"] == "" ||
          el["value07"] == null ||
          el["value07"] > 0
        ) {
          el["value07"] = "0";
        } else {
          var output07 = await decryptData(
            el["value07"],
            el["keycode07"],
            database
          );
          el["value07"] = output07;
        }

        //value 0
        if (el["value08"] == null) {
          el["value08"] = "0";
        } else {
          var output08 = await decryptData(
            el["value08"],
            el["keycode08"],
            database
          );
          el["value08"] = output08;
        }

        //value 0
        if (
          el["value09"] == "0" ||
          el["value09"] == "" ||
          el["value09"] == null ||
          el["value09"] > 0
        ) {
          el["value09"] = "0";
        } else {
          var output09 = await decryptData(
            el["value09"],
            el["keycode09"],
            database
          );
          el["value09"] = output09;
        }

        //value 0
        if (
          el["value10"] == "0" ||
          el["value10"] == "" ||
          el["value10"] == null ||
          el["value10"] > 0
        ) {
          el["value10"] = "0";
        } else {
          var output10 = await decryptData(
            el["value10"],
            el["keycode10"],
            database
          );
          el["value10"] = output10;
        }

        //value 0
        if (
          el["value11"] == "0" ||
          el["value11"] == "" ||
          el["value11"] == null ||
          el["value11"] > 0
        ) {
          el["value11"] = "0";
        } else {
          var output11 = await decryptData(
            el["value11"],
            el["keycode11"],
            database
          );
          el["value11"] = output11;
        }
        //value 0
        if (
          el["value12"] == "0" ||
          el["value12"] == "" ||
          el["value12"] == null ||
          el["value12"] > 0
        ) {
          el["value12"] = "0";
        } else {
          var output12 = await decryptData(
            el["value12"],
            el["keycode12"],
            database
          );
          el["value12"] = output12;
        }

        if (el.type == "C") {
          list_pemotongan.push(el);
        } else {
          list_pendapatan.push(el);
        }
      } catch (error) {
        console.error(`Error processing: ${item}`);
      }
    }

    // results.forEach((el) => {
    // //value 1
    // if (el['value01']=="0" ||el['value01']=="" || el['value01']==null || el['value01']>0 ){

    // }else{
    //  var output01= decryptData(el['value01'], el['keycode01'],database)
    //   el['value01']=output01

    // }
    //  //value 2
    //  if (el['value02']=="0" ||el['value02']=="" || el['value02']==null || el['value02']>0   ){

    //  }else{
    //   var output02= decryptData(el['value02'], el['keycode02'],database)
    //    el['value02']=output02

    //  }

    //   //value 3
    // if (el['value03']=="0" ||el['value03']=="" || el['value03']==null  || el['value03']>0 ){

    // }else{
    //  var output03= decryptData(el['value03'], el['keycode03'],database)
    //   el['value03']=output03

    // }

    //  //value 4
    //  if (el['value04']=="0" ||el['value04']=="" || el['value04']==null || el['value04']>0  ){

    //  }else{
    //   var output04= decryptData(el['value04'], el['keycode04'],database)
    //    el['value04']=output04

    //  }
    //   //value 0
    // if (el['value05']=="0" ||el['value05']=="" || el['value05']==null || el['value05']>0  ){

    // }else{
    //  var output05= decryptData(el['value05'], el['keycode05'],database)
    //   el['value05']=output05

    // }
    //  //value 0
    //  if (el['value06']=="0" ||el['value06']=="" || el['value06']==null || el['value06']>0  ){

    //  }else{
    //   var output06= decryptData(el['value06'], el['keycode06'],database)
    //    el['value06']=output06

    //  }

    //   //value 0
    //   if (el['value07']=="0" ||el['value07']=="" || el['value07']==null  || el['value07']>0 ){

    //   }else{

    //    var output07= decryptData(el['value07'], el['keycode07'],database)
    //     el['value07']=output07

    //   }

    //      //value 0
    //      if (el['value08']==null ){

    //      }else{
    //       var output08= decryptData(el['value08'], el['keycode08'],database)
    //        el['value08']=output08

    //      }

    //         //value 0
    //   if (el['value09']=="0" ||el['value09']=="" || el['value09']==null  || el['value09']>0 ){

    //   }else{
    //    var output09= decryptData(el['value09'], el['keycode09'],database)
    //     el['value09']=output09

    //   }

    //      //value 0
    //      if (el['value10']=="0" ||el['value10']=="" || el['value10']==null  || el['value10']>0 ){

    //      }else{
    //       var output10= decryptData(el['value10'], el['keycode10'],database)
    //        el['value10']=output10

    //      }

    //       //value 0
    //       if (el['value11']=="0" ||el['value11']=="" || el['value11']==null  || el['value11']>0 ){

    //       }else{
    //        var output11= decryptData(el['value11'], el['keycode11'],database)
    //         el['value11']=output11

    //       }
    //        //value 0
    //      if (el['value12']=="0" ||el['value12']=="" || el['value12']==null || el['value12']>0  ){

    //      }else{
    //       var output12= decryptData(el['value12'], el['keycode12'],database)
    //        el['value12']=output12

    //      }

    //      if (el.type=="C"){
    //       list_pemotongan.push(el);

    //      }else{
    //       list_pendapatan.push(el);
    //      }

    // });

    res.send({
      status: true,
      message: "Berhasil ambil data!",
      data_pendapatan: list_pendapatan,
      data_pemotongan: list_pemotongan,
    });

    //   console.log('-----Slip gaji----------')
    //  poolDynamic.getConnection(function (err, connection)  {
    //     if (err) console.log(err);;
    //     connection.query(
    //       `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}' AND payroll='Y' ORDER BY initial`,
    //       function (error, results) {
    //         if (error) {
    //           res.send({
    //             status: false,
    //             message: "Periode tidak di temukan"
    //           });
    //         } else {

    //         }
    //       }
    //     );
    //     connection.release();
    //   });

    async function decryptData(nilai, keycode, dbname) {
      try {
        // Basic Authentication credentials
        const username = "aplikasioperasionalsiscom";
        const password = "siscom@ptshaninformasi#2022@";
        const auth = Buffer.from(`${username}:${password}`).toString("base64");
        const headers = {
          Authorization: `Basic ${auth}`,
        };

        // Set up the request options
        const options = {
          method: "GET",
          headers: headers,
        };
        const response = await axios.get(
          `https://myhris.siscom.id/custom/${dbname}/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`,
          { headers }
        ); // Replace with your actual API endpoint
        // res.json(response.data);
        console.log(response.data.status);
        if (response.data.status == true) {
          return response.data.data;
        } else {
          return "0";
        }
      } catch (error) {
        console.log(error);
        // res.status(500).json({ error: 'An error occurred' });
        return "1 ";
      }

      console.log("nilai ", nilai);
      console.log("key", keycode);
      const params = {
        nilai: `${nilai}`,
        key2: `${keycode}`,
        aplikasioperasionalsiscomkey: "siscom@ptshaninformasi%232022@",
      };

      // Convert the parameters to a query string
      const paramString = querystring.stringify(params);

      // The URL you want to send the GET request to, with the parameters appended
      const url = `https://myhris.siscom.id/custom/dpi/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`;

      // Send the GET request
      //       const req = await https.request(url, options, (res) => {
      //         let data = '';

      //         // Accumulate the response data
      //         res.on('data', (chunk) => {
      //           data += chunk;
      //         });

      //         // Process the response data
      //         res.on('end', () => {
      //           console.log(data)
      //           var d=JSON.parse(data)
      //           console.log(`data ${d.data}`);
      //           if (d.status==true){
      // console.log(`data true ${d.data}`);
      //             return d.data;
      //           }else{
      //             return "0"
      //           }
      //           // Do something with the response data
      //         });
      //       });

      //       req.on('error', (error) => {
      //         console.error(`Error: ${error.message}`);
      //         return "1";
      //       });

      //       req.end();
      // return "1"
    }
  },

  async pph21(req, res) {
    console.log("pph21");
    var database = req.query.database;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql2/promise");
    const poolDynamic = mysql.createPool(configDynamic);

    const connection = await poolDynamic.getConnection();
    var em_id = req.body.em_id;
    var tahun = req.body.tahun;

    const [results] = await connection.query(
      `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}'  ORDER BY initial`
    );
    var list_pendapatan = [];
    var list_pemotongan = [];

    for (const el of results) {
      try {
        //value 1
        if (
          el["fiscal01"] == "0" ||
          el["fiscal01"] == "" ||
          el["fiscal01"] == null ||
          el["fiscal01"] > 0
        ) {
          el["fiscal01"] = "0";
        } else {
          var output01 = await decryptData(
            el["fiscal01"],
            el["keycode01"],
            database
          );
          el["fiscal01"] = output01;
        }
        //fiscal 2
        if (
          el["fiscal02"] == "0" ||
          el["fiscal02"] == "" ||
          el["fiscal02"] == null ||
          el["fiscal02"] > 0
        ) {
          el["fiscal02"] = "0";
        } else {
          var output02 = await decryptData(
            el["fiscal02"],
            el["keycode02"],
            database
          );
          el["fiscal02"] = output02;
        }

        //fiscal 3
        if (
          el["fiscal03"] == "0" ||
          el["fiscal03"] == "" ||
          el["fiscal03"] == null ||
          el["fiscal03"] > 0
        ) {
          el["fiscal03"] = "0";
        } else {
          var output03 = await decryptData(
            el["fiscal03"],
            el["keycode03"],
            database
          );
          el["fiscal03"] = output03;
        }

        //fiscal 4
        if (
          el["fiscal04"] == "0" ||
          el["fiscal04"] == "" ||
          el["fiscal04"] == null ||
          el["fiscal04"] > 0
        ) {
          el["fiscal04"] = "0";
        } else {
          var output04 = await decryptData(
            el["fiscal04"],
            el["keycode04"],
            database
          );
          el["fiscal04"] = output04;
        }
        //fiscal 0
        if (
          el["fiscal05"] == "0" ||
          el["fiscal05"] == "" ||
          el["fiscal05"] == null ||
          el["fiscal05"] > 0
        ) {
          el["fiscal05"] = "0";
        } else {
          var output05 = await decryptData(
            el["fiscal05"],
            el["keycode05"],
            database
          );
          el["fiscal05"] = output04;
        }
        //fiscal 0
        if (
          el["fiscal06"] == "0" ||
          el["fiscal06"] == "" ||
          el["fiscal06"] == null ||
          el["fiscal06"] > 0
        ) {
          el["fiscal06"] = "0";
        } else {
          var output06 = await decryptData(
            el["fiscal06"],
            el["keycode06"],
            database
          );
          el["fiscal06"] = output06;
        }

        //fiscal 0
        if (
          el["fiscal07"] == "0" ||
          el["fiscal07"] == "" ||
          el["fiscal07"] == null ||
          el["fiscal07"] > 0
        ) {
          el["fiscal07"] = "0";
        } else {
          var output07 = await decryptData(
            el["fiscal07"],
            el["keycode07"],
            database
          );
          el["fiscal07"] = output07;
        }

        //fiscal 0
        if (el["fiscal08"] == null) {
          el["fiscal08"] = "0";
        } else {
          var output08 = await decryptData(
            el["fiscal08"],
            el["keycode08"],
            database
          );
          el["fiscal08"] = output08;
        }

        //fiscal 0
        if (
          el["fiscal09"] == "0" ||
          el["fiscal09"] == "" ||
          el["fiscal09"] == null ||
          el["fiscal09"] > 0
        ) {
          el["fiscal09"] = "0";
        } else {
          var output09 = await decryptData(
            el["fiscal09"],
            el["keycode09"],
            database
          );
          el["fiscal09"] = output09;
        }

        //fiscal 0
        if (
          el["fiscal10"] == "0" ||
          el["fiscal10"] == "" ||
          el["fiscal10"] == null ||
          el["fiscal10"] > 0
        ) {
          el["fiscal10"] = "0";
        } else {
          var output10 = await decryptData(
            el["fiscal10"],
            el["keycode10"],
            database
          );
          el["fiscal10"] = output10;
        }

        //fiscal 0
        if (
          el["fiscal11"] == "0" ||
          el["fiscal11"] == "" ||
          el["fiscal11"] == null ||
          el["fiscal11"] > 0
        ) {
          el["fiscal11"] = "0";
        } else {
          var output11 = await decryptData(
            el["fiscal11"],
            el["keycode11"],
            database
          );
          el["fiscal11"] = output11;
        }
        //fiscal 0
        if (
          el["fiscal12"] == "0" ||
          el["fiscal12"] == "" ||
          el["fiscal12"] == null ||
          el["fiscal12"] > 0
        ) {
          el["fiscal12"] = "0";
        } else {
          var output12 = await decryptData(
            el["fiscal12"],
            el["keycode12"],
            database
          );
          el["fiscal12"] = output12;
        }
        list_pendapatan.push(el);
      } catch (error) {
        console.error(`Error processing: ${item}`);
      }
    }

    res.send({
      status: true,
      message: "Berhasil ambil data!",
      data: list_pendapatan,
    });

    async function decryptData(nilai, keycode, dbname) {
      console.log("masuk sini");

      try {
        // Basic Authentication credentials
        const username = "aplikasioperasionalsiscom";
        const password = "siscom@ptshaninformasi#2022@";
        const auth = Buffer.from(`${username}:${password}`).toString("base64");
        const headers = {
          Authorization: `Basic ${auth}`,
        };

        // Set up the request options
        const options = {
          method: "GET",
          headers: headers,
        };
        const response = await axios.get(
          `https://myhris.siscom.id/custom/${dbname}/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`,
          { headers }
        ); // Replace with your actual API endpoint
        // res.json(response.data);
        console.log(response.data.status);
        if (response.data.status == true) {
          console;
          return response.data.data;
        } else {
          return "0";
        }
      } catch (error) {
        console.log(error);
        return "1 ";
      }
    }
  },

  async pph21(req, res) {
    console.log("pph21");
    var database = req.query.database;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql2/promise");
    const poolDynamic = mysql.createPool(configDynamic);

    const connection = await poolDynamic.getConnection();
    var em_id = req.body.em_id;
    var tahun = req.body.tahun;

    const [results] = await connection.query(
      `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}'  ORDER BY initial`
    );
    var list_pendapatan = [];
    var list_pemotongan = [];

    for (const el of results) {
      try {
        //value 1
        if (
          el["fiscal01"] == "0" ||
          el["fiscal01"] == "" ||
          el["fiscal01"] == null ||
          el["fiscal01"] > 0
        ) {
          el["fiscal01"] = "0";
        } else {
          var output01 = await decryptData(
            el["fiscal01"],
            el["keycode01"],
            database
          );
          el["fiscal01"] = output01;
        }
        //fiscal 2
        if (
          el["fiscal02"] == "0" ||
          el["fiscal02"] == "" ||
          el["fiscal02"] == null ||
          el["fiscal02"] > 0
        ) {
          el["fiscal02"] = "0";
        } else {
          var output02 = await decryptData(
            el["fiscal02"],
            el["keycode02"],
            database
          );
          el["fiscal02"] = output02;
        }

        //fiscal 3
        if (
          el["fiscal03"] == "0" ||
          el["fiscal03"] == "" ||
          el["fiscal03"] == null ||
          el["fiscal03"] > 0
        ) {
          el["fiscal03"] = "0";
        } else {
          var output03 = await decryptData(
            el["fiscal03"],
            el["keycode03"],
            database
          );
          el["fiscal03"] = output03;
        }

        //fiscal 4
        if (
          el["fiscal04"] == "0" ||
          el["fiscal04"] == "" ||
          el["fiscal04"] == null ||
          el["fiscal04"] > 0
        ) {
          el["fiscal04"] = "0";
        } else {
          var output04 = await decryptData(
            el["fiscal04"],
            el["keycode04"],
            database
          );
          el["fiscal04"] = output04;
        }
        //fiscal 0
        if (
          el["fiscal05"] == "0" ||
          el["fiscal05"] == "" ||
          el["fiscal05"] == null ||
          el["fiscal05"] > 0
        ) {
          el["fiscal05"] = "0";
        } else {
          var output05 = await decryptData(
            el["fiscal05"],
            el["keycode05"],
            database
          );
          el["fiscal05"] = output04;
        }
        //fiscal 0
        if (
          el["fiscal06"] == "0" ||
          el["fiscal06"] == "" ||
          el["fiscal06"] == null ||
          el["fiscal06"] > 0
        ) {
          el["fiscal06"] = "0";
        } else {
          var output06 = await decryptData(
            el["fiscal06"],
            el["keycode06"],
            database
          );
          el["fiscal06"] = output06;
        }

        //fiscal 0
        if (
          el["fiscal07"] == "0" ||
          el["fiscal07"] == "" ||
          el["fiscal07"] == null ||
          el["fiscal07"] > 0
        ) {
          el["fiscal07"] = "0";
        } else {
          var output07 = await decryptData(
            el["fiscal07"],
            el["keycode07"],
            database
          );
          el["fiscal07"] = output07;
        }

        //fiscal 0
        if (el["fiscal08"] == null) {
          el["fiscal08"] = "0";
        } else {
          var output08 = await decryptData(
            el["fiscal08"],
            el["keycode08"],
            database
          );
          el["fiscal08"] = output08;
        }

        //fiscal 0
        if (
          el["fiscal09"] == "0" ||
          el["fiscal09"] == "" ||
          el["fiscal09"] == null ||
          el["fiscal09"] > 0
        ) {
          el["fiscal09"] = "0";
        } else {
          var output09 = await decryptData(
            el["fiscal09"],
            el["keycode09"],
            database
          );
          el["fiscal09"] = output09;
        }

        //fiscal 0
        if (
          el["fiscal10"] == "0" ||
          el["fiscal10"] == "" ||
          el["fiscal10"] == null ||
          el["fiscal10"] > 0
        ) {
          el["fiscal10"] = "0";
        } else {
          var output10 = await decryptData(
            el["fiscal10"],
            el["keycode10"],
            database
          );
          el["fiscal10"] = output10;
        }

        //fiscal 0
        if (
          el["fiscal11"] == "0" ||
          el["fiscal11"] == "" ||
          el["fiscal11"] == null ||
          el["fiscal11"] > 0
        ) {
          el["fiscal11"] = "0";
        } else {
          var output11 = await decryptData(
            el["fiscal11"],
            el["keycode11"],
            database
          );
          el["fiscal11"] = output11;
        }
        //fiscal 0
        if (
          el["fiscal12"] == "0" ||
          el["fiscal12"] == "" ||
          el["fiscal12"] == null ||
          el["fiscal12"] > 0
        ) {
          el["fiscal12"] = "0";
        } else {
          var output12 = await decryptData(
            el["fiscal12"],
            el["keycode12"],
            database
          );
          el["fiscal12"] = output12;
        }
        list_pendapatan.push(el);
      } catch (error) {
        console.error(`Error processing: ${item}`);
      }
    }

    res.send({
      status: true,
      message: "Berhasil ambil data!",
      data: list_pendapatan,
    });

    async function decryptData(nilai, keycode, dbname) {
      console.log("masuk sini");

      try {
        // Basic Authentication credentials
        const username = "aplikasioperasionalsiscom";
        const password = "siscom@ptshaninformasi#2022@";
        const auth = Buffer.from(`${username}:${password}`).toString("base64");
        const headers = {
          Authorization: `Basic ${auth}`,
        };

        // Set up the request options
        const options = {
          method: "GET",
          headers: headers,
        };
        const response = await axios.get(
          `https://myhris.siscom.id/custom/${dbname}/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`,
          { headers }
        ); // Replace with your actual API endpoint
        // res.json(response.data);
        console.log(response.data.status);
        if (response.data.status == true) {
          console;
          return response.data.data;
        } else {
          return "0";
        }
      } catch (error) {
        console.log(error);
        return "1 ";
      }
    }
  },

  validasiLogin(req, res) {
    console.log("-----validasi login----------");
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var email = req.body.email;
    var password = sha1(req.body.password);
    var token_notif = req.body.token_notif;

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT a.em_bpjs_kesehatan as nomor_bpjs_kesehatan,a.em_bpjs_tenagakerja as nomor_bpjs_tenagakerja, em_id, full_name, em_email, des_id, dep_id, dep_group_id as dep_group, em_mobile as em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title as posisi, em_hak_akses, last_login, status as status_aktif, em_control, em_controlaccess as em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working as emp_att_working FROM employee a LEFT JOIN designation b ON a.des_id=b.id 
        LEFT JOIN department c ON a.dep_id=c.id where em_email='${email}' AND em_password='${password}'`,
        function (error, results) {
          if (error) console.log(error);
          if (results.length == 0) {
            res.send({
              status: false,
              message: "Kombinasi email & password Anda Salah",
            });
          } else {
            var queryKontra = "SELECT * FROM em";

            var updateToken = `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${email}'`;
            connection.query(updateToken, function (error, results) {});
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        }
      );
      connection.release();
    });
  },

  async refresh_employee(req, res) {
    function convertDaysToYMD(totalDays) {
      const daysInYear = 365; // Jumlah hari dalam setahun
      const daysInMonth = 30; // Rata-rata jumlah hari dalam sebulan

      const years = Math.floor(totalDays / daysInYear);
      totalDays -= years * daysInYear;

      const months = Math.floor(totalDays / daysInMonth);
      totalDays -= months * daysInMonth;

      const days = totalDays;

      return {
        tahun: years,
        bulan: months,
        hari: days,
      };
    }

    var currentDate = new Date();

    // Extract date components
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, "0");
    var day = String(currentDate.getDate()).padStart(2, "0");

    // Create the formatted date string
    var dateNow = `${year}-${month}-${day}`;
    var array = `${year}-${month}-${day}`.split("-");
    console.log("array", array);

    var database = req.query.database;
    // const namaDatabaseDynamic = `${database}_test2208`;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var query = `
    
    SELECT
    IFNULL((SELECT  IFNULL(work_schedule.time_in ,'08:00:00') FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%') ,'08:30:00') AS jam_masuk,
    IFNULL((SELECT  IFNULL(work_schedule.time_in ,'08:00:00') FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%') ,'08:30:00') AS time_in,
    IFNULL((SELECT  IFNULL(work_schedule.time_out ,'08:00:00') FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%') ,'08:30:00') AS jam_keluar,
    IFNULL((SELECT  IFNULL(work_schedule.time_out ,'08:00:00') FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%') ,'08:30:00') AS time_out,

    a.tipe_absen,
    IFNULL(employee_history.description ,em_status) as em_status,
    a.dep_id,
    
    IFNULL(MAX(employee_history.end_date) ,'')AS tanggal_berakhir_kontrak,
    
    IFNULL(DATEDIFF(MAX(employee_history.end_date), CURDATE()),'0') AS sisa_kontrak,
    
    IFNULL(DATEDIFF(CURDATE(),a.em_joining_date),'0') AS lama_bekerja,
    em_bpjs_kesehatan AS nomor_bpjs_kesehatan,em_bpjs_tenagakerja AS nomor_bpjs_tenagakerja,
    (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,
    (SELECT NAME FROM sysdata WHERE id='18') AS time_attendance,
    (SELECT NAME FROM sysdata WHERE kode='012') AS is_view_tracking,
    (SELECT NAME FROM sysdata WHERE id='006') AS interval_tracking,
    (SELECT NAME FROM sysdata WHERE kode='021') AS back_date,
    (SELECT NAME FROM sysdata WHERE kode='001') AS periode_awal,
    (SELECT NAME FROM sysdata WHERE kode='040') AS durasi_absen_masuk,
    (SELECT NAME FROM sysdata WHERE kode='041') AS durasi_absen_keluar,
    a.em_tracking  AS is_tracking,
    branch_id,
    a.file_face,
    a.loan_limit,
    (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll,
    em_control, em_controlaccess AS em_control_access,
    branch.name AS branch_name, a.em_id, full_name, em_email, des_id, dep_id, dep_group_id AS dep_group, em_mobile AS em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, job_title AS posisi, em_hak_akses, last_login, a.status AS status_aktif, em_controlaccess AS em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working AS emp_att_working FROM employee a 
    LEFT JOIN employee_history ON a.em_id=employee_history.em_id LEFT JOIN designation b ON a.des_id=b.id 
    LEFT JOIN
    department c ON a.dep_id=c.id LEFT JOIN branch ON branch.id=a.branch_id WHERE a.em_id='${em_id}'
     GROUP BY a.em_id
     
     `;

    console.log(query);
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

            connection.query(
              `SELECT * FROM employee_history WHERE em_id='${em_id}' ORDER BY id DESC`,
              (err, history) => {
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

                let currentDate = new Date();

                // Function to calculate the difference in days
                function getDaysDifference(endDate) {
                  // Convert the endDate string to a Date object
                  let end = new Date(endDate);

                  // Check if endDate is a valid date
                  if (isNaN(end)) {
                    return 0; // If the endDate is invalid, return 0 (similar to the 'IFNULL' logic)
                  }

                  // Calculate the difference in milliseconds
                  let diffInMs = end - currentDate;

                  // Convert milliseconds to days
                  let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

                  return diffInDays + 1;
                }

                if (history.length > 0) {
                  results[0].em_status = history[0].description;
                  results[0].tanggal_berakhir_kontrak = history[0].end_date;
                  let sisaKontrak = getDaysDifference(history[0].end_date);

                  if (results[0].em_status == "PERMANENT") {
                    results[0].sisa_kontrak = "0";
                  } else {
                    results[0].sisa_kontrak = sisaKontrak.toString();
                  }
                }

                console.log("Sisa kontrak", results[0].sisa_kontrak);

                connection.query(
                  `SELECT * FROM  department WHERE  id='${results[0].dep_id}'`,
                  (err, depertment) => {
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

                    if (
                      results[0].tipe_absen == "" ||
                      results[0].tipe_absen == "0" ||
                      results[0].tipe_absen == null ||
                      results[0].tipe_absen == undefined
                    ) {
                      results[0].tipe_absen = depertment[0].tipe_absen;
                    }

                    console.log(results[0].lama_bekerja);
                    const totalDays = parseInt(results[0].lama_bekerja);
                    const result = convertDaysToYMD(totalDays);

                    var formatLamaBekerja = "";
                    if (result.tahun != 0) {
                      formatLamaBekerja = `${result.tahun} Tahun ${result.bulan} Bulan ${result.hari} Hari`;
                    } else {
                      if (result.bulan != 0) {
                        formatLamaBekerja = `${result.bulan} bulan ${result.hari} Hari`;
                      } else {
                        formatLamaBekerja = `${result.hari} Hari`;
                      }
                    }
                    const totalDaysKontrak = parseInt(results[0].sisa_kontrak);
                    const result1 = convertDaysToYMD(totalDaysKontrak);

                    var formatSisaKontrak = "";
                    if (result1.tahun != 0) {
                      formatSisaKontrak = `${result1.tahun} Tahun ${result1.bulan} Bulan ${result1.hari} Hari`;
                    } else {
                      if (result1.bulan != 0) {
                        formatSisaKontrak = `${result1.bulan} Bulan ${result1.hari} Hari`;
                      } else {
                        formatSisaKontrak = `${result1.hari} hr`;
                      }
                    }

                    if (totalDaysKontrak == 0) {
                      formatSisaKontrak = "";
                    }
                    results[0].sisa_kontrak_format = formatSisaKontrak;
                    results[0].lama_bekerja_format = formatLamaBekerja;
                    connection.commit((err) => {
                      if (err) {
                        console.error("Error committing transaction:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: "failed insert data",
                            data: [],
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log("Transaction completed successfully!");
                      return res.status(200).send({
                        status: true,
                        message: "Success insert data",
                        data: results,
                      });
                    });
                  }
                );
              }
            );
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
  //   refresh_employee(req, res) {
  //     function convertDaysToYMD(totalDays) {
  //       const daysInYear = 365; // Jumlah hari dalam setahun
  //       const daysInMonth = 30; // Rata-rata jumlah hari dalam sebulan

  //       const years = Math.floor(totalDays / daysInYear);
  //       totalDays -= years * daysInYear;

  //       const months = Math.floor(totalDays / daysInMonth);
  //       totalDays -= months * daysInMonth;

  //       const days = totalDays;

  //       return {
  //           tahun: years,
  //           bulan: months,
  //       hari: days
  //       };
  //   }

  //     var currentDate = new Date();

  //     // Extract date components
  //     var year = currentDate.getFullYear();
  //     var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  //     var day = String(currentDate.getDate()).padStart(2, '0');

  //     // Create the formatted date string
  //     var array = `${year}-${month}-${day}`.split('-');
  //     console.log('array',array)

  //     var database = req.query.database;
  //     // const namaDatabaseDynamic = `${database}_test2208`;
  //     const configDynamic = {
  //       multipleStatements: true,
  //       host: ipServer,//my${database}.siscom.id (ip local)
  //       user: 'pro',
  //       password: 'Siscom3519',
  //       database: `${database}_hrm`,
  //       connectionLimit: 1000,
  //       connectTimeout: 60 * 60 * 1000,
  //       acquireTimeout: 60 * 60 * 1000,
  //       timeout: 60 * 60 * 1000,
  //     };
  //     const mysql = require("mysql");
  //     const poolDynamic = mysql.createPool(configDynamic);
  //     var em_id = req.body.em_id;

  //     const tahun = `${array[0]}`;
  //     const convertYear = tahun.substring(2, 4);
  //     var convertBulan;
  //     if (array[1].length == 1) {
  //       convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //     } else {
  //       convertBulan = array[1];

  //     }
  //     const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

  //     poolDynamic.getConnection(function (err, connection) {
  //       if (err) console.log(err);

  //       var query=   `
  //       SELECT
  //       IFNULL(MAX(employee_history.end_date) ,'')AS tanggal_berakhir_kontrak,
  //       IFNULL(DATEDIFF(MAX(employee_history.end_date), CURDATE()),'0') AS sisa_kontrak,
  //       IFNULL(DATEDIFF(CURDATE(),a.em_joining_date),'0') AS lama_bekerja,
  //       em_bpjs_kesehatan AS nomor_bpjs_kesehatan,em_bpjs_tenagakerja AS nomor_bpjs_tenagakerja,
  //       (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,
  //       (SELECT NAME FROM sysdata WHERE id='18') AS time_attendance,
  //       (SELECT NAME FROM sysdata WHERE kode='012') AS is_view_tracking,
  //       (SELECT NAME FROM sysdata WHERE id='006') AS interval_tracking,
  //       (SELECT NAME FROM sysdata WHERE kode='021') AS back_date,
  //       a.em_tracking  AS is_tracking,
  //       a.file_face,
  //       (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll,
  //       em_control, em_controlaccess AS em_control_access,
  //       branch.name AS branch_name, a.em_id, full_name, em_email, des_id, dep_id, dep_group_id AS dep_group, em_mobile AS em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title AS posisi, em_hak_akses, last_login, a.status AS status_aktif, em_controlaccess AS em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working AS emp_att_working FROM employee a
  //       LEFT JOIN employee_history ON a.em_id=employee_history.em_id LEFT JOIN designation b ON a.des_id=b.id LEFT JOIN
  //       department c ON a.dep_id=c.id JOIN branch ON branch.id=a.branch_id WHERE a.em_id='${em_id}'
  //        GROUP BY a.em_id`

  //       connection.query(query,function (error, results) {
  //           connection.release();
  //           if (error != null) console.log(error)
  //           if (results.length == 0) {
  //             res.send({
  //               status: false,
  //               message: "Data tidak ditemukan",
  //             });
  //           } else {
  // console.log(results[0].lama_bekerja)
  //             const totalDays = parseInt(results[0].lama_bekerja);
  //             const result = convertDaysToYMD(totalDays);

  //             var formatLamaBekerja="";
  //             if (result.tahun!=0){
  //               formatLamaBekerja=`${result.tahun} Tahun ${result.bulan} Bulan ${result.hari} Hari`
  //             }else{
  //               if (result.bulan!=0){
  //                 formatLamaBekerja=`${result.bulan} bulan ${result.hari} Hari`
  //               }else{
  //                 formatLamaBekerja=`${result.hari} Hari`
  //               }
  //             }
  //             const totalDaysKontrak = parseInt(results[0].sisa_kontrak);
  //             const result1 = convertDaysToYMD(totalDaysKontrak);

  //             var formatSisaKontrak="";
  //             if (result1.tahun!=0){
  //               formatSisaKontrak=`${result1.tahun} Tahun ${result1.bulan} Bulan ${result1.hari} Hari`
  //             }else{
  //               if (result1.bulan!=0){
  //                 formatSisaKontrak=`${result1.bulan} Bulan ${result1.hari} Hari`
  //               }else{
  //                 formatSisaKontrak=`${result1.hari} hr`
  //               }
  //             }

  //             if (totalDaysKontrak==0){
  //               formatSisaKontrak=''
  //             }
  //             results[0].sisa_kontrak_format=formatSisaKontrak;
  //             results[0].lama_bekerja_format =formatLamaBekerja

  //             res.send({
  //               status: true,
  //               message: "Berhasil ambil data!",
  //               data: results,
  //             });
  //           }
  //         }
  //       );

  //     });
  //   },
  validasiGantiPassword(req, res) {
    console.log("-----validasi ganti password---------");

    var database = req.query.database;

    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var password_lama = req.body.password_lama;
    var password_baru = req.body.password_baru;

    var convertPasswordLama = sha1(password_lama);
    var convertPasswordBaru = sha1(password_baru);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT * FROM employee WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          var getPassword = results[0].em_password;
          var validasi = convertPasswordLama == getPassword ? true : false;
          if (validasi == true) {
            connection.query(
              `UPDATE employee SET em_password='${convertPasswordBaru}' WHERE em_id='${em_id}'`,
              function (error, results) {
                if (error != null) console.log(error);
                res.send({
                  status: true,
                  message: "Password berhasil di ubah",
                });
              }
            );
          } else {
            res.send({
              status: false,
              message: "Password lama tidak sama",
            });
          }
        }
      );
    });
  },
  newPasswordBaru(req, res) {
    console.log("-----validasi ganti password---------");
    var database = req.query.database;
    // const namaDatabaseDynamic = `${database}_test2208`;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var password_baru = req.body.password;
    var convertPasswordBaru = sha1(password_baru);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET em_password='${convertPasswordBaru}' WHERE em_email='${req.body.email}'`,
        function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Password berhasil di ubah",
          });
        }
      );
    });
  },

  // kirimTidakMasukKerja(req, res) {
  //   console.log('-----kirim tidak masuk kerja----------')
  //   var database = req.query.database;
  //   var script = `INSERT INTO emp_leave SET ?`;
  //   var insertData = {
  //     "em_id": req.body.em_id,
  //     "typeid": req.body.typeid,
  //     "nomor_ajuan": req.body.nomor_ajuan,
  //     "leave_type": req.body.leave_type,
  //     "start_date": req.body.start_date,
  //     "end_date": req.body.end_date,
  //     "leave_duration": req.body.leave_duration,
  //     "date_selected": req.body.date_selected,
  //     "time_plan": req.body.time_plan,
  //     "time_plan_to": req.body.time_plan_to,
  //     "apply_date": req.body.apply_date,
  //     "reason": req.body.reason,
  //     "leave_status": req.body.leave_status,
  //     "atten_date": req.body.atten_date,
  //     "em_delegation": req.body.em_delegation,
  //     "leave_files": req.body.leave_files,
  //     "ajuan": req.body.ajuan,
  //   };
  //   var dataInsertLog = {
  //     menu_name: req.body.menu_name,
  //     activity_name: req.body.activity_name,
  //     acttivity_script: script,
  //     createdUserID: req.body.created_by
  //   }

  //   var array = req.body.start_date.split("-");

  //   const tahun = `${array[0]}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (array[1].length == 1) {
  //     convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //   } else {
  //     convertBulan = array[1];
  //   }

  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
  //   // const namaDatabaseDynamic = `${database}_test2208`;

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: ipServer,//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.send({
  //         status: false,
  //         message: "Database tidak tersedia",
  //       });
  //     } else {
  //       connection.query(
  //         `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
  //         function (error, results) {
  //           if (results.length == 0) {
  //             connection.query(
  //               script,
  //               [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 connection.query(
  //                   `INSERT INTO logs_actvity SET ?;`,
  //                   [dataInsertLog],
  //                   function (error,) {
  //                     if (error != null) console.log(error)
  //                   }
  //                 );
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil berhasil di tambah!",
  //                 });
  //               }
  //             );
  //           } else {
  //             res.send({
  //               status: false,
  //               message: "ulang",
  //               data: results
  //             });
  //           }
  //         }
  //       );
  //       connection.release();
  //     }

  //   });

  // },
  // kirimTidakMasukKerja(req, res) {
  //   console.log('-----kirim tidak masuk kerja----------')
  //   var database = req.query.database;
  //   var script     = `INSERT INTO emp_leave SET ?`;
  //   var insertData = {
  //     "em_id": req.body.em_id,
  //     "typeid": req.body.typeid,
  //     "nomor_ajuan": req.body.nomor_ajuan,
  //     "leave_type": req.body.leave_type,
  //     "start_date": req.body.start_date,
  //     "end_date": req.body.end_date,
  //     "leave_duration": req.body.leave_duration,
  //     "date_selected": req.body.date_selected,
  //     "time_plan": req.body.time_plan,
  //     "time_plan_to": req.body.time_plan_to,
  //     "apply_date": req.body.apply_date,
  //     "reason": req.body.reason,
  //     "leave_status": req.body.leave_status,
  //     "atten_date": req.body.atten_date,
  //     "em_delegation": req.body.em_delegation,
  //     "leave_files": req.body.leave_files,
  //     "ajuan": req.body.ajuan,
  //     "apply_status":"Pending"
  //   };
  //   var dataInsertLog = {
  //     menu_name: req.body.menu_name,
  //     activity_name: req.body.activity_name,
  //     acttivity_script: script,
  //     createdUserID: req.body.created_by
  //   }

  //   var array = req.body.start_date.split("-");

  //   const tahun = `${array[0]}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (array[1].length == 1) {
  //     convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //   } else {
  //     convertBulan = array[1];
  //   }

  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
  //   // const namaDatabaseDynamic = `${database}_test2208`;

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: ipServer,//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.send({
  //         status: false,
  //         message: "Database tidak tersedia",
  //       });
  //     } else {
  //       connection.query(
  //         `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
  //         function (error, results) {
  //           if (results.length == 0) {
  //             connection.query(
  //               script,
  //               [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 connection.query(
  //                   `INSERT INTO logs_actvity SET ?;`,
  //                   [dataInsertLog],
  //                   function (error,) {
  //                     if (error != null) console.log(error)
  //                   }
  //                 );
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil berhasil di tambah!",
  //                 });
  //               }
  //             );
  //           } else {
  //             res.send({
  //               status: false,
  //               message: "ulang",
  //               data: results
  //             });
  //           }
  //         }
  //       );
  //       connection.release();
  //     }

  //   });

  // var dates=req.body.date_selected.split(',');

  // dates.forEach(function(date) {
  //   var array = date.split("-");

  //   var tahun = `${array[0]}`;
  //   var convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (array[1].length == 1) {
  //     convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //   } else {
  //     convertBulan = array[1];
  //   }

  //   var namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

  // const configDynamic = {
  //   multipleStatements: true,
  //   host: ipServer,//my${database}.siscom.id (ip local)
  //   user: 'pro',
  //   password: 'Siscom3519',
  //   database: `${namaDatabaseDynamic}`,
  //   connectionLimit: 1000,
  //   connectTimeout: 60 * 60 * 1000,
  //   acquireTimeout: 60 * 60 * 1000,
  //   timeout: 60 * 60 * 1000,
  // };
  // const mysql = require("mysql");
  // const poolDynamic = mysql.createPool(configDynamic);

  // poolDynamic.getConnection(function (err, connection) {

  //   if (err) {
  //     res.send({
  //       status: false,
  //       message: "Database tidak tersedia",
  //     });
  //   } else {
  //     connection.query(
  //       `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
  //       function (error, results) {
  //         if (results.length == 0) {
  //           connection.query(
  //             script,
  //             [insertData],
  //             function (error, results) {
  //               if (error != null) console.log(error)
  //               connection.query(
  //                 `INSERT INTO logs_actvity SET ?;`,
  //                 [dataInsertLog],
  //                 function (error,) {
  //                   if (error != null) console.log(error)
  //                 }
  //               );
  //               res.send({
  //                 status: true,
  //                 message: "Berhasil berhasil di tambah!",
  //               });
  //             }
  //           );
  //         } else {
  //           res.send({
  //             status: false,
  //             message: "ulang",
  //             data: results
  //           });
  //         }
  //       }
  //     );
  //     connection.release();
  //   }

  // });
  // });

  //},

  async kirimTidakMasukKerja(req, res) {
    console.log("-----kirim tidak masuk kerja----------");
    var database = req.query.database;

    var insertData = {
      em_id: req.body.em_id,
      typeid: req.body.typeid,
      nomor_ajuan: req.body.nomor_ajuan,
      leave_type: req.body.leave_type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      leave_duration: req.body.leave_duration,
      date_selected: req.body.date_selected,
      time_plan: req.body.time_plan,
      time_plan_to: req.body.time_plan_to,
      apply_date: req.body.apply_date,
      reason: req.body.reason,
      leave_status: req.body.leave_status,
      atten_date: req.body.atten_date,
      em_delegation: req.body.em_delegation,
      leave_files: req.body.leave_files,
      ajuan: req.body.ajuan,
      apply_status: "Pending",
    };

    var array = req.body.start_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const databaseMaster = `${database}_hrm`;
    // const namaDatabaseDynamic = `${database}_test2208`;

    const mysql = require("mysql");

    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_leave SET ?`;

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

        //get sysdata
        connection.query(
          `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE ajuan='4'`,
          (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }

            if (results.length > 0) {
              var text = results[0]["nomor_ajuan"];
              nomor = parseInt(text.substring(8, 13)) + 1;
              var nomorStr = String(nomor).padStart(4, "0");
              insertData.nomor_ajuan =
                `DL20${convertYear}${convertBulan}` + nomorStr;
            } else {
              nomor = 1;
              var nomorStr = String(nomor).padStart(4, "0");
              insertData.nomor_ajuan =
                `DL20${convertYear}${convertBulan}` + nomorStr;
            }
            connection.query(script, [insertData], (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi kesahalan",
                    data: [],
                  });
                });
                return;
              }

              connection.query(
                `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${insertData.nomor_ajuan}'`,
                (err, transaksi) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: "Data gagal terkirim",
                        data: results,
                      });
                    });
                    return;
                  }
                  connection.query(
                    `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${insertData.em_id}'`,
                    (err, employee) => {
                      if (err) {
                        console.error("Error executing SELECT statement:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: "Data gagal terkirim",
                            data: results,
                          });
                        });
                        return;
                      }

                      utility.insertNotifikasi(
                        employee[0].em_report_to,
                        "Approval Dinas Luar",
                        "DinasLuar",
                        employee[0].em_id,
                        transaksi[0].id,
                        transaksi[0].nomor_ajuan,
                        employee[0].full_name,
                        namaDatabaseDynamic,
                        databaseMaster
                      );

                      connection.commit((err) => {
                        if (err) {
                          console.error("Error committing transaction:", err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: false,
                              message: "error commit",

                              data: [],
                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log("Transaction completed successfully!");
                        return res.status(200).send({
                          status: true,
                          message: "Successfuly get data",
                          data: employee,
                        });
                      });
                    }
                  );
                }
              );
            });
          }
        );
      });
    });
    //   });
    // });
  },
  // const poolDynamic = mysql.createPool(configDynamic);

  // poolDynamic.getConnection(function (err, connection) {

  //   if (err) {
  //     res.send({
  //       status: false,
  //       message: "Database tidak tersedia",
  //     });
  //   } else {
  //     connection.query(
  //       `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
  //       function (error, results) {
  //         if (results.length == 0) {
  //           connection.query(
  //             script,
  //             [insertData],
  //             function (error, results) {
  //               if (error != null) console.log(error)
  //               connection.query(
  //                 `INSERT INTO logs_actvity SET ?;`,
  //                 [dataInsertLog],
  //                 function (error,) {
  //                   if (error != null) console.log(error)
  //                 }
  //               );
  //               res.send({
  //                 status: true,
  //                 message: "Berhasil berhasil di tambah!",
  //               });
  //             }
  //           );
  //         } else {
  //           res.send({
  //             status: false,
  //             message: "ulang",
  //             data: results
  //           });
  //         }
  //       }
  //     );
  //     connection.release();
  //   }

  // });

  async empoyeeDivisi(req, res) {
    console.log("-----employee divisi----------");
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1);
    var value = req.body.val;
    var cari = req.body.cari;
    var database = req.query.database;
    var depId = req.body.dep_id;
    var emId = req.body.em_id;
    var query = "";
    var table = "";

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

        //get sysdata
        connection.query(
          `SELECT * FROM sysdata WHERE kode='003'`,
          (err, sysdata) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }
            var sys = sysdata;
            if (sys[0].name == "DIV") {
              table = "dep_id";
            } else {
              table = "dep_group_id";
            }
            //get employee
            connection.query(
              `SELECT * FROM employee WHERE em_id='${emId}'`,
              (err, results) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: false,
                      message: "Terjadi kesahalan",
                      data: [],
                    });
                  });
                  return;
                }
                var employee = results;
                var ids = [];
                if (
                  employee[0].em_hak_akses == "" ||
                  employee[0].em_hak_akses == "0"
                ) {
                  query =
                    "SELECT * FROM employee JOIN branch ON employee.branch_id=branch.id WHERE branch.name  ORDER BY full_name ASC";
                } else {
                  query = `SELECT * FROM employee WHERE ${table} IN (?) AND branch_id='${employee[0].branch_id}'`;
                  console.log("query divisi ", query);
                  ids = employee[0].em_hak_akses.split(",");
                }

                //get employee
                connection.query(query, [ids], (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: false,
                        message: "Terjadi kesahalan",
                        data: [],
                      });
                    });
                    return;
                  }
                  var employee = results;

                  connection.commit((err) => {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: false,
                          message: "error commit",

                          data: [],
                        });
                      });
                      return;
                    }
                    connection.end();
                    console.log("Transaction completed successfully!");
                    return res.status(200).send({
                      status: true,
                      message: "Successfuly get data",
                      data: employee,
                    });
                  });
                });
              }
            );
          }
        );
      });
    });
  },
  async kirimAbsenNew(req, res) {
    var database = req.query.database;

    var database = req.query.database;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    if (req.body.reg_type == 1) {
      var randomstring = require("randomstring");

      var image = req.body.gambar;
      var bitmap = Buffer.from(image, "base64");
      var stringRandom = randomstring.generate(5);
      var nameFile = stringRandom + date + month + year + hour + menit + ".png";

      const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFile}`;
      sftp
        .connect(configSftp)
        .then(() => {
          // SFTP connection successful
          return sftp.put(bitmap, remoteFilePath);
        })
        .then(() => {
          console.log("berhasil upload image");

          sftp.end(); // Disconnect after the upload is complete
        })
        .catch((err) => {
          console.log(`gagal upload image ${err}`);
          sftp.end(); // Disconnect if an error occurs
          return res.status(400).send({
            status: false,
            message: "Gagal registrasi wajah",
          });
        });

      sftp.end();
    }

    var typeAbsen = req.body.typeAbsen;
    var jamMasuk = "";
    var jamKeluar = "";
    var gambarMasuk = "";
    var gambarKeluar = "";
    var lokasiAbsenIn = "";
    var lokasiAbsenOut = "";
    var latLangIn = "";
    var latLangOut = "";
    var lokasiMasuk = "";
    var lokasiKeluar = "";
    var catatanMasuk = "";
    var catatanKeluar = "";

    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startDate = req.body.start_date == undefined ? "" : req.body.start_date;
    var endDate = req.body.end_date == undefined ? "" : req.body.end_date;
    var startTime = req.body.start_time == undefined ? "" : req.body.start_time;
    var endTime =
      req.body.end_time == undefined ? "" : (endTime = req.body.end_time);

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
          connection.query(
            `SELECT IFNULL(branch.zona_waktu,0) AS zona_waktu FROM employee LEFT JOIN branch ON employee.branch_id=branch.id  WHERE employee.em_id='${req.body.em_id}'`,
            (err, employee) => {
              if (err) {
                return connection.rollback(() => {
                  console.error("Error inserting into table2:", err);
                  connection.end(); // Close connection
                });
              }

              const currentTime = new Date();
              var h = currentTime.getHours();
              var mi = currentTime.getMinutes().toString().padStart(2, "0");
              var s = currentTime.getSeconds().toString().padStart(2, "0");

              console.log(
                "zona waktu",
                parseInt(employee[0].zona_waktu.toString())
              );
              console.log("zona waktu", parseInt(h.toString));
              if (employee.length > 0) {
                h = h + parseInt(employee[0].zona_waktu.toString());
              }
              console.log("zona waktu1", h);
              h = h.toString().padStart(2, "0");
              const formattedTime = `${h}:${mi}:${s}`;
              if (typeAbsen == "1" || typeAbsen == 1) {
                //  jamMasuk = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
                jamMasuk = formattedTime;
                gambarMasuk = req.body.reg_type == 0 ? "" : nameFile;
                lokasiMasuk = req.body.lokasi;
                catatanMasuk = req.body.catatan;
                latLangIn = req.body.latLang;
                lokasiAbsenIn = req.body.place;
              } else {
                //jamKeluar = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
                jamKeluar = formattedTime;
                gambarKeluar = req.body.reg_type == 0 ? "" : nameFile;
                lokasiKeluar = req.body.lokasi;
                catatanKeluar = req.body.catatan;
                latLangOut = req.body.latLang;
                lokasiAbsenOut = req.body.place;
              }

              var insertData = {
                em_id: req.body.em_id,
                atten_date: req.body.tanggal_absen,
                signin_time:
                  jamMasuk == null || jamMasuk == "" || jamMasuk == undefined
                    ? "00:00:00"
                    : jamMasuk,
                signout_time:
                  jamKeluar == "null" ||
                  jamKeluar == null ||
                  jamKeluar == "" ||
                  jamKeluar == undefined
                    ? "00:00:00"
                    : jamKeluar,
                working_hour: "",
                place_in: lokasiAbsenIn,
                place_out: lokasiAbsenOut,
                absence: "",
                overtime: "",
                earnleave: "",
                status: "",
                signin_longlat: latLangIn,
                signout_longlat: latLangOut,
                // att_type: "",
                signin_pict: gambarMasuk,
                signout_pict: gambarKeluar,
                signin_note: catatanMasuk,
                signout_note: catatanKeluar,
                signin_addr: lokasiMasuk,
                signout_addr: lokasiKeluar,
                atttype: parseInt(req.body.kategori),
                // reg_type: 0,
                reg_type: req.body.reg_type,
              };

              if (startDate != "") {
                queryCek = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${req.body.em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}') AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1;`;
              } else {
                queryCek = `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`;
              }

              connection.query(queryCek, (err, data) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error("Error inserting into table2:", err);
                    connection.end(); // Close connection
                  });
                }

                if (req.body.kategori == "1") {
                  if (data.length == 0) {
                    connection.query(
                      `INSERT INTO ${namaDatabaseDynamic}.attendance SET ?;`,
                      [insertData],
                      (err, results) => {
                        if (err) {
                          console.error(
                            "Error executing SELECT statement:",
                            err
                          );
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: "Data gagal terkirim",
                              // data:results
                            });
                          });
                          return;
                        }
                      }
                    );
                  } else {
                    var lastItem = data.pop();
                    if (lastItem.signout_longlat == "") {
                      var id_record = lastItem.id;
                      connection.query(
                        `UPDATE ${namaDatabaseDynamic}.attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
                        (err, results) => {
                          if (err) {
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Data gagal terkirim",
                                data: results,
                              });
                            });
                            return;
                          }
                        }
                      );

                      // connection.query(
                      //   `UPDATE attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
                      //   function (error, results) {
                      //     if (error != null) console.log(error)
                      //     res.send({
                      //       status: true,
                      //       message: "Berhasil",
                      //       data: results,
                      //     });
                      //   }
                      // );
                    } else {
                      connection.query(
                        `INSERT INTO ${namaDatabaseDynamic}.attendance SET ?;`,
                        [insertData],
                        (err, results) => {
                          if (err) {
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Data gagal terkirim",
                                data: results,
                              });
                            });
                            return;
                          }
                        }
                      );

                      // connection.query(
                      //   `INSERT INTO attendance SET ?;`, [insertData],
                      //   function (error, results) {
                      //     if (error != null) console.log(error)
                      //     res.send({
                      //       status: true,
                      //       message: "Berhasil",
                      //       data: results,
                      //     });
                      //   }
                      // );
                    }
                  }
                }

                connection.commit((err) => {
                  if (err) {
                    console.error("Error committing transaction:", err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: "Data gagal terkirim",
                        data: [],
                      });
                    });
                    return;
                  }
                  connection.end();
                  console.log("Transaction completed successfully!");
                  return res.status(200).send({
                    status: true,
                    message: "data berhasil terkirm",
                  });
                });
              });
            }
          );
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

  async runTransaction(req, res) {
    console.log("absen new  werwrwe  ");
    var database = req.query.database;
    const currentTime = new Date();
    const h = currentTime.getHours().toString().padStart(2, "0");
    const mi = currentTime.getMinutes().toString().padStart(2, "0");
    const s = currentTime.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${h}:${mi}:${s}`;

    console.log(formattedTime);
    var database = req.query.database;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    if (req.body.reg_type == 1) {
      var randomstring = require("randomstring");

      var image = req.body.gambar;
      var bitmap = Buffer.from(image, "base64");
      var stringRandom = randomstring.generate(5);
      var nameFile = stringRandom + date + month + year + hour + menit + ".png";

      const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFile}`;
      sftp
        .connect(configSftp)
        .then(() => {
          // SFTP connection successful
          return sftp.put(bitmap, remoteFilePath);
        })
        .then(() => {
          console.log("berhasil upload image");

          sftp.end(); // Disconnect after the upload is complete
        })
        .catch((err) => {
          console.log(`gagal upload image ${err}`);
          sftp.end(); // Disconnect if an error occurs
          return res.status(400).send({
            status: false,
            message: "Gagal registrasi wajah",
          });
        });

      sftp.end();
    }

    var nomorSp = "";
    var typeAbsen = req.body.typeAbsen;
    var jamMasuk = "";
    var jamKeluar = "";
    var gambarMasuk = "";
    var gambarKeluar = "";
    var lokasiAbsenIn = "";
    var lokasiAbsenOut = "";
    var latLangIn = "";
    var latLangOut = "";
    var lokasiMasuk = "";
    var lokasiKeluar = "";
    var catatanMasuk = "";
    var catatanKeluar = "";
    var dateNow = req.body.tanggal_absen;
    let isNotif = false;
    let deskription = "";
    let title = "";
    let statusAbsen = "";
    var em_id = req.body.em_id;
    if (typeAbsen == "1" || typeAbsen == 1) {
      //  jamMasuk = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
      jamMasuk = formattedTime;
      gambarMasuk = req.body.reg_type == 0 ? "" : nameFile;
      lokasiMasuk = req.body.lokasi;
      catatanMasuk = req.body.catatan;
      latLangIn = req.body.latLang;
      lokasiAbsenIn = req.body.place;
    } else {
      //jamKeluar = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
      jamKeluar = formattedTime;
      gambarKeluar = req.body.reg_type == 0 ? "" : nameFile;
      lokasiKeluar = req.body.lokasi;
      catatanKeluar = req.body.catatan;
      latLangOut = req.body.latLang;
      lokasiAbsenOut = req.body.place;
    }

    var insertData = {
      em_id: req.body.em_id,
      atten_date: req.body.tanggal_absen,
      signin_time:
        jamMasuk == null || jamMasuk == "" || jamMasuk == undefined
          ? "00:00:00"
          : jamMasuk,
      signout_time:
        jamKeluar == "null" ||
        jamKeluar == null ||
        jamKeluar == "" ||
        jamKeluar == undefined
          ? "00:00:00"
          : jamKeluar,
      working_hour: "",
      place_in: lokasiAbsenIn,
      place_out: lokasiAbsenOut,
      absence: "",
      overtime: "",
      earnleave: "",
      status: "",
      signin_longlat: latLangIn,
      signout_longlat: latLangOut,
      // att_type: "",
      signin_pict: gambarMasuk,
      signout_pict: gambarKeluar,
      signin_note: catatanMasuk,
      signout_note: catatanKeluar,
      signin_addr: lokasiMasuk,
      signout_addr: lokasiKeluar,
      atttype: parseInt(req.body.kategori),

      // reg_type: 0,
      reg_type: req.body.reg_type,
    };
    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const namaDatabasMaster = `${database}_hrm`;

    var nomorLb = `LB20${convertYear}${convertBulan}`;
    var startDate = req.body.start_date == undefined ? "" : req.body.start_date;
    var endDate = req.body.end_date == undefined ? "" : req.body.end_date;
    var startTime = req.body.start_time == undefined ? "" : req.body.start_time;
    var endTime =
      req.body.end_time == undefined ? "" : (endTime = req.body.end_time);

    var queryCek = "";
    var queryEmployee = `SELECT IFNULL(branch.zona_waktu,0) AS zona_waktu FROM employee LEFT JOIN branch ON employee.branch_id=branch.id  WHERE employee.em_id='${req.body.em_id}' ORDER BY id DESC `;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabasMaster}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql2/promise");
    const poolDynamic = mysql.createPool(configDynamic);
    const connection = await poolDynamic.getConnection();

    //    poolDynamic.getConnection(function (err, connection) {

    if (startDate != "") {
      queryCek = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${req.body.em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}') AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC ;`;
    } else {
      queryCek = `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}' ORDER By id DESC`;
    }

    try {
      // Memulai transaksi
      await connection.beginTransaction();
      var queryEmmployee = `SELECT * FROM employee WHERE em_id='${req.body.em_id}'`;
      const [employee] = await connection.query(queryEmmployee);

      const [results] = await connection.query(queryCek);

      console.log("total absen ", results.length);
      if (results.length > 1) {
        if (results.length == 0) {
          await connection.query(
            `INSERT INTO ${namaDatabaseDynamic}.attendance SET ?`,
            [insertData]
          );
        } else {
          var lastItem = results[0];
          console.log("masuk sini 12 ", lastItem.signout_longlat);

          if (
            lastItem.signout_time == "" ||
            lastItem.signout_time == "00:00:00"
          ) {
            console.log("masuk sini 12");
            var id_record = lastItem.id;
            const [dataKeluar] = await connection.query(
              `UPDATE  ${namaDatabaseDynamic}.attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' `
            );

            const [cekLembur] = await connection.query(
              ` SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' AND tgl_ajuan='${dateNow}'`
            );

            console.log(
              `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' AND tgl_ajuan='${dateNow}'`
            );

            if (cekLembur.length == 0) {
              //logic Lembur
              console.log("tes  tes");
              const [sysdataLembur] = await connection.query(
                `SELECT * FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('041','042') `
              );

              console.log(sysdataLembur);
              if (sysdataLembur[0].name == "1" || sysdataLembur[0].name == 1) {
                var jamlembur = sysdataLembur[1].name;
                if (jamlembur == "" || jamlembur == "00:00") {
                } else {
                  console.log("lembur");

                  var dateNow = utility.dateNow2();

                  const jamParameter = new Date(`${dateNow}T${jamlembur}`); //jam masuk

                  var jamAbsen = new Date(`${dateNow}T${formattedTime}`);

                  if (jamAbsen > jamParameter) {
                    const [showDataLembur] = await connection.query(
                      ` SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' ORDER BY id DESC LIMIT 1`
                    );
                    const [employee] = await connection.query(
                      `SELECT * FROM employee WHERE em_id='${req.body.em_id}'`
                    );
                    var emReportTo = employee[0].em_report_to.split(",");
                    // var emReportTo=employee[0].em_report2_to.split(',')
                    var emDelegation = "";
                    if (emReportTo.length > 0) {
                      emDelegation = emReportTo[0];
                    }

                    if (showDataLembur.length > 0) {
                      var text = showDataLembur[0]["nomor_ajuan"];
                      var nomor = parseInt(text.substring(8, 13)) + 1;
                      var nomorStr = String(nomor).padStart(4, "0");
                      nomorLb = nomorLb + nomorStr;
                    } else {
                      var nomor = 1;
                      var nomorStr = String(nomor).padStart(4, "0");
                      nomorLb = nomorLb + nomorStr;
                    }
                    const selisihMilidetik = jamAbsen - jamParameter;
                    const selisihMenit = Math.floor(
                      selisihMilidetik / (1000 * 60)
                    ); // 1000 ms * 60 detik = 1 menit

                    const [lokasi] = await connection.query(
                      ` SELECT * FROM overtime WHERE lokasi  LIKE '%${lokasiAbsenOut}%' `
                    );

                    if (lokasi.length > 0) {
                      var dataLembur = {
                        nomor_ajuan: nomorLb,
                        em_id: req.body.em_id,
                        branch_id: employee[0]["branch_id"],
                        typeid: lokasi[0]["id"],
                        dari_jam: jamlembur,
                        dari_tgl: dateNow,
                        sampai_jam: formattedTime,
                        durasi: selisihMenit,
                        tgl_ajuan: dateNow,
                        atten_date: dateNow,
                        status: "Approve2",
                        status_transaksi: "1",
                        em_delegation: emDelegation,
                        uraian: catatanKeluar,

                        approve_status: "Approve",
                        approve2_status: "Approve",
                        ajuan: 1,
                      };

                      const [insertLembur] = await connection.query(
                        `INSERT INTO  ${namaDatabaseDynamic}.emp_labor SET ?;`,
                        [dataLembur]
                      );
                    }
                  }
                }
              }
            }
          } else {
            const [insert] = await connection.query(
              `INSERT INTO  ${namaDatabaseDynamic}.attendance SET ?;`,
              [insertData]
            );
          }
        }
      } else {
        //absen yang pertama

        //Absen 1

        if (results.length == 0) {
          var queryJadwal = `SELECT  IFNULL(work_schedule.time_in ,'08:30:00') as jam_masuk FROM ${namaDatabaseDynamic}.emp_shift  JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%'`;
          const [jamMasuk] = await connection.query(queryJadwal);

          if (jamMasuk.length > 0) {
            var jam = jamMasuk[0].jam_masuk;
            var jamAbsen = formattedTime;
            const jam1 = new Date(`${dateNow}T${jam}`); // 10:00 AM
            jam1.setMinutes(jam1.getMinutes() + 1);
            const jam2 = new Date(`${dateNow}T${jamAbsen}`); // 2:30 PM

            if (jam2 > jam1) {
              const selisihWaktu = jam1.getTime() - jam2.getTime();
              // Menghitung selisih dalam menit
              const selisihMenit = Math.floor(selisihWaktu / 60000); // 60000 ms = 1 menit
              title = "Absen Datang Terlambat";
              deskription = `Pemberitahuan: Anda datang terlambat. Mohon perhatikan waktu kedatangan di lain kesempatan`;
              isNotif = true;
              statusAbsen = "terlambat";
            }
          }
          await connection.query(
            `INSERT INTO ${namaDatabaseDynamic}.attendance SET ?`,
            [insertData]
          );
          console.log(
            "proses insert ",
            `INSERT INTO ${namaDatabaseDynamic}.attendance SET ?`
          );
          console.log(insertData);
          console.log("status absen", statusAbsen);
          if (statusAbsen == "terlambat") {
            var statussp = "";
            var statusSpName = "";
            var idSp = "";

            const [sysdata] = await connection.query(
              ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('S01','020','029','S08','SO9') `
            );
            console.log("nama database master ", namaDatabasMaster);
            console.log("nama database periode ", namaDatabaseDynamic);
            console.log(sysdata);

            var splitBulan = sysdata[0].name.split(",");
            const tanggalSekarang = new Date();
            const tanggalSekarangsp1 = tanggalSekarang.setMonth(
              tanggalSekarang.getMonth() + parseInt(splitBulan[0].toString())
            );
            const tanggalSekarangsp2 = tanggalSekarang.setMonth(
              tanggalSekarang.getMonth() + parseInt(splitBulan[1].toString())
            );
            var fixtgl = utility.dateConvert(tanggalSekarangsp1);
            var fixtglSp2 = utility.dateConvert(tanggalSekarangsp2);
            // var queryTerlambat=`SELECT attendance.* FROM ${namaDatabaseDynamic}.attendance JOIN ${namaDatabaseDynamic}.emp_shift ON emp_shift.atten_date=attendance.atten_date AND attendance.em_id=emp_shift.em_id  JOIN ${namaDatabasMaster}.work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${em_id}' AND work_schedule.time_in < attendance.signin_time`

            var startPeriode =
              req.query.start_periode == undefined
                ? "2024-02-03"
                : req.query.start_periode;
            var endPeriode =
              req.query.end_periode == undefined
                ? "2024-02-03"
                : req.query.end_periode;
            var array1 = startPeriode.split("-");
            var array2 = endPeriode.split("-");

            const startPeriodeDynamic = `${database}_hrm${array1[0].substring(
              2,
              4
            )}${array1[1]}`;
            const endPeriodeDynamic = `${database}_hrm${array2[0].substring(
              2,
              4
            )}${array2[1]}`;

            let date1 = new Date(startPeriode);
            let date2 = new Date(endPeriode);
            const montStart = date1.getMonth() + 1;
            const monthEnd = date2.getMonth() + 1;

            console.log("start end  ", date1);
            console.log("end start  ", date2);

            console.log("start end  ", montStart, date1.getMonth());
            console.log("end start  ", monthEnd, date2.getMonth());

            var queryTerlambat = `WITH RankedAttendance1 AS (
                SELECT *, 
                (SELECT b.name FROM ${startPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
              
                       ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY attendance.id) AS row_num
                FROM ${startPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND atten_date>='${startPeriode}' AND atten_date <='${endPeriode}'
            )
            SELECT RankedAttendance1.* 
              FROM RankedAttendance1 
              JOIN ${startPeriodeDynamic}.emp_shift ON RankedAttendance1.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance1.atten_date
              LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
              WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance1.signin_time
              AND RankedAttendance1.em_id='${em_id}'`;

            if (
              montStart < monthEnd ||
              date1.getFullYear() < date2.getFullYear()
            ) {
              var queryTerlambat = `
                
                WITH RankedAttendance1 AS (
                  SELECT *, 
                  (SELECT b.name FROM ${startPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                
                         ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY attendance.id) AS row_num
                  FROM ${startPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND atten_date>='${startPeriode}' AND atten_date <='${endPeriode}'
              ),RankedAttendance2 AS (
                SELECT *,
                (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti , 
                       ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY attendance.id) AS row_num
                FROM ${endPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND atten_date>='${startPeriode}' AND atten_date <='${endPeriode}'
            )

              SELECT RankedAttendance1.* 
              FROM RankedAttendance1 
              JOIN ${startPeriodeDynamic}.emp_shift ON RankedAttendance1.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance1.atten_date
              LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
              WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance1.signin_time
              AND RankedAttendance1.em_id='${em_id}'    
              UNION ALL 
              SELECT RankedAttendance2.* 
              FROM RankedAttendance2 
              JOIN ${endPeriodeDynamic}.emp_shift ON RankedAttendance2.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance2.atten_date
              LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
              WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance2.signin_time
              AND RankedAttendance2   .em_id='${em_id}'   
               
              
              `;
            }
            queryTerlambat = `SELECT * FROM (${queryTerlambat}) AS TBL WHERE TBL.cuti IS NULL`;

            console.log(queryTerlambat);

            const [terlambat] = await connection.query(queryTerlambat);
            console.log("masuk sini ", terlambat.length);
            console.log("masuk sini ", sysdata[0].name);
            deskription = `Anda sudah terlambat ${
              terlambat.length
            }x. Mohon perhatikan waktu kedatangan di lain kesempatan 
              jika terlambat mencapai ${parseInt(
                sysdata[1].name
              )}x. Kami akan mengeluarkan surat peringatan`;
            utility.insertNotifikasiAbsensi(
              sysdata[2].name,
              "Absensi Terlambat",
              statusAbsen,
              employee[0].emId,
              "",
              "",
              employee[0].full_name,
              namaDatabaseDynamic,
              namaDatabasMaster
            );

            if (terlambat.length >= parseInt(sysdata[1].name)) {
              statusSpName = "Surat Peringatan 1";
              (statussp = "sp1"), (idSp = "2");
            }

            if (terlambat.length >= parseInt(sysdata[3].name)) {
              statusSpName = "Surat Peringatan 2";
              statussp = "sp2";
              idSp = "3";
            }

            // if ((terlambat.length>=parseInt(sysdata[3].name))){
            //   statusSpName="Surat Peringatan 3"
            //   statussp="sp3"
            //   idSp='4'
            // }

            if (terlambat.length >= parseInt(sysdata[1].name)) {
              var status = "Pending";
              var alasan = "Absen datang terlambat";
              var approveStatus = "Pending";
              var titleAbsen = "Absen Datang Terlambat";

              const [cekDataSp] =
                await connection.query(`SELECT * FROM employee_letter
                 WHERE em_id='${req.body.em_id}' AND status IN ('Pending','Appprove','Approved') 
                 AND alasan LIKE '%${alasan}%'
                 AND eff_date >=CURDATE() AND CURDATE()<=exp_date AND title='${titleAbsen}' ORDER BY id DESC`);

              if (cekDataSp.length > 0) {
                // suda dapat sp1
                if (cekDataSp[0]["letter_id"] == "2") {
                  if (terlambat.length >= parseInt(sysdata[3].name)) {
                    // SP 2
                    deskription = `Anda tercatat melakukan absensi datang terlambat ${terlambat.length}x. Kami akan ${statusSpName}. Mohon perhatikan waktu absensi anda di lain kesempatan
                        `;

                    const [dataSp] = await connection.query(
                      `SELECT * FROM ${namaDatabasMaster}.employee_letter WHERE nomor LIKE '%SP%' AND nomor IS NOT NULL  ORDER BY id DESC LIMIT 1`
                    );
                    nomorSp = `SP${year}${convertBulan}`;
                    if (dataSp.length > 0) {
                      var text = dataSp[0]["nomor"];
                      var nomor = parseInt(text.substring(9, 14)) + 1;
                      var nomorStr = String(nomor).padStart(4, "0");
                      nomorSp = nomorSp + nomorStr;
                    } else {
                      var nomor = 1;
                      var nomorStr = String(nomor).padStart(4, "0");
                      nomorSp = nomorSp + nomorStr;
                    }

                    const [data] =
                      await connection.query(`INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,upload_file,status,approve_status,title,exp_date)
                 VALUES ('${nomorSp}','${utility.dateNow2()}','${em_id}','${idSp}','${utility.dateNow2()}','','${status}','${approveStatus}','${titleAbsen}','${fixtgl2}') `);

                    const [insertDetail] = await connection.query(
                      `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUES('${data.insertId}','${alasan}')`
                    );

                    const [sysdataSP] = await connection.query(
                      ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026','027')`
                    );
                    if (sysdataSP.length > 0) {
                      if (sysdataSP[0].name != null) {
                        utility.insertNotifikasiAbsensiSp(
                          sysdataSP[0].name,
                          "Absensi Terlambat",
                          statusAbsen,
                          employee[0].emId,
                          "",
                          sysdataSP[0].nomor,
                          employee[0].full_name,
                          namaDatabaseDynamic,
                          namaDatabasMaster,
                          statusSpName
                        );
                      }
                      if (sysdataSP[1].name != null) {
                        utility.insertNotifikasiAbsensiSp(
                          sysdataSP[1].name,
                          "Absensi Terlambat",
                          statusAbsen,
                          employee[0].emId,
                          "",
                          sysdataSP[0].nomor,
                          employee[0].full_name,
                          namaDatabaseDynamic,
                          namaDatabasMaster,
                          statusSpName
                        );
                      }
                    }
                  } else {
                    deskription = `Anda sudah terlambat ${terlambat.length} x dan sudah menerima Surat Peringatan 1 dengan nomor ${cekDataSp[0].nomor}. Mohon perhatikan dan perbaiki kualitas absensi Anda. 
                      `;
                  }
                }

                if (cekDataSp[0]["letter_id"] == "3") {
                  if (terlambat.length >= parseInt(sysdata[4].name)) {
                    // SP 3
                    deskription = `Anda tercatat melakukan absensi datang terlambat ${terlambat.length}x. Kami akan mengeluarkan ${statusSpName}. Mohon perhatikan waktu absensi anda di lain kesempatan
                        `;

                    const [dataSp] = await connection.query(
                      `SELECT * FROM ${namaDatabasMaster}.employee_letter WHERE nomor LIKE '%SP%' AND nomor IS NOT NULL  ORDER BY id DESC LIMIT 1`
                    );
                    nomorSp = `SP${year}${convertBulan}`;
                    if (dataSp.length > 0) {
                      var text = dataSp[0]["nomor"];
                      var nomor = parseInt(text.substring(9, 14)) + 1;
                      var nomorStr = String(nomor).padStart(4, "0");
                      nomorSp = nomorSp + nomorStr;
                    } else {
                      var nomor = 1;
                      var nomorStr = String(nomor).padStart(4, "0");
                      nomorSp = nomorSp + nomorStr;
                    }

                    const [data] =
                      await connection.query(`INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,upload_file,status,approve_status,title,exp_date)
                 VALUES ('${nomorSp}','${utility.dateNow2()}','${em_id}','${idSp}','${utility.dateNow2()}','','${status}','${approveStatus}','${titleAbsen}','${fixtglSp2}') `);

                    const [insertDetail] = await connection.query(
                      `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUES('${data.insertId}','${alasan}')`
                    );

                    const [sysdataSP] = await connection.query(
                      ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026','027')`
                    );
                    if (sysdataSP.length > 0) {
                      if (sysdataSP[0].name != null) {
                        utility.insertNotifikasiAbsensiSp(
                          sysdataSP[0].name,
                          "Absensi Terlambat",
                          statusAbsen,
                          employee[0].emId,
                          "",
                          "",
                          employee[0].full_name,
                          namaDatabaseDynamic,
                          namaDatabasMaster,
                          statusSpName
                        );
                      }
                      if (sysdataSP[1].name != null) {
                        utility.insertNotifikasiAbsensiSp(
                          sysdataSP[1].name,
                          "Absensi Terlambat",
                          statusAbsen,
                          employee[0].emId,
                          "",
                          "",
                          employee[0].full_name,
                          namaDatabaseDynamic,
                          namaDatabasMaster,
                          statusSpName
                        );
                      }
                    }
                  } else {
                    deskription = `Anda sudah terlambat ${terlambat.length} x dan sudah menerima Surat Peringatan 2 dengan nomor ${cekDataSp[0].nomor}. Mohon perhatikan dan perbaiki kualitas absensi Anda. 
                      `;
                  }
                }
              } else {
                // SP 1
                deskription = `Anda tercatat melakukan absensi datang terlambat ${terlambat.length}x. Kami akan mengeluarkan ${statusSpName}. Mohon perhatikan waktu absensi anda di lain kesempatan
                  `;
                const [dataSp] = await connection.query(
                  `SELECT * FROM ${namaDatabasMaster}.employee_letter WHERE nomor LIKE '%SP%' AND nomor IS NOT NULL  ORDER BY id DESC LIMIT 1`
                );
                nomorSp = `SP${year}${convertBulan}`;
                if (dataSp.length > 0) {
                  var text = dataSp[0]["nomor"];
                  var nomor = parseInt(text.substring(9, 14)) + 1;
                  var nomorStr = String(nomor).padStart(4, "0");
                  nomorSp = nomorSp + nomorStr;
                } else {
                  var nomor = 1;
                  var nomorStr = String(nomor).padStart(4, "0");
                  nomorSp = nomorSp + nomorStr;
                }

                const [data] =
                  await connection.query(`INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,upload_file,status,approve_status,title)
                 VALUES ('${nomorSp}','${utility.dateNow2()}','${em_id}','${idSp}','${fixtgl}','','${status}','${approveStatus}','${titleAbsen}') `);

                const [insertDetail] = await connection.query(
                  `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUES('${data.insertId}','${alasan}')`
                );
                //  const [sysdataSP] = await connection.query(` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026)`);
                // if (sysdataSP.length>0){

                //   if (sysdataSP[0].name!=null){

                //     utility.insertNotifikasiAbsensiSp(sysdataSP[0].name,'Absensi Terlambat',statusAbsen,employee[0].emId,'','',employee[0].full_name,namaDatabaseDynamic,namaDatabasMaster)

                //   }

                // }

                const [sysdataSP] = await connection.query(
                  ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026','027')`
                );
                if (sysdataSP.length > 0) {
                  if (sysdataSP[0].name != null) {
                    utility.insertNotifikasiAbsensiSp(
                      sysdataSP[0].name,
                      "Absensi Terlambat",
                      statusAbsen,
                      employee[0].emId,
                      "",
                      "",
                      employee[0].full_name,
                      namaDatabaseDynamic,
                      namaDatabasMaster,
                      statusSpName
                    );
                  }
                  if (sysdataSP[1].name != null) {
                    utility.insertNotifikasiAbsensiSp(
                      sysdataSP[1].name,
                      "Absensi Terlambat",
                      statusAbsen,
                      employee[0].emId,
                      "",
                      "",
                      employee[0].full_name,
                      namaDatabaseDynamic,
                      namaDatabasMaster,
                      statusSpName
                    );
                  }
                }
              }
            } else {
            }
          } else {
          }
        } else {
          var lastItem = results.pop();
          if (
            lastItem.signout_longlat == "" ||
            lastItem.signout_time == "00:00:00"
          ) {
            var id_record = lastItem.id;
            const [dataKeluar] = await connection.query(
              `UPDATE  ${namaDatabaseDynamic}.attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' `
            );
            const [jamMasuk] = await connection.query(
              `SELECT  IFNULL(work_schedule.time_out ,'17:00:00') as jam_masuk FROM ${namaDatabaseDynamic}.emp_shift  JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%'`
            );

            console.log("tes  tes");
            const [sysdataLembur] = await connection.query(
              `SELECT * FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('041','042') `
            );

            console.log(sysdataLembur);
            if (sysdataLembur[0].name == "1" || sysdataLembur[0].name == 1) {
              var jamlembur = sysdataLembur[1].name;
              if (jamlembur == "" || jamlembur == "00:00") {
              } else {
                console.log("lembur");

                var dateNow = utility.dateNow2();

                const jamParameter = new Date(`${dateNow}T${jamlembur}`); //jam masuk

                var jamAbsen = new Date(`${dateNow}T${formattedTime}`);

                if (jamAbsen > jamParameter) {
                  const [showDataLembur] = await connection.query(
                    ` SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' ORDER BY id DESC LIMIT 1`
                  );
                  const [employee] = await connection.query(
                    `SELECT * FROM employee WHERE em_id='${req.body.em_id}'`
                  );
                  var emReportTo = employee[0].em_report_to.split(",");
                  // var emReportTo=employee[0].em_report2_to.split(',')
                  var emDelegation = "";
                  if (emReportTo.length > 0) {
                    emDelegation = emReportTo[0];
                  }

                  if (showDataLembur.length > 0) {
                    var text = showDataLembur[0]["nomor_ajuan"];
                    var nomor = parseInt(text.substring(8, 13)) + 1;
                    var nomorStr = String(nomor).padStart(4, "0");
                    nomorLb = nomorLb + nomorStr;
                  } else {
                    var nomor = 1;
                    var nomorStr = String(nomor).padStart(4, "0");
                    nomorLb = nomorLb + nomorStr;
                  }
                  const selisihMilidetik = jamAbsen - jamParameter;
                  const selisihMenit = Math.floor(
                    selisihMilidetik / (1000 * 60)
                  ); // 1000 ms * 60 detik = 1 menit

                  const [lokasi] = await connection.query(
                    ` SELECT * FROM overtime WHERE lokasi  LIKE '%${lokasiAbsenOut}%' `
                  );

                  if (lokasi.length > 0) {
                    var dataLembur = {
                      nomor_ajuan: nomorLb,
                      em_id: req.body.em_id,
                      branch_id: employee[0]["branch_id"],
                      typeid: lokasi[0]["id"],
                      dari_jam: jamlembur,
                      dari_tgl: dateNow,
                      sampai_jam: formattedTime,
                      durasi: selisihMenit,
                      tgl_ajuan: dateNow,
                      atten_date: dateNow,
                      status: "Approve2",
                      status_transaksi: "1",
                      em_delegation: emDelegation,
                      uraian: catatanKeluar,

                      approve_status: "Approve",
                      approve2_status: "Approve",
                      ajuan: 1,
                    };

                    const [insertLembur] = await connection.query(
                      `INSERT INTO  ${namaDatabaseDynamic}.emp_labor SET ?;`,
                      [dataLembur]
                    );
                  }
                }
              }
            }

            console.log("data result ", results.length);

            console.log("data result ", results.length);
            if (jamMasuk.length > 0) {
              var jam = jamMasuk[0].jam_masuk;
              var jamAbsen = formattedTime;
              const jam1 = new Date(`${dateNow}T${jam}`); //jam masuk
              jam1.setMinutes(jam1.getMinutes() + 1);
              const jam2 = new Date(`${dateNow}T${jamAbsen}`); // jam pulang

              if (jam2 < jam1) {
                const selisihWaktu = jam1.getTime() - jam2.getTime();

                // Menghitung selisih dalam menit
                const selisihMenit = Math.floor(selisihWaktu / 60000); // 60000 ms = 1 menit

                title = "Absen Pulang Cepat";
                deskription = `Anda pulang lebih awal. Pastikan untuk tetap menjaga komitmen kerja di lain waktu`;
                isNotif = true;
                statusAbsen = "pulang_cepat";
              }
            }

            if (statusAbsen == "pulang_cepat") {
              const [sysdata] = await connection.query(
                `SELECT IFNULL(name,3) as name FROM sysdata WHERE kode IN ('S02','030','020','S10','S11')`
              );

              var splitBulan = sysdata[0].name.split(",");
              const tanggalSekarang = new Date();
              const tanggalSekarangsp1 = tanggalSekarang.setMonth(
                tanggalSekarang.getMonth() + parseInt(splitBulan[0].toString())
              );

              const fixtgl = utility.dateConvert(tanggalSekarangsp1);
              // utility.insertNotifikasi(sysdata[2].name,'Absensi Pulang Cepat',statusAbsen,"",employee[0].full_name,namaDatabaseDynamic,namaDatabasMaster)

              //    var queryPulangCepaat=`WITH RankedAttendance AS (
              //     SELECT *,
              //            ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
              //     FROM ${namaDatabaseDynamic}.attendance
              // )
              // SELECT *
              // FROM RankedAttendance
              // JOIN ${namaDatabaseDynamic}.emp_shift ON RankedAttendance.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance.atten_date
              // LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
              // WHERE row_num = 1 AND IFNULL(work_schedule.time_out,'18:00') < RankedAttendance.signout_time
              // AND RankedAttendance.em_id='${em_id}'  AND RankedAttendance.signout_time!='00:00:00' `

              var startPeriode =
                req.query.start_periode == undefined
                  ? "2024-02-03"
                  : req.query.start_periode;
              var endPeriode =
                req.query.end_periode == undefined
                  ? "2024-02-03"
                  : req.query.end_periode;
              var array1 = startPeriode.split("-");
              var array2 = endPeriode.split("-");

              const startPeriodeDynamic = `${database}_hrm${array1[0].substring(
                2,
                4
              )}${array1[1]}`;
              const endPeriodeDynamic = `${database}_hrm${array2[0].substring(
                2,
                4
              )}${array2[1]}`;

              let date1 = new Date(startPeriode);
              let date2 = new Date(endPeriode);
              const montStart = date1.getMonth() + 1;
              const monthEnd = date2.getMonth() + 1;

              var queryPulangCepaat = `  WITH RankedAttendance1 AS (
          SELECT *, 
          (SELECT b.name FROM ${startPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
        
                 ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY attendance.id) AS row_num
          FROM ${startPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND signout_time != '00:00:00' AND atten_date>='${startPeriode}' AND atten_date <='${endPeriode}'
      )
      SELECT RankedAttendance1.* 
        FROM RankedAttendance1 
        JOIN ${startPeriodeDynamic}.emp_shift ON RankedAttendance1.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance1.atten_date
        LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
        WHERE row_num = 1  AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance1 .signout_time
        AND RankedAttendance1.em_id='${em_id}'   
        AND  RankedAttendance1.atten_date>='${startPeriode}' AND RankedAttendance1.atten_date<='${endPeriode}'`;

              if (
                montStart < monthEnd ||
                date1.getFullYear() < date2.getFullYear()
              ) {
                var queryPulangCepaat = `
          
          WITH RankedAttendance1 AS (
            SELECT *, 
            (SELECT b.name FROM ${startPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
          
                   ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY attendance.id) AS row_num
            FROM ${startPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND signout_time != '00:00:00' AND atten_date>='${startPeriode}' AND atten_date <='${endPeriode}'
        ),RankedAttendance2 AS (
          SELECT *,
          (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti , 
                 ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY attendance.id) AS row_num
          FROM ${endPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND signout_time != '00:00:00' AND atten_date>='${startPeriode}' AND atten_date <='${endPeriode}'
          
      ) 

        SELECT RankedAttendance1.* 
        FROM RankedAttendance1 
        JOIN ${startPeriodeDynamic}.emp_shift ON RankedAttendance1.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance1.atten_date
        LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
        WHERE row_num = 1  AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance1 .signout_time
        AND RankedAttendance1.em_id='${em_id}'   
        AND  RankedAttendance1.atten_date>='${startPeriode}' AND RankedAttendance1.atten_date<='${endPeriode}'
        UNION ALL 
        SELECT RankedAttendance2.* 
        FROM RankedAttendance2 
        JOIN ${endPeriodeDynamic}.emp_shift ON RankedAttendance2.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance2.atten_date
        LEFT JOIN ${namaDatabasMaster}.work_schedule ON emp_shift.work_id=work_schedule.id
        WHERE row_num = 1 AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance2 .signout_time
        AND RankedAttendance2   .em_id='${em_id}'   
        AND  RankedAttendance2.atten_date>='${startPeriode}' AND RankedAttendance2.atten_date<='${endPeriode}'
         
        
        `;
              }
              queryPulangCepaat = `SELECT * FROM (${queryPulangCepaat}) AS TBL WHERE TBL.cuti IS NULL`;

              // if (montStart<monthEnd){

              //     var queryTerlambat=`

              //     WITH RankedAttendance1 AS (
              //       SELECT *,
              //       (SELECT b.name FROM ${startPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE
              //         em_id='${em_id}' AND leave_status='Approve2'   AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
              //              ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
              //       FROM ${startPeriodeDynamic}.attendance WHERE em_id='${em_id}'  AND signout_time != '00:00:00' ORDER BY id DESC
              //   ),ankedAttendance1 AS (
              //     SELECT *,
              //     (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE
              //       em_id='${em_id}' AND leave_status='Approve2'   AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
              //            ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
              //     FROM ${endPeriodeDynamic}.attendance WHERE em_id='${em_id}'  AND signout_time != '00:00:00' ORDER BY id DESC

              // )

              // SELECT RankedAttendance1 .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
              //   FROM RankedAttendance1
              //   JOIN ${startPeriodeDynamic}.emp_shift ON RankedAttendance1 .em_id = emp_shift.em_id
              //   AND emp_shift.atten_date = RankedAttendance1.atten_date

              //   LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
              //   WHERE RankedAttendance1 .row_num = 1
              //   AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance1 .signout_time
              //   AND RankedAttendance1 .em_id='${em_id}'  AND RankedAttendance1.signout_time!='00:00:00'   AND  RankedAttendance1.atten_date>='${startPeriode}' AND RankedAttendance1.atten_date<='${endPeriode}'

              //   UNION ALL
              //   SELECT RankedAttendance2 .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
              //   FROM RankedAttendance2
              //   JOIN ${startPeriodeDynamic}.emp_shift ON RankedAttendance2 .em_id = emp_shift.em_id
              //   AND emp_shift.atten_date = RankedAttendance2.atten_date

              //   LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
              //   WHERE RankedAttendance2 .row_num = 1
              //   AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance2 .signout_time
              //   AND RankedAttendance2 .em_id='${em_id}'  AND RankedAttendance2.signout_time!='00:00:00'   AND  RankedAttendance2.atten_date>='${startPeriode}' AND RankedAttendance.atten_date<='${endPeriode}'

              //   `

              //     ;

              // }
              // queryPulangCepaat=`SELECT * FROM (${queryPulangCepaat}) AS TBL WHERE TBL.cuti IS NULL`

              const [pulangCepat] = await connection.query(queryPulangCepaat);

              // const [pulangCepat] = await connection.query( ` SELECT * FROM ${namaDatabaseDynamic}.attendance JOIN ${namaDatabaseDynamic}.emp_shift  ON emp_shift.atten_date=attendance.atten_date
              // AND attendance.em_id=emp_shift.em_id JOIN work_schedule ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${em_id}' AND work_schedule.time_out > attendance.signout_time  AND attendance.signout_time!='00:00:00' `);

              utility.insertNotifikasiAbsensi(
                sysdata[2].name,
                "Absensi Pulang Cepat",
                statusAbsen,
                employee[0].emId,
                "",
                "",
                employee[0].full_name,
                namaDatabaseDynamic,
                namaDatabasMaster
              );

              deskription = `Anda tercatat melakukan absensi pulang cepat  ${pulangCepat.length}x. Mohon perhatikan waktu absensi anda di lain kesempatan.Jika absensi pulang cepat anda  mecapai ${sysdata[1].name}x. Kami akan mengeluarkan Surat peringatan.
           `;
              var statusSpName = "";
              var statussp = "";
              var idSp = "";
              if (pulangCepat.length >= parseInt(sysdata[1].name)) {
                statusSpName = "Surat Peringatan 1";
                (statussp = "sp1"), (idSp = "2");
              }

              if (pulangCepat.length >= parseInt(sysdata[3].name)) {
                statusSpName = "Surat Peringatan 2";
                statussp = "sp2";
                idSp = "3";
              }

              if (pulangCepat.length >= parseInt(sysdata[3].name)) {
                statusSpName = "Surat Peringatan 3";
                statussp = "sp3";
                idSp = "4";
              }

              if (pulangCepat.length >= sysdata[1].name) {
                var status = "Pending";
                var alasan = "Absen Pulang cepat";
                var approveStatus = "Pending";

                const [cekDataSp] = await connection.query(
                  `SELECT * FROM employee_letter WHERE em_id='${req.body.em_id}' AND status IN ('Pending','Appprove','Approved') AND alasan LIKE '%${alasan}%'`
                );

                if (cekDataSp.length > 0) {
                  // suda dapat sp1
                  if (cekDataSp[0]["letter_id"] == "2") {
                    if (pulangCepat.length >= parseInt(sysdata[3].name)) {
                      // SP 2
                      deskription = `Anda tercatat melakukan absensi pulang cepat ${pulangCepat.length}x. Kami akan mengeluarkan ${statusSpName}. Mohon perhatikan waktu absensi anda di lain kesempatan
                          `;

                      const [dataSp] = await connection.query(
                        `SELECT * FROM ${namaDatabasMaster}.employee_letter WHERE nomor LIKE '%SP%' AND nomor IS NOT NULL  ORDER BY id DESC LIMIT 1`
                      );
                      nomorSp = `SP${year}${convertBulan}`;
                      if (dataSp.length > 0) {
                        var text = dataSp[0]["nomor"];
                        var nomor = parseInt(text.substring(9, 14)) + 1;
                        var nomorStr = String(nomor).padStart(4, "0");
                        nomorSp = nomorSp + nomorStr;
                      } else {
                        var nomor = 1;
                        var nomorStr = String(nomor).padStart(4, "0");
                        nomorSp = nomorSp + nomorStr;
                      }

                      const [data] =
                        await connection.query(`INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,upload_file,status,approve_status,title,exp_date)
                   VALUES ('${nomorSp}','${utility.dateNow2()}','${em_id}','${idSp}','${utility.dateNow2()}','','${status}','${approveStatus}','${titleAbsen}','${fixtglSp2}') `);

                      const [insertDetail] = await connection.query(
                        `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUES('${data.insertId}','${alasan}')`
                      );

                      const [sysdataSP] = await connection.query(
                        ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026','027')`
                      );
                      if (sysdataSP.length > 0) {
                        if (sysdataSP[0].name != null) {
                          utility.insertNotifikasiAbsensiSp(
                            sysdataSP[0].name,
                            "Absensi Pulang Cepat",
                            statusAbsen,
                            employee[0].emId,
                            "",
                            "",
                            employee[0].full_name,
                            namaDatabaseDynamic,
                            namaDatabasMaster,
                            statusSpName
                          );
                        }
                        if (sysdataSP[1].name != null) {
                          utility.insertNotifikasiAbsensiSp(
                            sysdataSP[1].name,
                            "Absensi Pulang Cepat",
                            statusAbsen,
                            employee[0].emId,
                            "",
                            "",
                            employee[0].full_name,
                            namaDatabaseDynamic,
                            namaDatabasMaster,
                            statusSpName
                          );
                        }
                      }
                    } else {
                      deskription = `Anda sudah pulang cepat ${pulangCepat.length} x dan sudah menerima Surat Peringatan 1 dengan nomor ${cekDataSp[0].nomor}. Mohon perhatikan dan perbaiki kualitas absensi Anda. 
                        `;
                    }
                  }

                  if (cekDataSp[0]["letter_id"] == "3") {
                    if (pulangCepat.length >= parseInt(sysdata[4].name)) {
                      // SP 3
                      deskription = `Anda tercatat melakukan absensi datang pulang cepat ${pulangCepat.length}x. Kami akan mengeluarkan ${statusSpName}. Mohon perhatikan waktu absensi anda di lain kesempatan
                          `;

                      const [dataSp] = await connection.query(
                        `SELECT * FROM ${namaDatabasMaster}.employee_letter WHERE nomor LIKE '%SP%' AND nomor IS NOT NULL  ORDER BY id DESC LIMIT 1`
                      );
                      nomorSp = `SP${year}${convertBulan}`;
                      if (dataSp.length > 0) {
                        var text = dataSp[0]["nomor"];
                        var nomor = parseInt(text.substring(9, 14)) + 1;
                        var nomorStr = String(nomor).padStart(4, "0");
                        nomorSp = nomorSp + nomorStr;
                      } else {
                        var nomor = 1;
                        var nomorStr = String(nomor).padStart(4, "0");
                        nomorSp = nomorSp + nomorStr;
                      }

                      const [data] =
                        await connection.query(`INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,upload_file,status,approve_status,title,exp_date)
                   VALUES ('${nomorSp}','${utility.dateNow2()}','${em_id}','${idSp}','${utility.dateNow2()}','','${status}','${approveStatus}','${titleAbsen}','${fixtglSp2}') `);

                      const [insertDetail] = await connection.query(
                        `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUES('${data.insertId}','${alasan}')`
                      );

                      const [sysdataSP] = await connection.query(
                        ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026','027')`
                      );
                      if (sysdataSP.length > 0) {
                        if (sysdataSP[0].name != null) {
                          utility.insertNotifikasiAbsensiSp(
                            sysdataSP[0].name,
                            "Absensi Pulang Cepat",
                            statusAbsen,
                            employee[0].emId,
                            "",
                            "",
                            employee[0].full_name,
                            namaDatabaseDynamic,
                            namaDatabasMaster,
                            statusSpName
                          );
                        }
                        if (sysdataSP[1].name != null) {
                          utility.insertNotifikasiAbsensiSp(
                            sysdataSP[1].name,
                            "Absensi Pulang Cepat",
                            statusAbsen,
                            employee[0].emId,
                            "",
                            "",
                            employee[0].full_name,
                            namaDatabaseDynamic,
                            namaDatabasMaster,
                            statusSpName
                          );
                        }
                      }
                    } else {
                      deskription = `Anda sudah absensin pulang cepat ${pulangCepat.length} x dan sudah menerima Surat Peringatan 2 dengan nomor ${cekDataSp[0].nomor}. Mohon perhatikan dan perbaiki kualitas absensi Anda. 
                        `;
                    }
                  }

                  // if (cekDataSp[0]['staus']=="Pending" || cekDataSp[0]['staus']=="pending" ){
                  //   deskription=`Anda tercatat melakukan absensi pulang cepat  ${pulangCepat.length}x. Kami akan mengeluarkan Surat Peringatan. Mohon perhatikan waktu absensi anda di lain kesempatan
                  //   `

                  // }else{

                  //   deskription=`Anda tercatat melakukan absensi pulang cepat  ${pulangCepat.length}x.
                  //   dan sudah menerima Surat Peringatan nomor ${cekDataSp[0].nomor}. mohon perhatikan waktu absensi anda di lain kesempatan
                  //   `

                  // }

                  //logic Lembur
                } else {
                  deskription = `Anda tercatat melakukan absensi pulang cepat ${pulangCepat.length}x. Kami akan mengeluarkan ${statusSpName}. Mohon perhatikan waktu absensi anda di lain kesempatan
                `;

                  const [dataSp] = await connection.query(
                    `SELECT * FROM employee_letter WHERE nomor LIKE '%SP%'  ORDER BY id DESC LIMIT 1`
                  );

                  nomorSp = `SP${year}${convertBulan}`;

                  if (dataSp.length > 0) {
                    var text = dataSp[0]["nomor"];
                    var nomor = parseInt(text.substring(9, 14)) + 1;
                    var nomorStr = String(nomor).padStart(4, "0");
                    nomorSp = nomorSp + nomorStr;
                  } else {
                    var nomor = 1;
                    var nomorStr = String(nomor).padStart(4, "0");
                    nomorSp = nomorSp + nomorStr;
                  }

                  var status = "Pending";
                  var alasan = "Absen pulang cepat";
                  var approveStatus = "Pending";
                  var titleNew = "Absen Pulang Cepat";

                  const [data] =
                    await connection.query(`INSERT INTO employee_letter (nomor,tgl_surat,em_id,letter_id,eff_date,upload_file,status,approve_status,title,exp_date)
                    VALUES ('${nomorSp}','${utility.dateNow2()}','${em_id}','${idSp}','${utility.dateNow2()}','','${status}','${approveStatus}','${titleNew}','${fixtgl}') `);

                  const [insertDetail] = await connection.query(
                    `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUES('${data.insertId}','${alasan}')`
                  );

                  const [sysdataSP] = await connection.query(
                    ` SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('026','027')`
                  );
                  if (sysdataSP.length > 0) {
                    if (sysdataSP[0].name != null) {
                      utility.insertNotifikasiAbsensiSp(
                        sysdataSP[0].name,
                        "Absensi Pulang Cepat",
                        statusAbsen,
                        employee[0].emId,
                        "",
                        "",
                        employee[0].full_name,
                        namaDatabaseDynamic,
                        namaDatabasMaster,
                        statusSpName
                      );
                    }
                    if (sysdataSP[1].name != null) {
                      utility.insertNotifikasiAbsensiSp(
                        sysdataSP[1].name,
                        "Absensi Pulang Cepat",
                        statusAbsen,
                        employee[0].emId,
                        "",
                        "",
                        employee[0].full_name,
                        namaDatabaseDynamic,
                        namaDatabasMaster,
                        statusSpName
                      );
                    }
                  }
                }
              }
            }
          } else {
            const [insert] = await connection.query(
              `INSERT INTO  ${namaDatabaseDynamic}.attendance SET ?;`,
              [insertData]
            );
          }
        }
      }

      await connection.commit();
      return res.status(200).send({
        status: true,
        message: "berhasil kirimm absen",
        title: title, // Absen Datang terlambat
        is_show_notif: isNotif, //true and false,
        deskription: deskription, //deslripsi ,
        status_absen: statusAbsen, // pulang_cepat atau terlambat,
        data: insertData,
      });

      // // Contoh query
      // const insertQuery1 = 'INSERT INTO table1 (column1) VALUES (?)';
      // const [result1] = await connection.query(insertQuery1, ['value1']);

      // const insertQuery2 = 'INSERT INTO table2 (column2) VALUES (?)';
      // const [result2] = await connection.query(insertQuery2, ['value2']);

      // // Jika semua query berhasil, commit transaksi

      // console.log('Transaction committed:', result1.insertId, result2.insertId);
    } catch (error) {
      // Jika ada error, rollback transaksi
      await connection.rollback();
      console.error("Transaction rolled back:", error);
    } finally {
      // Lepaskan koneksi setelah selesai
      connection.release();
    }
  },

  async kirimAbsen(req, res) {
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
          connection.query(
            `SELECT * FROM employee WHERE em_id='${req.body.em_id}'`,
            (err, employee) => {
              if (err) {
                console.error("Error executing UPDATE statement:", err);
                connection.rollback(() => {
                  1;

                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "terjadi kesalahan",
                    data: [],
                  });
                });
                return;
              }
              connection.query(queryCek, (err, results) => {
                if (err) {
                  console.error("Error executing UPDATE statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: "terjadi kesalahan",
                      data: [],
                    });
                  });
                  return;
                }

                if (results.length == 0) {
                  connection.query(
                    `SELECT  IFNULL(work_schedule.time_in ,'08:30:00') as jam_masuk FROM ${namaDatabaseDynamic}.emp_shift  JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%'`,
                    (err, jamMasuk) => {
                      if (err) {
                        console.error("Error executing UPDATE statement:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: "terjadi kesalahan",
                            data: [],
                          });
                        });
                        return;
                      }
                      if (jamMasuk.length > 0) {
                        var jam = jamMasuk[0].jam_masuk;
                        var jamAbsen = formattedTime;
                        const jam1 = new Date(`${dateNow}T${jam}`); // 10:00 AM
                        jam1.setMinutes(jam1.getMinutes() + 1);
                        const jam2 = new Date(`${dateNow}T${jamAbsen}`); // 2:30 PM

                        if (jam2 > jam1) {
                          const selisihWaktu = jam1.getTime() - jam2.getTime();

                          // Menghitung selisih dalam menit
                          const selisihMenit = Math.floor(selisihWaktu / 60000); // 60000 ms = 1 menit
                          title = "Absen Datang Terlambat";
                          deskription = `Pemberitahuan: Anda datang terlambat. Mohon perhatikan waktu kedatangan di lain kesempatan`;
                          isNotif = true;
                          statusAbsen = "terlambat";
                        }
                      }

                      connection.query(
                        `INSERT INTO ${namaDatabaseDynamic}.attendance SET ?;`,
                        [insertData],
                        (err, results) => {
                          if (err) {
                            console.error(
                              "Error executing UPDATE statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "terjadi kesalahan",
                                data: [],
                              });
                            });
                            return;
                          }

                          if (statusAbsen == "terlambat") {
                            console.log(
                              "masuk sini  sini sono ",
                              `SELECT  name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('S01','028','020') `
                            );

                            connection.query(
                              `SELECT name FROM ${namaDatabasMaster}.sysdata WHERE kode IN ('S01','028','020') `,
                              (err, sysdata) => {
                                if (err) {
                                  console.error(
                                    "Error executing UPDATE statement terlambat new:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "terjadi kesalahan",
                                      data: [],
                                    });
                                  });
                                  return;
                                }
                                console.log(
                                  `SELECT attendance.* FROM ${namaDatabaseDynamic}.attendance LEFT  JOIN ${namaDatabaseDynamic}.emp_shift ON emp_shift.atten_date=attendance.atten_date JOIN ${namaDatabasMaster}.work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${em_id}' AND work_schedule.time_in < attendance.signin_time`
                                );

                                utility.insertNotifikasiAbsensi(
                                  sysdata[2].name,
                                  "Absensi Terlambat",
                                  statusAbsen,
                                  "",
                                  employee[0].full_name,
                                  namaDatabaseDynamic,
                                  namaDatabasMaster
                                );

                                var splitBulan = sysdata[0].name.split(",");
                                const tanggalSekarang = new Date();
                                const tanggalSekarangsp1 =
                                  tanggalSekarang.setMonth(
                                    tanggalSekarang.getMonth() +
                                      parseInt(splitBulan[0].toString())
                                  );

                                connection.query(
                                  `SELECT attendance.* FROM ${namaDatabaseDynamic}.attendance LEFT  JOIN ${namaDatabaseDynamic}.emp_shift ON emp_shift.atten_date=attendance.atten_date JOIN ${namaDatabasMaster}.work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${em_id}' AND work_schedule.time_in < attendance.signin_time `,
                                  (err, Terlambat) => {
                                    if (err) {
                                      console.error(
                                        "Error executing UPDATE statement:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "terjadi kesalahan",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }

                                    console.log(Terlambat.length);
                                    console.log("data ", Terlambat);

                                    if (
                                      Terlambat.length >
                                      parseInt(sysdata[1].name)
                                    ) {
                                      connection.query(
                                        `SELECT * FROM ${namaDatabasMaster}.employee_letter WHERE nomor LIKE '%SP1%'  ORDER BY id DESC LIMIT 1`,
                                        (err, dataSp) => {
                                          if (err) {
                                            console.error(
                                              "Error executing UPDATE statement:",
                                              err
                                            );
                                            connection.rollback(() => {
                                              connection.end();
                                              return res.status(400).send({
                                                status: true,
                                                message: "terjadi kesalahan",
                                                data: [],
                                              });
                                            });
                                            return;
                                          }

                                          nomorSp = `SP1${year}${convertYear}`;

                                          if (dataSp.length > 0) {
                                            var text = dataSp[0]["nomor"];
                                            var nomor =
                                              parseInt(text.substring(9, 14)) +
                                              1;
                                            var nomorStr = String(
                                              nomor
                                            ).padStart(4, "0");
                                            nomorSp = nomorSp + nomorStr;
                                          } else {
                                            var nomor = 1;
                                            var nomorStr = String(
                                              nomor
                                            ).padStart(4, "0");
                                            nomorSp = nomorSp + nomorStr;
                                          }

                                          var dataInsert = {
                                            nomor: nomorSp,
                                            tgl_surat: utility.dateNow3(),
                                            em_id: em_id,
                                            letter_id: 2,
                                            eff_date: tanggalSekarangsp1,
                                            upload_file: "",
                                            alasan: "Absen Datang Terlambat",
                                            status: "Pending",
                                            approve_status: "Pending",
                                          };
                                          connection.query(
                                            `INSERT INTO employee_letter SET `,
                                            [dataInsert],
                                            (err, sysdataSp) => {
                                              if (err) {
                                                console.error(
                                                  "Error executing UPDATE statement:",
                                                  err
                                                );
                                                connection.rollback(() => {
                                                  connection.end();
                                                  return res.status(400).send({
                                                    status: true,
                                                    message:
                                                      "terjadi kesalahan",
                                                    data: [],
                                                  });
                                                });
                                                return;
                                              }

                                              connection.query(
                                                `SELECT * FROM ${namaDatabasMaster}.sysdata WHERE kode ('026','027') `,
                                                (err, sysdataSp) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing UPDATE statement:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "terjadi kesalahan",
                                                          data: [],
                                                        });
                                                    });
                                                    return;
                                                  }
                                                }
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }
                                  }
                                );
                              }
                            );
                          }
                        }
                      );
                    }
                  );
                } else {
                  var lastItem = results.pop();
                  if (lastItem.signout_longlat == "") {
                    var id_record = lastItem.id;
                    connection.query(
                      `UPDATE  ${namaDatabaseDynamic}.attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' `,
                      [insertData],
                      (err, resultss) => {
                        if (err) {
                          console.error(
                            "Error executing UPDATE statement:",
                            err
                          );
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: "terjadi kesalahan",
                              data: [],
                            });
                          });
                          return;
                        }
                        connection.query(
                          `SELECT  IFNULL(work_schedule.time_out ,'17:00:00') as jam_masuk FROM ${namaDatabaseDynamic}.emp_shift  JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE '%${dateNow}%'`,
                          (err, jamMasuk) => {
                            if (err) {
                              console.error(
                                "Error executing UPDATE statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "terjadi kesalahan",
                                  data: [],
                                });
                              });
                              return;
                            }
                            if (results.length > 1) {
                              if (jamMasuk.length > 0) {
                                var jam = jamMasuk[0].jam_masuk;
                                var jamAbsen = formattedTime;
                                const jam1 = new Date(`${dateNow}T${jam}`); //jam masuk
                                jam1.setMinutes(jam1.getMinutes() + 1);
                                const jam2 = new Date(`${dateNow}T${jamAbsen}`); // jam pulang

                                if (jam2 < jam1) {
                                  const selisihWaktu =
                                    jam1.getTime() - jam2.getTime();

                                  // Menghitung selisih dalam menit
                                  const selisihMenit = Math.floor(
                                    selisihWaktu / 60000
                                  ); // 60000 ms = 1 menit

                                  title = "Absen Pulang Cepat";
                                  deskription = `Anda pulang lebih awal. Pastikan untuk tetap menjaga komitmen kerja di lain waktu`;
                                  isNotif = true;
                                  statusAbsen = "pulang_cepat";
                                }
                              }

                              console.log(statusAbsen);

                              if (statusAbsen == "pulang-cepat") {
                                connection.query(
                                  `SELECT IFNULL(name,3) as name FROM sysdata WHERE kode IN ('S01','030','020')`,
                                  (err, sysdata) => {
                                    if (err) {
                                      console.error(
                                        "Error executing UPDATE statement:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "terjadi kesalahan",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }

                                    utility.insertNotifikasi(
                                      sysdata[2].name,
                                      "Absensi Pulang Cepat",
                                      statusAbsen,
                                      "",
                                      employee[0].full_name,
                                      namaDatabaseDynamic,
                                      namaDatabasMaster
                                    );
                                    connection.query(
                                      ` SELECT * FROM ${namaDatabaseDynamic}.attendance JOIN ${namaDatabaseDynamic}.emp_shift ON emp_shift.atten_date=attendance.atten_date JOIN work_schedule ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${em_id}' AND work_schedule.time_out > attendance.signout_time `,
                                      (err, pulangCepat) => {
                                        if (err) {
                                          console.error(
                                            "Error executing UPDATE statement:",
                                            err
                                          );
                                          connection.rollback(() => {
                                            connection.end();
                                            return res.status(400).send({
                                              status: true,
                                              message: "terjadi kesalahan",
                                              data: [],
                                            });
                                          });
                                          return;
                                        }
                                        //SPI 3 pulang cepat

                                        if (
                                          pulangCepat.length > sysdata[1].name
                                        ) {
                                          connection.query(
                                            `SELECT * FROM employee_letter WHERE nomor LIKE '%SP1%'  ORDER BY id DESC LIMIT 1`,
                                            (err, dataSp) => {
                                              if (err) {
                                                console.error(
                                                  "Error executing UPDATE statement:",
                                                  err
                                                );
                                                connection.rollback(() => {
                                                  connection.end();
                                                  return res.status(400).send({
                                                    status: true,
                                                    message:
                                                      "terjadi kesalahan",
                                                    data: [],
                                                  });
                                                });
                                                return;
                                              }
                                              var splitBulan =
                                                sysdata[0].name.split(",");
                                              const tanggalSekarang =
                                                new Date();
                                              const tanggalSekarangsp1 =
                                                tanggalSekarang.setMonth(
                                                  tanggalSekarang.getMonth() +
                                                    parseInt(
                                                      splitBulan[0].toString()
                                                    )
                                                );

                                              nomorSp = `SP1${year}${convertYear}`;

                                              if (dataSp.length > 0) {
                                                var text = dataSp[0]["nomor"];
                                                var nomor =
                                                  parseInt(
                                                    text.substring(9, 14)
                                                  ) + 1;
                                                var nomorStr = String(
                                                  nomor
                                                ).padStart(4, "0");
                                                nomorSp = nomorSp + nomorStr;
                                              } else {
                                                var nomor = 1;
                                                var nomorStr = String(
                                                  nomor
                                                ).padStart(4, "0");
                                                nomorSp = nomorSp + nomorStr;
                                              }

                                              var dataInsert = {
                                                nomor: nomorSp,
                                                tgl_surat: utility.dateNow3(),
                                                em_id: em_id,
                                                letter_id: 2,
                                                eff_date: tanggalSekarangsp1,
                                                upload_file: "",
                                                alasan: "Absen Pulang cepat",
                                                status: "Pending",
                                                approve_status: "Pending",
                                              };
                                              connection.query(
                                                `INSERT INTO employee_letter SET `,
                                                [dataInsert],
                                                (err, sysdataSp) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error executing UPDATE statement:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "terjadi kesalahan",
                                                          data: [],
                                                        });
                                                    });
                                                    return;
                                                  }
                                                }
                                              );
                                            }
                                          );
                                        }
                                      }
                                    );
                                  }
                                );
                              }
                            }
                          }
                        );
                      }
                    );
                  } else {
                    connection.query(
                      `INSERT INTO  ${namaDatabaseDynamic}.attendance SET ?;`,
                      [insertData],
                      (err, results) => {
                        if (err) {
                          console.error(
                            "Error executing UPDATE statement:",
                            err
                          );
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: "terjadi kesalahan",
                              data: [],
                            });
                          });
                          return;
                        }
                      }
                    );
                  }
                }

                // if (isNotif==true){

                //}

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
                  console.log("  Transaction completed successfully! Absen ");

                  return res.status(200).send({
                    status: true,
                    message: "berhasil kirimm absen",
                    title: title, // Absen Datang terlambat
                    is_show_notif: isNotif, //true and false,
                    deskription: deskription, //deslripsi ,
                    status_absen: statusAbsen, // pulang_cepat atau terlambat,
                    data: records,
                  });
                });
              });
            }
          );
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

  async kirimAbsenIstiraha(req, res) {
    console.log("absen istirahat ");
    var database = req.query.database;
    const currentTime = new Date();
    const h = currentTime.getHours().toString().padStart(2, "0");
    const mi = currentTime.getMinutes().toString().padStart(2, "0");
    const s = currentTime.getSeconds().toString().padStart(2, "0");
    const formattedTime = `${h}:${mi}:${s}`;

    console.log(formattedTime);

    var database = req.query.database;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    if (req.body.reg_type == 1) {
      var randomstring = require("randomstring");

      var image = req.body.gambar;
      var bitmap = Buffer.from(image, "base64");
      var stringRandom = randomstring.generate(5);
      var nameFile = stringRandom + date + month + year + hour + menit + ".png";

      const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFile}`;
      sftp
        .connect(configSftp)
        .then(() => {
          // SFTP connection successful
          return sftp.put(bitmap, remoteFilePath);
        })
        .then(() => {
          console.log("berhasil upload image");

          sftp.end(); // Disconnect after the upload is complete
        })
        .catch((err) => {
          console.log(`gagal upload image ${err}`);
          sftp.end(); // Disconnect if an error occurs
          return res.status(400).send({
            status: false,
            message: "Gagal registrasi wajah",
          });
        });

      sftp.end();
    }

    var typeAbsen = req.body.typeAbsen;
    var jamMasuk = "";
    var jamKeluar = "";
    var gambarMasuk = "";
    var gambarKeluar = "";
    var lokasiAbsenIn = "";
    var lokasiAbsenOut = "";
    var latLangIn = "";
    var latLangOut = "";
    var lokasiMasuk = "";
    var lokasiKeluar = "";
    var catatanMasuk = "";
    var catatanKeluar = "";
    if (typeAbsen == "1" || typeAbsen == 1) {
      //  jamMasuk = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
      jamMasuk = formattedTime;
      gambarMasuk = req.body.reg_type == 0 ? "" : nameFile;
      lokasiMasuk = req.body.lokasi;
      catatanMasuk = req.body.catatan;
      latLangIn = req.body.latLang;
      lokasiAbsenIn = req.body.place;
    } else {
      //jamKeluar = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
      jamKeluar = formattedTime;
      gambarKeluar = req.body.reg_type == 0 ? "" : nameFile;
      lokasiKeluar = req.body.lokasi;
      catatanKeluar = req.body.catatan;
      latLangOut = req.body.latLang;
      lokasiAbsenOut = req.body.place;
    }

    var insertData = {
      em_id: req.body.em_id,

      breakin_time:
        jamMasuk == null || jamMasuk == "" || jamMasuk == undefined
          ? "00:00:00"
          : jamMasuk,
      breakout_time:
        jamKeluar == "null" ||
        jamKeluar == null ||
        jamKeluar == "" ||
        jamKeluar == undefined
          ? "00:00:00"
          : jamKeluar,
      working_hour: "",
      place_break_in: lokasiAbsenIn,
      place_break_out: lokasiAbsenOut,
      absence: "",
      overtime: "",
      earnleave: "",
      status: "",
      breakin_longlat: latLangIn,
      breakout_longlat: latLangOut,
      // att_type: "",
      breakin_pict: gambarMasuk,
      breakout_pict: gambarKeluar,
      breakin_note: catatanMasuk,
      breakout_note: catatanKeluar,
      brakin_addr: lokasiMasuk,
      breakout_addr: lokasiKeluar,
      atttype: parseInt(req.body.kategori),
    };
    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startDate = req.body.start_date == undefined ? "" : req.body.start_date;
    var endDate = req.body.end_date == undefined ? "" : req.body.end_date;
    var startTime = req.body.start_time == undefined ? "" : req.body.start_time;
    var endTime =
      req.body.end_time == undefined ? "" : (endTime = req.body.end_time);

    var queryCek = "";
    var queryEmployee = `SELECT IFNULL(branch.zona_waktu,0) AS zona_waktu FROM employee LEFT JOIN branch ON employee.branch_id=branch.id  WHERE employee.em_id='${req.body.em_id}'`;

    const configDynamic = {
      multipleStatements: true,
      host: "3.1.189.143", //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    //    poolDynamic.getConnection(function (err, connection) {

    if (startDate != "") {
      queryCek = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${req.body.em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}') AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1;`;
    } else {
      queryCek = `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`;
    }

    console.log(insertData);

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
          connection.query(queryCek, (err, results) => {
            if (err) {
              console.error("Error executing UPDATE statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "terjadi kesalahan",
                  data: [],
                });
              });
              return;
            }
            console.log(results.length);

            if (req.body.kategori == "1") {
              if (results.length == 0) {
              } else {
                var queryUpdate = `UPDATE  ${namaDatabaseDynamic}.attendance SET breakout_time='${jamKeluar}', place_break_out='${lokasiAbsenOut}', breakout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}'`;

                var lastItem = results.pop();
                if (lastItem.signout_longlat == "") {
                  var id_record = lastItem.id;
                  if (typeAbsen == "1" || typeAbsen == 1) {
                    queryUpdate = `UPDATE  ${namaDatabaseDynamic}.attendance SET breakin_time='${jamMasuk}', place_break_in='${lokasiAbsenIn}', breakin_longlat='${latLangIn}', breakin_pict='${gambarMasuk}', breakin_note='${catatanMasuk}', breakin_addr='${lokasiMasuk}' WHERE id='${id_record}'`;
                  } else {
                    queryUpdate = `UPDATE  ${namaDatabaseDynamic}.attendance SET breakout_time='${jamKeluar}', place_break_out='${lokasiAbsenOut}', breakout_longlat='${latLangOut}', breakout_pict='${gambarKeluar}', breakout_note='${catatanKeluar}', breakout_addr='${lokasiKeluar}' WHERE id='${id_record}'`;
                  }
                  console.log(queryUpdate);
                  connection.query(queryUpdate, (err, results) => {
                    if (err) {
                      console.error("Error executing UPDATE statement:", err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: "terjadi kesalahan",
                          data: [],
                        });
                      });
                      return;
                    }
                  });
                } else {
                }
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
            }
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

  // kirimAbsen(req, res) {
  //   console.log('-----kirim absen new----------')
  //   var database=req.query.database;

  //   let ts = Date.now();
  //   let date_ob = new Date(ts);
  //   let date = date_ob.getDate();
  //   let month = date_ob.getMonth() + 1;
  //   let year = date_ob.getFullYear();
  //   let hour = date_ob.getHours();
  //   let menit = date_ob.getMinutes();
  //   var randomstring = require("randomstring");
  //   var stringRandom = randomstring.generate(5);
  //   var nameFile = stringRandom + date + month + year + hour + menit + ".png";
  //   // if (req.body.reg_type == 1) {
  //   //   var randomstring = require("randomstring");
  //   //   var fs = require("fs");
  //   //   var image = req.body.gambar;
  //   //   var bitmap = Buffer.from(image, 'base64');
  //   //   var stringRandom = randomstring.generate(5);

  //   //   fs.writeFileSync("public/foto_absen/" + nameFile, bitmap);
  //   // }
  //     if (req.body.reg_type==1){
  //       const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFile}`;
  //       sftp.connect(configSftp)
  //      .then(() => {
  //        // SFTP connection successful
  //        return sftp.put(file.data, remoteFilePath);
  //      })
  //      .then(() => {
  //        console.log("berhasil upload image")

  //        sftp.end(); // Disconnect after the upload is complete
  //      })
  //      .catch(err => {
  //        console.log(`gagal upload image ${err}`)
  //        res.send({
  //          status: false,
  //          message: "Gagal registrasi wajah",
  //        });
  //        sftp.end(); // Disconnect if an error occurs
  //      });
  //      sftp.end();

  //     }

  //   var typeAbsen = req.body.typeAbsen;
  //   var jamMasuk = "";
  //   var jamKeluar = "";
  //   var gambarMasuk = "";
  //   var gambarKeluar = "";
  //   var lokasiAbsenIn = "";
  //   var lokasiAbsenOut = "";
  //   var latLangIn = "";
  //   var latLangOut = "";
  //   var lokasiMasuk = "";
  //   var lokasiKeluar = "";
  //   var catatanMasuk = "";
  //   var catatanKeluar = "";
  //   if (typeAbsen == "1") {
  //     jamMasuk = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
  //     gambarMasuk = req.body.reg_type == 0 ? "" : nameFile;
  //     lokasiMasuk = req.body.lokasi;
  //     catatanMasuk = req.body.catatan;
  //     latLangIn = req.body.latLang;
  //     lokasiAbsenIn = req.body.place;
  //   } else {
  //     jamKeluar = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
  //     gambarKeluar = req.body.reg_type == 0 ? "" : nameFile;
  //     lokasiKeluar = req.body.lokasi;
  //     catatanKeluar = req.body.catatan;
  //     latLangOut = req.body.latLang;
  //     lokasiAbsenOut = req.body.place;
  //   }

  //   var insertData = {
  //     em_id: req.body.em_id,
  //     atten_date: req.body.tanggal_absen,
  //     signin_time: jamMasuk == null || jamMasuk == "" || jamMasuk == undefined ? "00:00:00" : jamMasuk,
  //     signout_time: jamKeluar == null || jamKeluar == "" || jamKeluar == undefined ? "00:00:00" : jamKeluar,
  //     working_hour: "",
  //     place_in: lokasiAbsenIn,
  //     place_out: lokasiAbsenOut,
  //     absence: "",
  //     overtime: "",
  //     earnleave: "",
  //     status: "",
  //     signin_longlat: latLangIn,
  //     signout_longlat: latLangOut,
  //     // att_type: "",
  //     signin_pict: gambarMasuk,
  //     signout_pict: gambarKeluar,
  //     signin_note: catatanMasuk,
  //     signout_note: catatanKeluar,
  //     signin_addr: lokasiMasuk,
  //     signout_addr: lokasiKeluar,
  //     atttype: parseInt(req.body.kategori),
  //     // reg_type: 0,
  //     reg_type: req.body.reg_type,
  //   };
  //   const tahun = `${year}`;
  //   const convertYear = tahun.substring(2, 4);
  //   const convertBulan = month <= 9 ? `0${month}` : month;
  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

  //   const configDynamic = {
  //     multipleStatements: true,
  //                host: ipServer,//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {
  //     //database

  //           if (err) console.log(err);
  //     connection.query(
  //       `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`,
  //       function (error, results) {
  //         connection.release();
  //         if (error != null) console.log(error)
  //         if (req.body.kategori == "1") {
  //           if (results.length == 0) {
  //             connection.query(
  //               `INSERT INTO attendance SET ?;`, [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil",
  //                   data: results,
  //                 });

  //               }
  //             );

  //           } else {
  //             var lastItem = results.pop();
  //             if (lastItem.signout_longlat == "") {
  //               var id_record = lastItem.id;
  //               connection.query(
  //                 `UPDATE attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );

  //             } else {
  //               connection.query(
  //                 `INSERT INTO attendance SET ?;`, [insertData],
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );

  //             }

  //           }
  //         }

  //       }
  //     );

  //     if (err) console.log(err);
  //     connection.query(
  //       `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`,
  //       function (error, results) {
  //         connection.release();
  //         if (error != null) console.log(error)
  //         if (req.body.kategori == "1") {
  //           if (results.length == 0) {
  //             connection.query(
  //               `INSERT INTO attendance SET ?;`, [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil",
  //                   data: results,
  //                 });
  //               }
  //             );

  //           } else {
  //             var lastItem = results.pop();
  //             if (lastItem.signout_longlat == "") {
  //               var id_record = lastItem.id;
  //               connection.query(
  //                 `UPDATE attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );

  //             } else {
  //               connection.query(
  //                 `INSERT INTO attendance SET ?;`, [insertData],
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );

  //             }

  //           }
  //         }

  //       }
  //     );

  //   });
  // },
  load_aktifitas(req, res) {
    console.log("-----log aktifitas----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var limit = req.body.limit;
    var offset = req.body.offset;

    let ts = Date.now();
    let date_ob = new Date(ts);
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT * FROM logs_actvity WHERE createdUserID='${em_id}' ORDER BY idx DESC LIMIT ${offset}, ${limit};`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            jumlah_data: results.length,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
    });
  },
  pencarian_aktifitas(req, res) {
    console.log("-----perncatian aktifitas----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var cari = req.body.cari;

    let ts = Date.now();
    let date_ob = new Date(ts);
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT * FROM logs_actvity WHERE createdUserID='${em_id}' AND menu_name LIKE '%${cari}%' ORDER BY idx DESC`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            jumlah_data: results.length,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
    });
  },
  load_approve_info(req, res) {
    console.log("-----load approve info update----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert1 = parseInt(getbulan);
    var convertBulan = convert1 <= 9 ? `0${convert1}` : convert1;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var query1 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan IN ('2', '3')   AND a.status_transaksi=1`;
    var query2 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='1'   AND a.status_transaksi=1`;
    var query3 = `SELECT o.name as category_pengajuan,   a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1'  AND a.status_transaksi=1 `;

    var query4 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='2'  AND a.status_transaksi=1`;
    var query5 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='4'   AND a.status_transaksi=1`;
    var query6 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'  AND a.status_transaksi=1`;
    var query7 = `SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
    JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
    AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  LIKE '%${em_id}%'  AND a.created_date=CURDATE()`;
    // var query8="SELECT * FROM emp_labor WHERE ajuan='3'  AND status_transaksi=1 AND (status='Pending' OR status='pending')"

    var query8 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
    a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='3' AND a.ajuan='5' AND a.status_transaksi=1 `;

    var query9 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
    a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='4' AND a.status_transaksi=1 `;

    var query10 = `SELECT * FROM ${database}_hrm.emp_loan LEFT JOIN ${database}_hrm.sysdata ON  sysdata.kode='019' WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status='Pending' AND emp_loan.em_id!='${em_id}' `;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query1 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan IN ('2', '3')   AND a.status_transaksi=1
       UNION ALL
       ELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan IN ('2', '3')   AND a.status_transaksi=1
       `;
      query2 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='1'   AND a.status_transaksi=1
      UNION ALL
      SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='1'   AND a.status_transaksi=1
      `;
      //var query3 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1' `;
      query3 = `SELECT o.name as category_pengajuan,   a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1'  AND a.status_transaksi=1
      UNION ALL 
      SELECT o.name as category_pengajuan,   a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1'  AND a.status_transaksi=1
      `;

      query4 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='2'  AND a.status_transaksi=1
      UNION ALL 
      SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='2'  AND a.status_transaksi=1
      `;

      query5 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='4'   AND a.status_transaksi=1
      UNION 
      SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='4'   AND a.status_transaksi=1
      `;

      query6 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'  AND a.status_transaksi=1
      UNION 
      SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'  AND a.status_transaksi=1
      `;

      //  var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (a.approved_id IS NULL OR  a.approved_id ='') `;

      query7 = `SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
      JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
      AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  LIKE '%${em_id}%'  AND a.created_date=CURDATE()
      
      `;
      // var query8="SELECT * FROM emp_labor WHERE ajuan='3'  AND status_transaksi=1 AND (status='Pending' OR status='pending')"

      query8 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
      JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
      a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='3' AND a.ajuan='5' AND a.status_transaksi=1 
      UNION ALL

      SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
      JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
      a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='3' AND a.ajuan='5' AND a.status_transaksi=1 
      `;

      var query9 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
      JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
      a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='4' AND a.status_transaksi=1
      UNION 
      SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
      JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
      a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='4' AND a.status_transaksi=1
      
      `;

      var query10 = `SELECT * FROM ${database}_hrm.emp_loan LEFT JOIN ${database}_hrm.sysdata ON  sysdata.kode='019' WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status='Pending' AND emp_loan.em_id!='${em_id}'`;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6};${query7};${query8};${query9};${query10};`,
          [em_id],
          function (error, results) {
            if (error != null) console.log(error);
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_tidak_hadir: results[0].length,
              jumlah_cuti: results[1].length,
              jumlah_lembur: results[2].length,
              jumlah_tugasluar: results[3].length,
              jumlah_dinasluar: results[4].length,
              jumlah_klaim: results[5].length,
              jumlah_payroll: results[6].length,
              jumlah_checkin: results[7].length,
              jumlah_wfh: results[8].length,
              jumlah_kasbon: results[9].length,
              data1: results[0],
              data2: results[1],
              data3: results[2],
              data4: results[3],
              data5: results[4],
              data6: results[5],
              data7: results[6],
              data7: results[7],
              data8: results[8],
              data9: results[9],
            });
          }
        );
      }
    });
  },
  load_approve_info_multi(req, res) {
    console.log("-----load approve infor multi----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    var branchId = req.headers.branch_id;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert1 = parseInt(getbulan);
    var convertBulan = convert1 <= 9 ? `0${convert1}` : convert1;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var query1 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan IN ('2', '3')    AND a.status_transaksi=1`;
    var query2 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='1'  AND a.status_transaksi=1`;

    var query3 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee  b ON b.em_id=a.em_id  
  JOIN ${database}_hrm.overtime o ON o.id=a.typeid 
  WHERE a.em_id=b.em_id 
  AND (
    (o.dinilai = 'N' AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%'))
    OR 
    (o.dinilai = 'Y' AND (a.em_delegation LIKE '%${em_id}%' OR a.em_ids LIKE '%${em_id}%'))
)

  AND a.status IN ('Pending', 'Approve') AND a.ajuan='1'  
  AND a.status_transaksi=1    `;

    var query4 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='2'   AND a.status_transaksi=1`;
    var query5 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='4'   AND a.status_transaksi=1`;

    var query6 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  
  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  
  AND a.status IN ('Pending', 'Approve') `;
    // var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id   AND created_date='${req.body.date}' AND a.approved_id IS NULL`;
    var query7 = `SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
  JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
  AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  LIKE '%${em_id}%'  AND a.created_date=CURDATE()`;

    var query8 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
  WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND (a.ajuan='3' OR a.ajuan='5') AND a.status_transaksi=1`;

    var query9 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
  WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND a.ajuan='4' AND a.status_transaksi=1`;

    var query10 = `SELECT * FROM ${database}_hrm.emp_loan LEFT JOIN ${database}_hrm.sysdata ON  sysdata.kode='019' WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status='Pending'   AND emp_loan.em_id!='${em_id}' `;

    var query11 = `SELECT a.em_id, b.full_name FROM ${database}_hrm.employee_letter a JOIN ${database}_hrm.employee b  ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.sysdata ON sysdata.kode='027'   WHERE   a.status IN ('Pending')  AND sysdata.name LIKE '%${em_id}%' `;

    var query12 = `SELECT a.em_id, b.full_name FROM ${database}_hrm.teguran_lisan a JOIN ${database}_hrm.employee b  ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.sysdata ON sysdata.kode='027'   WHERE   a.status IN ('Pending')  AND sysdata.name LIKE '%${em_id}%' `;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query1 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan IN ('2', '3')    AND a.status_transaksi=1 AND a.atten_date>='${startPeriode}' AND  a.atten_date<='${endPeriode}'
    UNION ALL
    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan IN ('2', '3')    AND a.status_transaksi=1 AND a.atten_date>='${startPeriode}' AND  a.atten_date<='${endPeriode}' 
    `;

      var query2 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='1'  AND a.status_transaksi=1 AND a.atten_date>='${startPeriode}'
    UNION ALL

    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id 
    AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') 
    
    AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='1'  AND a.status_transaksi=1 AND a.atten_date<='${endPeriode}'
    `;

      var query3 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id JOIN ${database}_hrm.overtime o ON o.id=a.typeid   WHERE a.em_id=b.em_id 
    AND (
      (o.dinilai = 'N' AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%'))
      OR 
      (o.dinilai = 'Y' AND (a.em_delegation LIKE '%${em_id}%' OR a.em_ids LIKE '%${em_id}%'))
  )
    AND a.status IN ('Pending', 'Approve') AND a.ajuan='1'  AND a.status_transaksi=1  AND a.tgl_ajuan>='${startPeriode}'
    UNION ALL
    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  JOIN ${database}_hrm.overtime o ON o.id=a.typeid   WHERE a.em_id=b.em_id 
    AND (
      (o.dinilai = 'N' AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%'))
      OR 
      (o.dinilai = 'Y' AND (a.em_delegation LIKE '%${em_id}%' OR a.em_ids LIKE '%${em_id}%'))
  )
    AND a.status IN ('Pending', 'Approve') AND a.ajuan='1'  AND a.status_transaksi=1 AND a.tgl_ajuan<='${startPeriode}'
    `;

      var query4 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='2'   AND a.status_transaksi=1 AND a.tgl_ajuan>='${startPeriode}'
    UNION ALL
    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='2'   AND a.status_transaksi=1 AND a.tgl_ajuan<='${endPeriode}'
    `;

      var query5 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='4'   AND a.status_transaksi=1 AND a.atten_date>='${startPeriode}'
    UNION ALL
    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='4'   AND a.status_transaksi=1 AND a.atten_date<='${endPeriode}'
    `;

      var query6 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  
    ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  
    AND a.status IN ('Pending', 'Approve') AND a.created_on>='${startPeriode}'
    UNION ALL

    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  
    ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  
    AND a.status IN ('Pending', 'Approve') AND a.created_on<='${endPeriode}'
    `;

      // var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id   AND created_date='${req.body.date}' AND a.approved_id IS NULL`;
      var query7 = `SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
    JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
    AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  LIKE '%${em_id}%'  AND a.created_date=CURDATE()`;

      var query8 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
    WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND (a.ajuan='3' OR a.ajuan='5') AND a.status_transaksi=1
    AND a.tgl_ajuan>='${startPeriode}'
    
    UNION ALL
    SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
    WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND (a.ajuan='3' OR a.ajuan='5') AND a.status_transaksi=1
    AND a.tgl_ajuan<='${endPeriode}'
    `;

      // var query9 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b
      // JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
      // WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND a.ajuan='4' AND a.status_transaksi=1`;

      var query9 = `SELECT a.em_id, b.full_name FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
    WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND a.ajuan='4' AND a.status_transaksi=1 AND a.tgl_ajuan>='${startPeriode}'
     UNION ALL
     SELECT a.em_id, b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
    WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND a.ajuan='4' AND a.status_transaksi=1 AND a.tgl_ajuan<='${endPeriode}'
    
    `;
      var query10 = `SELECT * FROM ${database}_hrm.emp_loan LEFT JOIN ${database}_hrm.sysdata ON  sysdata.kode='019' WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status='Pending'   AND emp_loan.em_id!='${em_id}' `;
    }

    console.log(query3);

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6};${query7};${query8};${query9};${query10};${query11};${query12}`,
          function (error, results) {
            if (error != null) console.log(error);
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_tidak_hadir: results[0].length,
              jumlah_cuti: results[1].length,
              jumlah_lembur: results[2].length,
              jumlah_tugasluar: results[3].length,
              jumlah_dinasluar: results[4].length,
              jumlah_klaim: results[5].length,
              jumlah_payroll: results[6].length,
              jumlah_checkin: results[7].length,
              jumlah_wfh: results[8].length,
              jumlah_kasbon: results[9].length,
              jumlah_surat_peringatan: results[10].length,
              jumlah_teguran_lisan: results[11].length,
              data1: results[0],
              data2: results[1],
              data3: results[2],
              data4: results[3],
              data5: results[4],
              data6: results[5],
              data7: results[6],
              data8: results[7],
              data9: results[8],
              data10: results[9],
              data11: results[10],
              data12: results[11],
            });
          }
        );
      }
    });
  },
  load_approve_history(req, res) {
    console.log("-----load approve hisotry----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert = parseInt(getbulan);
    var convertBulan = convert <= 9 ? `0${convert}` : convert;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `hris_test2208`;

    var query1 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan IN ('2', '3')`;
    var query2 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='1'`;
    var query3 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='1'`;
    var query4 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='2'`;
    var query5 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='4'`;
    var query6 = `SELECT a.*, c.name as nama_tipe, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%'`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6}`,
          function (error, results) {
            if (error != null) console.log(error);
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data_tidak_hadir: results[0],
              data_cuti: results[1],
              data_lembur: results[2],
              data_tugas_luar: results[3],
              data_dinas_luar: results[4],
              data_klaim: results[5],
            });
          }
        );
      }
    });
  },
  load_approve_history_multi(req, res) {
    console.log("-----load approve hisotry multi----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert = parseInt(getbulan);
    var convertBulan = convert <= 9 ? `0${convert}` : convert;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan IN ('2', '3')`;
    var query2 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='1'`;
    var query3 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='1'`;
    var query4 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='2'`;
    var query5 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='4'`;
    var query6 = `SELECT a.*, c.name as nama_tipe, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')`;
    var query7 = `SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
    JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
    AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  IN (?)`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6};${query6}`,
          function (error, results) {
            if (error != null) console.log(error);
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data_tidak_hadir: results[0],
              data_cuti: results[1],
              data_lembur: results[2],
              data_tugas_luar: results[3],
              data_dinas_luar: results[4],
              data_klaim: results[5],
              data_payroll: results[6],
            });
          }
        );
      }
    });
  },

  async ApprovalAbsensi(req, res) {
    console.log("approval employee attendance new");

    var database = req.query.database;
    var email = req.query.email;
    var emId = req.body.em_id;
    let records;
    var emId = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var status = req.body.status;
    var signinTime = req.body.signin_time;
    var signOutTime = req.body.signout_time;
    var date = req.body.date;
    var approveId = req.body.approved_id;
    var approvedBy = req.body.approved_by;
    var id = req.body.id;
    var alasanRejected = req.body.alasan_reject;
    var status = req.body.status;
    var image = req.body.image;
    var note = req.body.image;
    var placeIn = req.body.place_in;
    var placeOut = req.body.place_out;
    var placeOut = req.body.pola;
    var urlTransaksi = "absensi";
    var tanggaAbsen = "absensi";
    queryCek = "";
    //   console.log(req.body);

    // return;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    var pola = req.body.pola;
    var startDate = req.body.startDate == undefined ? "" : req.body.startDate;
    var endDate = req.body.endDate == undefined ? "" : req.body.endDate;
    var startTime = req.body.startTime == undefined ? "" : req.body.startTime;
    var endTime =
      req.body.endTime == undefined ? "" : (endTime = req.body.endTime);
    var queryCek = "";
    var attenDate = req.body.date;
    console.log("body absensi ", req.body);
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    if (startDate != "") {
      queryCek = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${emId}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}') AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1;`;
    } else {
      queryCek = `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${attenDate}';`;
    }
    if (pola == "1") {
      console.log(`database dynamic ${namaDatabaseDynamic}`);
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

            var approveDate1 = req.body.approve_date1;
            var approveBy1 = req.body.approve_by1;
            var approveId1 = req.body.approve_id1;

            var approveBy2 = req.body.approve_by2;
            var approveDate2 = req.body.approve_Date2;
            var approveId2 = req.body.approve_id2;
            var bodyStatusFinal = status;

            var namaTransaksi = "Absensi";

            var title = "";
            var deskripsi = "";
            var urlTransaksi = "absensi";

            // // //keti approve
            // if (bodyStatusFinal=='Approve' || bodyStatusFinal=='Approve'){

            //   var listData=sysdata[2].name.toString().split(',')

            //     for (var i=0;i<listData.length;i++){

            //       if (listData[i]!=''){
            //       var title='';
            //       var deskripsi='';
            //       title=`Approval ${namaTransaksi}`
            //       deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`

            //       connection.query(
            //         `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

            //         (err, employee) => {
            //         if (err) {
            //           console.error('Error executing SELECT statement:', err);
            //           connection.rollback(() => {
            //             connection.end();
            //             return res.status(400).send({

            //               status: true,
            //               message: 'gaga ambil data',
            //               data:[]

            //             });
            //           });
            //           return;
            //         }

            //       connection.query(
            //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0)`,

            //         (err, results) => {
            //         if (err) {
            //           console.error('Error executing SELECT statement:', err);
            //           connection.rollback(() => {
            //             connection.end();
            //             return res.status(400).send({
            //               status: true,
            //               message: 'gaga ambil data',
            //               data:[]

            //             });
            //           });
            //           return;
            //         }

            //           utility.notifikasi(employee[0].token_notif,title,deskripsi)
            //       });
            //     });

            //   }

            //     }

            //     //jika approve
            //   }
            //   //ketika rejected
            //   if (bodyStatusFinal=='Rejected' || bodyStatusFinal=='Rejected'){
            //     console.log("Masuk reject query")
            //     var listData=sysdata[1].name.toString().split(',')

            //       for (var i=0;i<listData.length;i++){
            //         console.log("Masuk reject query 1")
            //         console.log(namaTransaksi)

            //         if (listData[i]!=''){
            //         title=`Rejection ${namaTransaksi}`
            //         deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`

            //         connection.query(
            //           `SELECT  * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

            //           (err, employee) => {
            //           if (err) {
            //             console.error('Error executing SELECT statement:', err);
            //             connection.rollback(() => {
            //               connection.end();
            //               return res.status(400).send({
            //                 status: true,
            //                 message: 'gaga ambil data',
            //                 data:[]

            //               });
            //             });
            //             return;
            //           }
            //         connection.query(
            //           `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0)`,
            //          (err, results) => {
            //           if (err) {
            //             console.error('Error executing SELECT statement:', err);
            //             connection.rollback(() => {
            //               connection.end();
            //               return res.status(400).send({
            //                 status: true,
            //                 message: 'gaga ambil data',
            //                 data:[]

            //               });
            //             });
            //             return;
            //           }     });

            //             utility.notifikasi(employee[0].token_notif,title,deskripsi)
            //         });

            //       }

            //     }

            //       //jika approve

            //     }

            // // alur 2  approval
            // console.log('sys data',sysdata)

            var query1 = "";

            query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approveDate1}' , approve_by='${approveBy1}',approve_id='${approveId1}',approve2_date='' , approve2_by='',approve2_id=''  WHERE id='${id}'`;

            // if (status=='Approve'){

            //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}',approve_date='${approvedDate}' , approve_by='${approvedBy}' ,approve_id='${approveId}' WHERE id='${id}' `;
            // }else{
            //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approvedDate}' , approve_by='${approvedBy}',approve_id='${approveId}'  WHERE id='${id}'`;

            // }

            connection.query(
              `SELECT emp_labor.nomor_ajuan,employee.* FROM ${namaDatabaseDynamic}.emp_labor JOIN ${database}_hrm.employee ON employee.em_id=emp_labor.em_id WHERE emp_labor.id='${id}'`,
              (err, dataAbsensi) => {
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

                connection.query(
                  `SELECT * FROM sysdata WHERE KODE IN ('022','023','013')`,
                  (err, sysdata) => {
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

                    connection.query(query1, (err, results) => {
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

                      console.log("tes");
                      if (status == "Rejected") {
                        var listData = sysdata[1].name.toString().split(",");

                        for (var i = 0; i < listData.length; i++) {
                          console.log(namaTransaksi);
                          if (listData[i] != "") {
                            title = `Rejection ${namaTransaksi}`;
                            deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${dataAbsensi[0].full_name} - ${emId} dengan nomor ajuan ${dataAbsensi[0].nomor_ajuan} telah di Tolak oleh ${approveBy1}`;

                            connection.query(
                              `SELECT  * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,

                              (err, employee) => {
                                if (err) {
                                  console.error(
                                    "Error executing SELECT statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "gaga ambil data",
                                      data: [],
                                    });
                                  });
                                  return;
                                }
                                connection.query(
                                  `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0)`,
                                  (err, results) => {
                                    if (err) {
                                      console.error(
                                        "Error executing SELECT statement:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "gaga ambil data",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }
                                  }
                                );

                                utility.notifikasi(
                                  employee[0].token_notif,
                                  title,
                                  deskripsi
                                );
                              }
                            );
                          }
                        }
                        //
                        connection.commit((err) => {
                          if (err) {
                            console.error("Error committing transaction:", err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Terjadi kesalahan",

                                data: [],
                              });
                            });
                            return;
                          }
                        });

                        connection.end();
                        console.log("Transaction completed successfully!");
                        return res.status(200).send({
                          status: true,
                          message: "Berhasil approve pengajuan absensi",
                          data: records,
                        });
                      }

                      var listData = sysdata[2].name.toString().split(",");

                      for (var i = 0; i < listData.length; i++) {
                        if (listData[i] != "") {
                          var title = "";
                          var deskripsi = "";
                          title = `Approval ${namaTransaksi}`;
                          deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${dataAbsensi[0].full_name} - ${emId} dengan nomor ajuan ${dataAbsensi[0].nomor_ajuan}  telah di ${bodyStatusFinal} oleh ${approveBy1}`;
                          connection.query(
                            `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                            (err, employee) => {
                              if (err) {
                                console.error(
                                  "Error executing SELECT statement:",
                                  err
                                );
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: "gaga ambil data",
                                    data: [],
                                  });
                                });
                                return;
                              }

                              connection.query(
                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0)`,

                                (err, results) => {
                                  if (err) {
                                    console.error(
                                      "Error executing SELECT statement:",
                                      err
                                    );
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: "gaga ambil data",
                                        data: [],
                                      });
                                    });
                                    return;
                                  }

                                  utility.notifikasi(
                                    employee[0].token_notif,
                                    title,
                                    deskripsi
                                  );
                                }
                              );
                            }
                          );
                        }
                      }

                      connection.query(`${queryCek}`, (err, results) => {
                        if (err) {
                          console.error(
                            "Error executing UPDATE statement:",
                            err
                          );
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: "terjadi kesalahan",
                              data: [],
                            });
                          });
                          return;
                        }
                        records = results;
                        console.log("data absensi ", data);

                        var queryInsert = `
                    INSERT INTO 
                    ${namaDatabaseDynamic}.attendance(em_id,
                    atten_date,
                    signin_time,
                    signout_time,
                    place_in,
                    place_out,
                    signin_longlat,
                    signout_longlat,
                    signin_pict,
                    signout_pict,
                    signin_note,
                    signout_note,
                    signin_addr,
                    signout_addr,
                    atttype,
                    reg_type,working_hour,absence,overtime,earnleave,status)
                  VALUES ('${emId}','${date ?? ""}','${
                          dataAbsensi[0].signin_out
                        }??""}','${dataAbsensi[0].signout_time ?? ""}','${
                          dataAbsensi[0].place_in ?? ""
                        }','${dataAbsensi[0].place_out ?? ""}','${
                          dataAbsensi[0].signin_longlat
                        }','${dataAbsensi[0].signout_longlat}','${
                          dataAbsensi[0].signin_pict ?? ""
                        }','${dataAbsensi[0].signout_pict ?? ""}','${
                          dataAbsensi[0].signin_note ?? ""
                        }','${
                          dataAbsensi[0].signout_out ?? ""
                        }','','',1,1,"","","","","") `;

                        if (results.length == 0) {
                          // `INSERT INTO attendance SET ?;`, [insertData],

                          connection.query(queryInsert, (err, results) => {
                            if (err) {
                              console.error(
                                "Error executing UPDATE statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "terjadi kesalahan",
                                  data: [],
                                });
                              });
                              return;
                            }
                          });
                        } else {
                          var lastItem = results.pop();
                          if (lastItem.signout_longlat == "") {
                            var id_record = lastItem.id;
                            connection.query(
                              `UPDATE attendance SET signout_time='${dataAbsensi[0].sampai_jam}', place_out='${dataAbsensi[0].place_out}', signout_longlat='${dataAbsensi.signout_longlat}', signout_pict='${dataAbsensi[0].signout_pict}', signout_note='${dataAbsensi.sign_note}', signout_addr='${dataAbsensi[0].signout_addr}' WHERE id='${id_record}' `,
                              (err, results) => {
                                if (err) {
                                  console.error(
                                    "Error executing UPDATE statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "terjadi kesalahan",
                                      data: [],
                                    });
                                  });
                                  return;
                                }
                              }
                            );
                          } else {
                            connection.query(queryInsert, (err, results) => {
                              if (err) {
                                console.error(
                                  "Error executing UPDATE statement:",
                                  err
                                );
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: "terjadi kesalahan",
                                    data: [],
                                  });
                                });
                                return;
                              }
                            });
                          }
                        }

                        connection.query(
                          `SELECT IFNULL(name,'') as name FROM ${database}_hrm.sysdata WHERE KODE IN ('022','023','013')`,
                          (err, sysdata) => {
                            if (err) {
                              console.error(
                                "Error executing SELECT statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "gaga ambil data",
                                  data: [],
                                });
                              });
                              return;
                            }
                            connection.query(
                              `SELECT * FROM employee WHERE em_id='${approveId}'`,
                              (err, employeeApproved) => {
                                if (err) {
                                  console.error(
                                    "Error executing SELECT statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "gaga ambil data",
                                      data: [],
                                    });
                                  });
                                  return;
                                }

                                connection.commit((err) => {
                                  if (err) {
                                    console.error(
                                      "Error committing transaction:",
                                      err
                                    );
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: "Terjadi kesalahan",

                                        data: [],
                                      });
                                    });
                                    return;
                                  }
                                  connection.end();
                                  console.log(
                                    "Transaction completed successfully!"
                                  );
                                  return res.status(200).send({
                                    status: true,
                                    message:
                                      "Berhasil approve pengajuan absensi",
                                    data: records,
                                  });
                                });
                              }
                            );
                          }
                        );

                        //});
                      });
                    });
                  }
                );
              }
            );
          });
        });
      } catch ($e) {
        return res.status(400).send({
          status: true,
          message: "Gagal ambil data",
          data: [],
        });
      }
    } else {
      console.log(req.body);
      const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
      console.log(`database dynamic ${namaDatabaseDynamic}`);
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

            var approveDate1 = req.body.approve_date1;
            var approveBy1 = req.body.approve_by1;

            var approveId1 = req.body.approve_id1;
            var approveStatus = req.body.approve_status;

            var approve2Status = req.body.approve2_status;
            var approveBy2 = req.body.approve_by2;

            var approveDate2 = req.body.approve_date2;
            var approveId2 = req.body.approve_id2;

            var query1 = "";
            if (approveId2 == "") {
              query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approveDate1}' , approve_by='${approveBy1}',approve_id='${approveId1}',approve2_date='' , approve2_by='',approve2_id='' ,approve_status='${approveStatus}'  WHERE id='${id}'`;
            } else {
              query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approveDate1}' , approve_by='${approveBy1}',approve_id='${approveId1}',approve2_date='${approveDate2}' , approve2_by='${approveBy2}',approve2_id='${approveId2}'  ,approve2_status='${approve2Status}' WHERE id='${id}'`;
            }

            // if (status=='Approve'){

            //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}',approve_date='${approvedDate}' , approve_by='${approvedBy}' ,approve_id='${approveId}' WHERE id='${id}' `;
            // }else{
            //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approvedDate}' , approve_by='${approvedBy}',approve_id='${approveId}'  WHERE id='${id}'`;

            // }

            connection.query(
              `SELECT emp_labor.nomor_ajuan,emp_labor.dari_jam,emp_labor.sampai_jam,emp_labor.signin_note,emp_labor.signout_note,emp_labor.signin_addr,emp_labor.signout_addr,emp_labor.signin_longlat,emp_labor.signout_longlat,emp_labor.place_out,emp_labor.place_in,emp_labor.signout_pict,employee.* FROM ${namaDatabaseDynamic}.emp_labor JOIN ${database}_hrm.employee ON employee.em_id=emp_labor.em_id WHERE emp_labor.id='${id}'`,
              (err, dataAbsensi) => {
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

                connection.query(
                  `SELECT * FROM sysdata WHERE KODE IN ('022','023','013')`,
                  (err, sysdata) => {
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

                    connection.query(query1, (err, results) => {
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

                      if (status == "Rejected" || status == "Reject") {
                        var namaTransaksi = "Absensi";

                        console.log(sysdata[1].name.toString().split(","));
                        console.log(approveBy1);
                        console.log(approveBy2);
                        console.log(approveId1);
                        console.log(approveId2);
                        // return;
                        var rejectedBy = "";
                        if (approveId2 == "") {
                          rejectedBy = approveBy1;
                        } else {
                          rejectedBy = approveBy2;
                        }

                        var listData = sysdata[1].name.toString().split(",");
                        console.log("Masuk reject query ", sysdata[1].name);

                        for (var i = 0; i < listData.length; i++) {
                          console.log("Masuk reject query");
                          console.log(listData[i]);

                          console.log(namaTransaksi);
                          if (listData[i] != "") {
                            connection.query(
                              `SELECT  * FROM ${database}_hrm.employee WHERE em_id='${listData[i]}'`,

                              (err, employee) => {
                                if (err) {
                                  console.error(
                                    "Error executing SELECT statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "gaga ambil data",
                                      data: [],
                                    });
                                  });
                                  return;
                                }

                                var title = `Rejection Absensi`;
                                var deskripsi = `Notifikasi Pengajuan Absensin dari ${dataAbsensi[0].full_name} - ${emId} dengan nomor ajuan ${dataAbsensi[0].nomor_ajuan} telah di Tolak oleh ${rejectedBy}`;

                                console.log("employee", employee);
                                console.log("employee", dataAbsensi);
                                console.log(
                                  `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0)`
                                );
                                connection.query(
                                  `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0)`,
                                  (err, results) => {
                                    if (err) {
                                      console.error(
                                        "Error executing SELECT statement:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "gaga ambil data",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }
                                  }
                                );

                                utility.notifikasi(
                                  employee[0].token_notif,
                                  title,
                                  deskripsi
                                );
                              }
                            );
                          }
                        }

                        connection.commit((err) => {
                          if (err) {
                            console.error("Error committing transaction:", err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Terjadi kesalahan",

                                data: [],
                              });
                            });
                            return;
                          }
                        });

                        connection.end();
                        console.log("Transaction completed successfully!");
                        return res.status(200).send({
                          status: true,
                          message: "Berhasil reject pengajuan absensi",
                          data: records,
                        });
                      }

                      if (
                        approveId2 == "" ||
                        approveId2 == "null" ||
                        approveId2 == undefined
                      ) {
                        connection.commit((err) => {
                          if (err) {
                            console.error("Error committing transaction:", err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Terjadi kesalahan",

                                data: [],
                              });
                            });
                            return;
                          }
                        });

                        connection.end();
                        console.log("Transaction completed successfully!");
                        return res.status(200).send({
                          status: true,
                          message: "Berhasil reject pengajuan absensi",
                          data: records,
                        });
                      }
                      var listData = sysdata[2].name.toString().split(",");

                      // connection.query(`SELECT * FROM ${namaDatabaseDynamic}.attendance  WHERE  atten_date='${date}' AND em_id='${emId}'`, (err,results) => {
                      // if (err) {
                      //   console.error('Error executing UPDATE statement:', err);
                      //   connection.rollback(() => {
                      //     connection.end();
                      //     return res.status(400).send({
                      //       status: true,
                      //       message: 'terjadi kesalahan',
                      //       data:[]

                      //     });
                      //   });
                      //   return;
                      // }
                      //   records=results

                      // if (records.length>0){
                      //   console.log("masuk sini update data")
                      // connection.query(`UPDATE  ${namaDatabaseDynamic}.attendance SET signin_time='${signinTime}',signout_time='${signOutTime}' WHERE em_id='${emId}' AND atten_date='${date}'  `, (err,results) => {
                      //   if (err) {
                      //     console.error('Error executing UPDATE statement:', err);
                      //     connection.rollback(() => {

                      //       connection.end();
                      //       return res.status(400).send({
                      //         status: true,
                      //         message: 'terjadi kesalahan',
                      //         data:[]

                      //       });
                      //     });
                      //     return;
                      //   }

                      //   console.log(sysdata[1].name.toString().split(','))
                      //   console.log(approveBy1)
                      //   console.log(approveBy2)
                      //   console.log(approveId1)
                      //   console.log(approveId2)
                      //   // return;
                      //   var rejectedBy='';
                      //   if (approveId2==''){
                      //     rejectedBy=approveBy1
                      //   }else{
                      //     rejectedBy=approveBy2
                      //   }

                      //   var listData=sysdata[1].name.toString().split(',')
                      //   console.log("Masuk reject query " ,sysdata[1].name)
                      //     for (var i=0;i<listData.length;i++){
                      //       console.log("Masuk reject query")
                      //       console.log(listData[i]);

                      //       console.log(namaTransaksi)
                      //       if (listData[i]!=''){
                      //       title=`Rejection ${namaTransaksi}`
                      //       deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${dataAbsensi[0].full_name} - ${emId} dengan nomor ajuan ${dataAbsensi[0].nomor_ajuan} telah di Tolak oleh ${rejectedBy}`

                      //       connection.query(
                      //         `SELECT  * FROM ${database}_hrm.employee WHERE em_id='${listData[i]}'`,

                      //         (err, employee) => {
                      //         if (err) {
                      //           console.error('Error executing SELECT statement:', err);
                      //           connection.rollback(() => {
                      //             connection.end();
                      //             return res.status(400).send({
                      //               status: true,
                      //               message: 'gaga ambil data',
                      //               data:[]

                      //             });
                      //           });
                      //           return;
                      //         }
                      //       connection.query(
                      //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0)`,
                      //        (err, results) => {
                      //         if (err) {
                      //           console.error('Error executing SELECT statement:', err);
                      //           connection.rollback(() => {
                      //             connection.end();
                      //             return res.status(400).send({
                      //               status: true,
                      //               message: 'gaga ambil data',
                      //               data:[]

                      //             });
                      //           });
                      //           return;
                      //         }     });

                      //           utility.notifikasi(employee[0].token_notif,title,deskripsi)
                      //       });

                      //     }

                      //   }

                      //   connection.commit((err) => {
                      //     if (err) {
                      //       console.error('Error committing transaction:', err);
                      //       connection.rollback(() => {
                      //         connection.end();
                      //         return res.status(400).send({
                      //           status: true,
                      //                    message: "Kombinasi email & password Anda Salah",
                      //           data:[]

                      //         });
                      //       });
                      //       return;
                      //     }
                      //     connection.end();
                      //     console.log('Transaction completed successfully!');
                      //     return res.status(200).send({
                      //       status: true,
                      //       message: "Kombinasi email & password Anda Salah",
                      //       data:records

                      //     });

                      //   });
                      // });

                      // }

                      // else{

                      //     var queryInsert=`INSERT INTO
                      //     ${namaDatabaseDynamic}.attendance(em_id,
                      //     atten_date,
                      //     signin_time,
                      //     signout_time,
                      //     place_in,
                      //     place_out,
                      //     signin_longlat,
                      //     signout_longlat,
                      //     signin_pict,
                      //     signout_pict,
                      //     signin_note,
                      //     signout_note,
                      //     signin_addr,
                      //     signout_addr,
                      //     atttype,
                      //     reg_type,working_hour,absence,overtime,earnleave,status)
                      //   VALUES ('${emId}','${date??""}','${signinTime??""}','${signOutTime??""}','${placeIn??""}','${placeOut??""}','','','${image??""}','${image??""}','${note??""}','${note??""}','','',1,1,"","","","","") `
                      //       console.log(queryInsert)
                      // connection.query(queryInsert, (err,results) => {
                      //   if (err) {
                      //     console.error('Error executing UPDATE statement:', err);
                      //     connection.rollback(() => {

                      //       connection.end();
                      //       return res.status(400).send({
                      //         status: true,
                      //         message: 'terjadi kesalahan',
                      //         data:[]

                      //       });
                      //     });
                      //     return;
                      //   }
                      //   console.log("berhasi insert absen ",results)

                      //   console.log(sysdata[1].name.toString().split(','))
                      //   console.log(approveBy1)
                      //   console.log(approveBy2)
                      //   console.log(approveId1)
                      //   console.log(approveId2)
                      //   // return;
                      //   var rejectedBy='';
                      //   if (approveId2==''){
                      //     rejectedBy=approveBy1
                      //   }else{
                      //     rejectedBy=approveBy2
                      //   }

                      //   var listData=sysdata[1].name.toString().split(',')
                      //   console.log("Masuk reject query " ,sysdata[1].name)
                      //     for (var i=0;i<listData.length;i++){
                      //       console.log("Masuk reject query")
                      //       console.log(listData[i]);

                      //       console.log(namaTransaksi)
                      //       if (listData[i]!=''){
                      //       title=`Rejection ${namaTransaksi}`
                      //       deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${dataAbsensi[0].full_name} - ${emId} dengan nomor ajuan ${dataAbsensi[0].nomor_ajuan} telah di Tolak oleh ${rejectedBy}`

                      //       connection.query(
                      //         `SELECT  * FROM ${database}_hrm.employee WHERE em_id='${listData[i]}'`,

                      //         (err, employee) => {
                      //         if (err) {
                      //           console.error('Error executing SELECT statement:', err);
                      //           connection.rollback(() => {
                      //             connection.end();
                      //             return res.status(400).send({
                      //               status: true,
                      //               message: 'gaga ambil data',
                      //               data:[]

                      //             });
                      //           });
                      //           return;
                      //         }
                      //       connection.query(
                      //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0)`,
                      //        (err, results) => {
                      //         if (err) {
                      //           console.error('Error executing SELECT statement:', err);
                      //           connection.rollback(() => {
                      //             connection.end();
                      //             return res.status(400).send({
                      //               status: true,
                      //               message: 'gaga ambil data',
                      //               data:[]

                      //             });
                      //           });
                      //           return;
                      //         }     });

                      //           utility.notifikasi(employee[0].token_notif,title,deskripsi)
                      //       });

                      //     }

                      //   }

                      //   connection.commit((err) => {
                      //     if (err) {
                      //       console.error('Error committing transaction:', err);
                      //       connection.rollback(() => {
                      //         connection.end();
                      //         return res.status(400).send({
                      //           status: true,
                      //                    message: "Terjadi kesalahan",

                      //                    data:[]

                      //         });
                      //       });
                      //       return;
                      //     }
                      //     connection.end();
                      //     console.log('Transaction completed successfully!');
                      //     return res.status(200).send({
                      //       status: true,
                      //       message: "Berhasil approve pengajuan absensi",
                      //       data:records

                      //     });

                      //   });
                      // });

                      // }

                      // });

                      console.log("query cek ", queryCek);
                      connection.query(`${queryCek}`, (err, results) => {
                        if (err) {
                          console.error(
                            "Error executing UPDATE statement:",
                            err
                          );
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: "terjadi kesalahan",
                              data: [],
                            });
                          });
                          return;
                        }
                        records = results;

                        var queryInsert = `
                    INSERT INTO 
                    ${namaDatabaseDynamic}.attendance(em_id,
                    atten_date,
                    signin_time,
                    signout_time,
                    place_in,
                    place_out,
                    signin_longlat,
                    signout_longlat,
                    signin_pict,
                    signout_pict,
                    signin_note,
                    signout_note,
                    signin_addr,
                    signout_addr,
                    atttype,
                    reg_type,working_hour,absence,overtime,earnleave,status)
                  VALUES ('${emId}','${date ?? ""}','${
                          dataAbsensi[0].dari_jam
                        }','${dataAbsensi[0].sampai_jam}','${
                          dataAbsensi[0].place_in ?? ""
                        }','${dataAbsensi[0].place_out ?? ""}','${
                          dataAbsensi[0].signin_longlat
                        }','${dataAbsensi[0].signout_longlat}','${
                          dataAbsensi[0].signin_pict ?? ""
                        }','${dataAbsensi[0].signout_pict ?? ""}','${
                          dataAbsensi[0].signin_note ?? ""
                        }','${
                          dataAbsensi[0].signout_out ?? ""
                        }','','',1,1,"","","","","") `;

                        console.log("data absensi ", queryInsert);

                        if (results.length == 0) {
                          // `INSERT INTO attendance SET ?;`, [insertData],

                          connection.query(queryInsert, (err, results) => {
                            if (err) {
                              console.error(
                                "Error executing UPDATE statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "terjadi kesalahan",
                                  data: [],
                                });
                              });
                              return;
                            }
                          });
                        } else {
                          var lastItem = results.pop();
                          if (
                            lastItem.signout_longlat == "" ||
                            lastItem.signout_time == "00:00:00"
                          ) {
                            var id_record = lastItem.id;
                            var queryUpdate = `UPDATE ${namaDatabaseDynamic}.attendance SET signout_time='${dataAbsensi[0].sampai_jam}', place_out='${dataAbsensi[0].place_out}', signout_longlat='${dataAbsensi[0].signout_longlat}', signout_pict='${dataAbsensi[0].signout_pict}', signout_note='${dataAbsensi[0].signout_note}', signout_addr='${dataAbsensi[0].signout_addr}' WHERE id='${id_record}' `;

                            console.log("dta absensi new", queryUpdate);
                            connection.query(queryUpdate, (err, results) => {
                              if (err) {
                                console.error(
                                  "Error executing UPDATE statement:",
                                  err
                                );
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: "terjadi kesalahan",
                                    data: [],
                                  });
                                });
                                return;
                              }
                            });
                          } else {
                            connection.query(queryInsert, (err, results) => {
                              if (err) {
                                console.error(
                                  "Error executing UPDATE statement:",
                                  err
                                );
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: "terjadi kesalahan",
                                    data: [],
                                  });
                                });
                                return;
                              }
                            });
                          }
                        }

                        connection.query(
                          `SELECT IFNULL(name,'') as name FROM ${database}_hrm.sysdata WHERE KODE IN ('022','023','013')`,
                          (err, sysdata) => {
                            if (err) {
                              console.error(
                                "Error executing SELECT statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "gaga ambil data",
                                  data: [],
                                });
                              });
                              return;
                            }
                            connection.query(
                              `SELECT * FROM employee WHERE em_id='${approveId}'`,
                              (err, employeeApproved) => {
                                if (err) {
                                  console.error(
                                    "Error executing SELECT statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "gaga ambil data",
                                      data: [],
                                    });
                                  });
                                  return;
                                }

                                connection.commit((err) => {
                                  if (err) {
                                    console.error(
                                      "Error committing transaction:",
                                      err
                                    );
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: "Terjadi kesalahan",

                                        data: [],
                                      });
                                    });
                                    return;
                                  }
                                  connection.end();
                                  console.log(
                                    "Transaction completed successfully!"
                                  );
                                  return res.status(200).send({
                                    status: true,
                                    message:
                                      "Berhasil approve pengajuan absensi",
                                    data: records,
                                  });
                                });
                              }
                            );
                          }
                        );

                        //});
                      });
                    });
                  }
                );
              }
            );
          });
        });
      } catch ($e) {
        return res.status(400).send({
          status: true,
          message: "Gagal ambil data",
          data: [],
        });
      }
    }

    // var email = req.body.email;
    // var password = sha1(req.body.password);
    // var token_notif = req.body.token_notif;

    // pool.getConnection(function (err, connection) {

    //   if (err) console.log(err);
    //   connection.query(
    //    ,
    //     function (error, results) {
    //       if (error) console.log(error);
    //       if (results.length == 0) {
    //         res.send({
    //           status: false,
    //           message: "Kombinasi email & password Anda Salah",
    //         });
    //       } else {
    //         var updateToken = `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${email}'`;
    //         connection.query(
    //           updateToken,
    //           function (error, results) {
    //           }
    //         )
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil data!",
    //           data: results,
    //         });
    //       }
    //     }
    //   );
    //   connection.release();
    // });
  },
  // spesifik_approval(req, res) {
  //   console.log('-----spesifik approval----------')
  //   var database = req.query.database;
  //   var em_id = req.body.em_id;
  //   var url_data = req.body.name_data;
  //   var getbulan = req.body.bulan;
  //   var gettahun = req.body.tahun;
  //   var approvename=req.body.name;
  //   var approveid=req.body.approveId;
  //   var approvedDate=req.body.approve_daet;
  //   var alasanRejected=req.body.alasan_rejected;

  //   var status=req.body.status;
  //   var id=req.body.id;

  //   var date=req.body.date

  //   const tahun = `${gettahun}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (getbulan.length == 1) {
  //     convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
  //   } else {
  //     convertBulan = getbulan;
  //   }
  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
  //   var query1="";
  //   if (status=='Approve'){

  //     query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}',approve_date='${approvedDate}' , approve_by='${approveBy}' ,approve_id='${approveid}' WHERE id='${id}' `;
  //   }else{
  //     query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}' WHERE id='${id}'`;
  //   }

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: ipServer,//myhris.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.send({
  //         status: false,
  //         message: "Database tidak ditemukan",
  //         data: []
  //       });
  //     } else {

  //         connection.query(
  //           query1,
  //           function (error, results) {
  //             if (error) {
  //               res.send({
  //                 status: false,
  //                 message: "Database tidak ditemukan",
  //                 data: []
  //               });
  //             }else{

  //               `SELECT TOP 1 FROM attendance WHERE em_id='${em_id}' AND date='${date}' `
  //               connection.query(
  //                 query1,
  //                 function (error, results) {
  //                   if (error) {
  //                     res.send({
  //                       status: false,
  //                       message: "Database tidak ditemukan",
  //                       data: []
  //                     });
  //                   }else{

  //                     `SELECT TOP 1 FROM attendance WHERE em_id='${em_id}' AND date='${date}' `

  //                   }

  //                 }
  //               );

  //             }

  //           }
  //         );

  //     }

  //   })
  // },

  spesifik_approval(req, res) {
    console.log("-----spesifik approval----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var url_data = req.body.name_data;
    var getbulan = req.body.bulan;
    var branchId = req.headers.branch_id;
    var gettahun = req.body.tahun;

    var stauts = req.body.status == undefined ? "Pending" : req.body.status;

    if (stauts == "pending" || stauts == "PENDING") {
      stauts = "Pending";
    }

    console.log(req.body);

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT
    CASE
    WHEN ( a.apply_status IS NULL  OR a.apply_status='Pending')  AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
    WHEN  (a.apply_status IS NULL  OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS apply_status,
    CASE
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS apply2_status,
    a.leave_duration,
    a.em_delegation,
    a.apply_by,
    a.apply2_by,
    a.atten_date,
    a.reason,
    a.em_id,
    a.leave_files,
    a.start_date,
    a.end_date,
    a.leave_status,
    a.nomor_ajuan,
    a.date_selected,
    a.id,
  a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,
    c.name as nama_penagjuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  b.em_report_to LIKE '%${em_id}%' AND a.leave_status LIKE '%${stauts}%' AND a.leave_status!='Cancel' AND a.ajuan IN ('2', '3')
    AND a.status_transaksi=1
    `;

    //cuti
    var query2 = `SELECT 
    CASE
    WHEN ( a.apply_status IS NULL OR a.apply_status='Pending')  AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
    WHEN  (a.apply_status  IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS apply_status,
    CASE
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS apply2_status,
    a.leave_duration,
    a.em_delegation,
    a.apply_by,
    a.apply2_by,
    a.atten_date,
    a.reason,
    a.em_id,
    a.leave_files,
    a.start_date,
    a.end_date,
    a.leave_status,
    a.nomor_ajuan,
 a.date_selected,
a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,

    d.name AS nama_divisi, a.nomor_ajuan, c.name as nama_penagjuan,  b.em_report_to as em_report_to,  
    b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a 
    INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b  JOIN ${database}_hrm.designation  d ON d.id=b.des_id 
    WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' 
    AND a.leave_status LIKE '%${stauts}%' AND a.leave_status!='Cancel' ${
      stauts == "" ? "AND a.leave_status!='Pending'" : ""
    }  AND leave_status AND a.ajuan='1'
    
    AND a.status_transaksi=1
    `;

    var query3 = `SELECT
    
    CASE
    WHEN ( a.approve_status  IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
    WHEN  (a.approve_status  IS NULL  OR a.approve_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS approve_status,
    CASE
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS approve2_status,
    a.dari_jam,
    a.sampai_jam,
    a.approve_by,
    a.approve2_by,
    a.em_delegation,
    a.atten_date,
    a.uraian,
    a.nomor_ajuan,
    a.em_id,
    a.approve_id,
    a.place_in,
    a.place_out,
    a.status,
        	a.ajuan,
a.approve_id,
a.approve_date,
a.id,
    

    o.name as nama_pengajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId  WHERE a.em_id=b.em_id AND a.em_delegation LIKE '%${em_id}%' AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND a.ajuan='1'

    
    AND a.status_transaksi=1
    `;
    var query4 = `
SELECT 
CASE
    WHEN ( a.approve_status  IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
    WHEN  (a.approve_status  IS NULL  OR a.approve_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS approve_status,
    CASE
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS approve2_status,
    a.dari_jam,
    a.sampai_jam,
    a.approve_by,
    a.approve2_by,
    a.em_delegation,
    a.atten_date,
    a.uraian,
    a.nomor_ajuan,
    a.em_id,
    a.approve_id,
    a.place_in,
    a.place_out,
    a.status,
    a.ajuan,
a.approve_id,
a.approve_date,
a.id,
    

b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND a.ajuan='2' 

AND a.status_transaksi=1
`;

    var query5 = `SELECT 
    CASE
    WHEN ( a.apply_status IS NULL  OR a.apply_status='Pending') AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
    WHEN  (a.apply_status  IS NULL   OR a.apply_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS apply_status,
    CASE
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS apply2_status,
    a.leave_duration,
    a.em_delegation,
    a.apply_by,
    a.apply2_by,
    a.atten_date,
    a.reason,
    a.em_id,
    a.leave_files,
    a.start_date,
    a.end_date,
    a.leave_status,
    a.nomor_ajuan,
a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,
 a.date_selected,
    
    b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status LIKE '%${stauts}%' AND a.leave_status!='Cancel' AND a.ajuan='4'
    
    AND a.status_transaksi=1
    `;

    var query6 = `SELECT (IFNULL(a.sisa_claim ,0)) as sisa_claim ,(IFNULL(a.saldo_claim ,0)) as saldo_claim , c.id as id_ajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, a.*
     FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b
     WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%'  AND a.status!='Cancel' AND a.status LIKE '%${stauts}%'`;

    // var query7 = `SELECT b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'`;
    var query7 = `SELECT
    CASE
    WHEN ( a.approve_status  IS NULL  OR a.approve_status='Pending') AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
    WHEN  (a.approve_status  IS NULL OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    ELSE "Approve"
    END AS approve_status,
    CASE
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    ELSE "Approve"
    END AS approve2_status,
    a.dari_jam,
    a.sampai_jam,
    a.approve_by,
    a.approve2_by,
    a.em_delegation,
    a.atten_date,
    a.uraian,
    a.nomor_ajuan,
    a.em_id,
    a.approve_id,
    a.place_in,
    a.place_out,
    a.status,
	  a.ajuan,
    a.approve_id, 
    a.approve_date,
    a.id,
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
     b.full_name,a.status as leave_status ,a.status as status FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b
     WHERE a.em_id=b.em_id  AND b.em_report_to LIKE '%${em_id}%' AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND  (a.ajuan='3' OR a.ajuan='5') AND a.status_transaksi=1`;

    //  var query8 = ` SELECT emp_loan.status as  approve_status,emp_loan.approve_id,emp_loan.approve_date,emp_loan.tgl_ajuan as tanggal_ajuan ,
    //   emp_loan.periode_mulai_cicil as periode,
    //   emp_loan.nomor_ajuan,emp_loan.description,emp_loan.total_loan as total_pinjaman ,emp_loan.durasi_cicil FROM sysdata JOIN emp_loan ON sysdata.kode='019' AND sysdata.name LIKE '%${em_id}%' AND emp_loan.status='Pending' `;

    // var query8 = `SELECT emp_loan.status as  approve_status,emp_loan.approve_id,emp_loan.approve_date,emp_loan.tgl_ajuan as tanggal_ajuan ,
    // emp_loan.periode_mulai_cicil as periode,
    // emp_loan.nomor_ajuan,emp_loan.description,emp_loan.total_loan as total_pinjaman ,emp_loan.durasi_cicil FROM ${database}_hrm.sysdata JOIN ${database}_hrm.emp_loan ON sysdata.kode='019' AND ${database}_hrm.sysdata.name LIKE '%${em_id}%' AND emp_loan.status='Pending' `;

    var query8 = `SELECT emp_loan.approve_by, emp_loan.id, employee.full_name, emp_loan.status as  approve_status,emp_loan.approve_id,emp_loan.approve_date,emp_loan.tgl_ajuan as tanggal_ajuan ,
    emp_loan.periode_mulai_cicil as periode,
    emp_loan.nomor_ajuan,emp_loan.description,emp_loan.total_loan as total_pinjaman ,emp_loan.durasi_cicil 
    FROM ${database}_hrm.sysdata JOIN ${database}_hrm.emp_loan ON sysdata.kode='019' JOIN ${database}_hrm.employee ON employee.em_id=emp_loan.em_id WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status LIKE '%${status}%'  AND emp_loan.em_id!='${em_id}' `;

    var query9 = `SELECT
    CASE
    WHEN ( a.approve_status  IS NULL  OR a.approve_status='Pending') AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
    WHEN  (a.approve_status  IS NULL OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    ELSE "Approve"
    END AS approve_status,
    CASE
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    ELSE "Approve"
    END AS approve2_status,
    a.approve_by,
    a.approve2_by,
    a.eff_date as atten_date,
    a.alasan as uraian,
    a.nomor as nomor_ajuan,
    a.em_id,
    a.approve_id,
    a.status,
    a.approve_id, 
    a.approve_date,
    a.id,
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
     b.full_name,a.status as leave_status ,a.status as status FROM employee_letter a JOIN ${database}_hrm.employee b
     WHERE a.em_id=b.em_id  AND b.em_report_to LIKE '%${em_id}%' AND a.status LIKE '%${stauts}%' AND a.status!='Cancel'`;
    //  AND emp_loan.nomor_ajuan LIKE '%LO2023110001%'

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: [],
        });
      } else {
        if (url_data == "cuti") {
          connection.query(query2, function (error, dataCuti) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve cuti!",
              jenis: "cuti",
              data: dataCuti,
            });
          });
        } else if (url_data == "tidak_hadir") {
          connection.query(query1, function (error, dataTidakHadir) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Tidak Hadir!",
              jenis: "tidak_hadir",
              data: dataTidakHadir,
            });
          });
        } else if (url_data == "lembur") {
          connection.query(query3, function (error, dataLembur) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Lembur!",
              jenis: "lembur",
              data: dataLembur,
            });
          });
        } else if (url_data == "tugas_luar") {
          connection.query(query4, function (error, dataTugasLuar) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Tugas Luar!",
              jenis: "Tugas Luar",
              data: dataTugasLuar,
            });
          });
        } else if (url_data == "dinas_luar") {
          connection.query(query5, function (error, dataDinasLuar) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Dinas Luar!",
              jenis: "Dinas Luar",
              data: dataDinasLuar,
            });
          });
        } else if (url_data == "klaim") {
          connection.query(query6, function (error, dataKlaim) {
            connection.release();
            res.send({
              message: "Berhasil ambil data approve klaim!",
              jenis: "Klaim",
              data: dataKlaim,
            });
          });
        } else if (url_data == "absensi") {
          connection.query(query7, function (error, dataAbsensi) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve klaim!",
              jenis: "absensi",
              data: dataAbsensi,
            });
          });
        } else if (url_data == "kasbon") {
          connection.query(query8, function (error, dataLoan) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve klaim!",
              jenis: "kasbon",
              data: dataLoan,
            });
          });
        } else if (url_data == "surat_peringatan") {
          connection.query(query9, function (error, dataLoan) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve klaim!",
              jenis: "kasbon",
              data: dataLoan,
            });
          });
        }
      }
    });
  },
  spesifik_approval_multi(req, res) {
    console.log("-----spesifik approval multi approvedd----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var branchId = req.headers.branch_id;
    var url_data = req.body.name_data;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var stauts =
      req.body.status == undefined
        ? "Pending"
        : req.body.status == "pending"
        ? "Pending"
        : req.body.status;
    var conditionStatus = "";
    var conditionStatusLabor = "";

    console.log(req.body);

    if (stauts == "pending" || stauts == "PENDING" || stauts == "Pending") {
      conditionStatus = "AND a.leave_status IN ('Pending','Approve')";
    } else {
      conditionStatus = "AND a.leave_status IN ('Approve2','Rejected')";
    }

    if (stauts == "pending" || stauts == "PENDING" || stauts == "Pending") {
      conditionStatusLabor = "AND a.status IN ('Pending','Approve')";
    } else {
      conditionStatusLabor = "AND a.status  IN  ('Approve2','Rejected')";
    }

    if (url_data == "Klaim" || url_data == "klaim") {
      if (stauts == "pending" || stauts == "PENDING" || stauts == "Pending") {
        conditionStatusLabor = "AND a.status IN ('Pending','Approve')";
      } else {
        conditionStatusLabor = "AND a.status  IN  ('Approve2','Rejected')";
      }
    }

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    var namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      conditionStatus = `${conditionStatus} AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'`;
      if (url_data == "Klaim" || url_data == "klaim") {
        conditionStatusLabor = ` ${conditionStatusLabor} AND a.created_on>='${startPeriode}' AND  a.created_on <='${endPeriode}'`;
      } else {
        conditionStatusLabor = ` ${conditionStatusLabor} AND a.atten_date>='${startPeriode}' AND  a.tgl_atten_date <='${endPeriode}'`;
      }

      namaDatabaseDynamic = startPeriodeDynamic;
    }

    // var query1 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan IN ('2', '3')`;
    // var query2 = `SELECT c.n.l, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='1'`;
    // var query3 = `SELECT o.name as nama_pengajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, a.* FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.status IN ('Pending', 'Approve') AND a.ajuan='1' `;
    // var query4 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, a.* FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.status IN ('Pending', 'Approve') AND a.ajuan='2'`;
    // var query5 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, a.* FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='4'`;

    // var query6 = `SELECT (IFNULL(a.sisa_claim ,0)) as sisa_claim ,(IFNULL(a.saldo_claim ,0)) as saldo_claim , c.id as id_ajuan,  b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, a.* FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.status IN ('Pending', 'Approve')`;
    // var query7 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (a.approved_id IS NULL OR  a.approved_id ='')  `;

    var orderby1 = "ORDER BY idd DESC";
    var orderby2 = "ORDER BY idd DESC";
    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      orderby1 = "";
    }
    var query1 = `SELECT
    a.id as idd,
    CASE
     WHEN ( a.apply_status IS NULL  OR a.apply_status='Pending') AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by!='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
	  a.apply_id,
    a.date_selected,
    a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,
c.input_time,
a.time_plan_to,
     c.name as nama_penagjuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id 
    AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  ${conditionStatus}  AND a.leave_status!='Cancel' AND a.ajuan IN ('2', '3')  AND a.status_transaksi=1 ${orderby1}`;

    var query2 = `SELECT
       a.id as idd,
     CASE
     WHEN ( a.apply_status  IS NULL OR a.apply_status='Pending')  AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by!='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
 a.date_selected,
	
a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,
c.input_time,
      d.name AS nama_divisi, a.nomor_ajuan, c.name as nama_penagjuan,  b.em_report_to as em_report_to,  
     b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a 
     INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b  JOIN ${database}_hrm.designation  d ON d.id=b.des_id 
     WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') 
 ${conditionStatus}   AND a.ajuan='1'  AND a.status_transaksi=1 ${orderby1}`;

    var query3 = `SELECT 
     a.id as idd,
     CASE
     WHEN ( a.approve_status  IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status IS NULL   OR a.approve_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     a.status,
	a.ajuan,
a.approve_id,
a.approve_date,
a.id,

CASE
    WHEN o.dinilai = 'N' THEN b.em_report2_to
    ELSE a.em_ids
END AS em_ids,
o.dinilai,
    
   

     o.name as nama_pengajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId  WHERE a.em_id=b.em_id 
   
     ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='1'  AND a.status_transaksi=1
     -- Kondisi dinilai = 'Y' untuk mengganti em_delegation dan em_ids
     AND (
         (o.dinilai = 'N' AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%'))
         OR 
         (o.dinilai = 'Y' AND (a.em_delegation LIKE '%${em_id}%' OR a.em_ids LIKE '%${em_id}%'))
     )
    

     ${orderby1}
     `;
    var query4 = `SELECT
     a.id as idd,
     CASE
     WHEN ( a.approve_status IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status IS NULL  OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     a.status,
	  a.ajuan,
    a.approve_id,
    a.approve_date,
    a.id,
      b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='2'  AND a.status_transaksi=1 
      ${orderby1} 
      `;

    var query5 = `SELECT
     a.id as idd,
     CASE
     WHEN ( a.apply_status IS NULL OR a.apply_status='Pending')  AND (a.apply_by IS NULL OR a.apply_by!='') THEN "Pending"
     WHEN  (a.apply_status IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by !='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
    a.apply_id,
    a.date_selected,
    a.id,
    a.apply_date,
    a.leave_type,
    a.ajuan,
    a.typeid,
     
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name  
     FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  
     (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  ${conditionStatus}  
     AND a.leave_status!='Cancel' AND a.ajuan='4'  AND a.status_transaksi=1 ${orderby1}`;

    var query6 = `SELECT 
     a.id as idd,
     a.approve_by,
     a.approve2_by, (IFNULL(a.sisa_claim ,0)) as sisa_claim ,(IFNULL(a.saldo_claim ,0)) as saldo_claim , c.id as id_ajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, a.*
      FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b
      WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status!='Cancel' ${conditionStatusLabor} ${orderby1}`;

    // var query7 = `SELECT b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'`;
    var query7 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
      b.full_name, a.*,a.status as leave_status FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b
      WHERE a.em_id=b.em_id  AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='3' AND a.status_transaksi=1
      a.id ORDER BY DESC
      `;

    var query8 = `SELECT
    a.id as idd,
    CASE
     WHEN ( a.approve_status IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status  IS NULL OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
	a.ajuan,
a.approve_id,
a.approve_date,
a.id,
a.signin_note as catatan_masuk,
a.signout_note as catatan_keluar,
a.signout_addr as lokasi_keluar,
a.signin_addr as lokasi_masuk,
a.signin_pict as foto_masuk,
a.signout_pict as foto_keluar,
a.place_in as place_in,
a.place_out as place_out,



     
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
     b.full_name,a.status as leave_status FROM ${namaDatabaseDynamic}.emp_labor a 
     JOIN ${database}_hrm.employee b   WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND( a.ajuan='3' OR a.ajuan='5') AND a.status_transaksi=1
     ${orderby1}
     `;

    var query9 = `SELECT
     a.id as idd,
     CASE
      WHEN ( a.approve_status IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
      WHEN  (a.approve_status  IS NULL OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
 
      ELSE "Approve"
      END AS approve_status,
      CASE
      WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
      WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
      
 
      ELSE "Approve"
      END AS approve2_status,
      a.dari_jam,
      a.sampai_jam,
      a.approve_by,
      a.approve2_by,
      a.em_delegation,
      a.atten_date,
      a.uraian,
      a.nomor_ajuan,
      a.em_id,
      a.approve_id,
      a.place_in,
      a.place_out,
    a.ajuan,
    a.approve_id,
 a.approve_date,
 a.id,
 a.title as judul,
 "Surat Peringatan 1"as nama,
      
      b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
      b.full_name,a.status as status,a.status as leave_status FROM ${namaDatabaseDynamic}.emp_labor a 
      JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND a.ajuan='4' AND a.status_transaksi=1 ${orderby1}`;

    var query10 = `SELECT emp_loan.approve_by, emp_loan.id, employee.full_name, emp_loan.status as  approve_status,emp_loan.approve_id,emp_loan.approve_date,emp_loan.tgl_ajuan as tanggal_ajuan ,
      emp_loan.periode_mulai_cicil as periode,
      emp_loan.nomor_ajuan,emp_loan.description,emp_loan.total_loan as total_pinjaman ,emp_loan.durasi_cicil 
      FROM ${database}_hrm.sysdata JOIN ${database}_hrm.emp_loan ON sysdata.kode='019' JOIN ${database}_hrm.employee ON employee.em_id=emp_loan.em_id WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status  LIKE '%${stauts}%'  AND emp_loan.em_id!='${em_id}' ORDER BY id DESC`;

    var query11 = `SELECT
      letter.name as nama,
      CASE
        WHEN (a.approve_status IS NULL OR a.approve_status = 'Pending') THEN "Pending"
        WHEN (a.approve_status = 'Rejected') THEN "Rejected"
        ELSE "Approve"
      END AS approve_status,
    a.eff_date AS atten_date,
    a.alasan AS uraian,
    a.nomor AS nomor_ajuan,
    e2.full_name AS approve_by,
    a.em_id,
    a.approve_id,
    a.approve_date,
    a.title AS judul,
    a.tgl_surat AS tanggal_ajuan,
    a.id,
    b.em_report_to,
    b.em_report2_to,
    b.full_name,
    a.status AS leave_status
    FROM ${database}_hrm.employee_letter a JOIN ${database}_hrm.employee b 
    LEFT JOIN ${database}_hrm.sysdata ON sysdata.kode='027' 
    LEFT JOIN ${database}_hrm.letter ON a.letter_id=letter.id
    LEFT JOIN 
       ${database}_hrm.employee e2 ON a.approve_id = e2.em_id
       WHERE a.em_id=b.em_id  AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND sysdata.name LIKE '%${em_id}%'`;

    var query12 = `SELECT
       letter.name as nama,
       CASE
         WHEN (a.approve_status IS NULL OR a.approve_status = 'Pending') THEN "Pending"
         WHEN (a.approve_status = 'Rejected') THEN "Rejected"
         ELSE "Approve"
       END AS approve_status,
     a.eff_date AS atten_date,
     a.pelanggaran AS pelangaran,
     a.nomor AS nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.approve_date,
     e2.full_name AS approve_by,
     a.hal AS judul,
     a.tgl_surat AS tanggal_ajuan,
     a.id,
     b.em_report_to,
     b.em_report2_to,
     b.full_name,
     a.status AS leave_status
     FROM ${database}_hrm.teguran_lisan a JOIN ${database}_hrm.employee b 
     LEFT JOIN ${database}_hrm.sysdata ON sysdata.kode='027' 
     LEFT JOIN ${database}_hrm.letter ON a.letter_id=letter.id
     LEFT JOIN 
       ${database}_hrm.employee e2 ON a.approve_id = e2.em_id
        WHERE a.em_id=b.em_id  AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND sysdata.name LIKE '%${em_id}%'`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query1 =
        query1 +
        `
    UNION ALL
    SELECT
    a.id as idd,
    CASE
     WHEN ( a.apply_status IS NULL  OR a.apply_status='Pending') AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by!='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
	  a.apply_id,
    a.date_selected,
    a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,
c.input_time,
a.time_plan_to,
     c.name as nama_penagjuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${endPeriodeDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id 
    AND   (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  ${conditionStatus}  AND a.leave_status!='Cancel' AND a.ajuan IN ('2', '3')  AND a.status_transaksi=1 ${orderby2}
    `;

      //cuti
      query2 =
        query2 +
        `
     UNION ALL SELECT
     a.id as idd,
     CASE
     WHEN ( a.apply_status  IS NULL OR a.apply_status='Pending')  AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by!='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
 a.date_selected,
  
a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.apply_id,
a.typeid,
c.input_time,


  
      d.name AS nama_divisi, a.nomor_ajuan, c.name as nama_penagjuan,  b.em_report_to as em_report_to,  
     b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${endPeriodeDynamic}.emp_leave a 
     INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b  JOIN ${database}_hrm.designation  d ON d.id=b.des_id 
     WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') 
 ${conditionStatus}   AND a.ajuan='1'  AND a.status_transaksi=1 ${orderby2}`;

      query3 = `${query3} UNION
      
      SELECT 
      a.id as idd,
     CASE
     WHEN ( a.approve_status  IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status IS NULL   OR a.approve_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     a.status,
	a.ajuan,
a.approve_id,
a.approve_date,
a.id,
a.em_ids,
o.dinilai,
    
   
     o.name as nama_pengajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId  WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor}AND a.status!='Cancel' AND a.ajuan='1'  AND a.status_transaksi=1 ${orderby2}
      `;
      query4 = `${query4}
     UNION ALL
     

     SELECT
     a.id as idd,
     CASE
     WHEN ( a.approve_status IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status IS NULL  OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     a.status,
	a.ajuan,
a.approve_id,
a.approve_date,
a.id,
      b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='2'  AND a.status_transaksi=1 ${orderby2}
     `;

      query5 = `${query5}
      
      UNION ALL

      SELECT
      a.id as idd,
     CASE
     WHEN ( a.apply_status IS NULL OR a.apply_status='Pending')  AND (a.apply_by IS NULL OR a.apply_by!='') THEN "Pending"
     WHEN  (a.apply_status IS NULL OR a.apply_status='Rejected')  AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by !='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
	a.apply_id,
 a.date_selected,
a.id,
a.apply_date,
a.leave_type,
a.ajuan,
a.typeid,
     
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name  FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  ${conditionStatus}  AND a.leave_status!='Cancel' AND a.ajuan='4'  AND a.status_transaksi=1 ${orderby2}
      `;

      query6 = `${query6}
     UNION ALL
     

     SELECT
     a.id as idd,
     a.approve_by,
     a.approve2_by, (IFNULL(a.sisa_claim ,0)) as sisa_claim ,(IFNULL(a.saldo_claim ,0)) as saldo_claim , c.id as id_ajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, a.*
      FROM ${endPeriodeDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b
      WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status!='Cancel' ${conditionStatusLabor} ${orderby2}
     `;

      // var query7 = `SELECT b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'`;
      var query7 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
      b.full_name, a.*,a.status as leave_status FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b
      WHERE a.em_id=b.em_id  AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='3' AND a.status_transaksi=1 ${orderby2}`;

      query8 = `${query8} 
   
   UNION ALL

   SELECT
   a.id as idd,
    CASE
     WHEN ( a.approve_status IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status  IS NULL OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
	  a.ajuan,
    a.approve_id,
    a.approve_date,
    a.id,
    a.signin_note as catatan_masuk,
    a.signout_note as catatan_keluar,
    a.signout_addr as lokasi_keluar,
    a.signin_addr as lokasi_masuk,
    a.signin_pict as foto_masuk,
    a.signout_pict as foto_keluar,
    a.place_in as place_in,
    a.place_out as place_out,



     
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
     b.full_name,a.status as leave_status FROM ${endPeriodeDynamic}.emp_labor a 
     JOIN ${database}_hrm.employee b   WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND( a.ajuan='3' OR a.ajuan='5') AND a.status_transaksi=1 ${orderby2}
   `;

      query9 = `${query9}
      
      UNION ALL

      SELECT
      a.id as idd,
     CASE
      WHEN ( a.approve_status IS NULL OR a.approve_status='Pending')  AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
      WHEN  (a.approve_status  IS NULL OR a.approve_status='Rejected')  AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
 
      ELSE "Approve"
      END AS approve_status,
      CASE
      WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
      WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
      
 
      ELSE "Approve"
      END AS approve2_status,
      a.dari_jam,
      a.sampai_jam,
      a.approve_by,
      a.approve2_by,
      a.em_delegation,
      a.atten_date,
      a.uraian,
      a.nomor_ajuan,
      a.em_id, 
      a.approve_id,
      a.place_in,
      a.place_out,
      a.ajuan,
      a.approve_id,
      a.approve_date,
      a.id,
      
      b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
      b.full_name,a.status as status,a.status as leave_status FROM ${endPeriodeDynamic}.emp_labor a 
      JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND a.ajuan='4' AND a.status_transaksi=1 ${orderby2}
      `;

      var query10 = `SELECT emp_loan.approve_by, emp_loan.id, employee.full_name, emp_loan.status as  approve_status,emp_loan.approve_id,emp_loan.approve_date,emp_loan.tgl_ajuan as tanggal_ajuan ,
      emp_loan.periode_mulai_cicil as periode,
      emp_loan.nomor_ajuan,emp_loan.description,emp_loan.total_loan as total_pinjaman ,emp_loan.jml_cicil  as durasi_cicil
      FROM ${database}_hrm.sysdata JOIN ${database}_hrm.emp_loan ON sysdata.kode='019' JOIN ${database}_hrm.employee ON employee.em_id=emp_loan.em_id WHERE sysdata.name LIKE '%${em_id}%' AND emp_loan.status  LIKE '%${stauts}%'   AND emp_loan.em_id!='${em_id}'`;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: [],
        });
      } else {
        if (url_data == "cuti") {
          console.log(query2);
          connection.query(query2, function (error, dataCuti) {
            console.log(dataCuti);
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve cuti!",
              jenis: "cuti",
              data: dataCuti,
            });
          });
        } else if (url_data == "tidak_hadir") {
          console.log(query1);
          connection.query(query1, function (error, dataTidakHadir) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Tidak Hadir!",
              jenis: "tidak_hadir",
              data: dataTidakHadir,
            });
          });
        } else if (url_data == "lembur") {
          connection.query(query3, function (error, dataLembur) {
            console.log(query3);
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Lembur!",
              jenis: "lembur",
              data: dataLembur,
            });
          });
        } else if (url_data == "tugas_luar") {
          connection.query(query4, function (error, dataTugasLuar) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Tugas Luar!",
              jenis: "Tugas Luar",
              data: dataTugasLuar,
            });
          });
        } else if (url_data == "dinas_luar") {
          console.log(query5);
          connection.query(query5, function (error, dataDinasLuar) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Dinas Luar!",
              jenis: "Dinas Luar",
              data: dataDinasLuar,
            });
          });
        } else if (url_data == "klaim") {
          connection.query(query6, function (error, dataKlaim) {
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data approve Klaim!",
              jenis: "Klaim",
              data: dataKlaim,
            });
          });
        } else if (url_data == "absensi") {
          connection.query(query8, function (error, dataAbsensi) {
            connection.release();
            console.log(dataAbsensi);
            res.send({
              status: true,
              message: "Berhasil ambil data approve Klaim!",
              jenis: "Klaim",
              data: dataAbsensi,
            });
          });
        } else if (url_data == "wfh") {
          console.log(stauts);
          connection.query(query9, function (error, dataAbsensi) {
            connection.release();
            console.log(dataAbsensi);

            res.send({
              status: true,
              message: "Berhasil ambil data approve Klaim!",
              jenis: "wfh",
              data: dataAbsensi,
            });
          });
        } else if (url_data == "kasbon") {
          console.log(query10);
          connection.query(query10, function (error, dataLoan) {
            console.log(dataLoan);

            connection.release();

            res.send({
              status: true,
              message: "Berhasil ambil data approve Klaim! ",
              jenis: "kasbon",
              data: dataLoan,
            });
          });
        } else if (url_data == "surat_peringatan") {
          console.log(query11);

          connection.query(query11, function (error, dataAbsensi) {
            connection.release();
            console.log("data ", dataAbsensi);

            res.send({
              status: true,
              message: "Berhasil ambil data approve Surat Peringatan!",
              jenis: "wfh",
              data: dataAbsensi,
            });
          });
        } else if (url_data == "teguran_lisan") {
          console.log(query12);

          connection.query(query12, function (error, dataAbsensi) {
            connection.release();
            console.log("data ", dataAbsensi);

            res.send({
              status: true,
              message: "Berhasil ambil data approve Teguran Lisan!",
              jenis: "teguran lisan",
              data: dataAbsensi,
            });
          });
        }
      }
    });
  },

  listApprovalPayroll(req, res) {
    console.log("-----spesifik approval----------");
    console.log(req.body);
    var database = req.query.database;
    var em_id = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var dateNow = req.body.date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT designation.name as nama_divisi, employee.full_name,employee.em_email,emp_mobile_approval.* FROM emp_mobile_approval JOIN ${database}_hrm.employee ON employee.em_id=emp_mobile_approval.em_id JOIN ${database}_hrm.designation ON employee.des_id=designation.id AND (emp_mobile_approval.approved_id IS NULL) AND created_date='${req.body.date}'`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: [],
        });
      } else {
        connection.query(query1, function (error, dataCuti) {
          connection.release();
          res.send({
            status: true,
            message: "Berhasil ambil data approve payroll",
            jenis: "cuti",
            data: dataCuti,
          });
        });
      }
    });
  },

  slipGaji(req, res) {
    console.log("-----spesifik approval----------");
    console.log(req.body);
    var database = req.query.database;
    var em_id = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var dateNow = req.body.date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT designation.name as nama_divisi, employee.full_name,employee.em_email,emp_mobile_approval.* FROM emp_mobile_approval JOIN ${database}_hrm.employee ON employee.em_id=emp_mobile_approval.em_id JOIN ${database}_hrm.designation ON employee.des_id=designation.id AND (emp_mobile_approval.approved_id IS NULL) AND created_date='${req.body.date}'`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: [],
        });
      } else {
        connection.query(query1, function (error, dataCuti) {
          connection.release();
          res.send({
            status: true,
            message: "Berhasil ambil data approve payroll",
            jenis: "cuti",
            data: dataCuti,
          });
        });
      }
    });
  },

  // checkSlipGajiValidation(req, res) {
  //   console.log('-----spesifik ----------')
  //   console.log(req.body)
  //   var database = req.query.database;
  //   var em_id = req.body.em_id;
  //   var getbulan = req.body.bulan;
  //   var gettahun = req.body.tahun;
  //   var dateNow=req.body.date;
  //   var des_id=req.body.des_id;

  //   const tahun = `${gettahun}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (getbulan.length == 1) {
  //     convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
  //   } else {
  //     convertBulan = getbulan;
  //   }
  //   const namaDatabaseDynamic = `${database}_hrm`;

  // var query1 = `SELECT * FROM employee JOIN designation ON desination.id=employee.des_id WHERE employee.em_id='${em_id}' AND designation.id='${des_id}' AND designation is NOT NULL`;

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: ipServer,//myhris.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.status(404).send({
  //         status: false,
  //         message: "Database tidak ditemukan",
  //         data: []
  //       });
  //     } else {

  //         connection.query(
  //           query1,
  //           function (error, data) {

  //             console.log(data)
  //             if (data.length>0){
  //               res.status(200).send({
  //                 status: false,
  //                 message: "Database tidak ditemukan",
  //                 data: []
  //               });

  //             }else{
  //               res.status(400).send({
  //                 status: false,
  //                 message: "Database tidak ditemukan",
  //                 data: []
  //               });
  //             }

  //           }
  //         );

  //     }

  //   })
  // },

  load_notifikasi(req, res) {
    console.log("-----load aktifitas notifikasi----------");
    var database = req.query.database;
    var em_id = req.body.em_id;

    var getTahun = req.body.tahun;
    var getBulan = req.body.bulan;

    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${getBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;
    var query1 = `SELECT atten_date FROM notifikasi WHERE em_id='${em_id}' ORDER BY id DESC`;
    var query2 = `SELECT * FROM notifikasi WHERE em_id='${em_id}'`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query1 = `SELECT atten_date,notifikasi.id as idd FROM ${startPeriodeDynamic}.notifikasi WHERE em_id='${em_id}' AND atten_date>='${startPeriode}' 
      UNION ALL
      SELECT atten_date ,notifikasi.id as idd FROM ${endPeriodeDynamic}.notifikasi WHERE em_id='${em_id}' AND atten_date<='${endPeriode}'
      ORDER BY idd DESC
      `;

      var query2 = `SELECT * FROM ${startPeriodeDynamic}.notifikasi WHERE em_id='${em_id}'  AND atten_date>='${startPeriode}'
      UNION ALL
      SELECT * FROM ${endPeriodeDynamic}.notifikasi WHERE em_id='${em_id}' AND atten_date<='${endPeriode}'
      `;
    }

    console.log(query1);
    console.log();

    console.log("query tanggal ", query1);
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(query1, function (error, dataTanggal) {
          connection.release();
          var listTanggal = dataTanggal;
          let filter1 = [];
          listTanggal.forEach((element) => {
            filter1.push(element["atten_date"]);
          });
          filter1 = filter1.filter(
            (value, index, arr) => arr.indexOf(value) == index
          );

          connection.query(query2, function (error, dataAll) {
            var allData = dataAll;
            console.log("");
            var hasilFinal = [];
            filter1.forEach((element) => {
              var turunan = [];

              allData.forEach((element2) => {
                if (element2["atten_date"] == element) {
                  turunan.push(element2);
                }
              });

              var data = {
                tanggal: element,
                notifikasi: turunan,
              };
              hasilFinal.push(data);
              hasilFinal = hasilFinal.sort((a, b) => a.tanggal - b.tanggal);

              console.log("hasil final ", hasilFinal);
            });
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: hasilFinal,
            });
          });
        });
      }
    });
  },
  load_laporan_absensi(req, res) {
    console.log(
      "-----load laporan absensi periode----------",
      req.headers.em_id
    );

    var emId = req.headers.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var status = req.body.status;
    var branchId = req.body.branch_id;

    var database = req.query.database;

    const tahun = gettahun;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length > 1) {
      convertBulan = getbulan;
    } else {
      var bulan_convert = getbulan <= 9 ? `0${getbulan}` : getbulan;
      convertBulan = bulan_convert;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    console.log(req.body);
    console.log(namaDatabaseDynamic);

    // var query1 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN hris_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' ) AND A.status='ACTIVE' ORDER BY A.full_name`;
    // var query2 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN hris_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' ) AND A.dep_id='${status}' AND A.status='ACTIVE' ORDER BY A.full_name`;
    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE A.branch_id=${branchId} AND CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id) AND A.status='ACTIVE' AND (A.em_report_to LIKE '%${emId}%' OR A.em_report2_to LIKE '%${emId}%') GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;
    var query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE A.branch_id=${branchId} AND CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id) AND A.dep_id='${status}' AND A.status='ACTIVE' AND (A.em_report_to LIKE '%${emId}%' OR A.em_report2_to LIKE '%${emId}%')  GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${startPeriodeDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE A.branch_id=${branchId} AND CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${startPeriodeDynamic}.attendance WHERE em_id=C.em_id) AND A.status='ACTIVE' AND (A.em_report_to LIKE '%${emId}%' OR A.em_report2_to LIKE '%${emId}%') 
      AND C.atten_date >='${startPeriode}' AND C.atten_date<='${endPeriode}' 
      GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note
      UNION ALL
      SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${endPeriodeDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE A.branch_id=${branchId} AND CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${endPeriodeDynamic}.attendance WHERE em_id=C.em_id) AND A.status='ACTIVE' AND (A.em_report_to LIKE '%${emId}%' OR A.em_report2_to LIKE '%${emId}%')
      AND C.atten_date >='${startPeriode}' AND C.atten_date<='${endPeriode}' 
       GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note
      `;

      query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${startPeriodeDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE A.branch_id=${branchId} AND  CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${startPeriodeDynamic}.attendance WHERE em_id=C.em_id) AND A.dep_id='${status}' AND A.status='ACTIVE' AND (A.em_report_to LIKE '%${emId}%' OR A.em_report2_to LIKE '%${emId}%') 
        AND C.atten_date >='${startPeriode}' AND C.atten_date<='${endPeriode}' 
        GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note
      
      
      
      UNION ALL
       SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${endPeriodeDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE A.branch_id=${branchId} AND  CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${endPeriodeDynamic}.attendance WHERE em_id=C.em_id) AND A.dep_id='${status}' AND A.status='ACTIVE' AND (A.em_report_to LIKE '%${emId}%' OR A.em_report2_to LIKE '%${emId}%') 
       AND C.atten_date >='${startPeriode}' AND C.atten_date<='${endPeriode}' 
       GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note
       `;
    }

    var url;
    if (status == "0") {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();

        console.log("url new ", url);
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
          });
        });
      }
    });
  },

  load_laporan_absensi_filter_lokasi(req, res) {
    console.log("-----load laporan absensi filter lokasi----------");
    var database = req.query.database;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var status = req.body.status;

    const tahun = gettahun;
    const convertYear = tahun.substring(2, 4);

    var convertBulan;
    if (getbulan.length > 1) {
      convertBulan = getbulan;
    } else {
      var bulan_convert = getbulan <= 9 ? `0${getbulan}` : getbulan;
      convertBulan = bulan_convert;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.place_in FROM ${namaDatabaseDynamic}.attendance C INNER JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE month(C.atten_date)='${getbulan}' AND A.status='ACTIVE' ORDER BY A.full_name`;
    var query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.place_in FROM ${namaDatabaseDynamic}.attendance C INNER JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE month(C.atten_date)='${getbulan}' AND A.status='ACTIVE' AND A.dep_id='${status}' ORDER BY A.full_name`;

    var url;
    if (status == "0") {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
          });
        });
      }
    });
  },

  load_laporan_absensi_tanggal(req, res) {
    console.log("-----log laporan absensi tanggal----------");
    var database = req.query.database;
    var atten_date = req.body.atten_date;
    var status = req.body.status;

    var array = atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    // var query1 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' AND atten_date='${atten_date}' ) AND A.status='ACTIVE' ORDER BY A.full_name`;
    // var query2 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' AND atten_date='${atten_date}' ) AND A.status='ACTIVE' AND A.dep_id='${status}' ORDER BY A.full_name`;

    var query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atten_date='${atten_date}') AND A.status='ACTIVE' GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;
    var query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atten_date='${atten_date}') AND A.dep_id='${status}' AND A.status='ACTIVE' GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;

    var url;
    if (status == "0") {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
          });
        });
      }
    });
  },

  load_laporan_absensi_harian(req, res) {
    console.log("-----load lapoarn absensi  ----------");
    var database = req.query.database;

    var status = req.body.status;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT a.atten_date, a.signin_time, a.place_in, b.em_id, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.attendance a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE' ORDER BY a.id DESC`;
    var query2 = `SELECT a.atten_date, a.signin_time, a.place_in, b.em_id, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.attendance a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE' AND b.dep_id='${status}' ORDER BY a.id DESC`;

    var url;
    if (status == "0") {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
            jumlah: results.length,
          });
        });
      }
    });
  },

  load_laporan_absensi_harian_telat(req, res) {
    console.log("-----load lapoarn absensi harian telat dev----------");
    var database = req.query.database;

    var status = req.body.status;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT DISTINCT emp.full_name AS full_name,
    cb.name AS branch_name,att.atten_date,att.signin_time,emp.job_title,emp.em_id,att.place_in,
    (
      (
        (
          TIMEDIFF (
            att.signin_time,
            (
              IFNULL (
                (SELECT
                  b.time_in
                FROM
                ${namaDatabaseDynamic}.emp_shift a,
                  ${database}_hrm.work_schedule b
                WHERE a.work_id = b.id
                  AND a.em_id = att.em_id
                  AND a.atten_date = att.atten_date),
                (SELECT
                  c.time_in
                FROM
                  ${database}_hrm.work_schedule c
                WHERE c.id = '2')
              )
            )
          )
        )
      )
    ) AS selisih,IFNULL (
      IFNULL (
        IFNULL (
          (SELECT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN LEFT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN LEFT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D03'),
          (SELECT DISTINCT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN LEFT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN LEFT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D02')
        ),
        IFNULL (
          (SELECT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN RIGHT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN RIGHT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D03'),
          (SELECT DISTINCT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN RIGHT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN RIGHT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D02')
        )
      ),
      10
    ) AS batas_toleransi
  FROM
   ${namaDatabaseDynamic}.attendance AS att,
   ${database}_hrm.employee emp,
  ${database}_hrm.branch cb
  WHERE emp.em_id = att.em_id
    AND cb.code = emp.branch_id
    AND att.atten_date='2023-07-06'
   
    AND att.place_in IN
    (SELECT DISTINCT
      a.place
    FROM
    ${database}_hrm.places_coordinate a,
    ${database}_hrm.late_rate b
    WHERE (
        LEFT (b.places, 2) = a.id
        OR RIGHT (b.places, 2) = a.id
      ))
   `;

    var query2 = `SELECT DISTINCT emp.full_name AS full_name,
   cb.name AS branch_name,att.atten_date,att.signin_time,emp.job_title,emp.em_id,att.place_in,
   (
     (
       (
         TIMEDIFF (
           att.signin_time,
           (
             IFNULL (
               (SELECT
                 b.time_in
               FROM
               ${namaDatabaseDynamic}.emp_shift a,
                 ${database}_hrm.work_schedule b
               WHERE a.work_id = b.id
                 AND a.em_id = att.em_id
                 AND a.atten_date = att.atten_date),
               (SELECT
                 c.time_in
               FROM
                 ${database}_hrm.work_schedule c
               WHERE c.id = '2')
             )
           )
         )
       )
     )
   ) AS selisih,IFNULL (
     IFNULL (
       IFNULL (
         (SELECT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN LEFT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN LEFT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D03'),
         (SELECT DISTINCT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN LEFT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN LEFT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D02')
       ),
       IFNULL (
         (SELECT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN RIGHT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN RIGHT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D03'),
         (SELECT DISTINCT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN RIGHT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN RIGHT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D02')
       )
     ),
     10
   ) AS batas_toleransi
 FROM
  ${namaDatabaseDynamic}.attendance AS att,
  ${database}_hrm.employee emp,
 ${database}_hrm.branch cb
 WHERE emp.em_id = att.em_id
   AND cb.code = emp.branch_id
   AND att.atten_date='2023-07-06'
  
   AND att.place_in IN
   (SELECT DISTINCT
     a.place
   FROM
   ${database}_hrm.places_coordinate a,
   ${database}_hrm.late_rate b
   WHERE (
       LEFT (b.places, 2) = a.id
       OR RIGHT (b.places, 2) = a.id
     ))
  `;

    //   var query2 = `
    //   SELECT DISTINCT emp.full_name AS full_name,
    //   cb.name AS branch_name,att.atten_date,att.signin_time,emp.job_title,emp.em_id,att.place_in,
    //   (
    //     (
    //       (
    //         TIMEDIFF (
    //           att.signin_time,
    //           (
    //             IFNULL (
    //               (SELECT
    //                 b.time_in
    //               FROM
    //               dpi_hrm2307.emp_shift a,
    //                 dpi_hrm.work_schedule b
    //               WHERE a.work_id = b.id
    //                 AND a.em_id = att.em_id
    //                 AND a.atten_date = att.atten_date),
    //               (SELECT
    //                 c.time_in
    //               FROM
    //                 dpi_hrm.work_schedule c
    //               WHERE c.id = '2')
    //             )
    //           )
    //         )
    //       )
    //     )
    //   ) AS selisih
    // FROM
    //   dpi_hrm2307.attendance AS att,
    //  dpi_hrm.employee emp,
    // dpi_hrm.branch cb
    // WHERE emp.em_id = att.em_id
    //   AND cb.code = emp.branch_id
    //   AND att.atten_date='2023-07-06'

    //   AND att.place_in IN
    //   (SELECT DISTINCT
    //     a.place
    //   FROM
    //   ${database}_hrm.places_coordinate a,
    //   ${database}_hrm.late_rate b
    //   WHERE (
    //       LEFT (b.places, 2) = a.id
    //       OR RIGHT (b.places, 2) = a.id
    //     ))
    //  `;

    var url;
    if (status == "0") {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
            jumlah: results.length,
          });
        });
      }
    });
  },

  whereOnceAttendate(req, res) {
    console.log("----- where once attendance----------");
    var database = req.query.database;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE id='${req.body.id_absen}'`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(query1, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        });
      }
    });
  },
  load_laporan_belum_absen(req, res) {
    console.log("-----load laporan belum absensi----------");
    var database = req.query.database;

    var status = req.body.status;
    console.log(`status ${status}`);

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    // var query1 = `SELECT a.full_name, a.job_title FROM ${database}_hrm.employee a WHERE a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    // var query2 = `SELECT a.full_name, a.job_title FROM ${database}_hrm.employee a WHERE a.dep_id='${status}' AND a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    // var query3 = `SELECT b.full_name, b.job_title, c.name as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_leave a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;
    // var query4 = `SELECT b.full_name, b.job_title, a.ajuan as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_labor a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;

    var query1 = `SELECT a.full_name,a.em_id, a.job_title FROM ${database}_hrm.employee a WHERE a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    var query2 = `SELECT a.full_name,a.em_id, a.job_title FROM ${database}_hrm.employee a WHERE a.dep_id='${status}' AND a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    var query3 = `SELECT b.full_name,b.em_id, b.job_title, c.name as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_leave a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;
    var query4 = `SELECT b.full_name,a.em_id, b.job_title, a.ajuan as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_labor a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;

    var url;
    if (status == "0") {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          `${url};${query3};${query4};`,
          function (error, results) {
            if (error) console.log(error);
            var all_jumlah =
              results[0].length + results[1].length + results[2].length;
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results[0],
              data_pengajuan1: results[1],
              data_pengajuan2: results[2],
              jumlah: all_jumlah,
            });
          }
        );
      }
    });
  },

  load_laporan_pengajuan(req, res) {
    console.log("-----load laporan pengajuan----------");
    var database = req.query.database;
    var emId = req.headers.em_id == undefined ? "000000123" : req.headers.em_id;
    var branchId = req.body.branch_id;

    var status = req.body.status;
    var type = req.body.type;

    const tahun = `${req.body.tahun}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = req.body.bulan;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var query1_tidak_hadir = `SELECT  a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan IN ('2','3') AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;
    var query2_tidak_hadir = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan IN ('2','3')  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;

    var query1_cuti = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;
    var query2_cuti = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId}  GROUP BY b.full_name`;

    var query1_lembur = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId}  GROUP BY b.full_name`;
    var query2_lembur = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId}  GROUP BY b.full_name`;

    var query1_tugas_luar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='2'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;
    var query2_tugas_luar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='2'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;

    var query1_dinasluar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='4'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;
    var query2_dinasluar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='4'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;

    var query1_klaim = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.created_on)='${req.body.bulan}' AND year(a.created_on)='${req.body.tahun}' AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;
    var query2_klaim = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.created_on)='${req.body.bulan}' AND year(a.created_on)='${req.body.tahun}' AND b.dep_id='${status}'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND a.branch_id=${branchId} GROUP BY b.full_name`;

    console.log(req.query);

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query1_tidak_hadir = `SELECT  a.*, b.full_name, b.job_title, count(*) as jumlah_penga , b.em_image as image FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan IN ('2','3') AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' GROUP BY b.full_name
   UNION ALL 
   SELECT  a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan IN ('2','3') AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' GROUP BY b.full_name

   `;
      query2_tidak_hadir = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  b.dep_id='${status}' AND a.ajuan IN ('2','3') AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' GROUP BY b.full_name
  UNION ALL
  SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  b.dep_id='${status}' AND a.ajuan IN ('2','3') AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' GROUP BY b.full_name
  `;

      query1_cuti = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE   a.ajuan='1' AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL 
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan='1' AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     `;

      query2_cuti = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  b.dep_id='${status}' AND a.ajuan='1' AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE b.dep_id='${status}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}' GROUP BY b.full_name
     `;

      query1_lembur = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.tgl_ajuan>='${startPeriode}' AND a.tgl_ajuan<='${endPeriode}'  GROUP BY b.full_name
    UNION ALL 

    SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan='1' AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.tgl_ajuan>='${startPeriode}' AND a.tgl_ajuan<='${endPeriode}' GROUP BY b.full_name
    
    `;
      query2_lembur = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id  b.dep_id='${status}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.tgl_ajuan>='${startPeriode}' AND a.tgl_ajuan<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE b.dep_id='${status}' AND a.ajuan='1'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     `;

      query1_tugas_luar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan='2'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.tgl_ajuan>='${startPeriode}' AND a.tgl_ajuan<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan='2'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.tgl_ajuan>='${startPeriode}' AND a.tgl_ajuan<='${endPeriode}'  GROUP BY b.full_name
     `;
      query2_tugas_luar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  b.dep_id='${status}' AND a.ajuan='2'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.tgl_ajuan>='${startPeriode}' AND a.tgl_ajuan<='${endPeriode}' GROUP BY b.full_name
     UNION ALL 
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE b.dep_id='${status}' AND a.ajuan='2'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     `;

      query1_dinasluar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE   a.ajuan='4' AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL 
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  a.ajuan='4'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     `;

      query2_dinasluar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  b.dep_id='${status}' AND a.ajuan='4'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah , b.em_image as image FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  b.dep_id='${status}' AND a.ajuan='4'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  GROUP BY b.full_name
     `;

      query1_klaim = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah, b.em_image as image FROM ${startPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE  (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.created_on>='${startPeriode}' AND a.created_on<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah, b.em_image as image FROM ${endPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE   (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.created_on>='${startPeriode}' AND a.created_on<='${endPeriode}' GROUP BY b.full_name
     `;

      query2_klaim = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah, b.em_image as image FROM ${startPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE b.dep_id='${status}'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.created_on>='${startPeriode}' AND  a.created_on<='${endPeriode}'  GROUP BY b.full_name
     UNION ALL 
     SELECT a.*, b.full_name, b.job_title, count(*) as jumlah, b.em_image as image FROM ${endPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE b.dep_id='${status}'  AND (b.em_report_to  LIKE '%${emId}%' OR   b.em_report_to  LIKE '%${emId}%'  ) AND  a.created_on>='${startPeriode}' AND a.created_on<='${endPeriode}'  GROUP BY b.full_name
     `;
    }

    var url;

    if (status == "0") {
      if (type == "tidak_hadir") {
        url = query1_tidak_hadir;
      } else if (type == "cuti") {
        url = query1_cuti;
      } else if (type == "lembur") {
        url = query1_lembur;
      } else if (type == "tugas_luar") {
        url = query1_tugas_luar;
      } else if (type == "dinas_luar") {
        url = query1_dinasluar;
      } else if (type == "klaim") {
        url = query1_klaim;
      }
    } else {
      if (type == "tidak_hadir") {
        url = query2_tidak_hadir;
      } else if (type == "cuti") {
        url = query2_cuti;
      } else if (type == "lembur") {
        url = query2_lembur;
      } else if (type == "tugas_luar") {
        url = query2_tugas_luar;
      } else if (type == "dinas_luar") {
        url = query2_dinasluar;
      } else if (type == "klaim") {
        url = query2_klaim;
      }
    }
    console.log("url baru", url);
    url = `SELECT SUM(TBL.jumlah) AS jumlah_pengajuan,TBL.* FROM 
( 
  ${url} 
) AS TBL 
GROUP BY TBL.full_name`;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //my${database}.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
            jumlah: 1,
          });
        });
      }
    });
  },

  load_laporan_pengajuan_harian(req, res) {
    console.log("-----load laporan pengajuanm harian----------");
    var database = req.query.database;

    var status = req.body.status;
    var type = req.body.type;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1_tidak_hadir = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan IN ('2','3') GROUP BY b.full_name`;
    var query2_tidak_hadir = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan IN ('2','3') GROUP BY b.full_name`;
    var query1_cuti = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query2_cuti = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query1_lembur = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query2_lembur = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query1_tugas_luar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='2' GROUP BY b.full_name`;
    var query2_tugas_luar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='2' GROUP BY b.full_name`;
    var query1_dinasluar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='4' GROUP BY b.full_name`;
    var query2_dinasluar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='4' GROUP BY b.full_name`;
    var query1_klaim = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE DATE(a.created_on)='${req.body.atten_date}' GROUP BY b.full_name`;
    var query2_klaim = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE DATE(a.created_on)='${req.body.atten_date}' AND b.dep_id='${status}' GROUP BY b.full_name`;

    var url;
    if (status == "0") {
      if (type == "tidak_hadir") {
        url = query1_tidak_hadir;
      } else if (type == "cuti") {
        url = query1_cuti;
      } else if (type == "lembur") {
        url = query1_lembur;
      } else if (type == "tugas_luar") {
        url = query1_tugas_luar;
      } else if (type == "dinas_luar") {
        url = query1_dinasluar;
      } else if (type == "klaim") {
        url = query1_klaim;
      }
    } else {
      if (type == "tidak_hadir") {
        url = query2_tidak_hadir;
      } else if (type == "cuti") {
        url = query2_cuti;
      } else if (type == "lembur") {
        url = query2_lembur;
      } else if (type == "tugas_luar") {
        url = query2_tugas_luar;
      } else if (type == "dinas_luar") {
        url = query2_dinasluar;
      } else if (type == "klaim") {
        url = query2_klaim;
      }
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
            jumlah: results.length,
          });
        });
      }
    });
  },

  load_detail_laporan_pengajuan(req, res) {
    console.log("-----load detail laporan pengajuan----------");
    var database = req.query.database;

    var em_id = req.body.em_id;
    var type = req.body.type;

    const tahun = `${req.body.tahun}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = req.body.bulan;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query_tidak_hadir = `SELECT a.*, b.name, b.category,b.input_time FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan IN ('2', '3') AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_cuti = `SELECT a.*, b.name, b.category FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan='1' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_lembur = `SELECT a.* FROM ${namaDatabaseDynamic}.emp_labor a WHERE a.ajuan='1' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_tugas_luar = `SELECT a.* FROM ${namaDatabaseDynamic}.emp_labor a WHERE a.ajuan='2' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_dinasluar = `SELECT a.* FROM ${namaDatabaseDynamic}.emp_leave a WHERE a.ajuan='4' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_klaim = `SELECT a.*, b.name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.cost b ON a.cost_id=b.id WHERE a.em_id='${em_id}' ORDER BY a.id DESC`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      var orderbyid = "";

      query_tidak_hadir = `SELECT  a.id as idd,a.*, b.name, b.category,b.input_time FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan IN ('2', '3') AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  ${orderbyid}
      
      UNION ALL

      SELECT a.id as idd,a.*, b.name, b.category,b.input_time FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan IN ('2', '3') AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'   ${orderbyid}
      `;

      query_cuti = `SELECT a.id as idd, a.*, b.name, b.category FROM ${startPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan='1' AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  ${orderbyid}
      UNION ALL
      SELECT a.id as idd, a.*, b.name, b.category FROM ${endPeriodeDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan='1' AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'   ${orderbyid}
      `;

      query_lembur = `SELECT a.id as idd, a.* FROM ${startPeriodeDynamic}.emp_labor a WHERE a.ajuan='1' AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'   ${orderbyid}
      UNION ALL
      SELECT a.id as idd, a.* FROM ${endPeriodeDynamic}.emp_labor a WHERE a.ajuan='1' AND a.em_id='${em_id}'  ${orderbyid} 
      `;
      query_tugas_luar = `SELECT a.id as idd, a.* FROM ${startPeriodeDynamic}.emp_labor a WHERE a.ajuan='2' AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'   ${orderbyid}
      UNION ALL
      SELECT a.id as idd, a.* FROM ${endPeriodeDynamic}.emp_labor a WHERE a.ajuan='2' AND a.em_id='${em_id}'  ${orderbyid}
      `;

      query_dinasluar = `SELECT a.id as idd, a.* FROM ${startPeriodeDynamic}.emp_leave a WHERE a.ajuan='4' AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'   ${orderbyid}
      UNION ALL
      SELECT a.id as idd, a.* FROM ${endPeriodeDynamic}.emp_leave a WHERE a.ajuan='4' AND a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  ${orderbyid}
      `;
      query_klaim = `SELECT a.id as idd,a.*, b.name FROM ${startPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.cost b ON a.cost_id=b.id WHERE a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  ${orderbyid}
      UNION ALL
      SELECT a.id as idd,a.*, b.name FROM ${endPeriodeDynamic}.emp_claim a JOIN ${database}_hrm.cost b ON a.cost_id=b.id WHERE a.em_id='${em_id}' AND a.atten_date>='${startPeriode}' AND a.atten_date<='${endPeriode}'  ${orderbyid}
      `;
    }

    var url;
    if (type == "tidak_hadir") {
      url = query_tidak_hadir;
    } else if (type == "cuti") {
      url = query_cuti;
    } else if (type == "lembur") {
      url = query_lembur;
    } else if (type == "tugas_luar") {
      url = query_tugas_luar;
    } else if (type == "dinas_luar") {
      url = query_dinasluar;
    } else if (type == "klaim") {
      url = query_klaim;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        console.log(url);
        connection.query(url, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
            jumlah: results.length,
          });
        });
        connection.release();
      }
    });
  },

  emp_leave_lastrow(req, res) {
    console.log("-----emp leave lastrow----------");
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM emp_leave WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(script, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil berhasil di tambah!",
            data: results,
          });
        });
      }
    });
  },
  emp_labor_lastrow(req, res) {
    console.log("----em labor lastrow----------");
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM emp_labor WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    console.log(script);

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(script, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil berhasil di tambah!",
            data: results,
          });
        });
      }
    });
  },
  emp_klaim_lastrow(req, res) {
    console.log("-----emp klaim last row---------");
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM emp_claim WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(script, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil berhasil di tambah!",
            data: results,
          });
        });
      }
    });
  },
  async emp_request_lastrow(req, res) {
    console.log("-----emp request last row----------");
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM employee_request WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

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
        //-------end check koneksi-----

        connection.query(script, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: "Terjadi kesahalan",
                data: [],
              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(200).send({
              status: false,
              message: "Terjadi kesalahan",
              data: [],
            });
          }
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results,
            });
          });
        });
      });
    });

    // pool.getConnection(function (err, connection) {
    //   if (err) {
    //     res.send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.query(
    //       script,
    //       function (error, results) {
    //         if (error != null) console.log(error)
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil di tambah!",
    //           data: results
    //         });
    //       }
    //     );
    //     connection.release();
    //   }
    // });
  },

  view_last_absen_user(req, res) {
    console.log("-----view last absen----------");

    var em_id = req.body.em_id;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var startDate = req.body.start_date;
    var endDate = req.body.end_date;
    var startTime = req.body.start_time;
    var endTime = req.body.end_time;

    console.log(namaDatabaseDynamic);

    var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' ORDER BY id DESC LIMIT 1`;
    // SELECT
    //   * FROM attendance WHERE CONCAT(atten_date, ' ', signin_time) >= '2023-10-02 05:00:00' AND CONCAT(atten_date, ' ', signin_time)<= '2023-10-03 09:00:00'
    //  var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
    //   AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1`;

    console.log("last abseen ", script);
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(script, function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        });
      }
    });
  },

  view_last_absen_user1(req, res) {
    console.log("-----view last absen 1 2----------");

    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startDate = req.body.start_date;
    var endDate = req.body.end_date;
    var startTime = req.body.start_time;
    var endTime = req.body.end_time;
    var pola = req.body.pola;

    console.log(namaDatabaseDynamic);

    console.log("body ", req.body);

    //     var script = `SELECT * FR OM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' ORDER BY id DESC LIMIT 1`;
    // SELECT
    //   * FROM attendance WHERE CONCAT(atten_date, ' ', signin_time) >= '2023-10-02 05:00:00' AND CONCAT(atten_date, ' ', signin_time)<= '2023-10-03 09:00:00'
    var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
    AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1`;

    console.log("-----view last absen 1 2---------- ", script);
    var wfh = "";
    if (pola == "2" || pola == 2) {
      wfh = `SELECT emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
    AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='4' AND status_transaksi='1' AND (status='Pending' OR status='Approve') ORDER BY id DESC LIMIT 1`;
    } else {
      wfh = `SELECT emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
    AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='4' AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`;
    }

    console.log("last abseen   new", script);
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(`${script};${wfh}`, function (error, results) {
          connection.release();
          if (error != null) console.log(error);

          //   return    res.send({
          //   status: true,
          //   message: "Berhasil ambil data!",
          //   data: results[0],
          //   wfh: [],

          // });

          if (results[0].length > 0) {
            if (results[1].length > 0) {
              return res.send({
                status: true,
                message: "Berhasil ambil data!",
                data: [],
                wfh: results[1],
              });
            } else {
              return res.send({
                status: true,
                message: "Berhasil ambil data!",
                data: results[0],
                wfh: results[1],
              });
            }
          } else {
            return res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results[0],
              wfh: results[1],
            });
          }
        });
      }
    });
  },

  potong_cuti(req, res) {
    console.log("-----potong cuti----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var terpakai = req.body.terpakai;
    var date = req.query.end_date.split("-");

    const databaseDynamic = `${database}_hrm${date[0].substring(2, 4)}${
      date[1]
    }`;

    var query1 = `SELECT terpakai FROM ${databaseDynamic}.assign_leave WHERE em_id='${em_id}' ORDER BY dateyear DESC  `;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    // var query2 = ``;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(query1, function (error, results) {
        if (error != null) console.log(error);
        var terpakaiUser = results[0].terpakai;
        var hitung = parseInt(terpakaiUser) + parseInt(terpakai);
        connection.query(
          `UPDATE ${databaseDynamic}.assign_leave
            
            
            
            
            
              SET terpakai='${hitung}' WHERE em_id='${em_id}' AND  dateyear='${results[0].dateyear}' `,
          function (error, results1) {
            res.send({
              status: true,
              message: "Berhasil Potong cuti!",
              data: results1,
            });
          }
        );
      });
      connection.release();
    });
  },

  // potong_cuti(req, res) {
  //   console.log('-----potong cuti----------')
  //   var database = req.query.database;
  //   var em_id = req.body.em_id;
  //   var terpakai = req.body.terpakai;
  //   var query1 = `SELECT terpakai,dateyear FROM assign_leave WHERE em_id='${em_id}' ORDER BY dateyear DESC  `;

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: ipServer,//myhris.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${database}_hrm`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);
  //   // var query2 = ``;
  //   poolDynamic.getConnection(function (err, connection) {
  //     if (err) console.log(err);
  //     connection.query(
  //       query1,
  //       function (error, results) {
  //         if (error != null) console.log(error)
  //         var terpakaiUser = results[0].terpakai;
  //         var hitung = parseInt(terpakaiUser) + parseInt(terpakai);
  //         connection.query(
  //           `UPDATE assign_leave SET terpakai='${hitung}' WHERE em_id='${em_id}' AND  dateyear='${results[0].dateyear}' `,
  //           function (error, results1) {
  //             res.send({
  //               status: true,
  //               message: "Berhasil Potong cuti!",
  //               data: results1,
  //             });
  //           }
  //         )
  //       }
  //     );
  //     connection.release();
  //   });
  // },

  edit_last_login(req, res) {
    console.log("EDIT las login");
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET last_login='${last_login}' WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil edit last login!",
            data: results,
          });
        }
      );
    });
  },
  edit_last_login_logout(req, res) {
    console.log("EDIT las login");
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET last_login='${last_login}',token_notif=null WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil edit last login!",
            data: results,
          });
        }
      );
    });
  },
  edit_last_login_id_mobile(req, res) {
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET last_login='${last_login}',id_mobile='${req.body.id_mobile}' ,token_notif=null WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil edit last login!",
            data: results,
          });
        }
      );
    });
  },

  edit_status_kandidat(req, res) {
    console.log("-----edit status kandidat----------");
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var id = req.body.id;
    var bodyValue = req.body;
    // var status = req.body.status;
    // var alasan_terima = req.body.alasan_terima;

    var script = `UPDATE candidate SET ? WHERE id='${id}'`;

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      delete bodyValue.id;
      connection.query(
        // `UPDATE candidate SET status='${status}', alasan_terima='${alasan_terima}' WHERE id='${id}'`,
        script,
        [bodyValue],
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil edit data kandidat !",
            data: results,
          });
        }
      );
    });
  },
  edit_statusAkhir_kandidat(req, res) {
    console.log("-----edit status akhir kandidat----------");
    var id = req.body.id;
    var status = req.body.status_akhir;
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE candidate SET status_akhir='${status}' WHERE id='${id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil edit status kandidat !",
            data: results,
          });
        }
      );
    });
  },
  tolak_kandidat(req, res) {
    console.log("-----total kandidat----------");
    var id = req.body.id;
    var status = req.body.status;
    var status_akhir = req.body.status_akhir;
    var alasan_tolak = req.body.alasan_tolak;
    var status_remaks = req.body.status_remaks;
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE candidate SET status='${status}', status_akhir='${status_akhir}', status_remaks='${status_remaks}', alasan_tolak='${alasan_tolak}' WHERE id='${id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil edit status kandidat !",
            data: results,
          });
        }
      );
    });
  },
  insert_absen_approve_pengajuan(req, res) {
    console.log("-----insert absen approve pengajuan----------");
    var data = req.body.dataAbsen;
    var database = req.query.database;
    var listTanggal = data[0].date_selected.split(",");
    var loopData = [];
    for (var i = 0; i < listTanggal.length; i++) {
      var insert = [
        data[0].em_id,
        listTanggal[i],
        "00:00:00",
        "00:00:00",
        "",
        "pengajuan",
        "pengajuan",
        "",
        "",
        "",
        "",
        "pengajuan",
        "pengajuan",
        "",
        "",
        data[0].nama_tipe,
        data[0].nama_tipe,
        "",
        "",
        "",
      ];
      loopData.push(insert);
    }

    var array = listTanggal[0].split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var script = `INSERT INTO ${namaDatabaseDynamic}.attendance (em_id, atten_date, signin_time, signout_time, working_hour, place_in, place_out, absence, overtime, earnleave, status, signin_longlat, signout_longlat, signin_pict, signout_pict, signin_note, signout_note, signin_addr, signout_addr, atttype) VALUES ?`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(script, [loopData], function (error, results) {
          connection.release();
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil input absensi pengajuan employee!",
            data: results,
          });
        });
      }
    });
  },
  notifikasi_reportTo(req, res) {
    console.log("-----notifikasi report to----------");
    var emIdPengaju = req.body.emId_pengaju;
    var title = req.body.title;
    var deskripsi = req.body.deskripsi;
    var url = req.body.url;
    var atten_date = req.body.atten_date;
    var jam = req.body.jam;
    var status = req.body.status;
    var database = req.query.database;
    var view = req.body.view;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT em_report_to FROM employee WHERE em_id='${emIdPengaju}'`,
        function (error, results) {
          var emReportTo = results[0].em_report_to;
          var emReportToList = emReportTo.split(",");
          var loopData = [];
          for (var i = 0; i < emReportToList.length; i++) {
            var insert = [
              emReportToList[i],
              title,
              deskripsi,
              url,
              atten_date,
              jam,
              status,
              view,
            ];
            loopData.push(insert);
          }

          var array = atten_date.split("-");

          const tahun = `${array[0]}`;
          const convertYear = tahun.substring(2, 4);
          const convertBulan = array[1];
          const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

          var script = `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id, title, deskripsi, url, atten_date, jam, status, view) VALUES ?`;

          const configDynamic = {
            multipleStatements: true,
            host: ipServer, //myhris.siscom.id (ip local)
            user: "pro",
            password: "Siscom3519",
            database: `${namaDatabaseDynamic}`,
            connectionLimit: 1000,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
          };
          const mysql = require("mysql");
          const poolDynamic = mysql.createPool(configDynamic);

          poolDynamic.getConnection(function (err, connection) {
            if (err) {
              res.send({
                status: false,
                message: "Database tidak di temukan",
              });
            } else {
              connection.query(script, [loopData], function (error, results) {
                if (error != null) console.log(error);
                res.send({
                  status: true,
                  message: "Berhasil input absensi pengajuan employee!",
                  data: results,
                });
              });
              connection.release();
            }
          });
        }
      );
      connection.release();
    });
  },
  insert_permintaan_kandidat(req, res) {
    console.log("-----inser permintaan kandidat----------");
    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var script = `INSERT INTO employee_request SET ?`;

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT * FROM employee_request WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
        function (error, results) {
          if (results.length == 0) {
            connection.query(script, [bodyValue], function (error, results) {
              if (error != null) console.log(error);
              res.send({
                status: true,
                message: "Berhasil berhasil di tambah!",
              });
            });
          } else {
            res.send({
              status: false,
              message: "ulang",
              data: results,
            });
          }
        }
      );
      connection.release();
    });
  },

  insert_kandidat_baru(req, res) {
    console.log("-----inert kandidat baru----------");
    var bodyValue = req.body;
    var database = req.query.database;

    var script = `INSERT INTO candidate SET ?`;
    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(script, [bodyValue], function (error, results) {
        if (error != null) console.log(error);
        res.send({
          status: true,
          message: "Berhasil berhasil di tambah!",
        });
      });
      connection.release();
    });
  },

  insert_emp_control_employee(req, res) {
    console.log("-----insert emp controll----------");

    var emId = req.body.em_id;
    var atten_date = req.body.atten_date;
    var jam = req.body.jam;
    var latLangKontrol = req.body.latLangKontrol;
    var alamat = req.body.alamat;

    var array = atten_date.split("-");
    var database = req.query.database;

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_control SET ?`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var insertData = {
      em_id: emId,
      atten_date: atten_date,
      time: jam,
      longlat: latLangKontrol,
      address: alamat,
    };

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(script, [insertData], function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil input absensi pengajuan employee!",
            data: results,
          });
        });
        connection.release();
      }
    });
  },

  load_history_kontrol(req, res) {
    console.log("-----load hostory kontrol----------");

    var em_id = req.body.em_id;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    var database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT * FROM ${namaDatabaseDynamic}.emp_control WHERE atten_date='${req.body.atten_date}' AND em_id='${em_id}' ORDER BY id DESC`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(query1, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil!",
            data: results,
          });
        });
        connection.release();
      }
    });
  },

  async checkSlipGajiValidation(req, res) {
    var database = req.query.database;

    var database = req.query.database;
    var em_id = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var dateNow = req.body.date;
    var des_id = req.body.des_id;
    console.log(req.body);

    var array = req.body.date.split("-");

    const getTahun = array[0];
    const getBulan = array[1];

    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getBulan.length == 1) {
      convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
    } else {
      convertBulan = getBulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

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
        //-------end check koneksi-----
        var query = `SELECT * FROM employee JOIN designation ON designation.id=employee.des_id WHERE employee.em_id='${em_id}' AND designation.id='${des_id}' AND (designation.payroll_approval is NOT NULL OR designation.payroll_approval!='')`;

        console.log(query);
        connection.query(query, (err, results) => {
          if (err) {
            console.error("Error executing SELECT statement:", err);
            connection.rollback(() => {
              connection.end();
              return res.status(404).send({
                status: false,
                message: "Terjadi kesahalan",
                data: [],
              });
            });
          }
          records = results;

          if (records.length == 0) {
            return res.status(200).send({
              status: false,

              data: [],
              approved: "not",
            });
          }

          connection.query(
            `SELECT * FROM ${namaDatabaseDynamic}.emp_mobile_approval WHERE em_id='${em_id}' AND created_date='${req.body.date}' `,
            (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(404).send({
                    status: false,
                    message: "Terjadi kesahalan",
                    data: [],
                  });
                });
              }
              records = results;

              if (records.length == 0) {
                return res.status(200).send({
                  status: false,

                  data: [],
                  approved: "not_yet",
                });
              }

              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: false,
                      message: "Terjadi kesalahan",
                      data: [],
                      approved: "approved",
                    });
                  });
                  return;
                }

                return res.status(200).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                  approved:
                    records[0].approved_id == null ? "pending" : "approved",
                });

                // connection.end();
                // console.log('Transaction completed successfully!');
                // return res.status(200).send({
                //   status: true,
                //   message: "Successfuly get data",
                //   data: results

                // });
              });
            }
          );
        });
      });
    });

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);;
    //   connection.query(
    //     `SELECT * FROM shift WHERE default_shift='1';`,
    //     function (error, results) {
    //       connection.release();
    //       if (error) console.log(error);
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },

  cekApprovalPayroll(req, res) {
    console.log("-----check validasi lapoarn----------");

    var emId = req.body.em_id;
    var designationId = req.body.designation_id;
    var date = req.body.date;
    var database = req.query.database;
    const databaseMaster = `${database}_hrm`;

    var description = "";

    if (req.body.type == "pph21") {
      description = "Pengajuan PPh21";
    } else if (req.body.type == "slip_gaji") {
      description = "Pengajuan Slip gaji";
    }

    var array = date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    var database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT * FROM ${databaseMaster}.designation WHERE id='${req.body.designation_id}'`;
    var queryCekApproval = `SELECT * FROM ${namaDatabaseDynamic}.emp_mobile_approval WHERE created_date='${date}' AND em_id='${emId}'`;
    var queryCekApprovalInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_mobile_approval (created_date,em_id,description) VALUES ('${date}','${emId}','${description}')`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(query1, function (error, results) {
          if (error != null) console.log(error);

          if (results.length > 0) {
            if (
              results[0].payroll_approval == "" ||
              results[0].payroll_approval == null ||
              results[0].payroll_approval == ""
            ) {
              return res.send(
                {
                  status: true,
                  message: "Tidak butuh approval",
                  // em_id:results[0].payroll_approval
                },
                200
              );
            } else {
              //cek transaksi aproval
              connection.query(queryCekApproval, function (error, data) {
                if (error != null) console.log(error);

                if (data.length > 0) {
                  if (
                    data[0].approved_id == null ||
                    data[0].approved_id == "" ||
                    data[0].approved_id == "null" ||
                    data[0].approved_id == "0"
                  ) {
                    return res.send(
                      {
                        status: true,
                        message:
                          "Data pengajuanmu belum di approve, tunggu beberapa saat lagi",
                        data: data,
                      },
                      400
                    );
                  } else {
                    return res.send(
                      {
                        status: true,
                        message: "Data has been approved",
                      },
                      200
                    );
                  }
                } else {
                  //insert data to pengajuan
                  connection.query(
                    queryCekApprovalInsert,
                    function (error, data) {
                      if (error != null) console.log(error);
                      return res.send(
                        {
                          status: true,
                          message: "data has been insert",
                          em_ids: results[0].payroll_approval,
                        },
                        400
                      );
                    }
                  );
                }
              });
            }
          } else {
            return res.send({
              status: true,
              message: "data tidak ditemukanh!",
            });
          }
        });
        connection.release();
      }
    });
  },
  approvePayroll(req, res) {
    console.log("-----check validasi lapoarn----------");

    var emId = req.body.em_id;
    var designationId = req.body.designation_id;
    var date = req.body.date;
    var database = req.query.database;
    var id = req.body.id;
    const databaseMaster = `${database}_hrm`;
    console.log(req.body);

    var description = "";

    if (req.body.type == "pph21") {
      description = "Pengajuan PPh21";
    } else if (req.body.type == "slip_gaji") {
      description = "Pengajuan Slip gaji";
    }

    var array = date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    var database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var date = req.body.date;
    var emId = req.body.em_id;

    var query1 = `UPDATE  ${namaDatabaseDynamic}.emp_mobile_approval SET approved_date='${date}',approved_id='${emId}' WHERE id='${id}'`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.status(404).send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(query1, function (error, results) {
          if (error != null) console.log(error);

          return res.status(200).send({
            status: true,
            message: "data tidak telah di approved",
          });
        });
        connection.release();
      }
    });
  },
  info_aktifitas_employee(req, res) {
    console.log("-----info aktifitas employee---------- ", req.body);
    var database = req.query.database;
    var em_id = req.headers.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    var startDate = req.query.start_date;
    var endDate = req.query.end_date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query_masuk_kerja = `SELECT atten_date FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1'`;
    var query_izin = `SELECT COUNT(*) as jumlah_izin FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='3'`;
    var query_sakit = `SELECT COUNT(*) as jumlah_sakit FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='2'`;
    var query_cuti = `SELECT COUNT(*) as jumlah_cuti FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='1'`;
    var query_lembur = `SELECT COUNT(*) as jumlah_lembur FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND ajuan='1'`;
    var query_masuk_wfh = `SELECT COUNT(*) as jumlah_masuk_wfh FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND place_in='WFH'`;
    var query_absen_tepat_waktu = `SELECT signin_time FROM ${namaDatabaseDynamic}.attendance WHERE em_id='CLD SISCOM' AND atttype='1'`;

    var query_jumlah_kerja = `SELECT IFNULL( workday,'22') as workday FROM ${database}_hrm.employee WHERE em_id='${em_id}'`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query_masuk_kerja = `SELECT atten_date FROM ${startPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')  
      UNION 
      SELECT atten_date FROM ${endPeriodeDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')  
      `;

      query_izin = `SELECT COUNT(*) as jumlah_izin FROM ${startPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='3' AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
      UNION

      SELECT COUNT(*) as jumlah_izin FROM ${endPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='3' AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
      
      `;

      query_sakit = `SELECT COUNT(*) as jumlah_sakit FROM ${startPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='2'  AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
      UNION 
      SELECT COUNT(*) as jumlah_sakit FROM ${endPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='2'  AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
      `;

      query_cuti = `SELECT COUNT(*) as jumlah_cuti FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='1'   AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
      UNION 
      SELECT COUNT(*) as jumlah_cuti FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND status_transaksi='1' AND ajuan='1'   AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
      
      `;

      query_lembur = `SELECT COUNT(*) as jumlah_lembur FROM ${startPeriodeDynamic}.emp_labor WHERE em_id='${em_id}' AND ajuan='1'   AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
     UNION
     SELECT COUNT(*) as jumlah_lembur FROM ${endPeriodeDynamic}.emp_labor WHERE em_id='${em_id}' AND ajuan='1' AND 
      (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')
     `;

      query_absen_tepat_waktu = `SELECT signin_time FROM ${startPeriodeDynamic}.attendance WHERE  em_id='${em_id}' AND atttype='1' AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')  
     UNION

     SELECT signin_time FROM ${endPeriodeDynamic}.attendance WHERE  em_id='${em_id}' AND atttype='1' AND  (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}') 
     `;
    }

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `${query_masuk_kerja};${query_izin};${query_sakit};${query_cuti};${query_lembur};${query_masuk_wfh};${query_absen_tepat_waktu};${query_jumlah_kerja}`,
          function (error, results) {
            if (error != null) console.log(error);
            res.send({
              status: true,
              message: "Berhasil ambil data info!",

              data_izin: results[1],
              data_sakit: results[2],
              data_cuti: results[3],
              data_lembur: results[4],
              data_masukwfh: results[5],
              data_absentepatwaktu: results[6],
              data_employee: "22",
              data_masuk_kerja: results[0],
            });
          }
        );
        connection.release();
      }
    });
  },

  employeeAttendance(req, res) {
    console.log("-----Employee attemdamce  ----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `SELECT * FROM attendance WHERE atten_date='${date}' AND em_id='${em_id}'`,
          function (error, results) {
            if (error != null) console.log(error);
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        );
        connection.release();
      }
    });
  },

  UpdateEmployeeAttendance(req, res) {
    console.log("-----Employee attemdamce  ----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `UPDATE emp_labor SET status_transaksi=0 WHERE em_id='${em_id}'AND atten_date='${date}'`,
          function (error, results) {
            if (error != null) console.log(error);
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        );
        connection.release();
      }
    });
  },

  async saveEmployeeAttendance(req, res) {
    console.log("-----Employee attemdamce ----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;
    var checkin = req.body.checkin;
    var checkout = req.body.checkout;
    var status = req.body.status;
    var tanggalAjuan = req.body.tgl_ajuan;
    var nomorAjuan = "";
    var catatan = req.body.catatan;
    var nameFile = req.body.file;
    var lokasiMasuk = req.body.lokasi_masuk_id;
    var lokasiKeluar = req.body.lokasi_keluar_id;

    console.log(req.body);

    var namaTable = "emp_labor";
    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const databaseMaster = `${database}_hrm`;

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

          connection.query(
            `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE ajuan='3' AND em_id='${em_id}' AND atten_date='${req.body}' AND (status='Approve' OR status='Pending')`,
            (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "Data gagal terkirim",
                    data: results,
                  });
                });
                return;
              }
              connection.query(
                `SELECT * FROM ${databaseMaster}.places_coordinate WHERE id='${lokasiMasuk}' `,
                (err, lokasiMasukResult) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: "Data gagal terkirim",
                        data: results,
                      });
                    });
                    return;
                  }
                  connection.query(
                    `SELECT * FROM ${databaseMaster}.places_coordinate WHERE id='${lokasiKeluar}' `,
                    (err, lokasiKeluarResult) => {
                      if (err) {
                        console.error("Error executing SELECT statement:", err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: "Data gagal terkirim",
                            data: results,
                          });
                        });
                        return;
                      }

                      if (results.length > 0) {
                        return res.status(400).send({
                          status: true,
                          message: "Data sudah tersedia",
                          data: results,
                        });
                      }

                      connection.query(
                        ` SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE ajuan='3' ORDER BY id DESC `,
                        (err, results) => {
                          if (err) {
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Data gagal terkirim",
                                data: results,
                              });
                            });
                            return;
                          }
                          if (results.length > 0) {
                            var text = results[0]["nomor_ajuan"];
                            nomor = parseInt(text.substring(8, 13)) + 1;
                            var nomorStr = String(nomor).padStart(4, "0");
                            nomorAjuan =
                              `RQ20${convertYear}${convertBulan}` + nomorStr;
                          } else {
                            nomor = 1;
                            var nomorStr = String(nomor).padStart(4, "0");
                            nomorAjuan =
                              `RQ20${convertYear}${convertBulan}` + nomorStr;
                          }
                          var queryInsert = "";
                          var absenMasuk = req.body.address_masuk;
                          console.log(absenMasuk);
                          var absenKeluar = req.body.address_keluar;
                          queryInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,uraian,ajuan,em_delegation,req_file,place_in,place_out,approve_status)
              VALUES ('${nomorAjuan}','${em_id}','${date}','${checkin}','${checkout}',CURDATE(),'${status}','1','${catatan}','3','','${nameFile}','${lokasiMasuk}','${lokasiKeluar}','Pending')`;
                          if (lokasiMasuk == "") {
                            queryInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,uraian,ajuan,em_delegation,req_file,place_in,place_out,approve_status,signout_note,signout_pict,signout_longlat,signout_addr)
                VALUES ('${nomorAjuan}','${em_id}','${date}','00:00:00','${checkout}',CURDATE(),'${status}','1','${catatan}','3','','${nameFile}','${lokasiMasuk}','${lokasiKeluarResult[0].place}','Pending','${catatan}','${nameFile}','${lokasiKeluarResult[0].place_longlat}','${absenKeluar}')`;
                          } else if (lokasiKeluar == "") {
                            queryInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,uraian,ajuan,em_delegation,req_file,place_in,place_out,approve_status,signin_note,signin_pict,signin_longlat,signin_addr)
                VALUES ('${nomorAjuan}','${em_id}','${date}','${checkin}','00:00:00',CURDATE(),'${status}','1','${catatan}','3','','${nameFile}','${lokasiMasukResult[0].place}','${lokasiKeluar}','Pending','${catatan}','${nameFile}','${lokasiMasukResult[0].place_longlat}','${absenMasuk}')`;
                          } else {
                            queryInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,uraian,ajuan,em_delegation,req_file,place_in,place_out,approve_status,signin_note,signin_pict,signin_longlat,signout_note,signout_pict,signout_longlat,signin_addr,signout_addr)
                VALUES ('${nomorAjuan}','${em_id}','${date}','${checkin}','${checkout}',CURDATE(),'${status}','1','${catatan}','3','','${nameFile}','${lokasiMasukResult[0].place}','${lokasiKeluarResult[0].place}','Pending','${catatan}','${nameFile}','${lokasiMasukResult[0].place_longlat}','${catatan}','${nameFile}','${lokasiKeluarResult[0].place_longlat}','${absenMasuk}','${absenKeluar}')`;
                          }
                          connection.query(queryInsert, (err, results) => {
                            if (err) {
                              console.error(
                                "Error executing SELECT statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: "Data gagal terkirim",
                                  data: results,
                                });
                              });
                              return;
                            }
                            connection.query(
                              `SELECT * FROM ${namaDatabaseDynamic}.${namaTable} WHERE nomor_ajuan='${nomorAjuan}'`,
                              (err, transaksi) => {
                                if (err) {
                                  console.error(
                                    "Error executing SELECT statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: "Data gagal terkirim",
                                      data: results,
                                    });
                                  });
                                  return;
                                }
                                connection.query(
                                  `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${em_id}'`,
                                  (err, employee) => {
                                    if (err) {
                                      console.error(
                                        "Error executing SELECT statement:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: true,
                                          message: "Data gagal terkirim",
                                          data: results,
                                        });
                                      });
                                      return;
                                    }

                                    utility.insertNotifikasi(
                                      employee[0].em_report_to,
                                      "Approval Absensi",
                                      "Absensi",
                                      employee[0].em_id,
                                      transaksi[0].id,
                                      transaksi[0].nomor_ajuan,
                                      employee[0].full_name,
                                      namaDatabaseDynamic,
                                      databaseMaster
                                    );

                                    connection.commit((err) => {
                                      if (err) {
                                        console.error(
                                          "Error committing transaction:",
                                          err
                                        );
                                        connection.rollback(() => {
                                          connection.end();
                                          return res.status(400).send({
                                            status: true,
                                            message: "Data gagal terkirim",
                                            data: [],
                                          });
                                        });
                                        return;
                                      }
                                      connection.end();
                                      console.log(
                                        "Transaction completed successfully!"
                                      );
                                      return res.status(200).send({
                                        status: true,
                                        message: "data berhasil terkirm",
                                      });
                                    });
                                  }
                                );
                              }
                            );
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    } catch (e) {
      return res.status(400).send({
        status: true,
        message: "Gagal simpan data",
        data: [],
      });
    }

    // const mysql = require("mysql");
    // const poolDynamic = mysql.createPool(configDynamic);

    // poolDynamic.getConnection(function (err, connection) {
    //   if (err) {
    //     res.status(400).send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.query(
    //       "SELECT * FROM emp_labor WHERE ajuan='3' AND em_id=? AND atten_date=? AND (status='Approve'OR status='Pending')",[em_id,date],
    //       function (error, results) {
    //         if (error != null) console.log(error)

    //         if (results.length>0){
    //           res.status(400).send({
    //             status: false,
    //             message: "Data sudah tersedia",
    //           });

    //         }else{

    //           connection.query(
    //          ` SELECT nomor_ajuan FROM emp_labor WHERE ajuan='3' ORDER BY id DESC `,
    //             function (error, data) {
    //               if (error != null) {
    //                 res.status(400).send({
    //                   status: false,
    //                   message: error,
    //                 });
    //               }

    //           if (data.length > 0) {
    //             var text = data[0]['nomor_ajuan'];
    //             nomor = parseInt(text.substring(8, 13)) + 1;
    //             var nomorStr = String(nomor).padStart(4, '0')
    //             nomorAjuan = `RQ20${convertYear}${convertBulan}` + nomorStr;

    //           } else {
    //             nomor = 1;
    //             var nomorStr = String(nomor).padStart(4, '0')
    //             nomorAjuan  = `RQ20${convertYear}${convertBulan}` + nomorStr;
    //           }

    //           connection.query(
    //             `INSERT INTO emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,uraian,ajuan,em_delegation,req_file,place_in,place_out,approve_status)
    //              VALUES ('${nomorAjuan}','${em_id}','${date}','${checkin}','${checkout}','${tanggalAjuan}','${status}','1','${catatan}','3','','${nameFile}','${lokasiMasuk}','${lokasiKeluar}','Pending')`,
    //             function (error, results) {
    //               if (error != null) console.log(error)

    //               res.status(200).send({
    //                 status: true,
    //                 message: "Pengajuan berhasil",
    //               });

    //             }
    //           );

    //             }
    //           );

    //         }
    //       }
    //     );
    //     connection.release();
    //   }

    // });
  },

  getEmployeeAttendance(req, res) {
    console.log("-----Employee attemdamce  ----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;
    var query = `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query = `SELECT emp_labor.id as idd,  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM ${startPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 
     UNION ALL
     SELECT emp_labor.id as idd,  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM ${endPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1
     
     ORDER BY idd DESC
     `;
    }

    // var query= `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`

    const configDynamic = {
      multipleStatements: true,
      host: ipServer, //myhris.siscom.id (ip local)
      user: "pro",
      password: "Siscom3519",
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(query, function (error, results) {
          if (error != null) console.log(error);
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        });
        connection.release();
      }
    });
  },

  async loadCutiMelahirkan(req, res) {
    console.log("---------place coodinate----------------");
    var database = req.query.database;
    var typeId = req.body.type_id;
    let ms = Date.now();
    var d = new Date(ms),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = [year, month, day].join("-");

    var em_id = req.query.id;
    console.log(req.body);

    var array = date.split("-");
    console.log("date now ", date);

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

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
          //

          connection.query(
            `
             SELECT name FROM sysdata WHERE kode='013'`,
            (err, sysdata) => {
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
              connection.query(
                `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE typeId='${typeId}' AND em_id='${em_id}' AND start_date>CURDATE() AND  end_date<CURDATE() AND leave_status='${
                  sysdata[0].name == "1" || sysdata[0].name == 1
                    ? "Approve"
                    : "Approve2"
                }' ORDER BY ID DESC`,
                (err, results) => {
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
                      message: "Succesfuly ",
                      data: results,
                    });
                  });
                }
              );
            }
          );
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
};

// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`
