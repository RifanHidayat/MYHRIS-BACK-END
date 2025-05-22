const { body } = require("express-validator");
const model = require("../../utils/models");
const utility = require("../../utils/utility");
const { approval } = require("../loan");

module.exports = {
  async workSchedule(req, res) {
    var database = req.query.database;
    let connection;
    try {
      console.log("---------------work schedule---------------");
      connection = await (
        await model.createConnection1(`${database}_hrm`)
      ).getConnection();
      await connection.beginTransaction();

      var query = `SELECT id, name, time_in, time_out FROM work_schedule `;
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
        console.log("Transaction work schedule completed successfully!");

        return res.status(200).send({
          status: true,
          message: "Data berhasil diambil",
          data: records,
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

  async searchWorkSchedule(req, res) {
    var database = req.query.database;
    var em_id = req.body.em_id;
    var attenDate = req.body.atten_date;
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
    let connection;
    try {
      console.log("---------------work schedule---------------");
      connection = await (
        await model.createConnection1(`${database}_hrm`)
      ).getConnection();
      await connection.beginTransaction();

      var query = `SELECT ws.id, ws.name, ws.time_in, ws.time_out FROM work_schedule ws 
      JOIN ${namaDatabaseDynamic}.emp_shift es ON ws.id = es.work_id WHERE es.em_id = '${em_id}' AND es.atten_date = '${attenDate}'`;

      console.log(query);
      const [records] = await connection.query(query);
      await connection.commit();
      if (records.length === 0) {
        return res.status(400).send({
          status: false,
          message: "Data tidak ditemukan",
          data: [],
        });
      } else {
        console.log("Transaction work schedule completed successfully!");
        return res.status(200).send({
          status: true,
          message: "Data berhasil diambil",
          data: records,
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

  async store(req, res) {
    var database = req.query.database;
    var array = req.body.tgl_ajuan.split("-");
    var bodyValue = req.body;
    console.log(bodyValue);
    if (bodyValue.work_id_old == "") {
      bodyValue.work_id_old = 0;
    }
    if (bodyValue.work_id_new == "") {
      bodyValue.work_id_new = 0;
    }
    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    let conn;
    try {
      console.log("---------------create shift---------------");
      conn = await (
        await model.createConnection1(`${database}_hrm`)
      ).getConnection();
      await conn.beginTransaction();
      var query = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;
      let nomorLb = `RS20${convertYear}${convertBulan}`;
      const [cekNoAjuan] = await conn.query(
        `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%RS%' ORDER BY id DESC LIMIT 1`
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
      const [records] = await conn.query(query, [bodyValue]);
      const [user] = await conn.query(
        `SELECT * FROM employee where em_id = '${bodyValue.em_id}'`
      );
      const [transaksi] = await conn.query(
        `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE id = '${records.insertId}'`
      );
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
      console.log("ini combinasi id", combinedIds);
      utility.insertNotifikasi(
        combinedIds,
        "Approval shift",
        "shift",
        user[0].em_id,
        transaksi[0].id,
        transaksi[0].nomor_ajuan,
        user[0].full_name,
        namaDatabaseDynamic,
        `${database}_hrm`
      );
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Succesfuly create shift",
      });
    } catch (e) {
      console.error("error get create shift", e);
      if (conn) {
        await conn.rollback();
      }
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    } finally {
      if (conn) await conn.release;
    }
  },

  async edit(req, res) {
    var database = req.query.database;
    var array = req.body.tgl_ajuan.split("-");
    var id = req.body.id;
    var bodyValue = req.body;
    var transaksi = bodyValue.status_transaksi;
    console.log(bodyValue);
    if (bodyValue.work_id_old == "") {
      bodyValue.work_id_old = 0;
    }
    if (bodyValue.work_id_new == "") {
      bodyValue.work_id_new = 0;
    }
    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    let conn;
    try {
      console.log("---------------create shift---------------");
      conn = await (
        await model.createConnection1(`${database}_hrm`)
      ).getConnection();
      await conn.beginTransaction();
      const query = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE id = '${id}'`;
      if (transaksi == 0) {
        const body = {
          status_transaksi: 0,
        };
        await conn.query(query, [body]);
        await conn.commit();
        return res.status(200).send({
          status: true,
          message: "Succesfully Delete Shift",
        });
      } else {
        const body = {
          em_id: bodyValue.em_id,
          em_delegation: bodyValue.em_delegation,
          typeid: bodyValue.typeid,
          atten_date: bodyValue.atten_date,
          dari_tgl: bodyValue.dari_tgl,
          sampai_tgl: bodyValue.sampai_tgl,
          status: bodyValue.status,
          work_id_old: bodyValue.work_id_old,
          work_id_new: bodyValue.work_id_new,
          uraian: bodyValue.uraian,
          approve_status: bodyValue.approve_status,
        };
        await conn.query(query, [body]);
        await conn.commit();
        return res.status(200).send({
          status: true,
          message: "Succesfuly Edit shift",
        });
      }
    } catch (e) {
      console.error("error get edit shift", e);
      if (conn) {
        await conn.rollback();
      }
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    } finally {
      if (conn) await conn.release;
    }
  },

  async show(req, res) {
    console.log("---- show data dengan start periode and periode----------");
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url
      .substring(name_url.lastIndexOf("/") + 1)
      .replace("?database=" + req.query.database, "")
      .replace("&start_periode=" + req.query.start_periode, "")
      .replace("&end_periode=" + req.query.end_periode, "");

    console.log(convert1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1);

    console.log("convert 2", convert2);

    var em_id = req.headers.em_id;

    console.log(em_id);
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
    const connection = await model.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      var url = ` 
            
 SELECT el.id, el.nomor_ajuan, el.tgl_ajuan, el.dari_tgl, el.sampai_tgl,
 el.status, el.uraian, el.work_id_old, el.work_id_new,
 el.alasan1,el.alasan2,el.approve_by,el.approve2_by,
 a.name AS name_old, a.time_in AS time_in_old, a.time_out AS time_out_old,
 b.name AS name_new, b.time_in AS time_in_new, b.time_out AS time_out_new,
 e.full_name AS name_delegasi
 FROM ${startPeriodeDynamic}.emp_labor AS el LEFT JOIN work_schedule AS a ON el.work_id_old = a.id
 LEFT JOIN work_schedule AS b ON el.work_id_new = b.id LEFT JOIN employee e ON el.em_delegation=e.em_id
 WHERE el.em_id='${em_id}' AND el.status_transaksi=1 AND (el.tgl_ajuan>='${startPeriode}' AND el.tgl_ajuan<='${endPeriode}') AND el.typeId = '99'   ORDER BY id DESC

            `;

      if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
        url = `
              SELECT el.id, el.nomor_ajuan, el.tgl_ajuan, el.dari_tgl, el.sampai_tgl,
 el.status, el.uraian, el.work_id_old, el.work_id_new,
 el.alasan1,el.alasan2,el.approve_by,el.approve2_by,
 a.name AS name_old, a.time_in AS time_in_old, a.time_out AS time_out_old,
 b.name AS name_new, b.time_in AS time_in_new, b.time_out AS time_out_new,
 e.full_name AS name_delegasi
 FROM ${startPeriodeDynamic}.emp_labor AS el LEFT JOIN work_schedule AS a ON el.work_id_old = a.id
 LEFT JOIN work_schedule AS b ON el.work_id_new = b.id LEFT JOIN employee e ON el.em_delegation=e.em_id
 WHERE el.em_id='${em_id}' AND el.status_transaksi=1 AND (el.tgl_ajuan>='${startPeriode}' AND el.tgl_ajuan<='${endPeriode}') AND el.typeId = '99'
UNION ALL
              SELECT el.id, el.nomor_ajuan, el.tgl_ajuan, el.dari_tgl, el.sampai_tgl,
 el.status, el.uraian, el.work_id_old, el.work_id_new,
 el.alasan1,el.alasan2,el.approve_by,el.approve2_by,
 a.name AS name_old, a.time_in AS time_in_old, a.time_out AS time_out_old,
 b.name AS name_new, b.time_in AS time_in_new, b.time_out AS time_out_new,
 e.full_name AS name_delegasi
 FROM ${endPeriodeDynamic}.emp_labor AS el LEFT JOIN work_schedule AS a ON el.work_id_old = a.id
 LEFT JOIN work_schedule AS b ON el.work_id_new = b.id LEFT JOIN employee e ON el.em_delegation=e.em_id
 WHERE el.em_id='${em_id}' AND el.status_transaksi=1 AND (el.tgl_ajuan>='${startPeriode}' AND el.tgl_ajuan<='${endPeriode}') AND el.typeId = '99'   ORDER BY id DESC
              `;
      }
      console.log(url);
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
      console.error("eroor : ", e);
      return res.status(400).send({
        status: false,
        message: "Terjadi kesalahan",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async approval(req, res) {
    var database = req.query.database;
    var array = req.body.tanggal.split("-");
    var id = req.body.id;
    const emId = req.body.em_id;
    const status = req.body.status;
    const alasan = req.body.alasan;
    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    let conn;
    try {
      console.log("---------------approve shift---------------");
      conn = await (
        await model.createConnection1(`${database}_hrm`)
      ).getConnection();
      await conn.beginTransaction();
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const queryEmpApprove = `SELECT full_name, em_id FROM employee WHERE em_id = '${emId}'`;
      const queryApprovTipe = `SELECT name FROM sysdata WHERE kode = '013'`;
      const queryApprove = `UPDATE ${namaDatabaseDynamic}.emp_labor  SET ? WHERE id = '${id}'`;
      const queryCekData = `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE  id = '${id}'`;
      const [empApprove] = await conn.query(queryEmpApprove);
      const [approveType] = await conn.query(queryApprovTipe);
      const [cekData] = await conn.query(queryCekData);
      let data;
      console.log(req.body);
      if (approveType[0].name == 1) {
        data = {
          status: status,
          approve_status: status,
          approve_id: emId,
          approve_by: empApprove[0].name,
          approve_date: formattedDate,
          alasan1: alasan,
        };
      }

      if (approveType[0].name == 2) {
        if (cekData[0].status == "Approve") {
          if (status == "Rejected") {
            data = {
              status: status,
              approve2_status: status,
              approve2_id: emId,
              approve2_by: empApprove[0].full_name,
              approve2_date: formattedDate,
              alasan2: alasan,
            };
          } else {
            data = {
              status: "Approve2",
              approve2_status: status,
              approve2_id: emId,
              approve2_by: empApprove[0].full_name,
              approve2_date: formattedDate,
              alasan2: alasan,
            };
          }
        } else {
          data = {
            status: status,
            approve_status: status,
            approve_id: emId,
            approve_by: empApprove[0].full_name,
            approve_date: formattedDate,
            alasan1: alasan,
          };
        }
      }

      console.log(data);
      await conn.query(queryApprove, [data]);

      if (approveType[0].name == 1) {
      }

      if (approveType[0].name == 2) {
        if (cekData[0].status == "Approve") {
          if (status == "Rejected") {
          } else {
            let dari_tgl = utility.dateConvert(cekData[0].dari_tgl);
            let sampai_tgl = utility.dateConvert(cekData[0].sampai_tgl);
            let off_date_old;
            let off_date_new;
            let work_id_new =
              cekData[0].work_id_new == 0 ? null : cekData[0].work_id_new;
            let work_id_old =
              cekData[0].work_id_old == 0 ? null : cekData[0].work_id_old;
            if (work_id_old == null) {
              off_date_old = 0;
            } else{
              off_date_old = 1;
            }
            if (work_id_new == null) {
              off_date_new = 0;
            } else{
              off_date_new = 1;
            }
            const queryCurentSchedule = `UPDATE ${namaDatabaseDynamic}.emp_shift SET ?
            WHERE em_id = '${cekData[0].em_id}' AND atten_date = '${dari_tgl}' `;
            const queryReplaceSchedule = `UPDATE ${namaDatabaseDynamic}.emp_shift SET ?
            WHERE em_id = '${cekData[0].em_id}' AND atten_date = '${sampai_tgl}' `;
            const queryDelegasiSchedule = `UPDATE ${namaDatabaseDynamic}.emp_shift SET ?
            WHERE em_id = '${cekData[0].em_delegation}' AND atten_date = '${sampai_tgl}' `;
            if (cekData[0].em_delegation == "") {
              var cur = {
                work_id: work_id_new,
                off_date: off_date_new
              };
              await conn.query(queryCurentSchedule, [cur]);
              var rep = {
                work_id: work_id_old,
                off_date: off_date_old
              };
              await conn.query(queryReplaceSchedule, [rep]);
            } else {
              const queryNotif = ` SELECT a.full_name AS name_pengajuan, b.full_name AS name_swap 
              FROM employee AS a JOIN employee AS b WHERE a.em_id = '${cekData[0].em_id}' AND b.em_id = '${cekData[0].em_delegation}' `;
              const [notifName] = await conn.query(queryNotif);
              const queryWorkSchedule = `SELECT * FROM work_schedule WHERE id = '${work_id_old}'`;
              const [scheduleNotif] = await conn.query(queryWorkSchedule);
              var cur = {
                work_id: work_id_new,
                off_date: off_date_new
              };
              await conn.query(queryCurentSchedule, [cur]);
              var rep = {
                work_id: work_id_old,
                off_date: off_date_old
              };
              await conn.query(queryDelegasiSchedule, [rep]);

              utility.insertNotifikasiGlobal(
                cekData[0].em_delegation,
                'Pengajuan tukar shift',
                'shift',
                cekData[0].em_id,
                '',
                cekData[0].nomor_ajuan,
                '',
                namaDatabaseDynamic,
                `${database}_hrm`,
                `${notifName[0].name_pengajuan} Dengan ${notifName[0].name_swap} ${sampai_tgl} (${scheduleNotif[0].time_in} - ${scheduleNotif[0].time_out})`
              )
            }
          }
        } else {
        }
      }
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Succesfuly swap shift",
      });
    } catch (e) {
      console.error("error get create shift", e);
      if (conn) {
        await conn.rollback();
      }
      return res.status(400).send({
        status: true,
        message: e,
        data: [],
      });
    } finally {
      if (conn) await conn.release;
    }
  },
};
