const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const randomstring = require("randomstring");
const e = require("express");
// const faceApiService = require('./faceapiService');
const utility = require("../../utils/utility");

var request = require("request");

const model = require("../../utils/models");

pool.on("error", (err) => {
  console.error(err);
});

var remoteDirectory = "public_html/7H202305001";
const SftpClient = require("ssh2-sftp-client");
const sftp = new SftpClient();
const configSftp = {
  host: "imagehris.siscom.id",
  port: 3322, // Default SFTP port is 22
  username: "siscom",
  password: "siscom!@#$%",
};
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
                                  signin_addr,signout_addr,breakin_addr,breakout_addr)
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
                                  '${
                                    lokasiMasukRestResult?.[0]?.place ?? ""
                                  }','${
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
                                  '${absenMasuk}','${absenKeluar}', '${absenMasukRest}','${absenKeluarRest}')`;

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

  async absenPulangCepat(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;
    var startDate = req.query.startPeriode;
    var endDate = req.query.endPeriode;

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
      var databaseMaster = `${database}_hrm`;
      if (i == 0) {
        query = `  WITH RankedAttendance${i + 1} AS (
            SELECT *,
            (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE 
              em_id='${emId}' AND leave_status='Approve2'   AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                   ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
            FROM ${finalDatabase}.attendance WHERE em_id='${emId}'  AND signout_time != '00:00:00' AND atten_date>='${startDate}' AND atten_date<='${endDate}'  ORDER BY id DESC
          )`;
      } else {
        query = `${query},  RankedAttendance${i + 1}  AS (
            SELECT *,
            (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                   ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
                   
            FROM ${finalDatabase}.attendance WHERE em_id='${emId}' AND signout_time != '00:00:00' AND atten_date>='${startDate}' AND atten_date<='${endDate}'  ORDER BY id DESC
          )`;
      }

      // if (i==0){
      //   query=`  WITH RankedAttendance${i+1} AS (
      //     SELECT *,
      //     (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND leave_status='Approve2' AND ajuan='1'  LIMIT 1) AS cuti ,

      //     ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
      //     FROM ${finalDatabase}.attendance
      //   )`

      // }else{
      //   query= `${query},  RankedAttendance${i+1}  AS (
      //     SELECT *,
      //     (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND leave_status='Approve2' AND ajuan='1'  LIMIT 1) AS cuti ,
      //            ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num

      //     FROM ${finalDatabase}.attendance
      //   )`

      // }
    }

    for (var i = 0; i < datesplits.length; i++) {
      var date = datesplits[i].split("-");
      console.log(date);
      var bulan = date[1];
      var tahun = date[0];
      var convertYear = tahun.toString().substring(2, 4);

      var finalDatabase = `${database}_hrm${convertYear}${bulan}`;
      var databaseMaster = `${database}_hrm`;

      if (i == 0) {
        query = `${query} SELECT RankedAttendance${
          i + 1
        } .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
        FROM RankedAttendance${i + 1} 
        JOIN ${finalDatabase}.emp_shift ON RankedAttendance${
          i + 1
        } .em_id = emp_shift.em_id 
        AND emp_shift.atten_date = RankedAttendance${i + 1}.atten_date
                                 
        LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
        WHERE RankedAttendance${i + 1} .row_num = 1
        AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance${
          i + 1
        } .signout_time
        AND RankedAttendance${i + 1} .em_id = '${emId}'
   
        
        `;
      } else {
        query = `${query} UNION ALL SELECT RankedAttendance${
          i + 1
        } .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
        FROM RankedAttendance${i + 1} 
        JOIN ${finalDatabase}.emp_shift ON RankedAttendance${
          i + 1
        } .em_id = emp_shift.em_id 
                                 AND emp_shift.atten_date = RankedAttendance${
                                   i + 1
                                 }.atten_date
        LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
        WHERE RankedAttendance${i + 1} .row_num = 1
        AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance${
          i + 1
        } .signout_time
        AND RankedAttendance${i + 1} .em_id = '${emId}'
   
        
        `;
      }
    }

    var queryFinal = `SELECT * FROM (${query}) AS TBL WHERE TBL.cuti IS NULL`;
    console.log(queryFinal);
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

          connection.query(queryFinal, (err, pulangCepat) => {
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
                data: pulangCepat,
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

  async absenDatangTerlambat(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;

    var startDate = req.query.startPeriode;
    var endDate = req.query.endPeriode;

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
      var databaseMaster = `${database}_hrm`;

      if (i == 0) {
        query = `  WITH RankedAttendance${i + 1} AS (
              SELECT *,
              (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND leave_status='Approve2'   AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                     ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
              FROM ${finalDatabase}.attendance WHERE em_id='${emId}' AND atten_date>='${startDate}' AND atten_date<='${endDate}' ORDER BY id DESC
            )`;
      } else {
        query = `${query},  RankedAttendance${i + 1}  AS (
              SELECT *,
              (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                     ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
                     
              FROM ${finalDatabase}.attendance WHERE em_id='${emId}' AND atten_date>='${startDate}' AND atten_date<='${endDate}' ORDER BY id DESC
            )`;
      }
    }

    for (var i = 0; i < datesplits.length; i++) {
      var date = datesplits[i].split("-");
      console.log(date);
      var bulan = date[1];
      var tahun = date[0];
      var convertYear = tahun.toString().substring(2, 4);

      var finalDatabase = `${database}_hrm${convertYear}${bulan}`;
      var databaseMaster = `${database}_hrm`;

      if (i == 0) {
        query = `${query} SELECT RankedAttendance${
          i + 1
        } .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
          FROM RankedAttendance${i + 1} 
          JOIN ${finalDatabase}.emp_shift ON RankedAttendance${
          i + 1
        } .em_id = emp_shift.em_id 
          AND emp_shift.atten_date = RankedAttendance${
            i + 1
          }.atten_date                    
          LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
          WHERE RankedAttendance${i + 1} .row_num = 1
          AND IFNULL(work_schedule.time_in, '08:30') < RankedAttendance${
            i + 1
          } .signin_time
          AND RankedAttendance${i + 1} .em_id = '${emId}'
        
          `;
      } else {
        query = `${query} UNION ALL SELECT RankedAttendance${
          i + 1
        } .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
          FROM RankedAttendance${i + 1} 
          JOIN ${finalDatabase}.emp_shift ON RankedAttendance${
          i + 1
        } .em_id = emp_shift.em_id 
           AND emp_shift.atten_date = RankedAttendance${i + 1}.atten_date
          LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
          WHERE RankedAttendance${i + 1} .row_num = 1
          AND IFNULL(work_schedule.time_in, '08:30') < RankedAttendance${
            i + 1
          } .signin_time
          
          AND RankedAttendance${i + 1} .em_id = '${emId}'
       
          
          `;
      }
    }

    var queryFinal = `SELECT * FROM (${query}) AS TBL WHERE TBL.cuti IS NULL ORDER BY id`;
    console.log(queryFinal);
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

          connection.query(queryFinal, (err, pulangCepat) => {
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
                data: pulangCepat,
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
    //         var database=req.query.database;
    //         var emId=req.query.em_id;
    //         var dates=req.query.dates==undefined?'2024-08,2024-09':req.query.dates;

    //         console.log(req.query)

    //         var query=``

    //         var datesplits=dates.split(',')

    //         for (var i=0;i<datesplits.length;i++){

    //           var date=datesplits[i].split('-')
    //          console.log(date)
    //           var bulan=date[1];
    //           var tahun=date[0]
    //           var convertYear = tahun.toString().substring(2, 4);

    //           var finalDatabase=`${database}_hrm${convertYear}${bulan}`

    //           console.log('tes',finalDatabase)

    //          if (i==0){

    //           query=`WITH RankedAttendance AS (
    //             SELECT *,
    //                    ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
    //             FROM ${finalDatabase}.attendance
    //         )
    //         SELECT RankedAttendanc.*,work_schedule.time_in as jam_kerja
    //         FROM RankedAttendance
    //         JOIN ${finalDatabase}.emp_shift ON RankedAttendance.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance.atten_date
    //         LEFT JOIN .work_schedule ON emp_shift.work_id=work_schedule.id
    //         WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance.signin_time
    //         AND RankedAttendance.em_id='${emId}' `

    //           //  query= ` SELECT  attendance.*,work_schedule.time_in as jam_kerja FROM ${finalDatabase}.attendance   JOIN ${finalDatabase}.emp_shift
    //           //   ON emp_shift.atten_date=attendance.atten_date  AND emp_shift.em_id=attendance.em_id JOIN work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${emId}' AND work_schedule.time_in < attendance.signin_time `

    //          }else{
    // //          query=query +`UNION ALL  SELECT  attendance.*,work_schedule.time_in as jam_kerja FROM ${finalDatabase}.attendance  JOIN ${finalDatabase}.emp_shift ON emp_shift.atten_date=attendance.atten_date AND emp_shift.em_id=attendance.em_id JOIN work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${emId}' AND work_schedule.time_in < attendance.signin_time `

    //           query=query +`UNION ALL

    //           WITH RankedAttendance AS (
    //             SELECT *,
    //                    ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
    //             FROM ${finalDatabase}.attendance
    //         )
    //         SELECT RankedAttendanc.*,work_schedule.time_in as jam_kerja
    //         FROM RankedAttendance
    //         JOIN ${finalDatabase}.emp_shift ON RankedAttendance.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance.atten_date
    //         LEFT JOIN .work_schedule ON emp_shift.work_id=work_schedule.id
    //         WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance.signin_time
    //         AND RankedAttendance.em_id='${emId}'

    //           `

    //         }
    //         }
    //        // query= ` SELECT attendance.* FROM ${finalDatabase}.attendance WHERE attendance.em_id='${emId}'  `

    //         try{
    //             const connection = await model.createConnection(database);
    //               connection.connect((err) => {
    //                 if (err) {
    //                   console.error('Error connecting to the database:', err);
    //                   return;
    //                 }

    //                 connection.beginTransaction((err) => {
    //                   if (err) {
    //                     console.error('Error beginning transaction:', err);
    //                     connection.end();
    //                     return;
    //                   }

    //                         connection.query(query, (err, datangTerlambat) => {
    //                           if (err) {
    //                             console.error('Error executing SELECT statement:', err);
    //                             connection.rollback(() => {
    //                               connection.end();
    //                               return res.status(400).send({
    //                                 status: true,
    //                                 message: 'gaga ambil data',
    //                                 data:[]

    //                               });
    //                             });
    //                             return;
    //                           }
    //                         connection.commit((err) => {
    //                           if (err) {
    //                             console.error('Error committing transaction:', err);
    //                             connection.rollback(() => {
    //                               connection.end();
    //                               return res.status(400).send({
    //                                 status: true,
    //                                 message: 'Gagal ambil data',
    //                                 data:[]

    //                               });
    //                             });
    //                             return;
    //                           }
    //                           connection.end();
    //                           console.log('Transaction completed successfully!');
    //                           return res.status(200).send({
    //                             status: true,
    //                             message: 'Data berhasil di ambil',
    //                             data:datangTerlambat,

    //                           });
    //                         });

    //                       });
    //                     });
    //                   });

    //           }catch(e){
    //             return res.status(400).send({
    //               status: true,
    //               message: e,
    //               data:[]

    //             });

    //           }
  },

  async viewLastAbsen(req, res) {
    const database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;

    // g('-----view last absen 1 2----------')

    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startDate = req.body.start_date;
    var endDate = req.body.end_date;
    var startTime = req.body.start_time;
    var endTime = req.body.end_time;
    var pola = req.body.pola;

    console.log(namaDatabaseDynamic);

    console.log("body nih lastAbsen2", req.body);

    var script = "";
    let records;
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [absensi] = await conn.query(
        `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' ORDER BY id DESC`
      );
      const [sysdata] = await conn.query(
        `SELECT * FROM ${database}_hrm.sysdata WHERE kode='018'`
      );

      if (sysdata.length > 0) {
        const array1 = sysdata[0].name.split(",");

        if (
          array1[0].toString().trim() == "00:00" &&
          array1[1].toString().trim() == "00:00"
        ) {
          startTime = absensi[0]["signin_time"];
          startDate = absensi[0]["atten_date"];

          endTime = absensi[0]["signin_time"];

          var date = new Date(startDate);
          date.setDate(date.getDate() + 1);

          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1
          const day = String(date.getDate()).padStart(2, "0");

          endDate = `${year}-${month}-${day}`;
        }
      }

      var script = `SELECT places_coordinate.trx, attendance.* 
FROM  ${namaDatabaseDynamic}.attendance 
LEFT JOIN ${database}_hrm.places_coordinate 
  ON attendance.place_in = places_coordinate.place 
WHERE em_id = '${em_id}' 
  AND CONCAT(atten_date, ' ', signin_time) BETWEEN '${startDate} ${startTime}' AND '${endDate} ${endTime}'
  AND atttype = '1' 
ORDER BY id DESC 
LIMIT 1`;

      console.log("-----view last absen 1 2----------");
      const absensiNow = await conn.query(script);

      var wfh = "";
      var absenOffline = "";
      if (pola == "2" || pola == 2) {
        wfh = `SELECT emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                  AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND (ajuan='4' OR ajuan='3') AND status_transaksi='1' AND (status='Pending' OR status='Approve') ORDER BY id DESC LIMIT 1`;
      } else {
        wfh = `SELECT emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                  AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND  (ajuan='4' OR ajuan='3') AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`;
      }
      if (absensiNow.length > 0) {
        if (pola == "2" || pola == 2) {
          absenOffline = `SELECT emp_labor.atten_date,  emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan,emp_labor.sampai_jam as signout_time  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND  (CONCAT('${absensiNow[0].atten_date}', ' ', '${absensiNow[0].signin_time}') >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                      AND (CONCAT(atten_date, ' ', dari_jam) <= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' OR status='Approve' ) ORDER BY id DESC LIMIT 1`;
        } else {
          absenOffline = `SELECT emp_labor.atten_date,  emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.sampai_jam as signout_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT('${absensiNow[0].atten_date}', ' ', '${absensiNow[0].signin_time}') >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                      AND (CONCAT(atten_date, ' ', dari_jam) <= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`;
        }
      } else {
        if (pola == "2" || pola == 2) {
          absenOffline = `SELECT emp_labor.atten_date, emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan,emp_labor.sampai_jam as signout_time  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                     AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' OR status='Approve') ORDER BY id DESC LIMIT 1`;
        } else {
          absenOffline = `SELECT emp_labor.atten_date,  emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.sampai_jam as signout_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                     AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`;
        }
      }
      const [results] = await conn.query(`${script};${wfh};${absenOffline}`);
      await conn.commit();
      if (results[0].length > 0) {
        if (results[0][0].signin_time != "00:00:00") {
          if (results[0][0].signout_time != "00:00:00") {
            if (results[2].length > 0) {
              results[0] = [];
              console.log(script);
            }
          } else {
            if (results[2].length > 0) {
              var date1 = new Date(
                `${results[2][0].atten_date} ${results[2][0].signout_time}`
              );

              console.log(
                `${results[2].atten_date} ${results[2].signout_time}`
              );
              const timeDifference = Math.abs(new Date() - date1); // Use Math.abs to ensure a positive value

              // Convert the time difference to hours and minutes
              const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert to hours
              const minutes = Math.floor(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
              ); // Convert to minutes

              console.log(
                `Time difference: ${hours} hours and ${minutes} minutes`
              );
              if (hours > 24) {
                results[2] = [];
              } else {
                console.log("The date is within 24 hours from now.");
              }
            }
          }
        }
        if (results[1].length > 0) {
          return res.status(200).send({
            status: true,
            message: "Berhasil ambil data!",
            data: [],
            wfh: results[1],
            offiline: results[2],
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "Berhasil ambil data!",
            data: results[0],
            wfh: results[1],
            offiline: results[2],
          });
        }
      } else {
        return res.status(200).send({
          status: true,
          message: "Berhasil ambil data!",
          data: results[0],
          wfh: results[1],
          offiline: results[2],
        });
      }
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("error : ", e);
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async historyAttendance(req, res) {
    console.log("---------history absensi new----------------");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var em_id = req.body.em_id;

    let ms = Date.now();

    var d = new Date(ms),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = req.query.date;

    // var em_id=req.query.id
    console.log(req.body);
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;

    var startPeriode = req.body.start_periode;
    var endPeriode = req.body.end_periode;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
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
      namaDatabaseDynamic = startPeriodeDynamic;
    }
    console.log("month endd", monthEnd);
    console.log("month start  ", montStart);

    // If you want the month as a 1-based index (1 = January, 2 = February, ..., 12 = December)
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      const [sysdata] = await conn.query(
        `SELECT * FROM ${database}_hrm.sysdata WHERE KODE='013'`
      );
      console.log("data ", sysdata);

      const statusApproval =
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2";

      var query = `WITH RECURSIVE DateRange AS (
          SELECT DATE_FORMAT('${startPeriode}' ,'%Y-%m-01') AS DATE
          UNION ALL
          SELECT DATE + INTERVAL 1 DAY
          FROM DateRange
          WHERE DATE + INTERVAL 1 DAY <= LAST_DAY(DATE_FORMAT('${startPeriode}' ,'%Y-%m-01'))
      )
      SELECT
       DateRange.date,
      (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='1' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS lembur ,
      (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='2' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS tugas_luar ,
      (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND date_selected  LIKE CONCAT('%',DateRange.date,'%')  AND ajuan='1' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS cuti ,
      (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='2' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }'  LIMIT 1) AS sakit ,
      (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='3' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }'  LIMIT 1) AS izin ,
      (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND date_selected LIKE '%DateRange.date%' AND ajuan='4' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS dinas_luar ,
      (SELECT  IFNULL(off_date ,0) FROM ${namaDatabaseDynamic}.emp_shift WHERE em_id='${em_id}' AND atten_date LIKE DateRange.date) AS off_date,
      
      IFNULL((SELECT  IFNULL(work_schedule.time_in ,attendance.signin_time) FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'08:31:00')AS jam_kerja,
      IFNULL((SELECT  IFNULL(work_schedule.time_out ,attendance.signout_time) FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'17:01:00')AS jam_pulang,
      holiday.name  AS hari_libur,attendance.*
      FROM DateRange 
      LEFT JOIN ${namaDatabaseDynamic}.attendance ON attendance.atten_date=DateRange.date AND em_id='${em_id}'
      LEFT JOIN ${database}_hrm.holiday_date ON holiday_date.holiday_date=DateRange.date LEFT JOIN ${database}_hrm.holiday ON holiday.id=holiday_date.holiday_id
      WHERE DateRange.date <=CURDATE()  AND DateRange.date>='${startPeriode}'
      ORDER BY DateRange.date DESC;`;

      var query1 = `

      WITH RECURSIVE DateRange AS (
        SELECT DATE_FORMAT('${endPeriode} ','%Y-%m-01') AS DATE
        UNION ALL
        SELECT DATE + INTERVAL 1 DAY
        FROM DateRange
        WHERE DATE + INTERVAL 1 DAY <= LAST_DAY(DATE_FORMAT('${endPeriode}' ,'%Y-%m-01'))
    )
    SELECT
     DateRange.date,
    (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='1' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS lembur ,
    (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_labor WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='2' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS tugas_luar ,
    (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND date_selected  LIKE CONCAT('%',DateRange.date,'%')  AND ajuan='1' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS cuti ,
    (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='2' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS sakit ,
    (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='3' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS izin ,
    (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND date_selected LIKE '%DateRange.date%' AND ajuan='4' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS dinas_luar ,
    (SELECT  IFNULL(off_date ,0) FROM ${endPeriodeDynamic}.emp_shift WHERE em_id='${em_id}' AND atten_date LIKE DateRange.date) AS off_date,
    IFNULL((SELECT  IFNULL(work_schedule.time_in ,attendance.signin_time) FROM ${endPeriodeDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'08:31:00')AS jam_kerja,
    IFNULL((SELECT  IFNULL(work_schedule.time_out ,attendance.signout_time) FROM ${endPeriodeDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'17:00:00')AS jam_pulang,
     
    holiday.name  AS hari_libur,attendance.*
    FROM DateRange 
    LEFT JOIN ${endPeriodeDynamic}.attendance ON attendance.atten_date=DateRange.date AND em_id='${em_id}'
    LEFT JOIN ${database}_hrm.holiday_date ON holiday_date.holiday_date=DateRange.date LEFT JOIN ${database}_hrm.holiday ON holiday.id=holiday_date.holiday_id
    WHERE (DateRange.date <=CURDATE()  AND DateRange.date<='${endPeriode}')
    ORDER BY DateRange.date DESC;


      
      `;
      console.log();
      const [result] = await conn.query(query);
      let [result2] = await conn.query(query1);
      let resultFinal = [];
      resultFinal = result2;
      if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
        for (var i = 0; i < result.length; i++) {
          result2.push(result[i]);
        }
      }
      await conn.commit();

      return res.status(200).send({
        status: true,
        message: "Data berhasil diambil",
        data: result2,
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
      // if (connection) await connection.end();
    }
  },

  async kirimAbsensiOffline(req, res) {
    console.log("kirim absen offline");

    try {
      const database = req.query.database;
      const em_id = req.body.em_id;
      const attenDate = req.body.atten_date;
      const signingTime = req.body.signin_time || "00:00:00";
      const signoutTime = req.body.signout_time || "00:00:00";
      const placeIn = req.body.place_in;
      const placeOut = req.body.place_out;
      const signinLonglat = req.body.signin_longlat;
      const signOutLonglat = req.body.signout_longlat;
      const signinPict = req.body.signin_pict;
      const signoutPict = req.body.signout_pict;
      const signinNote = req.body.signin_note;
      const signoutOutNote = req.body.signout_note;
      const signinAddr = req.body.signin_addr;
      const signoutAddr = req.body.signout_addr;

      // Format tanggal
      const [tahun, bulan] = attenDate.split("-");
      const tahunConver = tahun.substring(2, 4);
      const status = "Pending";
      let nomorAjuan = "";

      // Format timestamp
      const timestampInSeconds = Math.floor(
        new Date(`${attenDate} ${signingTime || signoutTime}`).getTime() / 1000
      );

      // Generate nama file gambar
      const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
      const stringRandom = randomstring.generate(5);
      const nameFileMasuk = signinPict
        ? `absenmasuk_${stringRandom}_${timestamp}.png`
        : "";
      const nameFileKeluar = signoutPict
        ? `absenkeluar_${stringRandom}_${timestamp}.png`
        : "";

      // Upload gambar jika ada
      async function uploadImage(imageBase64, filename) {
        if (!imageBase64) return;
        const bitmap = Buffer.from(imageBase64, "base64");
        const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${filename}`;

        try {
          await sftp.connect(configSftp);
          await sftp.put(bitmap, remoteFilePath);
          console.log("Berhasil upload image:", filename);
        } catch (err) {
          console.error("Gagal upload image:", err);
          throw new Error("Gagal registrasi wajah");
        } finally {
          await sftp.end();
        }
      }

      await Promise.all([
        uploadImage(signinPict, nameFileMasuk),
        uploadImage(signoutPict, nameFileKeluar),
      ]);

      // Nama database
      const namaDatabaseDynamic = `${database}_hrm${tahunConver}${bulan}`;
      const databaseMaster = `${database}_hrm`;
      const connection = await model.createConnection1(databaseMaster);
      let conn = await connection.getConnection();

      try {
        console.log(req.body);
        await conn.beginTransaction();

        // Cek apakah data absensi sudah ada
        const [existingData] = await conn.query(
          `SELECT * FROM ${namaDatabaseDynamic}.emp_labor 
                WHERE em_id = ? AND idx = ? AND (status = 'Approve' OR status = 'Pending')`,
          [em_id, timestampInSeconds]
        );

        if (existingData.length > 0) {
          await conn.rollback();
          return res
            .status(400)
            .json({ status: false, message: "Data sudah tersedia" });
        }

        // Generate nomor ajuan
        const [latestData] = await conn.query(
          `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor 
                WHERE ajuan = '5' ORDER BY id DESC LIMIT 1`
        );

        const nextNumber =
          latestData.length > 0
            ? parseInt(latestData[0].nomor_ajuan.slice(-4)) + 1
            : 1;
        nomorAjuan = `RO20${tahunConver}${bulan}${String(nextNumber).padStart(
          4,
          "0"
        )}`;

        const [insert] = await conn.query(
          `INSERT INTO ${namaDatabaseDynamic}.emp_labor 
                (nomor_ajuan, em_id, atten_date, dari_jam, sampai_jam, tgl_ajuan, status, status_transaksi, 
                signin_note, signout_note, ajuan, em_delegation, signin_pict, signout_pict, place_in, place_out, 
                approve_status, signin_longlat, signout_longlat, signin_addr, signout_addr, uraian, idx) 
                VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, '5', '', ?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?, ?)`,
          [
            nomorAjuan,
            em_id,
            attenDate,
            signingTime,
            signoutTime,
            status,
            "1",
            signinNote,
            signoutOutNote,
            nameFileMasuk,
            nameFileKeluar,
            placeIn,
            placeOut,
            signinLonglat,
            signOutLonglat,
            signinAddr,
            signoutAddr,
            signinNote,
            timestampInSeconds,
          ]
        );

        // Kirim notifikasi ke atasan
        const [employee] = await conn.query(
          `SELECT em_report_to, em_id, full_name FROM ${databaseMaster}.employee WHERE em_id = ?`,
          [em_id]
        );

        if (employee.length > 0) {
          const delegationIds = employee[0].em_report_to
            ? Array.isArray(employee[0].em_report_to)
              ? employee[0].em_report_to
              : [employee[0].em_report_to]
            : [];

          const emIds = employee[0].em_report2_to
            ? Array.isArray(employee[0].em_report2_to)
              ? employee[0].em_report2_to
              : [employee[0].em_report2_to]
            : [];

          const combinedIds = [
            ...new Set([
              ...delegationIds.flatMap((id) =>
                id.split(",").map((i) => i.trim().toUpperCase())
              ),
              ...emIds.flatMap((id) =>
                id.split(",").map((i) => i.trim().toUpperCase())
              ),
            ]),
          ];
          utility.insertNotifikasi(
            combinedIds,
            "Approval Absensi",
            "Absensi",
            employee[0].em_id,
            insert.insertId,
            nomorAjuan,
            employee[0].full_name,
            namaDatabaseDynamic,
            databaseMaster
          );
        }

        await conn.commit();
        return res
          .status(200)
          .json({ status: true, message: "Success insert data" });
      } catch (error) {
        await conn.rollback();
        console.error("Error:", error);
        return res
          .status(400)
          .json({ status: false, message: "Gagal menyimpan data" });
      } finally {
        conn.release();
      }
    } catch (error) {
      console.error("Error utama:", error);
      return res
        .status(400)
        .json({ status: false, message: "Terjadi kesalahan server" });
    }
  },
};
