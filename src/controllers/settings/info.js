module.exports = {
  async info_sisa_kontrak(req, res) {
    console.log("-----sisa kontrak---------");
    var database = req.query.database;
    var branchId = req.headers.branch_id;

    const connection = await model.createConnection(database);
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
    //-----begin check koneksi----
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
        //-------end check koneksi-----

        connection.query(
          "SELECT * FROM sysdata WHERE kode='015'",
          (err, sysdata) => {
            if (err) {
              console.error("Error executing SELECT statement:", err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesahalan",
                  data: [],
                });
              });
              return;
            }

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

            connection.query(query1, (err, results) => {
              if (err) {
                console.error("Error executing SELECT statement:", err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "Terjadi kesahalan",
                    data: [],
                  });
                });
                return;
              }

              if (results.length == 0) {
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                });
              }
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: false,
                      message: "Terjadi kesalahan",
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
            });
          }
        );
      });
    });
  },
};
