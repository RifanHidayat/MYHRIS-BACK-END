const jwt = require("jsonwebtoken");

const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const e = require("express");
const utility = require("./../utils/utility");
var request = require("request");

const model = require("../utils/models");
const models = require("../utils/models");

require("dotenv").config();

var ipServer = process.env.API_URL;
var myDatabse = process.env.MY_DATABASE;
module.exports = {
  async isAuth(req, res, next) {
    console.log("---------Cek valid token----------------");
    var database = req.query.database;
    const token = req.headers.token;
    const emId = req.headers.em_id;
    console.log(`---------Token --------------- ${token}`);
    console.log(`-----em id---------- ${database}`);
    const connecting = await models.createConnection1(`${database}_hrm`);
    let conn;
    try {
      if (token == undefined) {
        console.log("tidak ada prosees apapun");
  
        return next();
      } else {
        console.log("ceksession");
        
        conn = await connecting.getConnection();
        await conn.beginTransaction();
        var query = `    SELECT
  
                 a.tipe_absen,
                 a.dep_id,
                 IFNULL(MAX(employee_history.end_date) ,'')AS tanggal_berakhir_kontrak,
                 IFNULL(DATEDIFF(MAX(employee_history.end_date), CURDATE()),'0') AS sisa_kontrak,
                 IFNULL(DATEDIFF(CURDATE(),a.em_joining_date),'0') AS lama_bekerja,
                 em_bpjs_kesehatan AS nomor_bpjs_kesehatan,em_bpjs_tenagakerja AS nomor_bpjs_tenagakerja,
                 (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,
                 (SELECT NAME FROM sysdata WHERE id='18') AS time_attendance,
                 (SELECT NAME FROM sysdata WHERE kode='012') AS is_view_tracking,
                 (SELECT NAME FROM sysdata WHERE id='006') AS interval_tracking,
                 (SELECT NAME FROM sysdata WHERE kode='021') AS back_date,
                 (SELECT NAME FROM sysdata WHERE kode='001') AS periode_awal,
                 a.em_tracking  AS is_tracking,
                 a.file_face,
                 (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll,
                 em_control, em_controlaccess AS em_control_access,
                 branch.name AS branch_name, a.em_id, full_name, em_email, des_id, dep_id, dep_group_id AS dep_group, em_mobile AS em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title AS posisi, em_hak_akses, last_login, a.status AS status_aktif, em_controlaccess AS em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working AS emp_att_working FROM employee a 
                 LEFT JOIN employee_history ON a.em_id=employee_history.em_id LEFT JOIN designation b ON a.des_id=b.id LEFT JOIN
                 department c ON a.dep_id=c.id LEFT JOIN branch ON branch.id=a.branch_id WHERE a.em_id='${emId}' AND a.token_notif='${token}'
                  GROUP BY a.em_id`;
        const [results] = await conn.query(query);

        await conn.commit();
  
        if (results.length == 0) {
          return res.status(402).json({
            status: false,
            message:
              "Seseorang masuk  menggunakan akun anda menyebabkan akun anda keluar secara otomatis",
          });
        }
  
        if (results[0].status == "INACTIVE") {
          console.log("token tidak valied");
          return res.status(402).json({
            status: false,
            message: "Akun anda sudah tidak aktif",
          });
        }
        next();
      }
    } catch (e) {
      if (conn) {
      await conn.rollback();
      }
      console.error('Eroor', e);
      return res
        .status(500)
        .json({ status: false, message: "Internal Server Error" });
    } finally {
      if (conn) await conn.release();
    }
    
  },
  isAuthorized: (req, res, next) => {
    if (req.user.role == "admin") {
      next();
    } else {
      res.status(401).json({
        message: "User Not Authorized",
      });
    }
  },
};
