const models = require("../../utils/models");
module.exports = {
  async userApresiasi(req, res) {
    console.log("get employ attt");
    var database = req.query.database;
    var emId = req.headers.em_id;
    var idTrx = req.body.id_trx;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);

    const databaseMaster = `${database}_hrm`;

    var fixquery = `SELECT a.*, b.full_name, dep.name AS divisi 
    FROM apresiasi AS a JOIN employee AS b ON b.em_id = a.em_id 
    JOIN department AS dep ON dep.id = b.dep_id
    WHERE a.em_id = '${emId}'`;

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
