const models = require("../../utils/models");

module.exports = {
  async PalceCoordinate(req, res) {
    console.log("---------place cooredinate  wkwkwk------");
    var database = req.query.database;
    var attenDate = req.query_date;

    let ms = Date.now();

    var d = new Date(ms),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = [year, month, day].join("-");

    var em_id = req.query.id;
    console.log(req.body);

    var array = date.split("-");
    console.log("date now ", date);

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const connection = await models.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const querySys = `SELECT name FROM sysdata WHERE kode='013'`;
      const [sysdata] = await conn.query(querySys);
      const queryTugasLuar = `
                 SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE atten_date='${date}'  AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='TL' ) AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }'
                 UNION ALL
                 SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${date}%' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='DL' ) AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }'
                 `;
      const [tugasLuar] = await conn.query(queryTugasLuar);
      console.log(tugasLuar);
      if (tugasLuar.length > 0) {

var queryResult = `SELECT places,dep_id FROM employee WHERE em_id='${em_id}'`;
        const [results] = await conn.query(queryResult);

        var data = results[0].places.split(",");

        var queryPlaceCoordinate = `SELECT * FROM places_coordinate WHERE trx ='${tugasLuar[0].nomor_ajuan.substring(
          0,
          2
        )}' OR ID IN (?)   `;
        const [palceCoordinate] = await conn.query(queryPlaceCoordinate, [
          data,
        ]);

        await conn.commit();
        return res.status(200).send({
          status: true,
          message: "Data berhasil diambil",
          data: palceCoordinate,
        });
      } else {
const [result] = await conn.query(
          `SELECT places,dep_id FROM employee WHERE em_id='${em_id}' `
        );
        var data = result[0].places.split(",");
        const [palceCoordinate] = await conn.query(
          `SELECT * FROM places_coordinate WHERE ID IN (?) `,
          [data]
        );

        await conn.commit();
        return res.status(200).send({
          status: true,
          message: "Data berhasil diambil",
          data: palceCoordinate,
        });
       


      }
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("errrroe", e);
      return res.status(400).send({
        status: true,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) {
        await conn.release();
      }
    }
  },
};
