const config = require("./../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require("sha1");
const e = require("express");
const utility = require("./../../utils/utility");
// const faceApiService = require('./faceapiService');

var request = require("request");

const model = require("../../utils/models");
const { emit } = require("nodemon");

pool.on("error", (err) => {
  console.error(err);
});
require("dotenv").config();

var ipServer = process.env.API_URL;

module.exports = {
  async store(req, res) {

    console.log('data fina; ',req.body)
    function isDateInRange(date, startDate, endDate) {
      return date >= startDate && date <= endDate;
    }
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1
      .substring(convert1.lastIndexOf("-") + 1)
      .replace("?database=" + req.query.database, "");

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;
    var bodyValue = req.body;
    var branchId = req.headers.branch_id==''?"1":req.headers.branch_id;
    var tasks = req.body.tasks;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    delete bodyValue.tasks;
    var isError=false;

    bodyValue.branch_id = branchId;

    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    var dateNow = `${year}-${month
      .toString()
      .padStart(2, "0")}-${date} ${hours}:${minutes}:${seconds}`;
    bodyValue.tgl_ajuan = utility.dateNow4();
    bodyValue.created_on = dateNow;

    // bodyValue.is_mobile="1"

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    console.log

    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;

    const databaseMaster = `${database}_hrm`;
    var nomorLb = `LB20${convertYear}${convertBulan}`;
    var transaksion = "";
    const connection = await model.createConnection1(databaseMaster);
    let conn;
    try {
      console.log("--------begin transaksi-----------");
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [data] = await conn.query(
        `SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                WHERE em_id='${req.body.em_id}' 
                AND (date_selected LIKE '%${req.body.atten_date}%')  
                AND  status_transaksi=1 
                 AND leave_status IN ('Pending','Approve','Approve2')`
      );
      for (var i = 0; i < data.length; i++) {
        if (data.length > 0) {
          if (data[0].leave_type == "HALFDAY") {
            var timeParam1 = new Date(
              `${req.body.atten_date}T${req.body.dari_jam}`
            );
            var timeParam2 = new Date(
              `${req.body.atten_date}T${req.body.sampai_jam}`
            );
            /// jika suda ada data
            var time1 = new Date(`${data[i].atten_date}T${data[i].time_plan}`);
            var time2 = new Date(
              `${data[i].atten_date}T${data[i].time_plan_to}`
            );
            if (time1 > time2) {
              time2.setDate(time2.getDate() + 1);
            }

            if (timeParam1 > timeParam2) {
              timeParam2.setDate(time2.getDate() + 1);
            }

            transaksion = "Izin";

            if (isDateInRange(timeParam1, time1, time2)) {
             
              await conn.commit();
              return res.status(400).send({
                status: false,
                message: `Kamu telah melakaukan pengajuan ${transaksion} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
              });
            }
          } else if (
            req.body.leave_type == "FULLDAY" ||
            req.body.leave_type == "FULL DAY"
          ) {
            if (data[i].ajuan == "1" || data[i].ajuan == 1) {
              isError=true;
              await conn.commit();
              return res.status(400).send({
                status: false,
                message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
              });
            }

            if (data[i].ajuan == "2" || data[i].ajuan == 2) {
              isError=true;
              await conn.commit();
              return res.status(400).send({
                status: false,
                message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
              });
            }
          }
        }
      }
      console.log("inin lolos gak");
      const [cekLembur] = await conn.query(
        `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.atten_date}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2')`
      );
      for (var i = 0; i < cekLembur.length; i++) {
        if (cekLembur.length > 0) {
          var timeParam1 = new Date(
            `${req.body.atten_date}T${req.body.dari_jam}`
          );
          var timeParam2 = new Date(
            `${req.body.atten_date}T${req.body.sampai_jam}`
          );

          /// jika suda ada data
          var time1 = new Date(
            `${cekLembur[i].atten_date}T${cekLembur[i].dari_jam}`
          );
          var time2 = new Date(
            `${cekLembur[i].atten_date}T${cekLembur[i].sampai_jam}`
          );

          if (time1 > time2) {
            time2.setDate(time2.getDate() + 1); 
          }

          if (timeParam1 > timeParam2) {
            timeParam2.setDate(time2.getDate() + 1);
          }

          if (cekLembur[i].ajuan == "2") {
            transaksion = "Tugas Luar";
          }

          if (cekLembur[i].ajuan == "1") {
            transaksion = "Lembur";
          }

          if (isDateInRange(timeParam1, time1, time2)) {
            isError=true;
            await conn.commit();
            return res.status(400).send({
              status: false,
              message: `Kamu telah melakukan pengajuan ${transaksion} pada tanggal ${time1} s.d. ${time2} dengan status ${cekLembur[0].status}`,
              data: [],
            });
          } else {
            if (isDateInRange(timeParam2, time1, time2)) {
              isError=true;
              await conn.commit();
              return res.status(400).send({
                status: false,
                message: `Kamu telah melakukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${cekLembur[0].status}`,
                data: [],
              });
            }
          }
        }
      }

      if (isError==true){
        return



        

      }
      const [cekNoAjuan] = await conn.query(
        `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' ORDER BY id DESC LIMIT 1`
      );
      if (cekNoAjuan.length > 0) {
        var text = cekNoAjuan[0]["nomor_ajuan"];
        var nomor = parseInt(text.substring(8, 13)) + 1;
        var nomorStr = String(nomor).padStart(4, "0");
        nomorLb = nomorLb + nomorStr;
      } else {
        var nomor = 1;
        var nomorStr = String(nomor).padStart(4, "0");
        nomorLb = nomorLb + nomorStr;
      }
      bodyValue.nomor_ajuan = nomorLb;
    
      await conn.query(script, [bodyValue]);  
      // console.log('ini result ', results[0]);
      const [cekDinilai] = await conn.query(
        `SELECT dinilai FROM overtime where id = '${bodyValue.typeid}'`
      );

      console.log("ini cek nilai ", cekDinilai);
      const [updateEmpLabor] = await conn.query(
        `UPDATE ${database}_hrm.overtime SET pakai='Y' WHERE id='${bodyValue.typeid}' `,
        [bodyValue]
      );
      const [transaksi] = await conn.query(
        `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan ='${bodyValue.nomor_ajuan}'`
      );
      const [sysData] = await conn.query(
        "SELECT name FROM sysdata WHERE KODE IN (024)"
      );
      const [user] = await conn.query(
        `SELECT * FROM  ${databaseMaster}.employee WHERE em_id='${bodyValue.em_id}'`
      );
      bodyValue.branch_id = user[0].branch_id;
      console.log('tasks ',tasks);
      for (var i = 0; i < tasks.length; i++) {
        let task = tasks[i]["task"];
        let level = tasks[i]["level"];
        const [insertTask] = await conn.query(
          `INSERT INTO ${namaDatabaseDynamic}.emp_labor_task (task,persentase,emp_labor_id,level) VALUES('${task}','0','${transaksi[0].id}',${level})`
        );
      }

      console.log("kesni gak sih");

      if (cekDinilai.length > 0 && cekDinilai[0].dinilai === "Y") {
        console.log("ini delegation", bodyValue.em_delegation);
        console.log("ini ids", bodyValue.em_ids);
        const delegationIds = bodyValue.em_delegation
          ? Array.isArray(bodyValue.em_delegation)
            ? bodyValue.em_delegation
            : [bodyValue.em_delegation]
          : [];

        const emIds = bodyValue.em_ids
          ? Array.isArray(bodyValue.em_ids)
            ? bodyValue.em_ids
            : [bodyValue.em_ids]
          : [];

          const combinedIds = [...new Set([
            ...delegationIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase())),
            ...emIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase()))
          ])];

        utility.insertNotifikasi(
          combinedIds,
          "Approval Lembur",
          "Lembur",
          user[0].em_id,
          transaksi[0].id,
          transaksi[0].nomor_ajuan,
          user[0].full_name,
          namaDatabaseDynamic,
          databaseMaster
        );
      } else {
        const delegationIds = user[0].em_report_to
          ? Array.isArray(user[0].em_report_to)
            ? user[0].em_report_to
            : [user[0].em_report_to]
          : [];

        const emIds = user[0].em_report2_to
          ? Array.isArray(user[0].em_report2_to)
            ? user[0].em_report2_to
            : [user[0].em_report2_to]
          : [];

          
          const combinedIds = [...new Set([
            ...delegationIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase())),
            ...emIds.flatMap(id => id.split(',').map(i => i.trim().toUpperCase()))
          ])];
        console.log('ini combinasi id', combinedIds);
        utility.insertNotifikasi(
          combinedIds,
          "Approval Lembur",
          "Lembur",
          user[0].em_id,
          transaksi[0].id,
          transaksi[0].nomor_ajuan,
          user[0].full_name,
          namaDatabaseDynamic,
          databaseMaster
        );
      }

      if (sysData[0].name == "" || sysData[0].name == null) {
      } else {
        var listData = sysData[0].name.toString().split(",");
        utility.insertNotifikasi(
          listData,
          "Pengajuan Lembur",
          "Lembur",
          user[0].em_id,
          null,
          transaksi[0].nomor_ajuan,
          user[0].full_name,
          namaDatabaseDynamic,
          databaseMaster
        );
      }
      console.log("ini gak yah");
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Successfuly insert data",
      });
    } catch (e) {
      console.error("error", e);
      if (conn) {
        await conn.rollback();
      }
      return res.status(400).send({
        status: false,
        message: "Gagal bikin pengajuan lembur",
        pesan: e
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async insertDraft(req, res) {
    const database = req.query.database;
    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    var bodyValue = req.body;
    var branchId = req.headers.branch_id;
    var tasks = req.body.tasks;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    delete bodyValue.tasks;

    var dateNow = `${year}-${month
      .toString()
      .padStart(2, "0")}-${date} ${hours}:${minutes}:${seconds}`;
    bodyValue.tgl_ajuan = utility.dateNow4();
    bodyValue.created_on = dateNow;

    var attenDate = req.body.atten_date
      ? req.body.atten_date
      : new Date().toISOString().split("T")[0];

    var array = attenDate.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const connection = await model.createConnection1(`${database}_hrm`);
    var nomorLb = `LB20${convertYear}${convertBulan}`;
    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [cekNoAjuan] = await conn.query(
        `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' ORDER BY id DESC LIMIT 1`
      );
      if (cekNoAjuan.length > 0) {
        var text = cekNoAjuan[0]["nomor_ajuan"];
        var nomor = parseInt(text.substring(8, 13)) + 1;
        var nomorStr = String(nomor).padStart(4, "0");
        nomorLb = nomorLb + nomorStr;
      } else {
        var nomor = 1;
        var nomorStr = String(nomor).padStart(4, "0");
        nomorLb = nomorLb + nomorStr;
      }
      bodyValue.nomor_ajuan = nomorLb;
      const [begin] = await conn.query(script, [bodyValue]);
      const [transaksi] = await conn.query(
        `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan ='${bodyValue.nomor_ajuan}'`
      );
      for (var i = 0; i < tasks.length; i++) {
        let task = tasks[i]["task"];
        let level = tasks[i]["level"];
        const [insertTask] = await conn.query(
          `INSERT INTO ${namaDatabaseDynamic}.emp_labor_task (task,persentase,emp_labor_id,level) VALUES('${task}','0','${transaksi[0].id}',${level})`
        );
      }
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Insert to draft succesfully",
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error bang", e);
    } finally {
      if (conn) await conn.release();
    }
  },

  async updateDraft(req, res) {
    const database = req.query.database;
    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    var bodyValue = req.body;
    var branchId = req.headers.branch_id;
    var tasks = req.body.tasks;
    var id = req.body.id;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    delete bodyValue.tasks;
    delete bodyValue.cari;
    delete bodyValue.id;

    var dateNow = `${year}-${month
      .toString()
      .padStart(2, "0")}-${date} ${hours}:${minutes}:${seconds}`;
    bodyValue.tgl_ajuan = utility.dateNow4();
    bodyValue.created_on = dateNow;

    var attenDate = req.body.atten_date
      ? req.body.atten_date
      : new Date().toISOString().split("T")[0];

    var array = attenDate.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const connection = await model.createConnection1(`${database}_hrm`);
    var nomorLb = `LB20${convertYear}${convertBulan}`;
    var script = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE id='${id}'`;
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [begin] = await conn.query(script, [bodyValue]);
      await conn.query(
        `DELETE FROM ${namaDatabaseDynamic}.emp_labor_task WHERE emp_labor_id = ${id}`
      );
      for (var i = 0; i < tasks.length; i++) {
        let task = tasks[i]["task"];
        let level = tasks[i]["level"];
        const [insertTask] = await conn.query(
          `INSERT INTO ${namaDatabaseDynamic}.emp_labor_task (task,persentase,emp_labor_id,level) VALUES('${task}','0','${id}',${level})`
        );
      }
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Insert to draft succesfully",
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error bang", e);
    } finally {
      if (conn) await conn.release();
    }
  },

  async updateLembur(req, res) {
    function isDateInRange(date, startDate, endDate) {
      return date >= startDate && date <= endDate;
    }
    var id = req.body.id;
    var nomorLb = req.body.nomor_ajuan;
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1
      .substring(convert1.lastIndexOf("-") + 1)
      .replace("?database=" + req.query.database, "");

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;

    var bodyValue = req.body;
    var tasks = req.body.tasks;
    console.log("task  ", tasks[0]);
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    delete bodyValue.tasks;
    delete bodyValue.nomor_ajuan;
    delete bodyValue.cari;
    delete bodyValue.id;

    let now = new Date();

    console.log(bodyValue);

    let year = now.getFullYear();
    let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    var dateNow = `${year}-${month
      .toString()
      .padStart(2, "0")}-${date} ${hours}:${minutes}:${seconds}`;
    bodyValue.tgl_ajuan = utility.dateNow4();
    bodyValue.created_on = dateNow;

    // bodyValue.is_mobile="1"

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var script = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE id='${id}'`;

    const databaseMaster = `${database}_hrm`;
    //var nomorLb=`LB20${convertYear}${convertBulan}`;
    var script = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE id='${id}'`;

    console.log(script);

    var transaksion = "";
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
            `SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                    WHERE em_id='${req.body.em_id}' 
                    AND (date_selected LIKE '%${req.body.atten_date}%')  
                    AND  status_transaksi=1 
                     AND leave_status IN ('Pending','Approve','Approve2')`,
            (err, data) => {
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

              for (var i = 0; i < data.length; i++) {
                if (data.length > 0) {
                  if (data[0].leave_type == "HALFDAY") {
                    var timeParam1 = new Date(
                      `${req.body.atten_date}T${req.body.dari_jam}`
                    );
                    var timeParam2 = new Date(
                      `${req.body.atten_date}T${req.body.sampai_jam}`
                    );
                    /// jika suda ada data
                    var time1 = new Date(
                      `${data[i].atten_date}T${data[i].time_plan}`
                    );
                    var time2 = new Date(
                      `${data[i].atten_date}T${data[i].time_plan_to}`
                    );
                    if (time1 > time2) {
                      time2.setDate(time2.getDate() + 1);
                    }

                    if (timeParam1 > timeParam2) {
                      timeParam2.setDate(time2.getDate() + 1);
                    }

                    transaksi = "Izin";

                    if (isDateInRange(timeParam1, time1, time2)) {
                      // console.error(`Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`)
                      return res.status(400).send({
                        status: false,
                        message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                        data: [],
                      });
                    }
                  } else if (
                    req.body.leave_type == "FULLDAY" ||
                    req.body.leave_type == "FULL DAY"
                  ) {
                    if (data[i].ajuan == "1" || data[i].ajuan == 1) {
                      // console.error(`Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`)
                      return res.status(400).send({
                        status: false,
                        message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                        data: [],
                      });
                    }

                    if (data[i].ajuan == "2" || data[i].ajuan == 2) {
                      // console.error(`Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`)
                      return res.status(400).send({
                        status: false,
                        message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                        data: [],
                      });
                    }
                  }
                }
              }

              connection.query(
                `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.atten_date}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2') AND id!='${id}'`,
                (err, data) => {
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

                  for (var i = 0; i < data.length; i++) {
                    if (data.length > 0) {
                      var timeParam1 = new Date(
                        `${req.body.atten_date}T${req.body.dari_jam}`
                      );
                      var timeParam2 = new Date(
                        `${req.body.atten_date}T${req.body.sampai_jam}`
                      );

                      /// jika suda ada data
                      var time1 = new Date(
                        `${data[i].atten_date}T${data[i].dari_jam}`
                      );
                      var time2 = new Date(
                        `${data[i].atten_date}T${data[i].sampai_jam}`
                      );

                      if (time1 > time2) {
                        time2.setDate(time2.getDate() + 1);
                      }

                      if (timeParam1 > timeParam2) {
                        timeParam2.setDate(time2.getDate() + 1);
                      }

                      if (data[i].ajuan == "2") {
                        transaksi = "Tugas Luar";
                      }

                      if (data[i].ajuan == "1") {
                        transaksi = "Lembur";
                      }

                      if (isDateInRange(timeParam1, time1, time2)) {
                        // console.error(`Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`)
                        return res.status(400).send({
                          status: false,
                          message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                          data: [],
                        });
                      } else {
                        if (isDateInRange(timeParam2, time1, time2)) {
                          console.error(
                            `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`
                          );
                          return res.status(400).send({
                            status: false,
                            message: `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                            data: [],
                          });
                        }
                      }
                    }
                  }

                  connection.query(script, [bodyValue], (err, results) => {
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
                      `UPDATE ${database}_hrm.overtime SET pakai='Y' WHERE id='${bodyValue.typeid}' `,
                      [bodyValue],
                      (err, updateEmpLabor) => {
                        if (err) {
                          console.error(
                            "Error executing SELECT statement:",
                            err
                          );
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

                        //Proses Notifikasi
                        connection.query(
                          "SELECT name FROM sysdata WHERE KODE IN (024)",
                          (err, sysData) => {
                            if (err) {
                              console.error(
                                "Error executing SELECT statement:",
                                err
                              );
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: false,
                                  message: "gagal ambil data",
                                  data: [],
                                });
                              });
                              return;
                              //proses notifikasi
                            }

                            connection.query(
                              `SELECT * FROM  ${databaseMaster}.employee WHERE em_id='${bodyValue.em_id}' `,
                              (err, user) => {
                                if (err) {
                                  console.error(
                                    "Error executing SELECT statement:",
                                    err
                                  );
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: false,
                                      message: "gagal ambil data",
                                      data: [],
                                    });
                                  });
                                  return;
                                  //proses notifikasi
                                }

                                connection.query(
                                  `DELETE FROM ${namaDatabaseDynamic}.emp_labor_task WHERE emp_labor_id = ${id}`,
                                  (err, user) => {
                                    if (err) {
                                      console.error(
                                        "Error executing SELECT statement:",
                                        err
                                      );
                                      connection.rollback(() => {
                                        connection.end();
                                        return res.status(400).send({
                                          status: false,
                                          message: "gagal ambil data",
                                          data: [],
                                        });
                                      });
                                      return;
                                      //proses notifikasi
                                    }

                                    for (var i = 0; i < tasks.length; i++) {
                                      var task = tasks[i]["task"];
                                      var level = tasks[i]["level"];
                                      console.log(tasks);
                                      connection.query(
                                        `INSERT INTO ${namaDatabaseDynamic}.emp_labor_task (task,persentase,emp_labor_id,level) VALUES('${task}','0',${id},${level})`,
                                        (err, user) => {
                                          if (err) {
                                            console.error(
                                              "Error executing SELECT statement:",
                                              err
                                            );
                                            connection.rollback(() => {
                                              connection.end();
                                              return res.status(400).send({
                                                status: false,
                                                message: "gagal ambil data",
                                                data: [],
                                              });
                                            });

                                            return;
                                            //proses notifikasi
                                          }
                                        }
                                      );
                                    }

                                    var title = "Approval Lembur";
                                    connection.commit((err) => {
                                      if (err) {
                                        console.error(
                                          "Error committing transaction:",
                                          err
                                        );
                                        connection.rollback(() => {
                                          connection.end();
                                          return res.status(400).send({
                                            status: true,
                                            message:
                                              "Kombinasi email & password Anda Salah",
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
                                          "Kombinasi email & password Anda Salah",
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
                  });
                }
              );
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

  async detailTask(req, res) {
    console.log("detail task");

    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1
      .substring(convert1.lastIndexOf("-") + 1)
      .replace("?database=" + req.query.database, "");
    var nomorAjuan = req.body.nomor_ajuan;

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;

    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    var dateNow = `${year}-${month
      .toString()
      .padStart(2, "0")}-${date} ${hours}:${minutes}:${seconds}`;
    bodyValue.created_on = dateNow;
    bodyValue.is_mobile = "1";

    var array = utility.dateNow2().split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);

    console.log("tahun ", tahun);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

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
    const namaDatabaseDynamic = startPeriodeDynamic;
    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      let query = `SELECT a.* FROM ${startPeriodeDynamic}.emp_labor_task a JOIN ${startPeriodeDynamic}.emp_labor b ON b.id = '${nomorAjuan}' WHERE a.emp_labor_id = '${nomorAjuan}'`;
      if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
        query = `SELECT a.* FROM ${startPeriodeDynamic}.emp_labor_task a JOIN ${startPeriodeDynamic}.emp_labor b ON b.id = '${nomorAjuan}' WHERE a.emp_labor_id = '${nomorAjuan}'
    AND (a.created_on >= '${startPeriode}' AND a.created_on <= '${endPeriode}')
      UNION ALL SELECT a.* FROM ${endPeriodeDynamic}.emp_labor_task a JOIN ${endPeriodeDynamic}.emp_labor b ON b.id = '${nomorAjuan}' WHERE a.emp_labor_id = '${nomorAjuan}' AND (a.created_on >= '${startPeriode}' AND a.created_on <= '${endPeriode}')`;
      }
      console.log(query);
      const [results] = await conn.query(query);
      console.log(results);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Successfuly get data",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("error", e);
      return res.status(400).send({
        status: false,
        message: "Gagal ambil data",
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async approvalTransaksi(req, res) {
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1
      .substring(convert1.lastIndexOf("-") + 1)
      .replace("?database=" + req.query.database, "");
    var nomorAjuan = req.boy.nomor_ajuan;

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;

    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    let now = new Date();

    let year = now.getFullYear();
    let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    var emId = req.headers.em_id;
    var dateNow = `${year}-${month
      .toString()
      .padStart(2, "0")}-${date} ${hours}:${minutes}:${seconds}`;
    bodyValue.created_on = dateNow;
    bodyValue.is_mobile = "1";

    var array = utility.dateNow2;

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
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
            `SELECT * FROM ${namaDatabaseDynamic}.emp_labor_task WHERE nomor_ajuan LIKE '${nomorAjuan}'`,
            (err, results) => {
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
                      message: "Successfuly get data",
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

  async atasPerintah(req, res) {
    console.log("-----atas perintah siapa nich----------");
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var convert2 = convert1
      .substring(convert1.lastIndexOf("-") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");
    var value = req.body.val;
    var cari = req.body.cari;
    var depGroupId = req.body.dep_group_id;
    var branchId = req.headers.branch_id;
    var database = req.query.database;

    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(`SELECT * FROM employee
JOIN designation ON employee.des_id = designation.id
JOIN department_group ON employee.dep_group_id = department_group.id
WHERE designation.level <= 3 AND department_group.id = ${depGroupId};`);

      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Successfuly get data",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("error", e);
      return res.status(400).send({
        status: false,
        message: "Gagal ambil data",
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async berhubunganDengan(req, res) {
    console.log("-----------Berhubungan dengan----------");
    var database = req.query.database;
    var dep_id = req.body.dep_id;
    var branchId = req.headers.branch_id;

    var query1 = ` SELECT * FROM ${database}_hrm.employee JOIN branch ON employee.branch_id=branch.id WHERE STATUS='ACTIVE' AND branch_id=${branchId} ORDER BY full_name ASC `;
    var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND branch_id=${branchId} AND status='ACTIVE' ORDER BY full_name ASC `;

    var url;
    if (dep_id == "0" || dep_id == 0) {
      url = query1;
      console.log(query1);
    } else {
      url = query2;
      console.log(query2);
    }
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(url);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Successfuly get data",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("error", e);
      return res.status(400).send({
        status: false,
        message: "Gagal ambil data",
      });
    } finally {
      if (conn) await conn.release();
    }
  },
};
