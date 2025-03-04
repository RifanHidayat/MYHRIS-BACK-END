const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const e = require("express");
const nodemailer = require("nodemailer");
// const faceApiService = require('./faceapiService');

var request = require("request");

const model = require("../utils/models");

pool.on("error", (err) => {
  console.error(err);
});

const transporter = nodemailer.createTransport({
  // service: 'gmail'
  host: "siscomonline.co.id",
  port: 465,

  secure: true, // use SSL
  auth: {
    user: "no-reply@siscomonline.co.id",
    pass: "siscomnoplayoke515",
  },
});

module.exports = {
  async menu(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;

    let records;

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
            `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='100110112'`,
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
              records = results;
              if (records.length == 0) {
                return res.status(400).send({
                  status: true,
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
                  data: records,
                });
              });
            }
          );
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

  async workSchedule(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.body.em_id;
    var date = req.body.date.split("-");

    const tahun = `${date[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (date[1].length == 1) {
      convertBulan = date[1] <= 9 ? `0${date[1]}` : date[1];
    } else {
      convertBulan = date[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    let records;
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

          var query = `SELECT work_schedule.time_in,work_schedule.time_out FROM ${namaDatabaseDynamic}.emp_shift JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id AND atten_date='${date}' AND em_id='${emId}'`;

          connection.query(query, (err, results) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "gaga ambil data",
                  data: [],
                });
              });
              return;
            }
            console.log(query);
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

                    data: [],
                  });
                });
                return;
              }
              connection.end();
              console.log("Transaction completed successfully!");
              return res.status(200).send({
                status: true,

                data: records[0],
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

  async kirimEmail(req, res) {
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;

    let records;

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
            `SELECT * FROM employee where em_email='${req.query.email}'`,
            (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: "gaga ambil data" + err,
                    data: results,
                  });
                });
                return;
              }
              records = results;
              if (records.length == 0) {
                return res.status(400).send({
                  status: true,
                  message: "Data email tidak tersedia",
                  data: [],
                });
              }

              const mailOptions = {
                from: "no-reply@siscomonline.co.id",
                to: req.query.email,
                subject: "Verifikasi email HRIS SISCOM",
                text:
                  "Demi meningkatkan keamanan akun HRIS-mu, kami mengirimkan Kode OTP dibawah ini. \n\n Mohon untuk tidak memberitahukan Kode ini kepada orang lain:\n\n " +
                  req.query.kode,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email:", error);
                } else {
                  //             connection.query(`UPDATE employee SET kode_verifikasi_email='${req.body.kode}' WHERE ='${req.query.email}'`, (err, results) => {
                  //                 if (err) {
                  //                   console.error('Error executing SELECT statement:', err);
                  //                   connection.rollback(() => {
                  //                     connection.end();
                  //                     return res.status(400).send({
                  //                       status: true,
                  //                       message: 'gagal update data',
                  //                     });
                  //                   });
                  //                   return;
                  //                 }
                  // });
                }
              });
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: "Gagal ambil data" + err + "data",
                      data: [],
                    });
                  });
                  return;
                }
                connection.end();
                console.log("Transaction completed successfully!");
                return res.status(200).send({
                  status: true,
                  message: "Silagkan cek email anda",
                  data: records,
                });
              });
            }
          );
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

  async editLastLogin(req, res) {
    var database = req.body.database;

    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
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
          connection.query(
            `UPDATE employee SET last_login='${last_login}' WHERE em_id='${em_id}'`,
            (err) => {
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
};
