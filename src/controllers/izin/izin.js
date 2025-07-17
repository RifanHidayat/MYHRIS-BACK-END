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
  async store(req, res) {
    console.log("-----kirim tidak masuk kerja izin----------");
    var database = req.body.database;
    var email = req.query.email;
    let records;
    var error = false;
    var pesan = "";

    try {
      var database = req.query.database;
      var script = `INSERT INTO emp_leave SET ?`;
      var leaveType = req.body.leave_type;
      var emId = req.body.em_id;
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
        atten_date: utility.dateNow2(),
        em_delegation: req.body.em_delegation,
        leave_files: req.body.leave_files,
        ajuan: req.body.ajuan,
        apply_status: "Pending",
        lokasi: req.body.lokasi,
        multiselect:req.body.multiselect==undefined?"0":req.body.multiselect
      };
      console.log('body ',insertData )
      var dataInsertLog = {
        menu_name: req.body.menu_name,
        activity_name: req.body.activity_name,
        acttivity_script: script,
        createdUserID: req.body.created_by,
      };
      var cutLeave = req.body.cut_leave;
      var jumlahCuti = req.body.total_cuti;
      var array = req.body.start_date.split("-");
      var dates = req.body.date_selected.split(",");
      console.log("date ", dates[0]);

      const tahun = `${array[0]}`;
      const convertYear = tahun.substring(2, 4);
      var convertBulan;
      if (array[1].length == 1) {
        convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
      } else {
        convertBulan = array[1];
      }
      var databaseMaster = `${database}_hrm`;
      const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

      const connection = await model.createConnection(database);

      console.log("Perulangan ");

      console.log(leaveType);

      //jika fullday
      if (
        leaveType == "FULLDAY" ||
        leaveType == "Full Day" ||
        leaveType == "Full day"
      ) {
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
            var queryPendingPotongCuti = `
    SELECT 
    SUM(e.leave_duration) AS total_leave_duration,
    e.leave_status AS status,
    e.nomor_ajuan AS nomorAjuan,
    lt.name AS namaAjuan
FROM ${namaDatabaseDynamic}.emp_leave e
JOIN ${databaseMaster}.leave_types lt ON e.typeId = lt.id
WHERE e.em_id = '${req.body.em_id}' 
  AND e.status_transaksi = 1
  AND lt.cut_leave = 1 AND e.leave_status IN ('Pending', 'Approve','Approve2');
`;
            for (var i = 0; i < dates.length; i++) {
              var d = dates[i];

              var date = dates[i].split("-");
              console.log(d);

              const tahun = `${date[0]}`;
              const year = tahun.substring(2, 4);
              var month;

              if (date[1].length == 1) {
                month = date[1] <= 9 ? `0${date[1]}` : date[1];
              } else {
                month = date[1];
              }
            }
            // const databasePeriode = `${database}_hrm${year}${month}`;

            connection.query(
              `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${emId}' AND date_selected LIKE '%${d}%' AND status_transaksi=1 AND (leave_status='Pending' OR leave_status='Approve' OR leave_status='Approve1' OR leave_status='Approve2')`,
              (err, results) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  error = true;
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

                connection.query(queryPendingPotongCuti, (err, dataPending) => {
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
                  console.log(queryPendingPotongCuti);
                  console.log(dataPending);
                  console.log("ini jumlah cuti user", jumlahCuti);
                  console.log("ini cut leave", cutLeave);
                  const totalLeaveDuration =
                    (dataPending[0]?.total_leave_duration || 0) +
                    req.body.leave_duration;
                  console.log("ini total leave durasion", totalLeaveDuration);
                  if (cutLeave == 1) {
                    if (totalLeaveDuration > jumlahCuti) {
                      error = true;
                      pesan = `Kamu mempunyai ${dataPending[0]?.namaAjuan} dengan Status ${dataPending[0]?.status} dan nomor ajuan ${dataPending[0]?.nomorAjuan} sehingga sisa cuti kamu tidak mencukupi`;
                    }
                  }
                  records = results;
                  console.log(`Masuk 1 ${records.length}`);
                  if (records.length > 0) {
                    error = true;

                    console.log("masuk sini");

                    pesan = `Kamu mempunyai pengajuan ${
                      results[0].ajuan == 1
                        ? "Cuti"
                        : results[0].ajuan == 2
                        ? "Sakit"
                        : results[0].ajuan == 3
                        ? "Izin"
                        : "Dinas Luar"
                    } dengan nomor ${
                      results[0].nomor_ajuan
                    }  pada tanggal ${d} status ${results[0].leave_status}`;
                  }

                  connection.query(
                    `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${emId}' AND ajuan='2' AND atten_date='${d}' AND status_transaksi=1 AND (status='Pending' OR status='Approve' OR status='Approve1' OR status='Approve2')`,
                    (err, results) => {
                      if (err) {
                        console.error("Error executing SELECT statement:", err);
                        connection.rollback(() => {
                          error = true;
                          return res.status(400).send({
                            status: true,
                            message: "Terjadi Kesalahan",
                            data: [],
                          });
                        });
                        return;
                      }

                      if (results.length > 0) {
                        error = true;
                        pesan = `Kamu mempunyai pengajuan Tugas Luar dengan nomor ${results[0].nomor_ajuan}  pada tanggal ${results[0].atten_date} status ${results[0].status}`;
                      }

                      connection.query(
                        `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${emId}' AND atten_date='${d}'`,
                        (err, results) => {
                          if (err) {
                            error = true;
                            console.error(
                              "Error executing SELECT statement:",
                              err
                            );
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: "Terjadi Kesalahan",
                                data: [],
                              });
                            });
                            return;
                          }
                          console.log(`Masuk 3 ${results}`);
                          // if (results.length > 0) {
                          //   error = true;
                          // }
                          console.log("errro", error);
                          if (error == false) {
                            console.log("kemari kag");
                            connection.query(
                              `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
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
                                console.log("ini result", results);

                                //  proses memasukan data

                                if (results.length > 0) {
                                  console.log("kemari");
                                  return res.status(200).send({
                                    status: false,
                                    message: "ulang",
                                    data: results,
                                  });
                                }

                                connection.query(
                                  `INSERT INTO ${namaDatabaseDynamic}.emp_leave SET ?`,
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
                                          status: false,
                                          message: "Terjadi Kesalahan",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }
                                    connection.query(
                                      `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?`,
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
                                        connection.query(
                                          `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${emId}'`,
                                          (err, employee) => {
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

                                            connection.query(
                                              `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
                                              (err, transaksi) => {
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
                                                        status: false,
                                                        message:
                                                          "Terjadi Kesalahan",
                                                        data: [],
                                                      });
                                                  });
                                                  return;
                                                }

                                                connection.query(
                                                  `SELECT * FROM sysdata WHERE kode='032'`,
                                                  (err, sysdata) => {
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
                                                              status: false,
                                                              message:
                                                                "Terjadi Kesalahan",
                                                              data: [],
                                                            });
                                                        }
                                                      );
                                                      return;
                                                    }

                                                    console.log("kenotif 1");

                                                    const delegationIds =
                                                      employee[0].em_report_to
                                                        ? Array.isArray(
                                                            employee[0]
                                                              .em_report_to
                                                          )
                                                          ? employee[0]
                                                              .em_report_to
                                                          : [
                                                              employee[0]
                                                                .em_report_to,
                                                            ]
                                                        : [];

                                                    const emIds = employee[0]
                                                      .em_report2_to
                                                      ? Array.isArray(
                                                          employee[0]
                                                            .em_report2_to
                                                        )
                                                        ? employee[0]
                                                            .em_report2_to
                                                        : [
                                                            employee[0]
                                                              .em_report2_to,
                                                          ]
                                                      : [];

                                                      const combinedIds = [...new Set([
                                                        ...delegationIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase())),
                                                        ...emIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase()))
                                                      ])];
                                                    utility.insertNotifikasi(
                                                      combinedIds,
                                                      "Approval Izin",
                                                      "Izin",
                                                      employee[0].em_id,
                                                      transaksi[0].id,
                                                      transaksi[0].nomor_ajuan,
                                                      employee[0].full_name,
                                                      namaDatabaseDynamic,
                                                      databaseMaster
                                                    );
                                                    utility.insertNotifikasi(
                                                      sysdata[0].name,
                                                      "Pengajuan Izin",
                                                      "Izin",
                                                      employee[0].em_id,
                                                      null,
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
                                                        connection.rollback(
                                                          () => {
                                                            connection.end();
                                                            return res
                                                              .status(400)
                                                              .send({
                                                                status: false,
                                                                message:
                                                                  "Kombinasi email & password Anda Salah",
                                                                data: [],
                                                              });
                                                          }
                                                        );
                                                        return;
                                                      }
                                                      connection.end();

                                                      console.log(
                                                        "Transaction completed successfully! 2"
                                                      );
                                                      return res
                                                        .status(200)
                                                        .send({
                                                          status: true,
                                                          message:
                                                            "Kombinasi email & password Anda Salah",
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
                                  }
                                );
                              }
                            );
                          } else {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: pesan,
                              data: [],
                            });
                          }
                        }
                      );
                    }
                  );
                });
              }
            );

            // if (error == false) {
            //   console.log('kemari kag');
            //   connection.query(
            //     `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
            //     (err, results) => {
            //       if (err) {
            //         console.error(
            //           "Error executing SELECT statement:",
            //           err
            //         );
            //         connection.rollback(() => {
            //           connection.end();
            //           return res.status(400).send({
            //             status: false,
            //             message: "Terjadi Kesalahan",
            //             data: [],
            //           });
            //         });
            //         return;
            //       }
            //       console.log('ini result', results);

            //       //  proses memasukan data

            //       if (results.length > 0) {
            //         console.log('kemari');
            //         return res.status(200).send({
            //           status: false,
            //           message: "ulang",
            //           data: results,
            //         });
            //       }

            //       connection.query(
            //         `INSERT INTO ${namaDatabaseDynamic}.emp_leave SET ?`,
            //         [insertData],
            //         (err, results) => {
            //           if (err) {
            //             console.error(
            //               "Error executing SELECT statement:",
            //               err
            //             );
            //             connection.rollback(() => {
            //               connection.end();
            //               return res.status(400).send({
            //                 status: false,
            //                 message: "Terjadi Kesalahan",
            //                 data: [],
            //               });
            //             });
            //             return;
            //           }
            //           connection.query(
            //             `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?`,
            //             [dataInsertLog],
            //             (err, results) => {
            //               if (err) {
            //                 console.error(
            //                   "Error executing SELECT statement:",
            //                   err
            //                 );
            //                 connection.rollback(() => {
            //                   connection.end();
            //                   return res.status(400).send({
            //                     status: false,
            //                     message: "Terjadi Kesalahan",
            //                     data: [],
            //                   });
            //                 });
            //                 return;
            //               }
            //               connection.query(
            //                 `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${emId}'`,
            //                 (err, employee) => {
            //                   if (err) {
            //                     console.error(
            //                       "Error executing SELECT statement:",
            //                       err
            //                     );
            //                     connection.rollback(() => {
            //                       connection.end();
            //                       return res.status(400).send({
            //                         status: false,
            //                         message: "Terjadi Kesalahan",
            //                         data: [],
            //                       });
            //                     });
            //                     return;
            //                   }

            //                   connection.query(
            //                     `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
            //                     (err, transaksi) => {
            //                       if (err) {
            //                         console.error(
            //                           "Error executing SELECT statement:",
            //                           err
            //                         );
            //                         connection.rollback(() => {
            //                           connection.end();
            //                           return res
            //                             .status(400)
            //                             .send({
            //                               status: false,
            //                               message:
            //                                 "Terjadi Kesalahan",
            //                               data: [],
            //                             });
            //                         });
            //                         return;
            //                       }

            //                       connection.query(
            //                         `SELECT * FROM sysdata WHERE kode='032'`,
            //                         (err, sysdata) => {
            //                           if (err) {
            //                             console.error(
            //                               "Error executing SELECT statement:",
            //                               err
            //                             );
            //                             connection.rollback(
            //                               () => {
            //                                 connection.end();
            //                                 return res
            //                                   .status(400)
            //                                   .send({
            //                                     status: false,
            //                                     message:
            //                                       "Terjadi Kesalahan",
            //                                     data: [],
            //                                   });
            //                               }
            //                             );
            //                             return;
            //                           }

            //                           console.log('kenotif 1');

            //                           //notifikasi approval
            //                           //  utility.insertNotifikasi(employee[0].em_report_to,title,'Izin',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
            //                            utility.insertNotifikasi(
            //                             employee[0].em_report_to,
            //                             "Approval Izin",
            //                             "Izin",
            //                             employee[0].em_id,
            //                             transaksi[0].id,
            //                             transaksi[0].nomor_ajuan,
            //                             employee[0].full_name,
            //                             namaDatabaseDynamic,
            //                             databaseMaster
            //                           );
            //                           utility.insertNotifikasi(
            //                             sysdata[0].name,
            //                             "Pengajuan Sakit",
            //                             "Izin",
            //                             employee[0].em_id,
            //                             transaksi[0].id,
            //                             transaksi[0].nomor_ajuan,
            //                             employee[0].full_name,
            //                             namaDatabaseDynamic,
            //                             databaseMaster
            //                           );

            //                           connection.commit((err) => {
            //                             if (err) {
            //                               console.error(
            //                                 "Error committing transaction:",
            //                                 err
            //                               );
            //                               connection.rollback(
            //                                 () => {
            //                                   connection.end();
            //                                   return res
            //                                     .status(400)
            //                                     .send({
            //                                       status: false,
            //                                       message:
            //                                         "Kombinasi email & password Anda Salah",
            //                                       data: [],
            //                                     });
            //                                 }
            //                               );
            //                               return;
            //                             }
            //                             connection.end();

            //                             console.log(
            //                               "Transaction completed successfully! 2"
            //                             );
            //                             return res
            //                               .status(200)
            //                               .send({
            //                                 status: true,
            //                                 message:
            //                                   "Kombinasi email & password Anda Salah",
            //                                 data: records,
            //                               });
            //                           });
            //                         }
            //                       );
            //                     }
            //                   );
            //                 }
            //               );
            //             }
            //           );
            //         }
            //       );
            //     }
            //   );
            // } else {
            //   connection.commit((err) => {
            //     if (err) {
            //       console.error(
            //         "Error committing transaction:",
            //         err
            //       );
            //       connection.rollback(() => {
            //         connection.end();
            //         return res.status(400).send({
            //           status: true,
            //           message: pesan,
            //           data: [],
            //         });
            //       });
            //       return;
            //     }
            //   });
            // }
          });
        });
      } else {
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
            for (var i = 0; i < dates.length; i++) {
              var d = dates[i];

              var date = dates[i].split("-");
              console.log(d);

              const tahun = `${date[0]}`;
              const year = tahun.substring(2, 4);
              var month;

              if (date[1].length == 1) {
                month = date[1] <= 9 ? `0${date[1]}` : date[1];
              } else {
                month = date[1];
              }

              const databasePeriode = `${database}_hrm${year}${month}`;

              console.log("eksekusi ", i);
              connection.query(
                `SELECT * FROM ${databasePeriode}.emp_leave WHERE em_id='${emId}' AND date_selected LIKE '%${d}%' AND status_transaksi=1 AND (leave_status='Pending' OR leave_status='Approve' OR leave_status='Approve1' OR leave_status='Approve2')`,
                (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    error = true;
                    connection.rollback(() => {
                      // connection.end();
                      return res.status(400).send({
                        status: false,
                        message: "Terjadi Kesalahan",
                        data: [],
                      });
                    });
                    // return;
                  }

                  records = results;
                  console.log(`Masuk 1 ${records.length}`);

                  if (records.length > 0) {
                    error = true;

                    // console.log('Transaction completed successfully!');
                    // return res.status(200).send({
                    //   status: true,
                    //   message: "Kombinasi email & password Anda Salah",
                    //   data:records

                    // });

                    console.log("masuk sini");
                    connection.rollback((rollbackErr) => {
                      if (rollbackErr)
                        console.error("Error during rollback:", rollbackErr);
                      connection.end();
                      return res.status(400).json({
                        status: true,
                        message: `Kamu mempunyai pengajuan ${
                          results[0].ajuan == 1
                            ? "Cuti"
                            : results[0].ajuan == 2
                            ? "Sakit"
                            : results[0].ajuan == 3
                            ? "Izin"
                            : "Dinas Luar"
                        } dengan nomor ${
                          results[0].nomor_ajuan
                        }  pada tanggal ${d} status ${results[0].leave_status}`,
                        data: [],
                      });
                    });
                    // return;
                  } else {
                    console.log("lanjut sini gak sih");

                    connection.query(
                      `SELECT * FROM ${databasePeriode}.emp_labor WHERE em_id='${emId}' AND ajuan='2' AND atten_date='${d}' AND status_transaksi=1 AND (status='Pending' OR status='Approve' OR status='Approve1' OR status='Approve2')`,
                      (err, results) => {
                        if (err) {
                          console.error(
                            "Error executing SELECT statement:",
                            err
                          );
                          connection.rollback(() => {
                            error = true;
                            return res.status(400).send({
                              status: true,
                              message: "Terjadi Kesalahan",
                              data: [],
                            });
                          });
                          return;
                        }

                        if (results.length > 0) {
                          error = true;
                          connection.rollback(() => {
                            // connection.end();
                            return res.status(400).send({
                              status: true,
                              message: `Kamu mempunyai pengajuan Tugas Luar dengan nomor ${results[0].nomor_ajuan}  pada tanggal ${results[0].atten_date} status ${results[0].status}`,
                              data: [],
                            });
                          });
                          return;
                        }

                        connection.commit((err) => {
                          if (err) {
                            console.error("Error committing transaction:", err);
                            connection.rollback(() => {
                              // connection.end();
                              return res.status(400).send({
                                status: true,
                                message:
                                  "Kombinasi email & password Anda Salah",
                                data: [],
                              });
                            });
                            return;
                          }
                          console.log("ini erro gak ", error);
                          if (error == false) {
                            connection.query(
                              `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
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

                                //  proses memasukan data

                                if (results.length > 0) {
                                  return res.status(200).send({
                                    status: false,
                                    message: "ulang",
                                    data: results,
                                  });
                                }

                                connection.query(
                                  `INSERT INTO ${namaDatabaseDynamic}.emp_leave SET ?`,
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
                                          status: false,
                                          message: "Terjadi Kesalahan",
                                          data: [],
                                        });
                                      });
                                      return;
                                    }
                                    connection.query(
                                      `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?`,
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
                                        connection.query(
                                          `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${emId}'`,
                                          (err, employee) => {
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
                                            connection.query(
                                              `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
                                              (err, transaksi) => {
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
                                                        status: false,
                                                        message:
                                                          "Terjadi Kesalahan",
                                                        data: [],
                                                      });
                                                  });
                                                  return;
                                                }

                                                var queryGlobal = `SELECT * FROM ${databaseMaster}.sysdata WHERE kode = '032'`;
                                                connection.query(
                                                  queryGlobal,
                                                  (err, global) => {
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
                                                              status: false,
                                                              message:
                                                                "Terjadi Kesalahan",
                                                              data: [],
                                                            });
                                                        }
                                                      );
                                                      return;
                                                    }
                                                    const delegationIds =
                                                      employee[0].em_report_to
                                                        ? Array.isArray(
                                                            employee[0]
                                                              .em_report_to
                                                          )
                                                          ? employee[0]
                                                              .em_report_to
                                                          : [
                                                              employee[0]
                                                                .em_report_to,
                                                            ]
                                                        : [];

                                                    const emIds = employee[0]
                                                      .em_report2_to
                                                      ? Array.isArray(
                                                          employee[0]
                                                            .em_report2_to
                                                        )
                                                        ? employee[0]
                                                            .em_report2_to
                                                        : [
                                                            employee[0]
                                                              .em_report2_to,
                                                          ]
                                                      : [];

                                                      const combinedIds = [...new Set([
                                                        ...delegationIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase())),
                                                        ...emIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase()))
                                                      ])];
                                                    utility.insertNotifikasi(
                                                      combinedIds,
                                                      "Approval Izin",
                                                      "Izin",
                                                      employee[0].em_id,
                                                      transaksi[0].id,
                                                      transaksi[0].nomor_ajuan,
                                                      employee[0].full_name,
                                                      namaDatabaseDynamic,
                                                      databaseMaster
                                                    );
                                                    utility.insertNotifikasi(
                                                      global[0].name,
                                                      "Pengajuan Izin",
                                                      "Izin",
                                                      employee[0].em_id,
                                                      null,
                                                      transaksi[0].nomor_ajuan,
                                                      employee[0].full_name,
                                                      namaDatabaseDynamic,
                                                      databaseMaster
                                                    );
                                                  }
                                                );

                                                connection.commit((err) => {
                                                  if (err) {
                                                    console.error(
                                                      "Error committing transaction:",
                                                      err
                                                    );
                                                    connection.rollback(() => {
                                                      connection.end();
                                                      return res
                                                        .status(400)
                                                        .send({
                                                          status: false,
                                                          message:
                                                            "Kombinasi email & password Anda Salah",
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
                                                    message:
                                                      "Kombinasi email & password Anda Salah",
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
                              }
                            );
                          }

                          // console.log('Transaction completed successfully! 1');
                          // return res.status(200).send({
                          //     status: true,
                          //   message: "Kombinasi email & password Anda Salah",
                          //   data:records

                          // });
                        });
                      }
                    );
                  }
                }
              );
            }
            console.log("ini erro gak ", error);
            // if (error == fase) {
            //   connection.query(
            //     `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
            //     (err, results) => {
            //       if (err) {
            //         console.error("Error executing SELECT statement:", err);
            //         connection.rollback(() => {
            //           connection.end();
            //           return res.status(400).send({
            //             status: false,
            //             message: "Terjadi Kesalahan",
            //             data: [],
            //           });
            //         });
            //         return;
            //       }

            //       //  proses memasukan data

            //       if (results.length > 0) {
            //         return res.status(200).send({
            //           status: false,
            //           message: "ulang",
            //           data: results,
            //         });
            //       }

            //       connection.query(
            //         `INSERT INTO ${namaDatabaseDynamic}.emp_leave SET ?`,
            //         [insertData],
            //         (err, results) => {
            //           if (err) {
            //             console.error("Error executing SELECT statement:", err);
            //             connection.rollback(() => {
            //               connection.end();
            //               return res.status(400).send({
            //                 status: false,
            //                 message: "Terjadi Kesalahan",
            //                 data: [],
            //               });
            //             });
            //             return;
            //           }
            //           connection.query(
            //             `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?`,
            //             [dataInsertLog],
            //             (err, results) => {
            //               if (err) {
            //                 console.error(
            //                   "Error executing SELECT statement:",
            //                   err
            //                 );
            //                 connection.rollback(() => {
            //                   connection.end();
            //                   return res.status(400).send({
            //                     status: false,
            //                     message: "Terjadi Kesalahan",
            //                     data: [],
            //                   });
            //                 });
            //                 return;
            //               }
            //               connection.query(
            //                 `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${emId}'`,
            //                 (err, employee) => {
            //                   if (err) {
            //                     console.error(
            //                       "Error executing SELECT statement:",
            //                       err
            //                     );
            //                     connection.rollback(() => {
            //                       connection.end();
            //                       return res.status(400).send({
            //                         status: false,
            //                         message: "Terjadi Kesalahan",
            //                         data: [],
            //                       });
            //                     });
            //                     return;
            //                   }
            //                   connection.query(
            //                     `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
            //                     (err, transaksi) => {
            //                       if (err) {
            //                         console.error(
            //                           "Error executing SELECT statement:",
            //                           err
            //                         );
            //                         connection.rollback(() => {
            //                           connection.end();
            //                           return res.status(400).send({
            //                             status: false,
            //                             message: "Terjadi Kesalahan",
            //                             data: [],
            //                           });
            //                         });
            //                         return;
            //                       }

            //                       utility.insertNotifikasi(
            //                         employee[0].em_report_to,
            //                         "Approval Izin",
            //                         "Izin",
            //                         employee[0].em_id,
            //                         transaksi[0].id,
            //                         transaksi[0].nomor_ajuan,
            //                         employee[0].full_name,
            //                         namaDatabaseDynamic,
            //                         databaseMaster
            //                       );

            //                       connection.commit((err) => {
            //                         if (err) {
            //                           console.error(
            //                             "Error committing transaction:",
            //                             err
            //                           );
            //                           connection.rollback(() => {
            //                             connection.end();
            //                             return res.status(400).send({
            //                               status: false,
            //                               message:
            //                                 "Kombinasi email & password Anda Salah",
            //                               data: [],
            //                             });
            //                           });
            //                           return;
            //                         }
            //                         connection.end();
            //                         console.log(
            //                           "Transaction completed successfully! 2"
            //                         );
            //                         return res.status(200).send({
            //                           status: true,
            //                           message:
            //                             "Kombinasi email & password Anda Salah",
            //                           data: records,
            //                         });
            //                       });
            //                     }
            //                   );
            //                 }
            //               );
            //             }
            //           );
            //         }
            //       );
            //     }
            //   );
            // }
            // else{
            //   connection.rollback((rollbackErr) => {
            //     if (rollbackErr) console.error("Error during rollback:", rollbackErr);
            //     connection.end();
            //     return res.status(400).json({
            //       status: true,
            //       message: `Kamu mempunyai pengajuan ${
            //         results[0].ajuan == 1
            //           ? "Cuti"
            //           : results[0].ajuan == 2
            //           ? "Sakit"
            //           : results[0].ajuan == 3
            //           ? "Izin"
            //           : "Dinas Luar"
            //       } dengan nomor ${
            //         results[0].nomor_ajuan
            //       }  pada tanggal ${d} status ${results[0].leave_status}`,
            //       data: [],
            //     });
            //   });
            // }
          });
        });
      }
    } catch (e) {
      console.error('ERROR Izin : ',e);
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    }
  },

  async historyIzin(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;

    var dates =
      req.query.dates == undefined ? "2024-08,2024-09" : req.query.dates;

    console.log(req.query);

    var query = ``;

    var datesplits = dates.split(",");

    for (var i = 0; i < datesplits.length; i++) {
      var date = datesplits[i].split("-");
      console.log(date);
      var bulan = date[1];
      var tahun = date[0];
      var convertYear = tahun.toString().substring(2, 4);

      var finalDatabase = `${database}_hrm${convertYear}${bulan}`;

      var query = "";

      if (i == 0) {
        query = ` SELECT   a.id as idd,a.*, b.name, b.category, b.leave_day, b.status, b.cut_leave,b.input_time,b.backdate as back_date FROM ${finalDatabase}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.em_id='${emId}' AND a.ajuan IN ('2','3','4') AND a.status_transaksi='1' `;
      } else {
        query =
          query +
          `UNION ALL  SELECT   a.id as idd,a.*, b.name, b.category, b.leave_day, b.status, b.cut_leave,b.input_time,b.backdate as back_date FROM ${finalDatabase}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.em_id='${emId}' AND a.ajuan IN ('2','3','4') AND a.status_transaksi='1'  `;
      }
    }

    if (datesplits.length > 0) {
      query = query + " ORDER BY idd DESC";
    }
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction;
      const [results] = await conn.query(query);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Succsefully get history izin",
        data: results,
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

  async tipeIzin(req, res) {
    console.log("tes");
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;
    var durasi = req.body.durasi;

    var dates =
      req.query.dates == undefined ? "2024-08,2024-09" : req.query.dates;

    console.log(req.query);

    var query = ``;

    var datesplits = dates.split(",");

    // query = `SELECT * FROM leave_types WHERE submission_period<='${durasi}' AND 
    //    status IN (2,3) `;

    // query = `SELECT * FROM leave_types WHERE  
    //    status IN (2,3) `;

    query = `SELECT * FROM leave_types WHERE (submission_period<='${durasi}' OR backdate=0 ) AND  status IN (2,3) `;
    console.log(query);
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction;
      const [result] = await conn.query(query);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Succsefully get tipe izin",
        data: result,
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

          connection.query(query, (err, data) => {
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
            connection.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
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
              console.log("Transaction completed successfully!");
              return res.status(200).send({
                status: true,
                message: "Data berhasil di ambil",

                data: data,
              });
            });
          });
        });
      });
    } catch (e) {
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    }
  },
};
