const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const utility = require("./../utils/utility");
const e = require("express");
// const faceApiService = require('./faceapiService');

var request = require("request");

const model = require("../utils/models");
require("dotenv").config();

var ipServer = process.env.API_URL;
pool.on("error", (err) => {
  console.error(err);
});
// var utility.ipServerHris()=utility.utility.ipServerHris()Hris()

module.exports = {
  async suratPeringatan(req, res) {
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
          var querySuratPeringatan= `SELECT letter.name as sp,employee.full_name as nama,employee.job_title as posisi, employee_letter.* FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id LEFT JOIN letter ON letter.id=employee_letter.letter_id WHERE employee_letter.em_id LIKE '%${emId}%' AND employee_letter.status='Approve' AND exp_date >= CURDATE() ORDER BY id DESC`;
          console.log(querySuratPeringatan);
          connection.query(
            querySuratPeringatan,
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

  async searchSuratPeringatan(req, res) {
    var database = req.query.database;
    var emId = req.body.em_id;
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
          var querySuratPeringatan= `SELECT letter.name as sp,employee.full_name as nama,employee.job_title as posisi, employee_letter.* FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id LEFT JOIN letter ON letter.id=employee_letter.letter_id WHERE employee_letter.em_id LIKE '%${emId}%' AND employee_letter.status='Approve' AND exp_date >= CURDATE() ORDER BY id DESC`;
          console.log(querySuratPeringatan);
          connection.query(
            querySuratPeringatan,
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

  async detailAlasan(req, res) {
    var database = req.query.database;
    var emId = req.headers.em_id;
    var id = req.params.id;
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
            `SELECT * FROM employee_letter_reason WHERE employee_letter_id='${id}'`,
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

                console.log("tes ne ", employee);

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

  async approvalSp(req, res) {
    var database = req.query.database;
    var emId = req.body.em_id;
    var id = req.body.id;
    var status = req.body.status;
    var konsekuensi = req.body.konsekuesi;
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
                `UPDATE employee_letter SET status='${status}',approve_status='${status}',approve_date=CURDATE(),approve_id='${emId}',tipe_konsekuensi='${konsekuensi}',exp_date = DATE_ADD(CURDATE(), INTERVAL 3 MONTH)  WHERE id='${id}'`,
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
                    `SELECT * FROM employee_letter WHERE id='${id}'`,
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

  async suratPeringatanPdf(req, res) {
    console.log("----detail kontrak---------");
    var database = req.query.database;

    const connection = await model.createConnection(database);
    var reminder = req.body.reminder;
    var emId = req.headers.em_id;
    var id = req.params.id;

    console.log();
    var query1 = ` 
      SELECT * FROM employee_letter_reason WHERE employee_letter_id='${id}'`;
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
};

// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`
