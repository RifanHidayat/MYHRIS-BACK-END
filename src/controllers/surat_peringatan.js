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
          var querySuratPeringatan = 
          `SELECT letter.name AS sp,employee.full_name AS nama,employee.job_title AS posisi, 
employee_letter.* , 
CASE 
           WHEN elv.employee_letter_id IS NOT NULL THEN 1 
           ELSE 0 
         END AS is_view 
FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id 
LEFT JOIN letter ON letter.id=employee_letter.letter_id 
LEFT JOIN employee_letter_view elv 
    ON elv.employee_letter_id = employee_letter.id 
    AND elv.em_id = employee_letter.em_id
WHERE employee_letter.em_id LIKE '${emId}' AND employee_letter.status='Approve' 
AND exp_date >= CURDATE() ORDER BY id DESC`;
          console.log(querySuratPeringatan);
          connection.query(querySuratPeringatan, (err, employee) => {
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

  async getUnreadSuratCount(req, res) {
    var database = req.query.database;
    var emId = req.headers.em_id;

    console.log('kesini gak sih');
  
    try {
      const connection = await model.createConnection(database);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return res.status(500).send({ status: false, message: "Koneksi gagal" });
        }
  
        const queryUnreadCount = `
          SELECT COUNT(*) AS unread_count
          FROM employee_letter el
          WHERE el.em_id = ?
          AND el.status = 'Approve'
          AND el.exp_date >= CURDATE()
          AND NOT EXISTS (
              SELECT 1 
              FROM employee_letter_view elr
              WHERE elr.employee_letter_id = el.id
              AND elr.em_id = ?
          )`;
  
        connection.query(queryUnreadCount, [emId, emId], (err, result) => {
          connection.end();
          if (err) {
            console.error("Error executing query:", err);
            return res.status(400).send({ status: false, message: "Gagal mengambil jumlah surat" });
          }
  
          return res.status(200).send({ 
            status: true, 
            message: "Jumlah surat yang belum dibaca", 
            unread_count: result[0].unread_count 
          });
        });
      });
    } catch (e) {
      return res.status(500).send({ status: false, message: "Terjadi kesalahan server" });
    }
  },
  

  async updateStatusSuratPeringatan(req, res) {
    var database = req.query.database;
    var emId = req.body.em_id;
    var letterId = req.body.letter_id;
  
    try {
      const connection = await model.createConnection(database);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return res.status(500).send({ status: false, message: "Koneksi gagal" });
        }
  
        const queryInsert = `
          INSERT INTO employee_letter_view (employee_letter_id, em_id) 
          VALUES (?, ?)`;

        console.log('ini em_id ',emId);
        connection.query(queryInsert, [letterId, emId], (err, result) => {
          connection.end();
          // console.log(queryInsert);
          if (err) {
            console.error("Error inserting into employee_letter_view:", err);
            return res.status(400).send({ status: false, message: "Gagal update status" });
          }
  
          return res.status(200).send({ status: true, message: "Surat peringatan sudah dibaca" });
        });
      });
    } catch (e) {
      return res.status(500).send({ status: false, message: "Terjadi kesalahan server" });
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
          var querySuratPeringatan = `SELECT letter.name as sp,employee.full_name as nama,employee.job_title as posisi, employee_letter.* FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id LEFT JOIN letter ON letter.id=employee_letter.letter_id WHERE employee_letter.em_id LIKE '%${emId}%' AND employee_letter.status='Approve' AND exp_date >= CURDATE() ORDER BY id DESC`;
          console.log(querySuratPeringatan);
          connection.query(querySuratPeringatan, (err, employee) => {
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
              if (employee.length > 0) {
                connection.end();
                console.log("Transaction completed successfully!");
                return res.status(200).send({
                  status: true,
                  message: "data tersedia",
                  data: employee,
                });
              } else {
                var querySuratPeringatanPending = `SELECT letter.name as sp,employee.full_name as nama,employee.job_title as posisi, employee_letter.* FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id LEFT JOIN letter ON letter.id=employee_letter.letter_id WHERE employee_letter.em_id LIKE '%${emId}%' ORDER BY id DESC`;
                console.log(querySuratPeringatanPending);
                connection.query(querySuratPeringatanPending, (err, employee) => {
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
                    connection.end();
                    console.log("Transaction completed successfully!");
                    return res.status(200).send({
                      status: true,
                      message: "data tersedia",
                      data: employee,
                    });
                  });
                });
              }
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
    var tipeSp = req.body.tipe_sp;
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
              connection.query(`SELECT * FROM sysdata WHERE kode=020`, (err, result) => {
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
                var masaBerlaku = result[0]['name'].split(',');
                var masaSp1 = masaBerlaku[0];
                var masaSp2 = masaBerlaku[1];
                console.log(masaSp1);                
                console.log(masaSp2);       
                var masaBerlakuSP = '';
                if (tipeSp == 'Surat Peringatan 1'){
                  masaBerlakuSP = `DATE_ADD(CURDATE(), INTERVAL ${masaSp1} MONTH)`;
                } else if(tipeSp == 'Surat Peringatan 2'){
                  masaBerlakuSP = `DATE_ADD(CURDATE(), INTERVAL ${masaSp2} MONTH)`;
                } else {
                  masaBerlakuSP = `CURDATE()`
                }
                connection.query(
                  `UPDATE employee_letter SET status='${status}',approve_status='${status}',approve_date=CURDATE(),eff_date=CURDATE(),approve_id='${emId}',tipe_konsekuensi='${konsekuensi}',
                  exp_date = ${masaBerlakuSP}  WHERE id='${id}'`,
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
                          var text = `Peringatan: Surat Peringatan telah diterbitkan. Anda mendapatkan surat peringatan dengan alasan  ${dataSp[0].alasan}, Anda perlu segera diperbaiki. Mohon perhatian serius!`;
                          console.log(employee[0]);
  
                          utility.insertNotifikasiGlobal(
                            dataSp[0].em_id,
                            "Info SP",
                            "sp",
                            employee[0].em_id,
                            dataSp[0].id,
                            "",
                            dataSp[0].em_id,
                            databasedinamik,
                            databseMaster,
                            text
                          );
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
