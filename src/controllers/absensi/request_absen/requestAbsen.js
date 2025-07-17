const models = require("../../../utils/models");
const utility = require("../../../utils/utility");

const ipServer = process.env.API_URL;
module.exports = {
  async employeeAttendance(req, res) {
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

    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(
        `SELECT * FROM attendance WHERE atten_date='${date}' AND em_id='${em_id}'`
      );
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "Berhasil ambil data!",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("error", e);
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async UpdateEmployeeAttendance(req, res) {
    console.log("-----Employee attemdamce  ----------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;
    var nomorAjuan = req.body.nomor_ajuan;

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
          `UPDATE emp_labor SET status_transaksi=0 WHERE em_id='${em_id}'AND nomor_ajuan='${nomorAjuan}'`,
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
    var lokasiMasukRest = req.body.lokasi_masuk_id_rest;
    var lokasiKeluarRest = req.body.lokasi_keluar_id_rest;
    var checkinRest = req.body.checkin_rest;
    var checkoutRest = req.body.checkout_rest;

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
      const connection = await models.createConnection(database);
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
          console.log(
            `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE ajuan='3' AND em_id='${em_id}' AND atten_date='${req.body.date}' AND (status='Approve' OR status='Pending')`
          );
          connection.query(
            `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE ajuan='3' AND em_id='${em_id}' AND atten_date='${req.body.date}' AND (status='Approve' OR status='Pending') AND status_transaksi = '1'`,
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

                      connection.query(
                        `SELECT * FROM ${databaseMaster}.places_coordinate WHERE id='${lokasiKeluarRest}' `,
                        (err, lokasiKeluarRestResult) => {
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
                            `SELECT * FROM ${databaseMaster}.places_coordinate WHERE id='${lokasiMasukRest}' `,
                            (err, lokasiMasukRestResult) => {
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

                              for (let i = 0; i < results.length; i++) {
                                const item = results[i];
                                const checks = [
                                  { key: "dari_jam", value: checkin + ":00" },
                                  {
                                    key: "sampai_jam",
                                    value: checkout + ":00",
                                  },
                                  {
                                    key: "breakin_time",
                                    value: checkinRest + ":00",
                                  },
                                  {
                                    key: "breakout_time",
                                    value: checkoutRest + ":00",
                                  },
                                ];

                                for (const check of checks) {
                                  if (
                                    item[check.key] !== "00:00:00" &&
                                    item[check.key] === check.value
                                  ) {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message:
                                        "Anda sudah memiliki pengajuan di tanggal dan jam yang sama",
                                      data: item,
                                    });
                                  }
                                }
                              }
                              console.log(
                                "Loop selesai, lanjut ke kode berikutnya!"
                              );

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
                                    var nomorStr = String(nomor).padStart(
                                      4,
                                      "0"
                                    );
                                    nomorAjuan =
                                      `RQ20${convertYear}${convertBulan}` +
                                      nomorStr;
                                  } else {
                                    nomor = 1;
                                    var nomorStr = String(nomor).padStart(
                                      4,
                                      "0"
                                    );
                                    nomorAjuan =
                                      `RQ20${convertYear}${convertBulan}` +
                                      nomorStr;
                                  }
                                  var queryInsert = "";
                                  var absenMasuk = req.body.address_masuk;
                                  console.log(absenMasuk);
                                  var absenMasukRest =
                                    req.body.address_masuk_Rest;
                                  var absenKeluarRest =
                                    req.body.address_keluar_Rest;
                                  var absenKeluar = req.body.address_keluar;
                                  var idAbsen = req.body.id_absen;
                                  queryInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_labor (
                                nomor_ajuan,em_id,atten_date,
                                dari_jam,sampai_jam,tgl_ajuan,
                                status,status_transaksi,uraian,
                                ajuan,em_delegation,req_file,
                                place_in,place_out,approve_status,
                                signin_note,signin_pict,signin_longlat,
                                signout_note,signout_pict,signout_longlat,
                                place_break_in,place_break_out,breakin_time,
                                breakout_time,breakin_note,breakout_note,
                                breakin_longlat, breakout_longlat,
                                signin_addr,signout_addr,breakin_addr,breakout_addr,id_absen)
                                VALUES (
                                '${nomorAjuan}','${em_id}','${date}',
                                '${checkin}','${checkout}',CURDATE(),
                                '${status}','1','${catatan}',
                                '3','','${nameFile}',
                                '${lokasiMasukResult?.[0]?.place ?? ""}','${
                                    lokasiKeluarResult?.[0]?.place ?? ""
                                  }','Pending',
                                '${catatan}','${nameFile}','${
                                    lokasiMasukResult?.[0]?.place_longlat ?? ""
                                  }',
                                '${catatan}','${nameFile}','${
                                    lokasiKeluarResult?.[0]?.place_longlat ?? ""
                                  }',
                                '${lokasiMasukRestResult?.[0]?.place ?? ""}','${
                                    lokasiKeluarRestResult?.[0]?.place ?? ""
                                  }','${checkinRest}',
                                '${checkoutRest}','${catatan}','${catatan}',
                                '${
                                  lokasiMasukRestResult?.[0]?.place_longlat ??
                                  ""
                                }','${
                                    lokasiKeluarRestResult?.[0]
                                      ?.place_longlat ?? ""
                                  }',
                                '${absenMasuk}','${absenKeluar}', '${absenMasukRest}','${absenKeluarRest}','${idAbsen}')`;

                                  connection.query(
                                    queryInsert,
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
                                                    message:
                                                      "Data gagal terkirim",
                                                    data: results,
                                                  });
                                                });
                                                return;
                                              }
                                              const delegationIds = employee[0]
                                                .em_report_to
                                                ? Array.isArray(
                                                    employee[0].em_report_to
                                                  )
                                                  ? employee[0].em_report_to
                                                  : [employee[0].em_report_to]
                                                : [];

                                              const emIds = employee[0]
                                                .em_report2_to
                                                ? Array.isArray(
                                                    employee[0].em_report2_to
                                                  )
                                                  ? employee[0].em_report2_to
                                                  : [employee[0].em_report2_to]
                                                : [];

                                              const combinedIds = [
                                                ...new Set([
                                                  ...delegationIds.flatMap(
                                                    (id) =>
                                                      id
                                                        .split(",")
                                                        .map((i) =>
                                                          i.trim().toUpperCase()
                                                        )
                                                  ),
                                                  ...emIds.flatMap((id) =>
                                                    id
                                                      .split(",")
                                                      .map((i) =>
                                                        i.trim().toUpperCase()
                                                      )
                                                  ),
                                                ]),
                                              ];
                                              utility.insertNotifikasi(
                                                combinedIds,
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
                                                    return res
                                                      .status(400)
                                                      .send({
                                                        status: true,
                                                        message:
                                                          "Data gagal terkirim",
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
                                                    "data berhasil terkirm",
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

  async getEmployeeAttendance(req, res) {
    console.log("get employ attt");
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
    var query = `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan IN ('3', '5') AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query = `SELECT emp_labor.id as idd,  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM ${startPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 
         UNION ALL
         SELECT emp_labor.id as idd,  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM ${endPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1
         
         ORDER BY idd DESC
         `;
    }

    // var query= `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`

    const connection = await models.createConnection1(namaDatabaseDynamic);

    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(query);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Data berhasil diambil",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error:", e.message);
      return res.status(500).send({
        status: false,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) conn.release();
      // if (connection) connection.end();
    }
  },
};
