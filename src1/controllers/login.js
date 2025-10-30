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
  async loginUser(req, res) {
    var database = req.body.database;
    var email = req.query.email;
    let records;
    var password = sha1(req.body.password);
    var token_notif = req.body.token_notif;

    console.log("token notif", token_notif, email);

    console.log(req.body);
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      var query = `SELECT
                  branch.id as branch_id,
                  a.em_tracking AS is_tracking,
                  file_face,
                  (SELECT name FROM sysdata WHERE id='006') AS interval_tracking,
                  (SELECT name FROM sysdata WHERE kode='012') AS is_view_tracking,
                  (SELECT name FROM sysdata WHERE kode='043') AS toleransi_pengembalian,
                  (SELECT name FROM sysdata WHERE kode='021') AS back_date,
                  IFNULL(MAX(employee_history.end_date) ,'') AS tanggal_berakhir_kontrak,
                    (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,(SELECT name FROM sysdata WHERE id='18') as time_attendance,
                  (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll, branch.name AS branch_name, a.em_id, full_name, em_email, des_id, dep_id, dep_group_id AS dep_group, em_mobile AS em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title AS posisi, em_hak_akses, last_login, a.status AS status_aktif,
                   em_control, em_controlaccess AS em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working AS emp_att_working 
                   FROM employee a 
                   LEFT JOIN designation b ON a.des_id=b.id
                    LEFT JOIN department c ON a.dep_id=c.id 
                    LEFT  JOIN branch ON branch.id=a.branch_id 
                    LEFT JOIN employee_history ON a.em_id=employee_history.em_id
                    where em_email='${req.body.email}' AND em_password='${password}'`;
      console.log(query);
      const [results] = await conn.query(query);
      const [dataPerusahaan] =
        await conn.query(`SELECT * FROM peraturan_perusahaan WHERE  status_transaksi='1' AND tipe='utama' AND status='1'  
                  AND (   branch_id LIKE '%${results[0].branch_id
                    .toString()
                    .padStart(2, "0")}%'  OR    branch_id LIKE '%${
          results[0].branch_id
        }%' )
               ORDER BY id DESC LIMIT 1`);
      if (dataPerusahaan.length === 0) {
        const [results] = await conn.query(
          `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${req.body.email}'`
        );
      } else {
        var queryPeraturanLogin = `SELECT * FROM peraturan_perusahaan_employee WHERE  em_id='${results[0].em_id}' AND peraturan_perusahaan_id='${dataPerusahaan[0].id}' ORDER BY id DESC LIMIT 1`;
        console.log(queryPeraturanLogin);
        const [data] = await conn.query(queryPeraturanLogin);
        if (data.length == 0) {
          var dataInsert = {
            peraturan_perusahaan_id: dataPerusahaan[0].id,
            em_id: results[0].em_id,
          };
          var queryInsert = `INSERT INTO peraturan_perusahaan_employee  SET ?`;
          const [insert] = await conn.query(queryInsert, [dataInsert]);
          const [update] = await conn.query(
            `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${req.body.email}'`
          );
        } else {
          const [update] = await conn.query(
            `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${req.body.email}'`
          );
        }
      }
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update",
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
    //         var updateToken = UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${email}';
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
  async cekNoHp(req, res) {
    console.log("cek no hp");
    var database = req.query.database;
    var email = req.query.email;

    let records;
    console.log(req.body);
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      var query = `SELECT em_mobile,full_name,em_email FROM employee where em_email='${req.query.email}'`;
      console.log(query);
      const [result] = await conn.query(query);
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update",
        data: result,
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

  edit_foto_user(req, res) {
    const SftpClient = require("ssh2-sftp-client");

    const config = {
      host: "Kantor.siscom.id",
      port: 22, // Default SFTP port is 22
      username: "siscom",
      password: "siscom!@#$%",
    };

    const localFilePath = "public/face_recog/regis_SIS202210039.png";
    const remoteFilePath =
      "public_html/6H202305001/foto_profile/regis_SIS202210039.png";

    const sftp = new SftpClient();

    sftp
      .connect(config)
      .then(() => {
        // SFTP connection successful
        return sftp.put(localFilePath, remoteFilePath);
      })
      .then(() => {
        console.log("File uploaded successfully!");
        sftp.end(); // Disconnect after the upload is complete
      })
      .catch((err) => {
        console.error("Error:", err);
        sftp.end(); // Disconnect if an error occurs
      });
    sftp.end();
  },

  async database(req, res) {
    var database = req.body.database;
    var email = req.query.email;
    var periode = req.body.periode;

    console.log("masuk sini");

    console;

    let records;
    const connection = await model.createConnection1("sis_admin");
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      var query = `SELECT DISTINCT co.dbname,ess.email,CONCAT(c.name,' (',co.dbname,')') as name FROM cust_order co  JOIN company c ON c.id=co.company_id  JOIN ess ON ess.dbname=co.dbname WHERE ess.email='${email}' AND ess.aktif='Y'`;
      console.log(query);
      const [result] = await conn.query(query);
      await conn.commit();
      if (result.length == 0) {
        return res.status(400).send({
          status: false,
          message: "User Ess tidak tersedia",
          data: [],
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "berhasil update",
          data: result,
        });
      }

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
  async updateVersion(req, res) {
    let records;
    const connection = await model.createConnection1("sis_admin");
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [result] = await conn.query(
        `SELECT * FROM mobile_versions WHERE apk = 'sisrajj'`
      );
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update",
        data: result,
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

  async updateVersionLast(req, res) {
    let records;
    const connection = await model.createConnection1("sis_admin");
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [result] = await conn.query(
        `SELECT * FROM mobile_versions WHERE apk = 'sisrajj' ORDER BY id DESC LIMIT 1`
      );
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update",
        data: result[0],
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

  async editLastLogin(req, res) {
    var database = req.body.database;

    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    console.log(req.body);
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [result] = await conn.query(
        `UPDATE employee SET last_login='${last_login}' WHERE em_id='${em_id}'`
      );
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update",
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

  async deleteFoto(req, res) {
    console.log("hhapus foro");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    console.log(req.body);

    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [result] = await conn.query(
        `UPDATE employee SET em_image=NULL WHERE em_id='${em_id}'`
      );
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update foto",
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
  async isAuth(req, res, next) {
    console.log("---------Cek valid token----------------");

    var database = req.query.database;
    const token = req.headers.token;
    const emId = req.headers.em_id;
    console.log(`---------Token --------------- ${token}`);
    console.log(`-----em id---------- ${database}`);

    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(
        `SELECT * FROM employee WHERE em_id='${emId}' and token_notif='${token}'`
      );
      if (results.length == 0) {
        console.log("token tidak valied");
        await conn.commit();
        return res.status(401).json({
          status: false,
          message: "Authorization failed",
        });
      }
      next();
      await conn.commit();
      console.log("Transaction completed successfully!");
      return res.status(200).send({
        status: true,
        message: "berhasil update",
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
};

// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`
