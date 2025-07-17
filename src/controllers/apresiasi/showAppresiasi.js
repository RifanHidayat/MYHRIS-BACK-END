const models = require("../../utils/models");
module.exports = {
  async log(req, res) {
    console.log("get employ attt");
    var database = req.query.database;
    var em_id = req.body.em_id;
    var idTrx = req.body.id_trx;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;

    const databaseMaster = `${database}_hrm`;

    var fixquery = `SELECT a.type, b.perihal_apresiasi, c.full_name, c.em_image, c.em_mobile FROM apresiasi AS a 
INNER JOIN apresiasi_detail AS b ON a.id = b.apresiasi_id 
INNER JOIN employee AS c ON c.em_id = b.em_id
WHERE a.tgl_mulai <= CURDATE() AND a.tgl_akhir >= CURDATE()`;

    const connection = await models.createConnection1(`${database}_hrm`);
    console.log(fixquery);

    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(fixquery);
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
      console.error("Error:", e);
      return res.status(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    } finally {
      if (conn) conn.release();
    }
  },
};
