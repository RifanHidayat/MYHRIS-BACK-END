const models = require("../../utils/models");

module.exports = {
  async PalceCoordinatePengajuan(req, res) {
    console.log("---------place coodinate----------------");
    var database = req.query.database;
    var attenDate = req.query_date;

    let ms = Date.now();

    var d = new Date(ms),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = req.query.date;

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
      const [tugasLuar] = await conn.query(`
                 SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE atten_date='${date}' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='TL' ) AND status='Approve'
                 UNION ALL
                 SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${date}%' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='DL' ) AND leave_status='Approve'
                 `);
      if (tugasLuar.length > 0) {
        const [results] = await conn.query(
          `SELECT places FROM employee WHERE em_id='${em_id}' `
        );

        var data = results[0].places.split(",");
        const [palceCoordinate] = await conn.query(
          `SELECT * FROM places_coordinate WHERE trx ='${tugasLuar[0].nomor_ajuan.substring(
            0,
            2
          )}' OR ID IN (?) AND `,
          [data]
        );
        await conn.commit();
        console.log("Transaction completed successfully!");
        return res.status(200).send({
          status: true,
          message: "Kombinasi email & password Anda Salah",
          data: palceCoordinate,
        });
      } else {
        const [results] = await conn.query(
          `SELECT places FROM employee WHERE em_id='${em_id}' `
        );

        var data = results[0].places.split(",");
        const [palceCoordinate] = await conn.query(
          `SELECT * FROM places_coordinate WHERE ID IN (?)`,
          [data]
        );
        await conn.commit();
        console.log("Transaction completed successfully!");
        return res.status(200).send({
          status: true,
          message: "Kombinasi email & password Anda Salah",
          data: palceCoordinate,
        });
      }
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error committing transaction:", e);
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
