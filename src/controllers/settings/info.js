const models = require("../../utils/models");

module.exports = {
  async info_sisa_kontrak(req, res) {
    console.log("-----sisa kontrak---------");
    var database = req.query.database;
    var branchId = req.headers.branch_id;
    var reminder = req.body.reminder;

    console.log();
    var query1 = ` 
        SELECT CURDATE(), TBL.em_id, ADDDATE(TBL.end_date, INTERVAL - 60 DAY),
        DATEDIFF(TBL.end_date, CURDATE()) AS sisa_kontrak, e.full_name, e.em_image, TBL.em_id, TBL.description, 
        TBL.begin_date, TBL.end_date, TBL.remark, e.status  
        FROM (SELECT MAX(h.nokey) AS nokey, h.em_id, MAX(h.begin_date) AS begin_date, 
        MAX(h.end_date) AS end_date, MAX(h.description) AS description, MAX(h.remark) AS remark    
        FROM employee_history h WHERE h.status = 1 GROUP BY h.em_id) TBL 
        JOIN employee e ON e.em_id = TBL.em_id 
        WHERE ADDDATE(TBL.end_date, INTERVAL - 60 DAY) <= CURDATE()  AND DATEDIFF(TBL.end_date, CURDATE())>0
        AND e.status = 'ACTIVE' AND e.em_status != 'PERMANENT' AND branch_id=${branchId} ORDER BY TBL.end_date
        
        `;
    const connection = await models.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [sysdata] = await conn.query(
        `SELECT * FROM sysdata WHERE kode='015'`
      );

      query1 = ` 
                SELECT CURDATE(), TBL.em_id, ADDDATE(TBL.end_date, INTERVAL - ${sysdata[0].name} DAY),
                DATEDIFF(TBL.end_date, CURDATE()) AS sisa_kontrak, e.full_name, e.em_image, TBL.em_id, TBL.description, 
                TBL.begin_date, TBL.end_date, TBL.remark, e.status  
                FROM (SELECT MAX(h.nokey) AS nokey, h.em_id, MAX(h.begin_date) AS begin_date, 
                MAX(h.end_date) AS end_date, MAX(h.description) AS description, MAX(h.remark) AS remark    
                FROM employee_history h WHERE h.status = 1 GROUP BY h.em_id) TBL 
                JOIN employee e ON e.em_id = TBL.em_id 
                WHERE ADDDATE(TBL.end_date, INTERVAL - ${sysdata[0].name} DAY) <= CURDATE()  AND DATEDIFF(TBL.end_date, CURDATE())>0
                AND e.status = 'ACTIVE' AND e.em_status != 'PERMANENT' ORDER BY TBL.end_date
                
                `;
      const [results] = await conn.query(query1);
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
