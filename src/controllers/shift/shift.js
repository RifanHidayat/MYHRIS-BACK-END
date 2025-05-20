const model = require("../../utils/models");
const utility = require("../../utils/utility");

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
      console.log(query);
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
      const [user] = await conn.query(`SELECT * FROM employee where em_id = '${bodyValue.em_id}'`);
      const [transaksi] = await conn.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE id = '${records.insertId}'`);
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
  async show(req, res) {
    console.log(
      "---- show data dengan start periode and periode----------"
    );
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
      var  url = ` 
            SELECT * FROM ${startPeriodeDynamic}.emp_labor 
            WHERE em_id='${em_id}' AND status_transaksi=1 AND (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}') AND typeId = '99'   ORDER BY id DESC`;

          if (
            montStart < monthEnd ||
            date1.getFullYear() < date2.getFullYear()
          ) {
            url = `
              SELECT * FROM ${startPeriodeDynamic}.emp_labor WHERE em_id='${em_id}' AND status_transaksi=1  AND (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}')  AND typeId = '99' 
              UNION ALL
              SELECT * FROM ${endPeriodeDynamic}.emp_labor  WHERE em_id='${em_id}' AND status_transaksi=1 AND (atten_date>='${startPeriode}' AND atten_date<='${endPeriode}'  ) AND typeId = '99' 
              ORDER BY idd
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
};
