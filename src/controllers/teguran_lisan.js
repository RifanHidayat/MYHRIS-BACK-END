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
    async suratTeguran(req, res) {
        var database = req.query.database;
        var emId = req.headers.em_id;
        var branchId = req.headers.branch_id;
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
                `SELECT letter.name AS sp,employee.full_name AS nama,employee.job_title AS posisi, teguran_lisan.* FROM teguran_lisan JOIN employee ON teguran_lisan.em_id=employee.em_id LEFT JOIN letter ON letter.id=teguran_lisan.letter_id WHERE teguran_lisan.em_id LIKE '%${emId}%'`,
                (err, employee) => {
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
                  console.log(
                    `SELECT letter.name AS sp,employee.full_name AS nama,employee.job_title AS posisi, teguran_lisan.* FROM teguran_lisan JOIN employee ON teguran_lisan.em_id=employee.em_id LEFT JOIN letter ON letter.id=teguran_lisan.letter_id WHERE teguran_lisan.em_id LIKE '%SIS202408061%'`
                  );
    
                  connection.commit((err) => {
                    if (err) {
                      console.error("Error committing transaction:", err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: "data tidak tersedia",
                          data: [],
                        });
                      });
                      return;
                    }
                    console;
    
                    connection.end();
                    console.log("Transaction completed successfully!");
                    return res.status(200).send({
                      status: true,
                      message: "data tersedia",
                      data: employee,
                    });
                  });
                }
              );
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
    
      
      async teguranLisanPdf(req, res) {
        console.log("----detail teguran---------");
        var database = req.query.database;
    
        const connection = await model.createConnection(database);
        var reminder = req.body.reminder;
        var emId = req.headers.em_id;
        var id = req.params.id;
    
        console.log();
        var query1 = ` 
          SELECT * FROM teguran_lisan_detail WHERE teguran_lisan_id='${id}'`;
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
  async approvalTeguranLisan(req, res) {
    var database = req.query.database;
    var emId = req.body.em_id;
    var id = req.body.id;
    var status = req.body.status;
    console.log(req.body);

    var branchId = req.body.branch_id;

    var databseMaster = `${database}_hrm`;
    var date = utility.dateNow2().split("-");

    var tahun = date[0].toString().substring(2, 4);
    var bulan = date[1];

    var databasedinamik = `${database}_hrm${tahun}${bulan}`;

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
            `SELECT * FROM employee WHERE em_id='${emId}'`,
            (err, employee) => {
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
                `UPDATE teguran_lisan SET status='${status}',approve_status='${status}',approve_date=CURDATE(),approve_id='${emId}' WHERE id='${id}'`,
                (err, employeqqe) => {
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
                    `SELECT * FROM teguran_lisan WHERE id='${id}'`,
                    (err, dataSp) => {
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
                        status == "Approve" ||
                        status == "Approved" ||
                        status == "Approve"
                      ) {
                        var text = `⚠️ Peringatan: Surat Peringatan telah diterbitkan. Anda mendapatkan surat peringatan dengan alasan  ${dataSp[0].alasan} 
                                Anda perlu segera diperbaiki. Mohon perhatian serius!`;
                        console.log(employee[0]);

                        //    utility.insertNotifikasiGlobal(employee[0].em_id,'Info SP','sp',employee[0].em_id,'','',employee[0].full_name,databasedinamik,databseMaster,text)
                      }

                      connection.commit((err) => {
                        if (err) {
                          console.error("Error committing transaction:", err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: "data tidak tersedia",
                              data: [],
                            });
                          });
                          return;
                        }

                        connection.end();
                        console.log("Transaction completed successfully!");
                        return res.status(200).send({
                          status: true,
                          message: "data tersedia",
                          data: employee,
                        });
                      });
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
        message: "Gagal ambil data",
        data: [],
      });
    }
  },
};
