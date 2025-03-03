const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const utility = require("../../utils/utility");
const e = require("express");

var request = require("request");

const model = require("../../utils/models");
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

          var queryTeguranLisan = `SELECT letter.name AS sp,
          e1.full_name AS nama,
          e1.job_title AS posisi,
          e2.full_name AS yang_menerbitkan, 
          
teguran_lisan.* , 
CASE 
           WHEN elv.teguran_lisan_id IS NOT NULL THEN 1 
           ELSE 0 
         END AS is_view 
FROM teguran_lisan JOIN employee e1 ON teguran_lisan.em_id=e1.em_id 
LEFT JOIN employee e2 ON teguran_lisan.diterbitkan_oleh=e2.em_id 
LEFT JOIN letter ON letter.id=teguran_lisan.letter_id 
LEFT JOIN teguran_lisan_view elv 
    ON elv.teguran_lisan_id = teguran_lisan.id 
    AND elv.em_id = teguran_lisan.em_id
WHERE teguran_lisan.em_id LIKE '${emId}' AND teguran_lisan.status='Approve' 
AND exp_date >= CURDATE() ORDER BY id DESC`;
          console.log(queryTeguranLisan);
          connection.query(queryTeguranLisan, (err, employee) => {
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
            FROM teguran_lisan el
            WHERE el.em_id = ?
            AND el.status = 'Approve'
            AND el.exp_date >= CURDATE()
            AND NOT EXISTS (
                SELECT 1 
                FROM teguran_lisan_view elr
                WHERE elr.teguran_lisan_id = el.id
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

  async updateStatusTeguranLisan(req, res) {
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
            INSERT INTO teguran_lisan_view (teguran_lisan_id, em_id) 
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

  async searchSuratTeguran(req, res) {
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

          var queryTeguranLisan = `SELECT letter.name AS sp,employee.full_name AS nama,employee.job_title AS posisi, teguran_lisan.* FROM teguran_lisan JOIN employee ON teguran_lisan.em_id=employee.em_id LEFT JOIN letter ON letter.id=teguran_lisan.letter_id WHERE teguran_lisan.em_id LIKE '%${emId}%' AND approve_status='Approve' AND exp_date >= CURDATE() ORDER BY id DESC`;
          console.log(queryTeguranLisan);
          connection.query(queryTeguranLisan, (err, employee) => {
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
                var queryTeguranLisan = `SELECT letter.name AS sp,employee.full_name AS nama,employee.job_title AS posisi, teguran_lisan.* FROM teguran_lisan JOIN employee ON teguran_lisan.em_id=employee.em_id LEFT JOIN letter ON letter.id=teguran_lisan.letter_id WHERE teguran_lisan.em_id LIKE '%${emId}%' AND teguran_lisan.status='Pending'  ORDER BY id DESC`;
                console.log(queryTeguranLisan);
                connection.query(queryTeguranLisan, (err, employee) => {
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
              connection.query(`SELECT * FROM sysdata WHERE kode = 020`, (err, result) => {
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
                var masaBerlakuTL = masaBerlaku[2];
                connection.query(
                  `UPDATE teguran_lisan SET status='${status}',approve_status='${status}',approve_date=CURDATE(),eff_date=CURDATE(),approve_id='${emId}', 
                  exp_date=DATE_ADD(CURDATE(), INTERVAL ${masaBerlakuTL} MONTH) WHERE id='${id}'`,
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
                          var text = `Peringatan: Teguran Lisan telah diterbitkan. Anda mendapatkan Teguran Lisan dengan alasan  ${dataSp[0].pelanggaran}, Anda perlu segera diperbaiki. Mohon perhatian serius!`;
                          console.log(dataSp[0]);
  
                          utility.insertNotifikasiGlobal(
                            dataSp[0].em_id,
                            "Info Teguran Lisan",
                            "tl",
                            employee[0].em_id,
                            dataSp[0].id,
                            dataSp[0].nomor_ajuan,
                            employee[0].full_name,
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
              })
              
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
