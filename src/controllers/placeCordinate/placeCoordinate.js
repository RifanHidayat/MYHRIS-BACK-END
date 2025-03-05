const models = require("../../utils/models");

module.exports = {
  async PalceCoordinate(req, res) {
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

    try {
      const connection = await models.createConnection(database);
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
          //

          connection.query(
            `
                 SELECT name FROM sysdata WHERE kode='013'
                 `,
            (err, sysdata) => {
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
                `
                 SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE atten_date='${date}' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='TL' ) AND status='${
                  sysdata[0].name == "1" || sysdata[0].name == 1
                    ? "Approve"
                    : "Approve2"
                }'
                 UNION ALL
                 SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${date}%' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='DL' ) AND leave_status='${
                  sysdata[0].name == "1" || sysdata[0].name == 1
                    ? "Approve"
                    : "Approve2"
                }'
                 `,

                (err, tugasLuar) => {
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

                  if (tugasLuar.length > 0) {
                    records = results;
                    var data = records[0].places.split(",");

                    connection.query(
                      ` SELECT * FROM places_coordinate WHERE (trx ='${tugasLuar[0].nomor_ajuan.substring(
                        0,
                        2
                      )}' OR em_ids LIKE '%${em_id}%' OR em_ids IS NULL  OR trx='0') AND isActive= '1'`,
                      (err, palceCoordinate) => {
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
                        }

                        connection.commit((err) => {
                          if (err) {
                            console.error("Error committing transaction:", err);
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
                          console.log("Transaction completed successfully!");
                          return res.status(200).send({
                            status: true,
                            message: "Kombinasi email & password Anda Salah",
                            data: palceCoordinate,
                          });
                        });
                      }
                    );
                  } else {
                    connection.query(
                      ` SELECT * FROM places_coordinate WHERE  (em_ids LIKE '%${em_id}%' OR em_ids IS NULL  OR trx='0') AND isActive= '1'`,
                      (err, palceCoordinate) => {
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
                        }

                        connection.commit((err) => {
                          if (err) {
                            console.error("Error committing transaction:", err);
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
                          console.log("Transaction completed successfully!");
                          return res.status(200).send({
                            status: true,
                            message: "Kombinasi email & password Anda Salah",
                            data: palceCoordinate,
                          });
                        });
                      }
                    );
                  }
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
};
