const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const e = require("express");
const nodemailer = require("nodemailer");
// const faceApiService = require('./faceapiService');

var request = require("request");

const model = require("../../utils/models");
require("dotenv").config();

var ipServer = process.env.API_URL;

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
    console.log("--------------load menu--------------");
    var database = req.query.database;
    var email = req.query.email;
    var periode = req.body.periode;
    var emId = req.query.em_id;
    let connection;
    try {
      connection = await model.createConnection1(`${database}_hrm`);
      await connection.getConnection();
      await connection.beginTransaction();

      const query = `
            SELECT * FROM menu_dashboard_user 
            JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  
            WHERE menu_dashboard_user.em_id = ?
        `;

      const [records] = await connection.query(query, [emId]);
      if (records.length === 0) {
        return res.status(404).send({
          status: false,
          message: "Data tidak ditemukan",
          data: [],
        });
      }

      await connection.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "Data berhasil diambil",
        data: records,
      });
    } catch (e) {
      console.error("Error occurred:", e);

      if (connection) {
        await connection.rollback();
      }
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    } finally {
      if (connection) {
        connection.release();
      }
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

    let connection;
    try {
      console.log("---------------work schedule---------------");
      connection = await (
        await model.createConnection1(namaDatabaseDynamic)
      ).getConnection();
      await connection.beginTransaction();

      var query = `SELECT work_schedule.time_in,work_schedule.time_out FROM ${namaDatabaseDynamic}.emp_shift JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id AND atten_date='${date}' AND em_id='${emId}'`;
      console.log(query);
      const [records] = await connection.query(query);

      if (records.length === 0) {
        await connection.commit();
        return res.status(400).send({
          status: false,
          message: "Data tidak ditemukan",
          data: [],
        });
      } else {
        const { time_in, time_out } = records[0];

        console.log("Transaction work schedule completed successfully!");
        
        return res.status(200).send({
          status: true,
          message: "Data berhasil diambil",
          data: {
            time_in,
            time_out,
          },
        });
      }
    } catch (e) {
      console.error("error get workschedule", e);
      if (connection) {
        await connection.rollback();
      }
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    } finally {
      if (connection) await connection.release;
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
    } catch (e) {
      console.error("Error occurred:", e);
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    }
  },

  async getMenuDashboard(req, res) {
    console.log("-----get menu dashboard----------");

    const database = req.query.database;
    const dbmaster = `${database}_hrm`;

    const connection = await model.createConnection1(dbmaster);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [modul] = await conn.query(`SELECT * FROM modul WHERE status = ?`, [
        1,
      ]);

      if (!modul.length) {
        return res.status(404).send({
          status: false,
          message: "Modul tidak ditemukan",
          data: [],
        });
      }

      const [menu] = await conn.query(`SELECT * FROM menu`);

      let finalData = modul.map((mod, index) => {
        let menuConvert = menu
          .filter((m) => m.id_modul === mod.id_modul)
          .map((m) => ({
            id_menu: m.id_menu,
            nama_menu: m.nama_menu,
            gambar: m.gambar,
            url: m.url,
          }));

        return {
          index,
          nama_modul: mod.nama_modul,
          status: false,
          menu: menuConvert,
        };
      });
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Berhasil ambil data!",
        data: finalData,
      });
    } catch (error) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error getMenuDashboard:", error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan saat mengambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async showMenuDashboard(req, res) {
    console.log("-----show menu dashboard----------");
    const database = req.query.database;
    const emId = req.query.em_id;
    const dbmaster = `${database}_hrm`;

    const connection = await model.createConnection1(dbmaster);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      const query = `
          SELECT * FROM menu_dashboard_user 
          JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  
          WHERE menu_dashboard_user.em_id = ? AND menu_dashboard.default = '1'
      `;

      const [menuResults] = await conn.query(query, [emId]);

      let results = menuResults;

      // Jika data menu_dashboard_user tidak ditemukan, ambil default menu_dashboard
      if (results.length === 0) {
        const defaultQuery = "SELECT * FROM menu_dashboard WHERE `default` = 1";
        const [defaultResults] = await conn.query(defaultQuery);
        results = defaultResults;
      }

      // Modul statis
      const modulStatic = [
        { status: 0, nama_modul: "Menu Utama" },
        { status: 1, nama_modul: "Payroll" },
      ];

      // Mapping data menu dengan modul statis
      const finalData = modulStatic.map((modul, index) => {
        const menuConvert = results
          .filter((menu) => menu.status === modul.status)
          .map((menu) => ({
            id: menu.id,
            nama: menu.nama,
            url: menu.url,
            gambar: menu.gambar,
          }));

        return {
          index,
          nama_modul: modul.nama_modul,
          status: false,
          menu: menuConvert,
        };
      });

      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Berhasil ambil data!",
        data: finalData,
      });
    } catch (error) {
      console.error("Error showMenuDashboard:", error);
      if (conn) {
        await conn.rollback();
      }
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan saat mengambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async showMenuDashboardUtama(req, res) {
    console.log("-----show menu dashboard----------");
    const database = req.query.database;
    const emId = req.query.em_id;
    const dbmaster = `${database}_hrm`;

    const connection = await model.createConnection1(dbmaster);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [userMenuResults] = await conn.query(
        `SELECT * FROM menu_dashboard_utama_user 
             JOIN menu_dashboard_utama 
             ON menu_dashboard_utama.id = menu_dashboard_utama_user.menu_id 
             WHERE menu_dashboard_utama_user.em_id = ?`,
        [emId]
      );

      // Jika data ditemukan, kirimkan hasilnya
      if (userMenuResults.length > 0) {
        return res.status(200).send({
          status: true,
          message: "Berhasil ambil data!",
          data: userMenuResults,
        });
      }

      // Jika data tidak ditemukan, ambil default data dari menu_dashboard_utama
      const [defaultMenuResults] = await conn.query(
        `SELECT * FROM menu_dashboard_utama`
      );
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Berhasil ambil data!",
        data: defaultMenuResults,
      });
    } catch (error) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error showMenuDashboardUtama:", error);
      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan saat mengambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },
};
