const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
const crypto = require('crypto');
// var https = require('https');
// const faceApiService = require('./faceapiService');
const model = require('../utils/models');
const _apiUrl = 'https://faceapi.mxface.ai/api/v3/face/';
const _subscriptionKey = 'YOpA1lpSxJDLTPbWIz-oxXMU0jLil1363';//change subscription key
var request = require('request');
API_TOKEN = "d5ad23d418674fa2a3165c02e022280c"
var remoteDirectory = 'public_html/7H202305001'
var username = 'aplikasioperasionalsiscom';
var password = 'siscom@ptshaninformasi#2022@';
var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
const https = require('https');
const querystring = require('querystring');


const axios = require('axios');




pool.on("error", (err) => {
  console.error(err);
});
const SftpClient = require('ssh2-sftp-client');
const { data, split } = require("@tensorflow/tfjs-node");
const configSftp = {
  host: 'imagehris.siscom.id',
  port: 3322, // Default SFTP port is 22
  username: 'siscom',
  password: 'siscom!@#$%'
};


const sftp = new SftpClient();



module.exports = {
  
  async allData(req, res) {
    var database = req.query.database;
    console.log('database ', database)
    const connection = await model.createConnection(database);
    let name_url = req.originalUrl;
    var getTableName = name_url.substring(name_url.lastIndexOf("/") + 1).replace("?database=" + req.query.database, "");
    var query_global = `SELECT * FROM ${getTableName}`;
    var query_departemen = `SELECT * FROM department`;
    var query_place = `SELECT * FROM places_coordinate WHERE isActive='1'`;

    var url;
    if (getTableName == "all_department") {
      url = query_departemen;
    
    } else if (getTableName == "places_coordinate") {
      url = query_place;
    } else if (getTableName=="emp_claim"){
    
      url = `SELECT emp_claim.*,cost.name as name FROM emp_claim JOIN ${database}_hrm.cost  ON  emp_claim.cost_id=cost.id `;
    
    }else{
      url = query_global;

    }

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }

        connection.query(url, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: 'gagal ambil data',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
                  data: []

                });
              });
              return;
            } 

            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
              data: results

            });


            });
        });

      });
    });
    // let name_url = req.originalUrl;
    // var getTableName = name_url.substring(name_url.lastIndexOf("/") + 1);

    // var query_global = `SELECT * FROM ${getTableName}`;
    // var query_departemen = `SELECT * FROM department`;
    // var query_place = `SELECT * FROM places_coordinate WHERE isActive='1'`;

    // var url;
    // if (getTableName == "all_department") {
    //   url = query_departemen;
    // } else if (getTableName == "places_coordinate") {
    //   url = query_place;
    // } else {
    //   url = query_global;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     url,
    //     function (error, results) {
    //       connection.release();
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // })hrm;



  },

  async cari_informasi_employee(req, res) {
    console.log('-----function cari informasi employee----------')
    var database = req.query.database;
    const connection = await model.createConnection(database);
    var dep_id = req.body.dep_id;

    var query1 = ` SELECT * FROM ${database}hrm_employee JOIN branch ON employee.branch_id=branch.id WHERE STATUS='ACTIVE'  `;
    var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND status='ACTIVE'`;

    var url;
    if (dep_id == "0" || dep_id == 0) {
      url = query1;
    } else {
      url = query2;
    }
    //-----begin check koneksi----
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     


        connection.query(url, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: 'gagal ambil data',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
              data: results

            });


          });
        });

      });
    });
    // var dep_id = req.body.dep_id;

    // var query1 = `SELECT * FROM ${database}_hrm.employee WHERE status='ACTIVE'`;
    // var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND status='ACTIVE'`;

    // var url;
    // if (dep_id == "0" || dep_id == 0) {
    //   url = query1;
    // } else {
    //   url = query2;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     url,
    //     function (error, results) {
    //       connection.release();
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },
  async info_sisa_kontrak(req, res) {
    console.log('-----sisa kontrak---------')
    var database = req.query.database;

    const connection = await model.createConnection(database);
    var reminder = req.body.reminder;


    var query1 = `SELECT 
    CURDATE(), TBL.em_id, ADDDATE(TBL.end_date, INTERVAL - ${reminder} DAY),
    DATEDIFF(TBL.end_date, CURDATE()) AS sisa_kontrak,
    DATEDIFF( CURDATE(),e.em_joining_date) AS lama_bekerja, e.full_name, e.em_image, TBL.em_id, TBL.description, 
    TBL.begin_date, TBL.end_date, TBL.remark, e.status  
    FROM (SELECT MAX(h.nokey) AS nokey, h.em_id, MAX(h.begin_date) AS begin_date, 
    MAX(h.end_date) AS end_date, MAX(h.description) AS description, MAX(h.remark) AS remark    
    FROM employee_history h WHERE h.status = 1 GROUP BY h.em_id) TBL 
    JOIN employee e ON e.em_id = TBL.em_id 
    WHERE ADDDATE(TBL.end_date, INTERVAL - ${reminder} DAY) <= CURDATE() 
    AND e.status = 'ACTIVE' AND e.em_status != 'PERMANENT' ORDER BY TBL.end_date
    
    `
    ;

  

    //-----begin check koneksi----
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     

        connection.query(query1, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          console.log(records)
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results

            });


          });
        });

      });
    });


    // var reminder = req.body.reminder;

    // var query1 = `SELECT DISTINCT CURDATE(), ADDDATE(h.end_date, INTERVAL -${reminder} DAY), DATEDIFF(h.end_date,CURDATE()) as sisa_kontrak, e.full_name, e.em_image,  
    // h.em_id, h.description, h.begin_date, h.end_date, h.remark, e.status FROM employee_history h JOIN employee e ON e.em_id = h.em_id 
    // WHERE h.status = 1 AND ADDDATE(h.end_date, INTERVAL -${reminder} DAY) <= CURDATE() AND e.status = 'ACTIVE' ORDER BY h.end_date ASC`;

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     query1,
    //     function (error, results) {

    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );
    //   connection.release();
    // });
  },

  async informasi_employee_ultah(req, res) {
    console.log('-----informasi employee ulang tahun----------')
    var dateNow = req.body.dateNow;

    var database = req.query.database;
    const connection = await model.createConnection(database);

    var query1 = `SELECT em_id,full_name, job_title, em_birthday, em_mobile, em_image FROM employee WHERE DATE_FORMAT(em_birthday, '%m')=DATE_FORMAT('${dateNow}', '%m') AND employee.status='ACTIVE' ORDER BY DATE_FORMAT(em_birthday, "%d") ASC`;
    //-----begin check koneksi----
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     

        connection.query(query1, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: []

                });
              });
              return;
            }

            console.log('Transaction completed successfully!');
            res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results

            });
            connection.end();


          });
        });

      });
    });

    // var query1 = `SELECT em_id FROM ${database}_hrm.employee WHERE DATE_FORMAT(em_birthday, '%m-%d')=DATE_FORMAT('${dateNow}', '%m-%d')`;
    // var query1 = `SELECT em_id,full_name, job_title, em_birthday, em_mobile, em_image FROM ${database}_hrm.employee WHERE DATE_FORMAT(em_birthday, '%m')=DATE_FORMAT('${dateNow}', '%m') AND ${database}_hrm.employee.status='ACTIVE' ORDER BY DATE_FORMAT(em_birthday, "%d") ASC`;


    // let proses1 = new Promise(function (myResolve, myReject) {
    //   pool.getConnection(function (err, connection) {
    //     if (err) console.log(err);
    //     connection.query(
    //       query1,
    //       function (error, results) {
    //         connection.release();
    //         if (error != null) console.log(error)
    //         myResolve(results);
    //       }
    //     );
    //   });
    // });
    // proses1.then(
    //   function (value) {

    //     var listReport = value;

    //     var query2 = `SELECT full_name, job_title, em_birthday, em_mobile, em_image FROM ${database}_hrm.employee WHERE em_id=?`;
    //     const getInfo = (t) => {
    //       return new Promise((resolve, reject) => {
    //         pool.getConnection(function (err, connection) {
    //           if (err) console.log(err);
    //           connection.query(
    //             query2, [t],
    //             function (error, results) {
    //               connection.release();
    //               if (error != null) console.log(error)
    //               resolve(results[0])
    //             }
    //           );
    //         });

    //       })
    //     }

    //     var response = [];

    //     listReport.map((value) => {
    //       response.push(getInfo(value['em_id']))
    //     })

    //     Promise.all(response)
    //       .then(response => {
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil data employee ultah!",
    //           data: response,
    //         });
    //       });

    //   },
    // );

  },

  informasi_wa_atasan(req, res) {
    console.log('-----informasi wa atasan----------')
    const mysql = require("mysql");
    var database = req.query.database;
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var kode = req.body.kode;
    var script1 = `SELECT em_report_to FROM ${database}_hrm.employee WHERE em_id='${em_id}'`;
    var script2 = `SELECT em_report_to, em_report2_to FROM ${database}_hrm.employee WHERE em_id='${em_id}'`;

    var url;
    if (kode == "1") {
      url = script1;
      jalan1();
    } else if (kode == "2") {
      url = script2;
      jalan2();
    }

    function jalan1() {
      let proses1 = new Promise(function (myResolve, myReject) {
        poolDynamic.getConnection(function (err, connection) {
          if (err) console.log(err);
          connection.query(
            url,
            function (error, results) {
              connection.release();
              if (error != null) console.log(error)
              var allAtasan = `${results[0].em_report_to}`;
              myResolve(allAtasan);
            }
          );
        });
      });
      proses1.then(
        function (value) {

          let listReport = value.split(',');
          listReport = listReport.filter(item => item);

          var script2 = `SELECT * FROM ${database}_hrm.employee WHERE em_id=?`;
          const getInfo = (t) => {
            return new Promise((resolve, reject) => {
              poolDynamic.getConnection(function (err, connection) {
                if (err) console.log(err);
                connection.query(
                  script2, [t],
                  function (error, results) {
                    connection.release();
                    if (error != null) console.log(error)
                    resolve(results[0])
                  }
                );
              });

            })
          }

          var response = [];

          listReport.map((value) => {
            response.push(getInfo(value))
          })

          Promise.all(response)
            .then(response => {
              res.send({
                status: true,
                message: "Berhasil ambil data level 2!",
                data: response,
              });
            });

        },
      );
    }


    function jalan2() {
      let proses1 = new Promise(function (myResolve, myReject) {
        poolDynamic.getConnection(function (err, connection) {
          if (err) console.log(err);
          connection.query(
            url,
            function (error, results) {
              connection.release();
              if (error != null) console.log(error)
              var allAtasan = ``;
              var allAtasan = `${results[0].em_report_to},${results[0].em_report2_to}`;
              myResolve(allAtasan);
            }
          );
        });
      });

      proses1.then(
        function (value) {
          let listReport = value.split(',');
          listReport = listReport.filter(item => item);
          var script2 = `SELECT * FROM ${database}_hrm.employee WHERE em_id=?`;
          const getInfo = (t) => {
            return new Promise((resolve, reject) => {
              poolDynamic.getConnection(function (err, connection) {
                if (err) console.log(err);
                connection.query(
                  script2, [t],
                  function (error, results) {
                    connection.release();
                    if (error != null) console.log(error)
                    resolve(results[0])
                  }
                );
              });

            })
          }

          var response = [];
          listReport.map((value) => {
            response.push(getInfo(value))
          })

          Promise.all(response)
            .then(response => {
              res.send({
                status: true,
                message: "Berhasil ambil data level 2!",
                data: response,
              });
            });

        },
      );
    }

  },

  //   async empoyeeDelegasi(req, res) {
  //   console.log('-----where once----------')
  //   let name_url = req.originalUrl;
  //   var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
  //   var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database="+req.query.database,"");
  //   var value = req.body.val;
  //   var cari = req.body.cari;
  //   var database=req.query.database;


  //   const connection=await model.createConnection(database);
  //   connection.connect((err) => {
  //     if (err) {
  //       console.error('Error connecting to the database:', err);
  //       return;
  //     }  
  //     connection.beginTransaction((err) => {
  //       if (err) {
  //         console.error('Error beginning transaction:', err);
  //         connection.end();
  //         return;
  //       }
  //  //-------end check koneksi-----     
  //           connection.query( `SELECT designation.level,employee.* FROM employee JOIN designation ON designation.id=employee.des_id  WHERE dep_group_id='${req.body.dep_group_id}' AND (designation.level<(SELECT designation.level FROM employee JOIN designation ON designation.id=employee.des_id  WHERE employee.em_id='${req.body.em_id}'))
  //           `, (err, results) => {
  //             if (err) {
  //               console.error('Error executing SELECT statement:', err);
  //               connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                   status: false,
  //                   message: 'Terjadi kesahalan',
  //                   data:[]

  //                 });
  //               });
  //               return;
  //             }
  //             records = results;
  //             if (records.length==0){
  //               return res.status(400).send({
  //                 status: false,
  //                           message: "Terjadi kesalahan",
  //                 data:[]

  //               });
  //             }
  //             connection.commit((err) => {
  //               if (err) {
  //                 console.error('Error committing transaction:', err);
  //                 connection.rollback(() => {
  //                   connection.end();
  //                   return res.status(400).send({
  //                     status: false,
  //                     message: "Terjadi kesalahan",
  //                     data:[]

  //                   });
  //                 });
  //                 return;
  //               }
  //               connection.end();
  //               console.log('Transaction completed successfully!');
  //               return res.status(200).send({
  //                 status: true,
  //                 message: "Successfuly get data",
  //                 data:results

  //               });


  //             });
  //           });

  //       });
  //     });
  // },



  async empoyeeDelegasi(req, res) {
    console.log('-----where once----------')
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    var value = req.body.val;
    var cari = req.body.cari;
    var database = req.query.database;


    const connection = await model.createConnection(database);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     
        connection.query(`SELECT em_report_to,em_report2_to FROM employee WHERE em_id ='${req.body.em_id}'`, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "data empty",
              data: []

            });
          }
          var data1 = records[0]['em_report_to'].split(',');
          var data2 = records[0]['em_report2_to'].split(',')
          var finalData = data1.concat(data2)
          connection.query(`SELECT *  FROM employee WHERE em_id IN (?)`, [finalData], (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: 'Terjadi kesahalan',
                  data: []

                });
              });
              return;
            }


            var employee = results;
            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "error commit",

                    data: []

                  });
                });
                return;
              }
              connection.end();
              console.log('Transaction completed successfully!');
              return res.status(200).send({
                status: true,
                message: "Successfuly get data",
                data: employee

              });

            });

          });
        });

      });
    });
  },
  async whereOnce(req, res) {
    console.log('-----where once----------')
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    var value = req.body.val;
    var cari = req.body.cari;
    var database = req.query.database;
    var query = "";
    console.log(req.query)
    const connection = await model.createConnection(database);

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     `SELECT * FROM ${convert2} WHERE ${value}='${cari}';`,
    //     function (error, results) {

    //       if (error != null) console.log(error)
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );
    //   connection.release();
    // });

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        query = `SELECT * FROM ${convert2} WHERE ${value}='${cari}' `;

        if (convert2 == 'assign_leave') {
        query = `SELECT * FROM ${convert2} WHERE ${value}='${cari}'  ORDER BY dateyear DESC `;
           
        
        

        
        } 
        
        //-------end check koneksi-----     

        connection.query(query, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results

            });


          });
        });

      });
    });
  },
  async whereTwo(req, res) {
    console.log('-----where two----------')
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    var value1 = req.body.val1;
    var cari1 = req.body.cari1;
    var value2 = req.body.val2;
    var cari2 = req.body.cari2;
    var database = req.query.database;
    const connection = await model.createConnection(database);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     

        connection.query(`SELECT * FROM ${convert2} WHERE ${value}='${cari}'`, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results

            });


          });
        });

      });
    });



    // pool.getConnection(function (err, connection) {

    //   if (err) console.log(err);
    //   connection.query(
    //     `SELECT * FROM ${convert2} WHERE ${value1}='${cari1}' AND ${value2}='${cari2}';`,
    //     function (error, results) {
    //       connection.release();
    //       if (error != null) console.log(error)
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },

  async setting_shift(req, res) {
    console.log('-----setting shift----------')
    var database = req.query.database;
    const connection = await model.createConnection(database);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     

        connection.query(`SELECT * FROM shift WHERE default_shift='1'`, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(400).send({
              status: false,
              message: "Terjadi kesalahan",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results

            });


          });
        });

      });
    });

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);;
    //   connection.query(
    //     `SELECT * FROM shift WHERE default_shift='1';`,
    //     function (error, results) {
    //       connection.release();
    //       if (error) console.log(error);
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },

  banner_from_finance(req, res) {
    console.log('-----banneer from finance----------')
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: 'sis_admin',
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT img,url,seq FROM banner WHERE stsrec = 'A' OR (begin_date>= date(now()) AND end_date <= date(now())) ORDER BY seq`,
        function (error, results) {
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );
      connection.release();
    });
  },

  historyData(req, res) {
    
    console.log('-----hoistory data----------')
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    
    console.log(convert1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");


    console.log('convert 2', convert2);


    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;




    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

     const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',    
      password: 'Siscom3519',
      timezone: "+00:00",
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    
    
    console.log("history absen")
    console.log(namaDatabaseDynamic);



    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: []
        });
      } else {
        var url;
        if (convert2 == 'emp_labor' || convert2 == 'emp_leave' || convert2 == 'emp_claim') {
          if (convert2=='emp_labor'){
            url = ` 
            SELECT emp_labor.*,overtime.name as type FROM emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}'  ORDER BY id DESC`;

          }else if (convert2 == 'emp_claim') {
            url = `SELECT emp_claim.*,cost.name as name  FROM  emp_claim JOIN ${database}_hrm.cost  ON cost.id=emp_claim.cost_id WHERE em_id='${em_id}' AND  status_transaksi=1 ORDER BY id DESC`;

          }else{
            url = `SELECT * FROM ${convert2} WHERE em_id='${em_id}' ORDER BY id DESC`;

          }
        
        } else {
          url = `SELECT * FROM ${convert2} WHERE em_id='${em_id}' ORDER BY id DESC`;
        }
        connection.query(
          url,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
                res.send({
                  status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        );

      }
    });
  },

  emp_leave_load_izin(req, res) {
    console.log('-----Load izin----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: []
        });
      } else {
        connection.query(
          `SELECT a.*, b.name, b.category, b.leave_day, b.status, b.cut_leave FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.em_id='${em_id}' AND a.ajuan IN ('2','3','4') AND a.status_transaksi='1' ORDER BY id DESC;`,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_data: results.length,
              data: results,
            });
          }
        );

      }
    });
  },
  empIzinCategori(req, res) {
    console.log('-----Load izin----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var typeId=req.body.type_id;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: []
        });
      } else {
        connection.query(
          `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor JOIN ${database}_hrm.leave_types ON leave_types.id=emp_labor.typeId WHERE em_id='${em_id}' AND emp_labor.typeId='${typeId}'
          UNION
          SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types ON leave_types.id=emp_leave.typeId WHERE em_id='${em_id}' AND emp_leave.typeId='${typeId}'
          `,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_data: results.length,
              data: results,
            });
          }
        );

      }
    });
  },


  emp_leave_load_dinasluar(req, res) {
    console.log('-----hoistory dinas luat----------')
    var database = req.query.database;

    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: []
        });
      } else {
        connection.query(
          `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='4' AND status_transaksi='1' ORDER BY id DESC;`,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_data: results.length,
              data: results,
            });
          }
        );

      }
    });
  },

  historyAjuanTidakMasukKerja(req, res) {
    console.log('-----hoistory ajuan tidak masuk kerja----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var ajuan = req.body.ajuan;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
          data: []
        });
      } else {
        connection.query(
          `SELECT a.*, b.name, b.id as id_type FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${em_id}' AND a.ajuan='${ajuan}' AND a.status_transaksi='1' ORDER BY a.id DESC;`,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        );

      }

    });
  },
  async historyPermintaanKandidat(req, res) {
    var database = req.query.database;
    console.log('-----history permintaan kandidat----------')
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;
    var status = req.body.status;

    var script1 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' ORDER BY a.nomor_ajuan DESC`;
    var script2 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' AND c.id='${status}' ORDER BY a.nomor_ajuan DESC`;

    var url;
    if (status == "0") {
      url = script1;
    } else {
      url = script2;
    }

    const connection = await model.createConnection(database);
    var dep_id = req.body.dep_id;

    // var query1 = `SELECT * FROM ${database}_hrm.employee WHERE status='ACTIVE'`;
    // var query2 = `SELECT * FROM ${database}_hrm.employee WHERE dep_id='${dep_id}' AND status='ACTIVE'`;

    // var url;
    // if (dep_id == "0" || dep_id == 0) {
    //   url = query1;
    // } else {
    //   url = query2;
    // }
    //-----begin check koneksi----
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     


        connection.query(url, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: 'gagal ambil data',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(200).send({
              status: true,
              message: "data kosong",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Kombinasi email & password Anda Salah",
              data: results

            });


          });
        });

      });
    });

    // var bulan = req.body.bulan;
    // var tahun = req.body.tahun;
    // var status = req.body.status;

    // var script1 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' ORDER BY a.nomor_ajuan DESC`;
    // var script2 = `SELECT a.*, b.full_name, c.name as nama_departement  FROM employee_request a INNER JOIN employee b ON a.em_id=b.em_id INNER JOIN department c ON b.dep_id=c.id WHERE month(a.tgl_ajuan)='${bulan}' AND year(a.tgl_ajuan)='${tahun}' AND c.id='${status}' ORDER BY a.nomor_ajuan DESC`;

    // var url;
    // if (status == "0") {
    //   url = script1;
    // } else {
    //   url = script2;
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) {
    //     res.send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.query(
    //       url,
    //       function (error, results) {
    //         if (error != null) console.log(error)
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil data!",
    //           data: results
    //         });
    //       }
    //     );
    //     connection.release();
    //   }
    // });

  },

  getMenuDashboard(req, res) {
    console.log('-----get menu dashbopard----------')
    console.log(req.query.database)
    var database = req.query.database;
    var dbmaster = `${database}_hrm`

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
        `SELECT * FROM modul WHERE status= 1;`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          var modul = results;
          connection.query(
            // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
            `SELECT * FROM menu;`,
            function (error, menulist) {
              if (error != null) console.log(error)
              var menu = menulist;
              var idx = 0;
              var finalData = [];
              for (var i = 0; i < modul.length; i++) {
                var menuConvert = [];
                for (var j = 0; j < menu.length; j++) {
                  if (menu[j].id_modul == modul[i].id_modul) {
                    var filMenu = {
                      'id_menu': menu[j].id_menu,
                      'nama_menu': menu[j].nama_menu,
                      'gambar': menu[j].gambar,
                      'url': menu[j].url,
                    }
                    menuConvert.push(filMenu)
                  }
                }
                var data = {
                  'index': idx,
                  'nama_modul': modul[i].nama_modul,
                  'status': false,
                  'menu': menuConvert,
                };
                idx = idx + 1;
                finalData.push(data);
              }
              res.send({
                status: true,
                message: "Berhasil ambil data!",
                data: finalData,
              });
            }
          );
        }
      );

    });
  },
  showMenuDashboard(req, res) {
    console.log('-----show menu dashboard----------')
    var database = req.query.database;
    var dbmaster = `${database}_hrm`

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var emId = req.query.em_id;
    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
        `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
        // `SELECT * FROM menu_dashboard`,
        function (error, results) {

          connection.release();
          if (error != null) console.log(error)
          if (results.length > 0) {
            var modulStatic = [
              {
                "status": 0,
                "nama_modul": "Menu Utama",
              },
              {
                "status": 1,
                "nama_modul": "Payroll",
              }
            ];
            var menu = results;
            var idx = 0;
            var finalData = [];
            for (var i = 0; i < modulStatic.length; i++) {
              var menuConvert = [];
              for (var j = 0; j < menu.length; j++) {
                if (menu[j].status == modulStatic[i].status) {
                  var filMenu = {
                    'id': menu[j].id,
                    'nama': menu[j].nama,
                    'url': menu[j].url,
                    'gambar': menu[j].gambar
                  }
                  menuConvert.push(filMenu)
                }
              }
              var data = {
                'index': idx,
                'nama_modul': modulStatic[i].nama_modul,
                'status': false,
                'menu': menuConvert,
              };
              idx = idx + 1;
              finalData.push(data);
            }
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: finalData,
            });

          } else {


            connection.query(
              // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
              //  `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
              `SELECT * FROM menu_dashboard`,
              function (error, results) {

                if (error != null) console.log(error)

                var modulStatic = [
                  {
                    "status": 0,
                    "nama_modul": "Menu Utama",
                  },
                  {
                    "status": 1,
                    "nama_modul": "Payroll",
                  }
                ];
                var menu = results;
                var idx = 0;
                var finalData = [];
                for (var i = 0; i < modulStatic.length; i++) {
                  var menuConvert = [];
                  for (var j = 0; j < menu.length; j++) {
                    if (menu[j].status == modulStatic[i].status) {
                      var filMenu = {
                        'id': menu[j].id,
                        'nama': menu[j].nama,
                        'url': menu[j].url,
                        'gambar': menu[j].gambar
                      }
                      menuConvert.push(filMenu)
                    }
                  }
                  var data = {
                    'index': idx,
                    'nama_modul': modulStatic[i].nama_modul,
                    'status': false,
                    'menu': menuConvert,
                  };
                  idx = idx + 1;
                  finalData.push(data);
                }
                res.send({
                  status: true,
                  message: "Berhasil ambil data!",
                  data: finalData,
                });





              }
            );


          }



        }
      );

    });
  },
  showMenuDashboardUtama(req, res) {
    console.log('-----show menu dashboard----------')
    var database = req.query.database;
    var dbmaster = `${database}_hrm`

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var emId = req.query.em_id;
    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
        `SELECT * FROM menu_dashboard_utama_user JOIN menu_dashboard_utama ON menu_dashboard_utama.id = menu_dashboard_utama_user.menu_id  WHERE menu_dashboard_utama_user.em_id='${emId}'`,
        // `SELECT * FROM menu_dashboard`,
        function (error, results) {

          connection.release();
          if (error != null) console.log(error)
          if (results.length > 0) {

            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });

          } else {


            connection.query(
              // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
              //  `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
              `SELECT * FROM menu_dashboard_utama`,
              function (error, results) {

                if (error != null) console.log(error)


                res.send({
                  status: true,
                  message: "Berhasil ambil data!",
                  data: results,
                });





              }
            );


          }



        }
      );

    });
  },

  // showMenuDashboard(req, res) {
  //   console.log('-----show menu dashboard----------')
  //   var database=req.query.database;
  //   var dbmaster=`${database}_hrm`

  //   const configDynamic = {
  //     multipleStatements: true,
  //                host: '15.10.1.197',//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: dbmaster,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);
  //   var emId=req.query.em_id;
  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) console.log(err);
  //     connection.query(
  //       // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
  //        `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
  //       //`SELECT * FROM menu_dashboard`,
  //       function (error, results) {
  //         connection.release();

  //       if (results.length>0){
  //         if (error != null) console.log(error)
  //         var modulStatic = [
  //           {
  //             "status": 0,
  //             "nama_modul": "Menu Utama",
  //           },
  //           {
  //             "status": 1,
  //             "nama_modul": "Payroll",
  //           }
  //         ];
  //         var menu = results;
  //         var idx = 0;
  //         var finalData = [];
  //         for (var i = 0; i < modulStatic.length; i++) {
  //           var menuConvert = [];
  //           for (var j = 0; j < menu.length; j++) {
  //             if (menu[j].status == modulStatic[i].status) {
  //               var filMenu = {
  //                 'id': menu[j].id,
  //                 'nama': menu[j].nama,
  //                 'url': menu[j].url,
  //                 'gambar': menu[j].gambar
  //               }
  //               menuConvert.push(filMenu)
  //             }
  //           }
  //           var data = {
  //             'index': idx,
  //             'nama_modul': modulStatic[i].nama_modul,
  //             'status': false,
  //             'menu': menuConvert,
  //           };
  //           idx = idx + 1;
  //           finalData.push(data);
  //         }
  //         res.send({
  //           status: true,
  //           message: "Berhasil ambil data!",
  //           data: finalData,
  //         });

  //       }else{
  //         connection.query(
  //           // `SELECT modul.nama_modul, menu.nama_menu FROM menu INNER JOIN modul ON menu.id_modul=modul.id_modul WHERE modul.id_modul=1;`,
  //           //  `SELECT * FROM menu_dashboard_user JOIN menu_dashboard ON menu_dashboard.id = menu_dashboard_user.menu_id  WHERE menu_dashboard_user.em_id='${emId}'`,
  //           `SELECT * FROM menu_dashboard`,
  //           function (error, results) {
  //             connection.release();

  //             if (error != null) console.log(error)
  //             var modulStatic = [
  //               {
  //                 "status": 0,
  //                 "nama_modul": "Menu Utama",
  //               },
  //               {
  //                 "status": 1,
  //                 "nama_modul": "Payroll",
  //               }
  //             ];
  //             var menu = results;
  //             var idx = 0;
  //             var finalData = [];
  //             for (var i = 0; i < modulStatic.length; i++) {
  //               var menuConvert = [];
  //               for (var j = 0; j < menu.length; j++) {
  //                 if (menu[j].status == modulStatic[i].status) {
  //                   var filMenu = {
  //                     'id': menu[j].id,
  //                     'nama': menu[j].nama,
  //                     'url': menu[j].url,
  //                     'gambar': menu[j].gambar
  //                   }
  //                   menuConvert.push(filMenu)
  //                 }
  //               }
  //               var data = {
  //                 'index': idx,
  //                 'nama_modul': modulStatic[i].nama_modul,
  //                 'status': false,
  //                 'menu': menuConvert,
  //               };
  //               idx = idx + 1;
  //               finalData.push(data);
  //             }
  //             res.send({
  //               status: true,
  //               message: "Berhasil ambil data!",
  //               data: finalData,
  //             });




  //           }
  //         );



  //       }


  //       }
  //     );

  //   });
  // },
  insertData(req, res) {
    
    console.log('-----insert data tugas luar----------')
    console.log('data absen ',req.body)
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;

    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;

  
    var script = `INSERT INTO ${nameTable} SET ?`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy
    }

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


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);


    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.release();
        if (nameTable == "emp_labor" || nameTable == "emp_leave" || nameTable == "emp_claim") {
          if (nameTable == "emp_claim") {
            delete bodyValue.atten_date;
          }
          connection.query(
            `SELECT * FROM ${nameTable} WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
            function (error, results) {
              if (results.length == 0) {
                connection.query(
                  script,
                  [bodyValue],
                  function (error, results) {
                    if (error != null) console.log(error)
                    connection.query(
                      `INSERT INTO logs_actvity SET ?;`,
                      [dataInsertLog],
                      function (error,) {
                        if (error != null) console.log(error)
                      }
                    );
                    res.send({
                      status: true,
                      message: "Berhasil berhasil di tambah!",
                    });
                  }
                );
              } else {
                res.send({
                  status: false,
                  message: "ulang",
                  data: results
                });
              }
            }
          );
        } else {
          connection.query(
            script,
            [bodyValue],
            function (error, results) {
              if (error != null) console.log(error)
              connection.query(
                `INSERT INTO logs_actvity SET ?;`,
                [dataInsertLog],
                function (error,) {
                  if (error != null) console.log(error)
                }
              );
              res.send({
                status: true,
                message: "Berhasil berhasil di tambah!",
              });
            }
          );
        }

      }


    });
  },


  async edit_face(req, res) {
    //     console.log("sftp")
    //     const SftpClient = require('ssh2-sftp-client');
    // const config = {
    //   host: 'kantor.siscom.id',
    //   port: 3322, // Default SFTP port is 22
    //   username: 'siscom',
    //   password: 'siscom!@#$%'
    // };

    //     const localFilePath = 'public/file_cuti/IMG-20220914-WA0004.jpg';
    //     const remoteFilePath = 'public_html/7H202305001/dpi/foto_profile/regis_SIS20221039.png';
    //     const sftp = new SftpClient();

    //    sftp.connect(config)
    //   .then(() => {
    //     // SFTP connection successful
    //     return sftp.put(localFilePath, remoteFilePath);
    //   })
    //   .then(() => {
    //     console.log('File uploaded successfully!');
    //     sftp.end(); // Disconnect after the upload is complete
    //   })
    //   .catch(err => {
    //     console.error('Error:', err);
    //     sftp.end(); // Disconnect if an error occurs
    //   });
    //   sftp.end();


    console.log('-----edit face registration----------')
    var database = req.query.database;
    var dbmaster = `${database}_hrm`

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: dbmaster,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);


    const { file } = req.files;
    const nameFile = "regis_" + req.body.em_id + ".png";
    //stftp
    const remoteFilePath = `${remoteDirectory}/${database}/face_recog/${nameFile}`;
    sftp.connect(configSftp)
      .then(() => {
        // SFTP connection successful
        return sftp.put(file.data, remoteFilePath);
      })
      .then(() => {
        console.log("berhasil upload image")
        poolDynamic.getConnection(function (err, connection) {
          if (err) {
            console.log(err)
            return res.send({
              status: false,
              message: "Gagal registrasi wajah",
            });
          };

          connection.query(
            `UPDATE employee SET file_face='${nameFile}' WHERE em_id='${req.body.em_id}'`,
            function (error, results) {
              if (error) {
                console.log(error);
                return res.send({
                  status: false,
                  message: "Gagal registrasi wajah",
                });

              }
              return res.send({
                status: true,
                message: "Berhasil update data!",

              });
            }
          );
          connection.release();
        });
        sftp.end(); // Disconnect after the upload is complete
      })
      .catch(err => {
        sftp.end(); // Disconnect if an error occurs
        console.log(`gagal upload image ${err}`)
        return res.send({
          status: false,
          message: "Gagal registrasi wajah",
        });

      });
    sftp.end();
    // return  res.send({
    //   status: true,
    //   message: "Berhasil update data!",

    // });



    // var options = {
    //   url: _apiUrl + "detect",
    //   method: 'POST',
    //   headers: {
    //     'subscriptionkey': _subscriptionKey,
    //     'Content-Type': 'application/json'
    //   },
    //   json: {
    //     encoded_image: base64String1
    //   },
    //   rejectUnauthorized: false,
    // };
    // request(options, function (error, response) {
    //   console.log(response.statusCode);
    //   if (error) {
    //     console.log(error)
    //   }
    //   else {

    //     if (response.statusCode == 200) {

    //       var faces = response.body.faces;
    //       if (faces.length == 1) {
    //         fs.writeFileSync("public/face_recog/" + nameFile, file.data);
    //         poolDynamic.getConnection(function (err, connection) {
    //           if (err) console.log(err);;
    //           connection.query(
    //             `UPDATE employee SET file_face='${nameFile}' WHERE em_id='${req.body.em_id}'`,
    //             function (error, results) {
    //               res.send({
    //                 status: true,
    //                 message: "Berhasil update data!",

    //               });
    //             }
    //           );
    //           connection.release();
    //         });

    //       } else {
    //         res.send({
    //           status: false,
    //           message: "Gagal registrasi wajah",
    //         });

    //       }

    //     }
    //     else {
    //       console.log("gaga registrasi")
    //       res.send({
    //         status: false,
    //         message: "Gagal registrasi wajah",
    //       });
    //     }
    //   }
    // });
  },
  // async edit_face(req,res){

  //   const { face1 } = req.files;
  //   const { face2 } = req.files;
  //   var formdata = new FormData();    
  //   formdata.append("face1", face1, "file");
  //   formdata.append("face2", face2, "file");

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: formdata,
  //     redirect: 'follow'
  //   };
  //   var myHeaders = new Headers();


  //   myHeaders.append("token", API_TOKEN);

  //   fetch("https://api.luxand.cloud/photo/landmarks", requestOptions)
  //     .then(response =>{
  //       response.json()
  //       console.log(response.json());
  //     })
  //     .then(result => {
  //       console.log("berhasil")
  //       callback(result)
  //     })
  //     .catch(error => console.log('error', error)); 
  // },


  async get_face_mx(req, res) {
    console.log('-----get face registration----------')
    const { file } = req.files;
    const nameFile = "regis_" + req.body.em_id + ".png";

    const fs = require('fs');
    const file_local = fs.readFileSync("public/face_recog/" + nameFile);

    console.log("file Local " + file_local.data);
    // var image1 =  fs.readFileSync(file.data);

    const base64String1 = Buffer(file.data).toString('base64');
    const base64String2 = Buffer(file_local).toString('base64');

    var optionsFaceCompare = {
      url: _apiUrl + 'verify',
      method: 'POST',
      headers: {
        'subscriptionkey': _subscriptionKey,
        'Content-Type': 'application/json'
      },
      json: {
        "encoded_image1": base64String1,
        "encoded_image2": base64String2,

      },

    };
    request(optionsFaceCompare, function (error, response) {
      console.log("Response /verify");
      if (error) {
        res.send({
          status: false,
          message: "wajah tidak terverifikasi",
        });

      }

      else {
        if (response.body.statusCode == 400) {
          res.send({
            status: false,
            message: "wajah tidak terverifikasi",
          });
        } else {
          if (response.body.matchedFaces[0].matchResult == 1)
            res.send({
              status: true,
              message: "wajah terverifikasi",
            });
          else
            res.send({
              status: false,
              message: "wajah tidak terverifikasi",
            });
        }
      }
    });

  },


  // async edit_face(req, res) {

  //   const { file } = req.files;
  //   var fs = require("fs");
  //   var nameFile = "regis_" + req.body.em_id + ".png";
  //   fs.writeFileSync("public/face_recog/" + nameFile, file.data);

  //   // const file = Buffer.from(req.body.image, 'base64');

  //   const em_id = req.body.em_id;
  //   const result = await faceApiService.registration(file.data);

  //   pool.getConnection(function (err, connection) {
  //     if (err) console.log(err);
  //     var message = result["message"];
  //     var data_image = result["data_image"];
  //     if (message == "tidakvalid") {
  //       res.send({
  //         status: false,
  //         message: "Gagal registrasi wajah",
  //       });
  //     } else {
  //       connection.query(
  //         `UPDATE employee SET file_face='${nameFile}' WHERE em_id='${em_id}'`,
  //         function (error, results) {
  //           res.send({
  //             status: true,
  //             message: "Berhasil update data!",
  //             data: results,
  //           });
  //         }
  //       );
  //     }
  //     connection.release();
  //   });
  // },

  // async get_face(req, res) {
  //   const { file } = req.files;
  //   const em_id = req.body.em_id;
  //   const fs = require('fs');
  //   var nameFile = "regis_" + em_id + ".png";
  //   const file_local = fs.readFileSync("public/face_recog/" + nameFile);
  //   const result = await faceApiService.detection(file.data, em_id, file_local);
  //   // const result = await faceApiService.detection(file, em_id);
  //   if (result == em_id)
  //     res.send({
  //       status: true,
  //       message: "wajah terverifikasi",
  //     });
  //   else
  //     res.send({
  //       status: false,
  //       message: "wajah tidak terverifikasi",
  //     });
  // },

  editData(req, res) {
    console.log('-----edit data ----------')
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    var nameWhere = req.body.val;
    var cariWhere = req.body.cari;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var atten_date = req.body.atten_date;
    var createdBy = req.body.created_by;
    var bodyValue = req.body;
    delete bodyValue.val;
    delete bodyValue.cari;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;

    console.log(req.body)

    var script = `UPDATE ${nameTable} SET ? WHERE ${nameWhere} = '${cariWhere}'`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy
    }
    console.log(req.body);
    // BATAL PENGAJUAN BERMASALAH
    // var array = atten_date.split("-");
    var array = [];
    try {
      array = atten_date.split("-");
    } catch (error) {
      array = req.body.start_date.split("-");
    }
    const getTahun = array[0];
    const getBulan = array[1];


    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getBulan.length == 1) {
      convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
    } else {
      convertBulan = getBulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (nameTable == "emp_claim") {
        delete bodyValue.atten_date;
      }
      if (err) console.log(err);
      connection.query(
        script,
        [bodyValue],
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          connection.query(
            `INSERT INTO logs_actvity SET ?;`,
            [dataInsertLog],
            function (error,) {
              if (error != null) console.log(error)

            }
          );

          res.send({
            status: true,
            message: "Berhasil di update!",
            data: results
          });
        }
      );

    });
  },
  deleteData(req, res) {
    console.log('-----delete data----------')
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    var nameWhere = req.body.val;
    var cariWhere = req.body.cari;
    var createdBy = req.body.created_by;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var atten_date = req.body.atten_date;
    var script = `DELETE FROM ${nameTable} WHERE ${nameWhere}='${cariWhere}'`;

    var dataInsert = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy
    }

    var getTahun;
    var getBulan;

    if (nameTable == "emp_leave") {
      var array = req.body.start_date.split("-");
      getTahun = array[0];
      getBulan = array[1];
    } else {
      var array = atten_date.split("-");
      getTahun = array[0];
      getBulan = array[1];
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
    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        script,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          connection.query(
            `INSERT INTO logs_actvity SET ?;`,
            [dataInsert],
            function (error,) {
              if (error != null) console.log(error)

            }
          );
          res.send({
            status: true,
            message: "Berhasil di hapus!",
          });
        }
      );

    });
  },
  edit_foto_user(req, res) {
    var database = req.query.database;



    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    // upload gambar
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    var randomstring = require("randomstring");
    var fs = require("fs");
    var image = req.body.base64_foto_profile;
    var bitmap = Buffer.from(image, 'base64');
    var stringRandom = randomstring.generate(5);
    var nameFile = stringRandom + date + month + year + hour + menit + ".png";
    fs.writeFileSync("public/foto_profile/" + nameFile, bitmap);


    const remoteFilePath = `${remoteDirectory}/${database}/foto_profile/${nameFile}`;
    sftp.connect(configSftp)
      .then(() => {
        // SFTP connection successful
        return sftp.put(bitmap, remoteFilePath);
      })
      .then(() => {
        console.log("berhasil upload image")

        sftp.end(); // Disconnect after the upload is complete
      })
      .catch(err => {
        console.log(`gagal upload image ${err}`)
        res.send({
          status: false,
          message: "Gagal registrasi wajah",
        });
        sftp.end(); // Disconnect if an error occurs
      });
    sftp.end();

    var em_id = req.body.em_id;
    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;

    var script = `UPDATE employee SET em_image='${nameFile}' WHERE em_id='${em_id}'`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: em_id
    }

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        script,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil di update!",
            nama_file: nameFile,
          });
        }
      );

    });
  },
  //   edit_foto_user(req, res) {
  //     console.log('-----edit foto user----------')
  // var database=req.query.database;
  //         // upload gambar
  //         let ts = Date.now();
  //         let date_ob = new Date(ts);
  //         let date = date_ob.getDate();
  //         let month = date_ob.getMonth() + 1;
  //         let year = date_ob.getFullYear();
  //         let hour = date_ob.getHours();
  //         let menit = date_ob.getMinutes();
  //         var randomstring = require("randomstring");
  //         var fs = require("fs");
  //         var image = req.body.base64_foto_profile;
  //         var bitmap = Buffer.from(image, 'base64');
  //         var stringRandom = randomstring.generate(5);
  //         var nameFile = stringRandom + date + month + year + hour + menit + ".png";
  //         fs.writeFileSync("public/foto_profile/" + nameFile, bitmap);

  //         var em_id = req.body.em_id;
  //         var menu_name = req.body.menu_name;
  //         var activity_name = req.body.activity_name;

  //         var script = `UPDATE employee SET em_image='${nameFile}' WHERE em_id='${em_id}'`;

  //         var dataInsertLog = {
  //           menu_name: menu_name,
  //           activity_name: activity_name,
  //           acttivity_script: script,
  //           createdUserID: em_id
  //         }


  //     const remoteFilePath = `${remoteDirectory}/${database}/foto_profile/${nameFile}`;
  //     sftp.connect(configSftp)
  //    .then(() => {
  //      // SFTP connection successful
  //      return sftp.put(file.data, remoteFilePath);
  //    })
  //    .then(() => {

  //      poolDynamic.getConnection(function (err, connection) {

  //        if (err) console.log(err);
  //        connection.query(
  //          script,
  //          function (error, results) {
  //            connection.release();
  //            if (error != null) console.log(error)
  //            res.send({
  //              status: true,
  //              message: "Berhasil di update!",
  //              nama_file: nameFile,
  //            });
  //          }
  //        );
  //        connection.release();
  //      });
  //      sftp.end(); // Disconnect after the upload is complete
  //    })
  //    .catch(err => {
  //      console.log(`gagal upload image ${err}`)
  //      res.send({
  //        status: false,
  //        message: "gagal update foto profile",
  //      });
  //      sftp.end(); // Disconnect if an error occurs
  //    });
  //    sftp.end();


  //   },
  // slip_gaji(req, res) {
  //   var database=req.query.database
  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: '15.10.1.197',//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${database}_hrm`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);






  //   console.log('-----Slip gaji----------')
  //   var em_id = req.body.em_id;
  //   var tahun = req.body.tahun;
  //  poolDynamic.getConnection(function (err, connection) {
  //     if (err) console.log(err);;
  //     connection.query(
  //       `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}' AND payroll='Y' ORDER BY initial`,
  //       function (error, results) {
  //         if (error) {
  //           res.send({
  //             status: false,
  //             message: "Periode tidak di temukan"
  //           });
  //         } else {
  //           var list_pendapatan = [];
  //           var list_pemotongan = [];

  //           results.forEach((el) => {
  //              //dycrip
  //             //  if (el['value03']=='0' || el['value03']==null || el['value03']=='' ){
  //             //  }else{
  //             //    var request = http.request({'hostname': `https://myhris.siscom.id/custom/${database}/api/decrypt?aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@&nilai=${el['value03']}&keycode=${el['keycode03']}`,
  //             //    'auth': 'aplikasioperasionalsiscom:siscom@ptshaninformasi#2022@'
  //             //   }, 
  //             //   function (response) {
  //             //     console.log('STATUS: ' + response.statusCode);
  //             //     console.log('HEADERS: ' + JSON.stringify(response.headers));
  //             //     response.setEncoding('utf8');
  //             //     response.on('data', function (chunk) {
  //             //       console.log('BODY: ' + chunk);
  //             //     });
  //             //   });

  //             //   request.end();


  //             //  }



  //             //  if (el.type=="D"){
  //             //   list_pendapatan.push(el);


  //             //  }else if (el.type=='C'){
  //             //   list_pendapatan.push(el);

  //             //  }

  //           });

  //           // results.forEach((el) => {
  //           //   if (el.type == "C") {
  //           //     list_pemotongan.push(el);
  //           //   }
  //           // });

  //           res.send({
  //             status: true,
  //             message: "Berhasil ambil data!",
  //             data_pendapatan: list_pendapatan,
  //             data_pemotongan: list_pemotongan,
  //           });
  //         }
  //       }
  //     );
  //     connection.release();
  //   });



  //   function decryptData(nilai, keycode) {
  //     const params = {
  //       nilai: `${nilai}`,
  //       key2: '${keyCode}',
  //     };

  //     // Convert the parameters to a query string
  //     const paramString = querystring.stringify(params);

  //     // The URL you want to send the GET request to, with the parameters appended
  //     const url = `https://example.com/path?${paramString}`;

  //     // Basic Authentication credentials
  //     const username = 'your_username';
  //     const password = 'your_password';
  //     const auth = Buffer.from(`${username}:${password}`).toString('base64');
  //     const headers = {
  //       'Authorization': `Basic ${auth}`,
  //     };

  //     // Set up the request options
  //     const options = {
  //       method: 'GET',
  //       headers: headers,
  //     };

  //     // Send the GET request
  //     const req = https.request(url, options, (res) => {
  //       let data = '';

  //       // Accumulate the response data
  //       res.on('data', (chunk) => {
  //         data += chunk;
  //       });

  //       // Process the response data
  //       res.on('end', () => {
  //         console.log(data);
  //         // Do something with the response data
  //       });
  //     });

  //     req.on('error', (error) => {
  //       console.error(`Error: ${error.message}`);
  //     });

  //     req.end();

  //   }
  // },

async slip_gaji(req, res) {
  
    var database=req.query.database
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require('mysql2/promise');
    const poolDynamic = mysql.createPool(configDynamic);

    const connection = await poolDynamic.getConnection();
    var em_id = req.body.em_id;
    var tahun = req.body.tahun; 
      
    const [results] = await connection.query(`SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}' AND payroll='Y' ORDER BY initial`);
    var list_pendapatan = [];
    var list_pemotongan = [];

    for (const el of results) {
      try {
            //value 1
      if (el['value01']=="0" ||el['value01']=="" || el['value01']==null || el['value01']>0 ){
        el['value01']="0"
      }else{
       var output01= await decryptData(el['value01'], el['keycode01'],database)
        el['value01']=output01
        
      }
       //value 2
       if (el['value02']=="0" ||el['value02']=="" || el['value02']==null || el['value02']>0   ){
        el['value02']="0"
       }else{
        var output02= await decryptData(el['value02'], el['keycode02'],database)
         el['value02']=output02
         
       }

        //value 3
      if (el['value03']=="0" ||el['value03']=="" || el['value03']==null  || el['value03']>0 ){
        el['value03']="0"
      }else{
       var output03=await  decryptData(el['value03'], el['keycode03'],database)
        el['value03']=output03
        
      }

       //value 4
       if (el['value04']=="0" ||el['value04']=="" || el['value04']==null || el['value04']>0  ){
        el['value04']="0"
       }else{
        var output04=await  decryptData(el['value04'], el['keycode04'],database)
         el['value04']=output04
         
       }
        //value 0
      if (el['value05']=="0" ||el['value05']=="" || el['value05']==null || el['value05']>0  ){
        el['value05']="0"
      }else{
       var output05= await decryptData(el['value05'], el['keycode05'],database)
       el['value05']=output04
        
      }
       //value 0
       if (el['value06']=="0" ||el['value06']=="" || el['value06']==null || el['value06']>0  ){
        el['value06']="0"
       }else{
        var output06=await  decryptData(el['value06'], el['keycode06'],database)
         el['value06']=output06
         
       }

        //value 0
        if (el['value07']=="0" ||el['value07']=="" || el['value07']==null  || el['value07']>0 ){
          el['value07']="0"
        }else{
          
         var output07= await decryptData(el['value07'], el['keycode07'],database)
          el['value07']=output07
          
        }

           //value 0
           if (el['value08']==null ){
            el['value08']="0"
           }else{
            var output08=await  decryptData(el['value08'], el['keycode08'],database)
             el['value08']=output08
             
           }

              //value 0
        if (el['value09']=="0" ||el['value09']=="" || el['value09']==null  || el['value09']>0 ){
          el['value09']="0"
        }else{
         var output09=await decryptData(el['value09'], el['keycode09'],database)
          el['value09']=output09
          
        }

           //value 0
           if (el['value10']=="0" ||el['value10']=="" || el['value10']==null  || el['value10']>0 ){
            el['value10']="0"
           }else{
            var output10= await decryptData(el['value10'], el['keycode10'],database)
             el['value10']=output10
             
           }

            //value 0
            if (el['value11']=="0" ||el['value11']=="" || el['value11']==null  || el['value11']>0 ){
              el['value11']="0"
            }else{
             var output11= await decryptData(el['value11'], el['keycode11'],database)
              el['value11']=output11
              
            }
             //value 0
           if (el['value12']=="0" ||el['value12']=="" || el['value12']==null || el['value12']>0  ){
            el['value12']="0"
           }else{
            var output12=await  decryptData(el['value12'], el['keycode12'],database)
             el['value12']=output12
             
           }

           if (el.type=="C"){
            list_pemotongan.push(el);

           }else{
            list_pendapatan.push(el);
           }
      } catch (error) {
        console.error(`Error processing: ${item}`);
      }
    }

    // results.forEach((el) => {
      // //value 1
      // if (el['value01']=="0" ||el['value01']=="" || el['value01']==null || el['value01']>0 ){

      // }else{
      //  var output01= decryptData(el['value01'], el['keycode01'],database)
      //   el['value01']=output01
        
      // }
      //  //value 2
      //  if (el['value02']=="0" ||el['value02']=="" || el['value02']==null || el['value02']>0   ){

      //  }else{
      //   var output02= decryptData(el['value02'], el['keycode02'],database)
      //    el['value02']=output02
         
      //  }

      //   //value 3
      // if (el['value03']=="0" ||el['value03']=="" || el['value03']==null  || el['value03']>0 ){

      // }else{
      //  var output03= decryptData(el['value03'], el['keycode03'],database)
      //   el['value03']=output03
        
      // }

      //  //value 4
      //  if (el['value04']=="0" ||el['value04']=="" || el['value04']==null || el['value04']>0  ){

      //  }else{
      //   var output04= decryptData(el['value04'], el['keycode04'],database)
      //    el['value04']=output04
         
      //  }
      //   //value 0
      // if (el['value05']=="0" ||el['value05']=="" || el['value05']==null || el['value05']>0  ){

      // }else{
      //  var output05= decryptData(el['value05'], el['keycode05'],database)
      //   el['value05']=output05
        
      // }
      //  //value 0
      //  if (el['value06']=="0" ||el['value06']=="" || el['value06']==null || el['value06']>0  ){

      //  }else{
      //   var output06= decryptData(el['value06'], el['keycode06'],database)
      //    el['value06']=output06
         
      //  }

      //   //value 0
      //   if (el['value07']=="0" ||el['value07']=="" || el['value07']==null  || el['value07']>0 ){

      //   }else{
          
      //    var output07= decryptData(el['value07'], el['keycode07'],database)
      //     el['value07']=output07
          
      //   }

      //      //value 0
      //      if (el['value08']==null ){

      //      }else{
      //       var output08= decryptData(el['value08'], el['keycode08'],database)
      //        el['value08']=output08
             
      //      }

      //         //value 0
      //   if (el['value09']=="0" ||el['value09']=="" || el['value09']==null  || el['value09']>0 ){

      //   }else{
      //    var output09= decryptData(el['value09'], el['keycode09'],database)
      //     el['value09']=output09
          
      //   }

      //      //value 0
      //      if (el['value10']=="0" ||el['value10']=="" || el['value10']==null  || el['value10']>0 ){

      //      }else{
      //       var output10= decryptData(el['value10'], el['keycode10'],database)
      //        el['value10']=output10
             
      //      }

      //       //value 0
      //       if (el['value11']=="0" ||el['value11']=="" || el['value11']==null  || el['value11']>0 ){

      //       }else{
      //        var output11= decryptData(el['value11'], el['keycode11'],database)
      //         el['value11']=output11
              
      //       }
      //        //value 0
      //      if (el['value12']=="0" ||el['value12']=="" || el['value12']==null || el['value12']>0  ){

      //      }else{
      //       var output12= decryptData(el['value12'], el['keycode12'],database)
      //        el['value12']=output12
             
      //      }

      //      if (el.type=="C"){
      //       list_pemotongan.push(el);

      //      }else{
      //       list_pendapatan.push(el);
      //      }

    // });


    
  
  
    
 
 
   

    res.send({
      status: true,
      message: "Berhasil ambil data!",
      data_pendapatan: list_pendapatan,
      data_pemotongan: list_pemotongan,
    });




  //   console.log('-----Slip gaji----------')
  //  poolDynamic.getConnection(function (err, connection)  {
  //     if (err) console.log(err);;
  //     connection.query(
  //       `SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}' AND payroll='Y' ORDER BY initial`,
  //       function (error, results) {
  //         if (error) {
  //           res.send({
  //             status: false,
  //             message: "Periode tidak di temukan"
  //           });
  //         } else {
       
  //         }
  //       }
  //     );
  //     connection.release();
  //   });
    


   async function decryptData(nilai, keycode,dbname)  {
    
    try {
         // Basic Authentication credentials
         const username = 'aplikasioperasionalsiscom';
         const password = 'siscom@ptshaninformasi#2022@';
         const auth = Buffer.from(`${username}:${password}`).toString('base64');
         const headers = {
           'Authorization': `Basic ${auth}`,
         };
         
         // Set up the request options
         const options = {
           method: 'GET',
           headers: headers,
         };
      const response = await axios.get(`https://myhris.siscom.id/custom/dpi/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`,{headers}); // Replace with your actual API endpoint
     // res.json(response.data);
    console.log(response.data.status)
    if (response.data.status==true){
      return response.data.data;

    }else{
      return "0"
    }
    
    } catch (error) {
      console.log(error )
     // res.status(500).json({ error: 'An error occurred' });
      return "1 "
    }



      
	console.log('nilai ',nilai);
	console.log('key',keycode);
      const params = {
        nilai: `${nilai}`,
        key2: `${keycode}`,
        aplikasioperasionalsiscomkey:'siscom@ptshaninformasi%232022@'
      };
      
      // Convert the parameters to a query string
      const paramString = querystring.stringify(params);
      
      // The URL you want to send the GET request to, with the parameters appended
      const url = `https://myhris.siscom.id/custom/dpi/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`;
    
   
      
      // Send the GET request
//       const req = await https.request(url, options, (res) => {
//         let data = '';
      
//         // Accumulate the response data
//         res.on('data', (chunk) => {
//           data += chunk;
//         });
      
//         // Process the response data
//         res.on('end', () => {
//           console.log(data)
//           var d=JSON.parse(data)
//           console.log(`data ${d.data}`);
//           if (d.status==true){
// console.log(`data true ${d.data}`);
//             return d.data;
//           }else{
//             return "0"
//           }
//           // Do something with the response data
//         });
//       });
      
//       req.on('error', (error) => {
//         console.error(`Error: ${error.message}`);
//         return "1";
//       });
      
//       req.end();
     // return "1"
     
    }
  },


  async pph21(req, res) {
  console.log("pph21")
    var database=req.query.database
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require('mysql2/promise');
    const poolDynamic = mysql.createPool(configDynamic);

    const connection = await poolDynamic.getConnection();
    var em_id = req.body.em_id;
    var tahun = req.body.tahun; 
      
    const [results] = await connection.query(`SELECT * FROM ${database}_hrm.emp_salary${tahun} WHERE em_id='${em_id}'  ORDER BY initial`);
    var list_pendapatan = [];
    var list_pemotongan = [];

    for (const el of results) {
      try {
            //value 1
      if (el['fiscal01']=="0" ||el['fiscal01']=="" || el['fiscal01']==null || el['fiscal01']>0 ){
        el['fiscal01']="0"
      }else{
       var output01= await decryptData(el['fiscal01'], el['keycode01'],database)
        el['fiscal01']=output01
        
      }
       //fiscal 2
       if (el['fiscal02']=="0" ||el['fiscal02']=="" || el['fiscal02']==null || el['fiscal02']>0   ){
        el['fiscal02']="0"
       }else{
        var output02= await decryptData(el['fiscal02'], el['keycode02'],database)
         el['fiscal02']=output02
         
       }

        //fiscal 3
      if (el['fiscal03']=="0" ||el['fiscal03']=="" || el['fiscal03']==null  || el['fiscal03']>0 ){
        el['fiscal03']="0"
      }else{
       var output03=await  decryptData(el['fiscal03'], el['keycode03'],database)
        el['fiscal03']=output03
        
      }

       //fiscal 4
       if (el['fiscal04']=="0" ||el['fiscal04']=="" || el['fiscal04']==null || el['fiscal04']>0  ){
        el['fiscal04']="0"
       }else{
        var output04=await  decryptData(el['fiscal04'], el['keycode04'],database)
         el['fiscal04']=output04
         
       }
        //fiscal 0
      if (el['fiscal05']=="0" ||el['fiscal05']=="" || el['fiscal05']==null || el['fiscal05']>0  ){
        el['fiscal05']="0"
      }else{
       var output05= await decryptData(el['fiscal05'], el['keycode05'],database)
       el['fiscal05']=output04
        
      }
       //fiscal 0
       if (el['fiscal06']=="0" ||el['fiscal06']=="" || el['fiscal06']==null || el['fiscal06']>0  ){
        el['fiscal06']="0"
       }else{
        var output06=await  decryptData(el['fiscal06'], el['keycode06'],database)
         el['fiscal06']=output06
         
       }

        //fiscal 0
        if (el['fiscal07']=="0" ||el['fiscal07']=="" || el['fiscal07']==null  || el['fiscal07']>0 ){
          el['fiscal07']="0"
        }else{

         var output07= await decryptData(el['fiscal07'], el['keycode07'],database)
          el['fiscal07']=output07
          
        }

           //fiscal 0
           if (el['fiscal08']==null ){
            el['fiscal08']="0"
           }else{
            var output08=await  decryptData(el['fiscal08'], el['keycode08'],database)
             el['fiscal08']=output08
             
           }

              //fiscal 0
        if (el['fiscal09']=="0" ||el['fiscal09']=="" || el['fiscal09']==null  || el['fiscal09']>0 ){
          el['fiscal09']="0"
        }else{
         var output09=await decryptData(el['fiscal09'], el['keycode09'],database)
          el['fiscal09']=output09
          
        }

           //fiscal 0
           if (el['fiscal10']=="0" ||el['fiscal10']=="" || el['fiscal10']==null  || el['fiscal10']>0 ){
            el['fiscal10']="0"
           }else{
            var output10= await decryptData(el['fiscal10'], el['keycode10'],database)
             el['fiscal10']=output10
             
           }

            //fiscal 0
            if (el['fiscal11']=="0" ||el['fiscal11']=="" || el['fiscal11']==null  || el['fiscal11']>0 ){
              el['fiscal11']="0"
            }else{
             var output11= await decryptData(el['fiscal11'], el['keycode11'],database)
              el['fiscal11']=output11
              
            }
             //fiscal 0
           if (el['fiscal12']=="0" ||el['fiscal12']=="" || el['fiscal12']==null || el['fiscal12']>0  ){
            el['fiscal12']="0"
           }else{
            var output12=await  decryptData(el['fiscal12'], el['keycode12'],database)
             el['fiscal12']=output12
             
           }
                    list_pendapatan.push(el);
      } catch (error) {
        console.error(`Error processing: ${item}`);
      }
    }

  
    
 
 
   

    res.send({
      status: true,
      message: "Berhasil ambil data!",
      data: list_pendapatan,

    });





   async function decryptData(nilai, keycode,dbname)  {
    console.log("masuk sini")
    
    try {
         // Basic Authentication credentials
         const username = 'aplikasioperasionalsiscom';
         const password = 'siscom@ptshaninformasi#2022@';
         const auth = Buffer.from(`${username}:${password}`).toString('base64');
         const headers = {
           'Authorization': `Basic ${auth}`,
         };

         // Set up the request options
         const options = {
           method: 'GET',
           headers: headers,
         };
      const response = await axios.get(`https://myhris.siscom.id/custom/dpi/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`,{headers}); // Replace with your actual API endpoint
     // res.json(response.data);
    console.log(response.data.status)
    if (response.data.status==true){
      console
      return response.data.data;

    }else{
      return "0"
    }
    
    } catch (error) {
      console.log(error )
      return "1 "
    }



  
     
    }
  },

  
  validasiLogin(req, res) {
    console.log('-----validasi login----------')
    var database = req.query.database;



    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var email = req.body.email;
    var password = sha1(req.body.password);
    var token_notif = req.body.token_notif;



    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        `SELECT a.em_bpjs_kesehatan as nomor_bpjs_kesehatan,a.em_bpjs_tenagakerja as nomor_bpjs_tenagakerja, em_id, full_name, em_email, des_id, dep_id, dep_group_id as dep_group, em_mobile as em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title as posisi, em_hak_akses, last_login, status as status_aktif, em_control, em_controlaccess as em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working as emp_att_working FROM employee a LEFT JOIN designation b ON a.des_id=b.id LEFT JOIN department c ON a.dep_id=c.id where em_email='${email}' AND em_password='${password}'`,
        function (error, results) {
          if (error) console.log(error);
          if (results.length == 0) {
            res.send({
              status: false,
              message: "Kombinasi email & password Anda Salah",
            });
          } else {
            var updateToken = `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${email}'`;
            connection.query(
              updateToken,
              function (error, results) {
              }
            )
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        }
      );
      connection.release();
    });
  },
  
  // refresh_employee(req, res) {
  //   var currentDate = new Date();

  //   // Extract date components
  //   var year = currentDate.getFullYear();
  //   var month = String(currentDate.getMonth() + 1).padStart(2, '0');
  //   var day = String(currentDate.getDate()).padStart(2, '0');
    
  //   // Create the formatted date string
  //   var array = `${year}-${month}-${day}`.split('-');
  //   console.log('array',array)
    
  //   var database = req.query.database;
  //   // const namaDatabaseDynamic = `${database}_test2208`;
  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: '15.10.1.197',//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${database}_hrm`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);
  //   var em_id = req.body.em_id;

  //   const tahun = `${array[0]}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (array[1].length == 1) {
  //     convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //   } else {
  //     convertBulan = array[1];
  //   }
  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    
  //   poolDynamic.getConnection(function (err, connection) {
  //     if (err) console.log(err);
  //     connection.query(
        
  //       `
  //       SELECT  
  //       em_bpjs_kesehatan as nomor_bpjs_kesehatan,em_bpjs_tenagakerja as nomor_bpjs_tenagakerja,
  //       (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,
  //       (SELECT name FROM sysdata WHERE id='18') as time_attendance,
  //       (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll,
  //       branch.name AS branch_name, a.em_id, full_name, em_email, des_id, dep_id, dep_group_id as dep_group, em_mobile as em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title as posisi, em_hak_akses, last_login, status as status_aktif, em_controlaccess as em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working as emp_att_working FROM employee a 
  //       LEFT JOIN designation b ON a.des_id=b.id LEFT JOIN
  //       department c ON a.dep_id=c.id JOIN branch ON branch.id=a.branch_id
  //        where a.em_id='${em_id}' `,
  //       function (error, results) {
  //         connection.release();
  //         if (error != null) console.log(error)
  //         if (results.length == 0) {
  //           res.send({
  //             status: false,
  //             message: "Data tidak ditemukan",
  //           });
  //         } else {
  //           res.send({
  //             status: true,
  //             message: "Berhasil ambil data!",
  //             data: results,
  //           });
  //         }
  //       }
  //     );

  //   });
  // },
  validasiGantiPassword(req, res) {
    console.log('-----validasi ganti password---------')

    var database = req.query.database;


    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var password_lama = req.body.password_lama;
    var password_baru = req.body.password_baru;

    var convertPasswordLama = sha1(password_lama);
    var convertPasswordBaru = sha1(password_baru);

    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        `SELECT * FROM employee WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          var getPassword = results[0].em_password;
          var validasi = convertPasswordLama == getPassword ? true : false;
          if (validasi == true) {
            connection.query(
              `UPDATE employee SET em_password='${convertPasswordBaru}' WHERE em_id='${em_id}'`,
              function (error, results) {
                if (error != null) console.log(error)
                res.send({
                  status: true,
                  message: "Password berhasil di ubah"
                });
              }
            )

          } else {
            res.send({
              status: false,
              message: "Password lama tidak sama",
            });
          }
        }
      );

    });
  },
  newPasswordBaru(req, res) {
    console.log('-----validasi ganti password---------')
    var database = req.query.database;
    // const namaDatabaseDynamic = `${database}_test2208`;
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    

    
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var password_baru = req.body.password;
    var convertPasswordBaru = sha1(password_baru);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET em_password='${convertPasswordBaru}' WHERE em_email='${req.body.email}'`,
        function (error, results) {
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Password berhasil di ubah"
          });
        }
      )

    });
  },

  // kirimTidakMasukKerja(req, res) {
  //   console.log('-----kirim tidak masuk kerja----------')
  //   var database = req.query.database;
  //   var script = `INSERT INTO emp_leave SET ?`;
  //   var insertData = {
  //     "em_id": req.body.em_id,
  //     "typeid": req.body.typeid,
  //     "nomor_ajuan": req.body.nomor_ajuan,
  //     "leave_type": req.body.leave_type,
  //     "start_date": req.body.start_date,
  //     "end_date": req.body.end_date,
  //     "leave_duration": req.body.leave_duration,
  //     "date_selected": req.body.date_selected,
  //     "time_plan": req.body.time_plan,
  //     "time_plan_to": req.body.time_plan_to,
  //     "apply_date": req.body.apply_date,
  //     "reason": req.body.reason,
  //     "leave_status": req.body.leave_status,
  //     "atten_date": req.body.atten_date,
  //     "em_delegation": req.body.em_delegation,
  //     "leave_files": req.body.leave_files,
  //     "ajuan": req.body.ajuan,
  //   };
  //   var dataInsertLog = {
  //     menu_name: req.body.menu_name,
  //     activity_name: req.body.activity_name,
  //     acttivity_script: script,
  //     createdUserID: req.body.created_by
  //   }

  //   var array = req.body.start_date.split("-");

  //   const tahun = `${array[0]}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (array[1].length == 1) {
  //     convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //   } else {
  //     convertBulan = array[1];
  //   }

  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
  //   // const namaDatabaseDynamic = `${database}_test2208`;

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: '15.10.1.197',//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.send({
  //         status: false,
  //         message: "Database tidak tersedia",
  //       });
  //     } else {
  //       connection.query(
  //         `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
  //         function (error, results) {
  //           if (results.length == 0) {
  //             connection.query(
  //               script,
  //               [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 connection.query(
  //                   `INSERT INTO logs_actvity SET ?;`,
  //                   [dataInsertLog],
  //                   function (error,) {
  //                     if (error != null) console.log(error)
  //                   }
  //                 );
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil berhasil di tambah!",
  //                 });
  //               }
  //             );
  //           } else {
  //             res.send({
  //               status: false,
  //               message: "ulang",
  //               data: results
  //             });
  //           }
  //         }
  //       );
  //       connection.release();
  //     }


  //   });

  // },
  kirimTidakMasukKerja(req, res) {
    console.log('-----kirim tidak masuk kerja----------')
    var database = req.query.database;
    var script     = `INSERT INTO emp_leave SET ?`;
    var insertData = {
      "em_id": req.body.em_id,
      "typeid": req.body.typeid,
      "nomor_ajuan": req.body.nomor_ajuan,
      "leave_type": req.body.leave_type,
      "start_date": req.body.start_date,
      "end_date": req.body.end_date,
      "leave_duration": req.body.leave_duration,
      "date_selected": req.body.date_selected,
      "time_plan": req.body.time_plan,
      "time_plan_to": req.body.time_plan_to,
      "apply_date": req.body.apply_date,
      "reason": req.body.reason,
      "leave_status": req.body.leave_status,
      "atten_date": req.body.atten_date,
      "em_delegation": req.body.em_delegation,
      "leave_files": req.body.leave_files,
      "ajuan": req.body.ajuan,
      "apply_status":"Pending"
    };
    var dataInsertLog = {
      menu_name: req.body.menu_name,
      activity_name: req.body.activity_name,
      acttivity_script: script,
      createdUserID: req.body.created_by
    }

    var array = req.body.start_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
          function (error, results) {
            if (results.length == 0) {
              connection.query(
                script,
                [insertData],
                function (error, results) {
                  if (error != null) console.log(error)
                  connection.query(
                    `INSERT INTO logs_actvity SET ?;`,
                    [dataInsertLog],
                    function (error,) {
                      if (error != null) console.log(error)
                    }
                  );
                  res.send({
                    status: true,
                    message: "Berhasil berhasil di tambah!",
                  });
                }
              );
            } else {
              res.send({
                status: false,
                message: "ulang",
                data: results
              });
            }
          }
        );
        connection.release();
      }


    });

    



    // var dates=req.body.date_selected.split(',');

    // dates.forEach(function(date) {
    //   var array = date.split("-");

    //   var tahun = `${array[0]}`;
    //   var convertYear = tahun.substring(2, 4);
    //   var convertBulan;
    //   if (array[1].length == 1) {
    //     convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    //   } else {
    //     convertBulan = array[1];
    //   }
  
    //   var namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

     

    // const configDynamic = {
    //   multipleStatements: true,
    //   host: '15.10.1.197',//my${database}.siscom.id (ip local)
    //   user: 'pro',
    //   password: 'Siscom3519',
    //   database: `${namaDatabaseDynamic}`,
    //   connectionLimit: 1000,
    //   connectTimeout: 60 * 60 * 1000,
    //   acquireTimeout: 60 * 60 * 1000,
    //   timeout: 60 * 60 * 1000,
    // };
    // const mysql = require("mysql");
    // const poolDynamic = mysql.createPool(configDynamic);

    // poolDynamic.getConnection(function (err, connection) {

    //   if (err) {
    //     res.send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.query(
    //       `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
    //       function (error, results) {
    //         if (results.length == 0) {
    //           connection.query(
    //             script,
    //             [insertData],
    //             function (error, results) {
    //               if (error != null) console.log(error)
    //               connection.query(
    //                 `INSERT INTO logs_actvity SET ?;`,
    //                 [dataInsertLog],
    //                 function (error,) {
    //                   if (error != null) console.log(error)
    //                 }
    //               );
    //               res.send({
    //                 status: true,
    //                 message: "Berhasil berhasil di tambah!",
    //               });
    //             }
    //           );
    //         } else {
    //           res.send({
    //             status: false,
    //             message: "ulang",
    //             data: results
    //           });
    //         }
    //       }
    //     );
    //     connection.release();
    //   }


    // });
    // });


  },

  kirimTidakMasukKerja(req, res) {
    console.log('-----kirim tidak masuk kerja----------')
    var database = req.query.database;
    var script = `INSERT INTO emp_leave SET ?`;
    var insertData = {
      "em_id": req.body.em_id,
      "typeid": req.body.typeid,
      "nomor_ajuan": req.body.nomor_ajuan,
      "leave_type": req.body.leave_type,
      "start_date": req.body.start_date,
      "end_date": req.body.end_date,
      "leave_duration": req.body.leave_duration,
      "date_selected": req.body.date_selected,
      "time_plan": req.body.time_plan,
      "time_plan_to": req.body.time_plan_to,
      "apply_date": req.body.apply_date,
      "reason": req.body.reason,
      "leave_status": req.body.leave_status,
      "atten_date": req.body.atten_date,
      "em_delegation": req.body.em_delegation,
      "leave_files": req.body.leave_files,
      "ajuan": req.body.ajuan,
      "apply_status":"Pending"
    };
    var dataInsertLog = {
      menu_name: req.body.menu_name,
      activity_name: req.body.activity_name,
      acttivity_script: script,
      createdUserID: req.body.created_by
    }

    var array = req.body.start_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `${database}_test2208`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `SELECT * FROM emp_leave WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
          function (error, results) {
            if (results.length == 0) {
              connection.query(
                script,
                [insertData],
                function (error, results) {
                  if (error != null) console.log(error)
                  connection.query(
                    `INSERT INTO logs_actvity SET ?;`,
                    [dataInsertLog],
                    function (error,) {
                      if (error != null) console.log(error)
                    }
                  );
                  res.send({
                    status: true,
                    message: "Berhasil berhasil di tambah!",
                  });
                }
              );
            } else {
              res.send({
                status: false,
                message: "ulang",
                data: results
              });
            }
          }
        );
        connection.release();
      }


    });

    

  },
  async empoyeeDivisi(req, res) {
    console.log('-----employee divisi----------')
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var convert2 = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    var value = req.body.val;
    var cari = req.body.cari;
    var database = req.query.database;
    var depId = req.body.dep_id;
    var emId = req.body.em_id;
    var query = "";
    var table="";   


    const connection = await model.createConnection(database);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }


        //get sysdata
        connection.query(`SELECT * FROM sysdata WHERE kode='003'`, (err, sysdata) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          var sys = sysdata;
          if (sys[0].name=="DIV"){
            table="dep_id"

          }else{
            table="dep_id"

          }
          //get employee
        connection.query(`SELECT * FROM employee WHERE em_id='${emId}'`, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          var employee = results;
          var ids=[];
          if (employee[0].em_hak_akses == "" || employee[0].em_hak_akses == "0") {
            query = "SELECT * FROM employee JOIN branch ON employee.branch_id=branch.id WHERE branch.name  ORDER BY full_name ASC"
          } else {
            query = `SELECT * FROM employee WHERE ${table} IN (?) AND branch_id='${employee[0].branch_id}'`
            ids=employee[0].em_hak_akses.split(',')
          }


          
        //get employee
          connection.query(query,[ids] ,(err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: 'Terjadi kesahalan',
                  data: []

                });
              });
              return;
            }
            var employee = results;

            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: false,
                    message: "error commit",

                    data: []

                  });
                });
                return;
              }
              connection.end();
              console.log('Transaction completed successfully!');
              return res.status(200).send({
                status: true,
                message: "Successfuly get data",
                data: employee

              });

            });

          });

        });

        });
      });
    });


  },

  kirimAbsen(req, res) {
    var database = req.query.database;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    if (req.body.reg_type == 1) {
      var randomstring = require("randomstring");

      var image = req.body.gambar;
      var bitmap = Buffer.from(image, 'base64');
      var stringRandom = randomstring.generate(5);
      var nameFile = stringRandom + date + month + year + hour + menit + ".png";

      const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFile}`;
      sftp.connect(configSftp)
        .then(() => {
          // SFTP connection successful
          return sftp.put(bitmap, remoteFilePath);
        })
        .then(() => {
          console.log("berhasil upload image")

          sftp.end(); // Disconnect after the upload is complete
        })
        .catch(err => {
          console.log(`gagal upload image ${err}`)
        
          sftp.end(); // Disconnect if an error occurs
          return res.status(400).send({
            status: false,
            message: "Gagal registrasi wajah",
          });
        });

      sftp.end();


    }


    var typeAbsen = req.body.typeAbsen;
    var jamMasuk = "";
    var jamKeluar = "";
    var gambarMasuk = "";
    var gambarKeluar = "";
    var lokasiAbsenIn = "";
    var lokasiAbsenOut = "";
    var latLangIn = "";
    var latLangOut = "";
    var lokasiMasuk = "";
    var lokasiKeluar = "";
    var catatanMasuk = "";
    var catatanKeluar = "";
    if (typeAbsen == "1") {
      jamMasuk = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
      gambarMasuk = req.body.reg_type == 0 ? "" : nameFile;
      lokasiMasuk = req.body.lokasi;
      catatanMasuk = req.body.catatan;
      latLangIn = req.body.latLang;
      lokasiAbsenIn = req.body.place;
    } else {
      jamKeluar = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
      gambarKeluar = req.body.reg_type == 0 ? "" : nameFile;
      lokasiKeluar = req.body.lokasi;
      catatanKeluar = req.body.catatan;
      latLangOut = req.body.latLang;
      lokasiAbsenOut = req.body.place;
    }

    var insertData = {
      em_id: req.body.em_id,
      atten_date: req.body.tanggal_absen,
      signin_time: jamMasuk == null || jamMasuk == "" || jamMasuk == undefined ? "00:00:00" : jamMasuk,
      signout_time: jamKeluar == null || jamKeluar == "" || jamKeluar == undefined ? "00:00:00" : jamKeluar,
      working_hour: "",
      place_in: lokasiAbsenIn,
      place_out: lokasiAbsenOut,
      absence: "",
      overtime: "",
      earnleave: "",
      status: "",
      signin_longlat: latLangIn,
      signout_longlat: latLangOut,
      // att_type: "",
      signin_pict: gambarMasuk,
      signout_pict: gambarKeluar,
      signin_note: catatanMasuk,
      signout_note: catatanKeluar,
      signin_addr: lokasiMasuk,
      signout_addr: lokasiKeluar,
      atttype: parseInt(req.body.kategori),
      // reg_type: 0,
      reg_type: req.body.reg_type,
    };
    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          if (req.body.kategori == "1") {
            if (results.length == 0) {
              connection.query(
                `INSERT INTO attendance SET ?;`, [insertData],
                function (error, results) {
                  if (error != null) console.log(error)
                  return res.status(200).send({
                    status: true,
                    message: "Berhasil",
                    data: results,
                  });
                }
              );


            } else {
              var lastItem = results.pop();
              if (lastItem.signout_longlat == "") {
                var id_record = lastItem.id;
                connection.query(
                  `UPDATE attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
                  function (error, results) {
                    if (error != null) console.log(error)
                  return   res.status(200).send({
                      status: true,
                      message: "Berhasil",
                      data: results,
                    });
                  }
                );


              } else {
                connection.query(
                  `INSERT INTO attendance SET ?;`, [insertData],
                  function (error, results) {
                    if (error != null) console.log(error)
                   return  res.status(200).send({
                      status: true,
                      message: "Berhasil",
                      data: results,
                    });
                  }
                );

              }

            }
          }else{
            return res.sttus(200).send({
              status: false,
              message: "Terjadi kesalahan",
              data: results,
            });
          }

        }
      );

    });
  },
  // kirimAbsen(req, res) {
  //   console.log('-----kirim absen----------')
  //   var database=req.query.database;

  //   let ts = Date.now();
  //   let date_ob = new Date(ts);
  //   let date = date_ob.getDate();
  //   let month = date_ob.getMonth() + 1;
  //   let year = date_ob.getFullYear();
  //   let hour = date_ob.getHours();
  //   let menit = date_ob.getMinutes();
  //   var randomstring = require("randomstring");
  //   var stringRandom = randomstring.generate(5);
  //   var nameFile = stringRandom + date + month + year + hour + menit + ".png";
  //   // if (req.body.reg_type == 1) {
  //   //   var randomstring = require("randomstring");
  //   //   var fs = require("fs");
  //   //   var image = req.body.gambar;
  //   //   var bitmap = Buffer.from(image, 'base64');
  //   //   var stringRandom = randomstring.generate(5);

  //   //   fs.writeFileSync("public/foto_absen/" + nameFile, bitmap);
  //   // }
  //     if (req.body.reg_type==1){
  //       const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFile}`;
  //       sftp.connect(configSftp)
  //      .then(() => {
  //        // SFTP connection successful
  //        return sftp.put(file.data, remoteFilePath);
  //      })
  //      .then(() => {
  //        console.log("berhasil upload image")

  //        sftp.end(); // Disconnect after the upload is complete
  //      })
  //      .catch(err => {
  //        console.log(`gagal upload image ${err}`)
  //        res.send({
  //          status: false,
  //          message: "Gagal registrasi wajah",
  //        });
  //        sftp.end(); // Disconnect if an error occurs
  //      });
  //      sftp.end();

  //     }

  //   var typeAbsen = req.body.typeAbsen;
  //   var jamMasuk = "";
  //   var jamKeluar = "";
  //   var gambarMasuk = "";
  //   var gambarKeluar = "";
  //   var lokasiAbsenIn = "";
  //   var lokasiAbsenOut = "";
  //   var latLangIn = "";
  //   var latLangOut = "";
  //   var lokasiMasuk = "";
  //   var lokasiKeluar = "";
  //   var catatanMasuk = "";
  //   var catatanKeluar = "";
  //   if (typeAbsen == "1") {
  //     jamMasuk = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
  //     gambarMasuk = req.body.reg_type == 0 ? "" : nameFile;
  //     lokasiMasuk = req.body.lokasi;
  //     catatanMasuk = req.body.catatan;
  //     latLangIn = req.body.latLang;
  //     lokasiAbsenIn = req.body.place;
  //   } else {
  //     jamKeluar = req.body.waktu == null || req.body.waktu == "" ? "00:00:00" : req.body.waktu;
  //     gambarKeluar = req.body.reg_type == 0 ? "" : nameFile;
  //     lokasiKeluar = req.body.lokasi;
  //     catatanKeluar = req.body.catatan;
  //     latLangOut = req.body.latLang;
  //     lokasiAbsenOut = req.body.place;
  //   }

  //   var insertData = {
  //     em_id: req.body.em_id,
  //     atten_date: req.body.tanggal_absen,
  //     signin_time: jamMasuk == null || jamMasuk == "" || jamMasuk == undefined ? "00:00:00" : jamMasuk,
  //     signout_time: jamKeluar == null || jamKeluar == "" || jamKeluar == undefined ? "00:00:00" : jamKeluar,
  //     working_hour: "",
  //     place_in: lokasiAbsenIn,
  //     place_out: lokasiAbsenOut,
  //     absence: "",
  //     overtime: "",
  //     earnleave: "",
  //     status: "",
  //     signin_longlat: latLangIn,
  //     signout_longlat: latLangOut,
  //     // att_type: "",
  //     signin_pict: gambarMasuk,
  //     signout_pict: gambarKeluar,
  //     signin_note: catatanMasuk,
  //     signout_note: catatanKeluar,
  //     signin_addr: lokasiMasuk,
  //     signout_addr: lokasiKeluar,
  //     atttype: parseInt(req.body.kategori),
  //     // reg_type: 0,
  //     reg_type: req.body.reg_type,
  //   };
  //   const tahun = `${year}`;
  //   const convertYear = tahun.substring(2, 4);
  //   const convertBulan = month <= 9 ? `0${month}` : month;
  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

  //   const configDynamic = {
  //     multipleStatements: true,
  //                host: '15.10.1.197',//my${database}.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {
  //     //database

  //           if (err) console.log(err);
  //     connection.query(
  //       `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`,
  //       function (error, results) {
  //         connection.release();
  //         if (error != null) console.log(error)
  //         if (req.body.kategori == "1") {
  //           if (results.length == 0) {
  //             connection.query(
  //               `INSERT INTO attendance SET ?;`, [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil",
  //                   data: results,
  //                 });



  //               }
  //             );


  //           } else {
  //             var lastItem = results.pop();
  //             if (lastItem.signout_longlat == "") {
  //               var id_record = lastItem.id;
  //               connection.query(
  //                 `UPDATE attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );


  //             } else {
  //               connection.query(
  //                 `INSERT INTO attendance SET ?;`, [insertData],
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );

  //             }

  //           }
  //         }

  //       }
  //     );





  //     if (err) console.log(err);
  //     connection.query(
  //       `SELECT * FROM attendance WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.tanggal_absen}';`,
  //       function (error, results) {
  //         connection.release();
  //         if (error != null) console.log(error)
  //         if (req.body.kategori == "1") {
  //           if (results.length == 0) {
  //             connection.query(
  //               `INSERT INTO attendance SET ?;`, [insertData],
  //               function (error, results) {
  //                 if (error != null) console.log(error)
  //                 res.send({
  //                   status: true,
  //                   message: "Berhasil",
  //                   data: results,
  //                 });
  //               }
  //             );


  //           } else {
  //             var lastItem = results.pop();
  //             if (lastItem.signout_longlat == "") {
  //               var id_record = lastItem.id;
  //               connection.query(
  //                 `UPDATE attendance SET signout_time='${jamKeluar}', place_out='${lokasiAbsenOut}', signout_longlat='${latLangOut}', signout_pict='${gambarKeluar}', signout_note='${catatanKeluar}', signout_addr='${lokasiKeluar}' WHERE id='${id_record}' ;`,
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );


  //             } else {
  //               connection.query(
  //                 `INSERT INTO attendance SET ?;`, [insertData],
  //                 function (error, results) {
  //                   if (error != null) console.log(error)
  //                   res.send({
  //                     status: true,
  //                     message: "Berhasil",
  //                     data: results,
  //                   });
  //                 }
  //               );

  //             }

  //           }
  //         }

  //       }
  //     );

  //   });
  // },
  load_aktifitas(req, res) {
    console.log('-----log aktifitas----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var limit = req.body.limit;
    var offset = req.body.offset;

    let ts = Date.now();
    let date_ob = new Date(ts);
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        `SELECT * FROM logs_actvity WHERE createdUserID='${em_id}' ORDER BY idx DESC LIMIT ${offset}, ${limit};`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            jumlah_data: results.length,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );

    });
  },
  pencarian_aktifitas(req, res) {
    console.log('-----perncatian aktifitas----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var cari = req.body.cari;

    let ts = Date.now();
    let date_ob = new Date(ts);
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    const tahun = `${year}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = month <= 9 ? `0${month}` : month;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) console.log(err);
      connection.query(
        `SELECT * FROM logs_actvity WHERE createdUserID='${em_id}' AND menu_name LIKE '%${cari}%' ORDER BY idx DESC`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            jumlah_data: results.length,
            message: "Berhasil ambil data!",
            data: results,
          });
        }
      );

    });
  },
  load_approve_info(req, res) {
    console.log('-----load approve info update----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert1 = parseInt(getbulan);
    var convertBulan = convert1 <= 9 ? `0${convert1}` : convert1;

     


    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // a.em_id,
   
    // var query1 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan IN ('2', '3') AND  `;
    // var query2 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='1'`;
    // var query3 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1'`;
    // var query4 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='2'`;
    // var query5 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='4'`;
    // var query6 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'`;
   
    // //  var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (a.approved_id IS NULL OR  a.approved_id ='') `;
   
    // var query7=`SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
    // JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
    // AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  IN (?)`
    // // var query8="SELECT * FROM emp_labor WHERE ajuan='3'  AND status_transaksi=1 AND (status='Pending' OR status='pending')"
   
   
    // var query8 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='3'`;
     


    var query1 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan IN ('2', '3') `;
    var query2 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='1' `;
    //var query3 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1' `;
    var query3 = `SELECT o.name as category_pengajuan,   a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='1'  `;
   
    var query4 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='2' `;
    
    var query5 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status='Pending' AND a.ajuan='4' `;
    var query6 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' `;
   
    //  var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (a.approved_id IS NULL OR  a.approved_id ='') `;
   
    var query7=`SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
    JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
    AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  LIKE '%${em_id}%'  AND a.created_date=CURDATE()`
    // var query8="SELECT * FROM emp_labor WHERE ajuan='3'  AND status_transaksi=1 AND (status='Pending' OR status='pending')"
   
   
    var query8 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
    JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE
     a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='3' AND a.status_transaksi=1 `;
     

     var query9 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending' AND a.ajuan='4' `;
    

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6};${query7};${query8};${query9};`,[em_id],
          function (error, results) {
            if (error != null) console.log(error)
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_tidak_hadir: results[0].length,
              jumlah_cuti: results[1].length,
              jumlah_lembur: results[2].length,
              jumlah_tugasluar: results[3].length,
              jumlah_dinasluar: results[4].length,
              jumlah_klaim: results[5].length,
              jumlah_payroll:results[6].length,
              jumlah_checkin:results[7].length,
              jumlah_wfh:results[7].length,
              data1: results[0],
              data2: results[1],
              data3: results[2],
              data4: results[3],
              data5: results[4],
              data6: results[5],
              data7: results[6],
              data7: results[7],
              data8: results[8],
              data9: results[9]
            });
          }
        );
      }


    });
  },
  load_approve_info_multi(req, res) {
    console.log('-----load approve infor multi----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    var hidden


    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert1 = parseInt(getbulan);
    var convertBulan = convert1 <= 9 ? `0${convert1}` : convert1;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // a.em_id,
  //   var query1 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan IN ('2', '3')`;
  //   var query2 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='1'`;
  //   var query3 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='1'`;
  //   var query4 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='2'`;
  //   var query5 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='4'`;
  //   var query6 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve')`;
  //  // var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id   AND created_date='${req.body.date}' AND a.approved_id IS NULL`;
  //   var query7=`SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
  //   JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
  //   AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  IN (?)`    
  //   var query8 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND (a.status='Pending' OR a.status='pending') AND a.ajuan='3'`;
    

  var query1 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan IN ('2', '3')  `  ;
  var query2 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='1' `;
  var query3 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='1' `;
  var query4 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='2' `;

  var query5 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.leave_status IN ('Pending', 'Approve') AND a.ajuan='4' `;
  
  var query6 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b JOIN  
  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  
  AND a.status IN ('Pending', 'Approve') `;
 // var query7 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id   AND created_date='${req.body.date}' AND a.approved_id IS NULL`;
  var query7=`SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
  JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
  AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  LIKE '%${em_id}%'  AND a.created_date=CURDATE()`  
  
  
  var query8 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b 
  JOIN  ${database}_hrm.branch ON b.branch_id=branch.id
  WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status IN ('Pending', 'Approve') AND a.ajuan='3' AND a.status_transaksi=1`;
  

  var query9 = `SELECT a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b JOIN  ${database}_hrm.branch ON b.branch_id=branch.id  WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status IN ('Pending', 'Approve') AND a.ajuan='4' `;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6};${query7};${query8};${query9}`,
          function (error, results) {
            if (error != null) console.log(error)
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              jumlah_tidak_hadir: results[0].length,
              jumlah_cuti: results[1].length,
              jumlah_lembur: results[2].length,
              jumlah_tugasluar: results[3].length,
              jumlah_dinasluar: results[4].length,
              jumlah_klaim: results[5].length,
              jumlah_payroll: results[6].length,
              jumlah_checkin: results[7].length,
              jumlah_wfh:results[8].length,
              data1: results[0],
              data2: results[1],
              data3: results[2],
              data4: results[3],
              data5: results[4],
              data6: results[5],
              data7: results[6],
              data8: results[7],
              data9: results[8],
            });
          }
        );
      }


    });
  },
  load_approve_history(req, res) {
    console.log('-----load approve hisotry----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert = parseInt(getbulan);
    var convertBulan = convert <= 9 ? `0${convert}` : convert;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    // const namaDatabaseDynamic = `hris_test2208`;

    var query1 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan IN ('2', '3')`;
    var query2 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='1'`;
    var query3 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='1'`;
    var query4 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='2'`;
    var query5 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.ajuan='4'`;
    var query6 = `SELECT a.*, c.name as nama_tipe, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%'`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6}`,
          function (error, results) {
            if (error != null) console.log(error)
            connection.release();
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data_tidak_hadir: results[0],
              data_cuti: results[1],
              data_lembur: results[2],
              data_tugas_luar: results[3],
              data_dinas_luar: results[4],
              data_klaim: results[5],
            });
          }
        );
      }

    });
  },
  load_approve_history_multi(req, res) {
    console.log('-----load approve hisotry multi----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convert = parseInt(getbulan);
    var convertBulan = convert <= 9 ? `0${convert}` : convert;

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    


    var query1 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan IN ('2', '3')`;
    var query2 = `SELECT a.*, c.name as nama_tipe, c.category, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='1'`;
    var query3 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='1'`;
    var query4 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='2'`;
    var query5 = `SELECT a.*, b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND a.ajuan='4'`;
    var query6 = `SELECT a.*, c.name as nama_tipe, b.full_name FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')`;
   var query7=`SELECT designation.payroll_approval, a.em_id, b.full_name FROM ${namaDatabaseDynamic}.emp_mobile_approval a 
    JOIN ${database}_hrm.employee b JOIN ${database}_hrm.designation ON designation.id=b.des_id WHERE a.em_id=b.em_id 
    AND (a.approved_id IS NULL OR  a.approved_id ='') AND designation.payroll_approval  IN (?)`
    


  
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(
          `${query1};${query2};${query3};${query4};${query5};${query6};${query6}`,
          function (error, results) {
            if (error != null) console.log(error)
            connection.release();   
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data_tidak_hadir: results[0],
              data_cuti: results[1],
              data_lembur: results[2],
              data_tugas_luar: results[3],
              data_dinas_luar: results[4],
              data_klaim: results[5],
              data_payroll: results[6],
            });
          }
        );
      }

    });
  },

  spesifik_approval(req, res) {
    console.log('-----spesifik approval----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var url_data = req.body.name_data;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;

    var stauts=req.body.status==undefined?"Pending":req.body.status;

    if (stauts=="pending" || stauts=="PENDING"){
      stauts="Pending"
    }


    console.log(req.body)

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT
    CASE
    WHEN ( a.apply_status OR a.apply_status='Pending') IS NULL AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
    WHEN  (a.apply_status  OR a.apply_status='Rejected') IS NULL AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS apply_status,
    CASE
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS apply2_status,
    a.leave_duration,
    a.em_delegation,
    a.apply_by,
    a.apply2_by,
    a.atten_date,
    a.reason,
    a.em_id,
    a.leave_files,
    a.start_date,
    a.end_date,
    a.leave_status,
    a.nomor_ajuan,
    c.name as nama_penagjuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  b.em_report_to LIKE '%${em_id}%' AND a.leave_status LIKE '%${stauts}%' AND a.leave_status!='Cancel' AND a.ajuan IN ('2', '3')`;
   
   //cuti 
    var query2 = `SELECT 
    CASE
    WHEN ( a.apply_status OR a.apply_status='Pending') IS NULL AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
    WHEN  (a.apply_status  OR a.apply_status='Rejected') IS NULL AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS apply_status,
    CASE
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS apply2_status,
    a.leave_duration,
    a.em_delegation,
    a.apply_by,
    a.apply2_by,
    a.atten_date,
    a.reason,
    a.em_id,
    a.leave_files,
    a.start_date,
    a.end_date,
    a.leave_status,
    a.nomor_ajuan,
    d.name AS nama_divisi, a.nomor_ajuan, c.name as nama_penagjuan,  b.em_report_to as em_report_to,  
    b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a 
    INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b  JOIN ${database}_hrm.designation  d ON d.id=b.des_id 
    WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' 
    AND a.leave_status LIKE '%${stauts}%' AND a.leave_status!='Cancel' ${stauts==""?"AND a.leave_status!='Pending'":""}  AND leave_status AND a.ajuan='1'`;
    
    
    var query3 = `SELECT
    
    CASE
    WHEN ( a.approve_status OR a.approve_status='Pending') IS NULL AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
    WHEN  (a.approve_status  OR a.approve_status='Rejected') IS NULL AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS approve_status,
    CASE
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS approve2_status,
    a.dari_jam,
    a.sampai_jam,
    a.approve_by,
    a.approve2_by,
    a.em_delegation,
    a.atten_date,
    a.uraian,
    a.nomor_ajuan,
    a.em_id,
    a.approve_id,
    a.place_in,
    a.place_out,
    a.status,
        
    
    o.name as nama_pengajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId  WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND a.ajuan='1'`;
    var query4 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, a.* FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND a.ajuan='2' `;
   
    var query5 = `SELECT 
    CASE
    WHEN ( a.apply_status OR a.apply_status='Pending') IS NULL AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
    WHEN  (a.apply_status  OR a.apply_status='Rejected') IS NULL AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS apply_status,
    CASE
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
    WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS apply2_status,
    a.leave_duration,
    a.em_delegation,
    a.apply_by,
    a.apply2_by,
    a.atten_date,
    a.reason,
    a.em_id,
    a.leave_files,
    a.start_date,
    a.end_date,
    a.leave_status,
    a.nomor_ajuan,
    
    b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.leave_status LIKE '%${stauts}%' AND a.leave_status!='Cancel' AND a.ajuan='4'`;
    
    var query6 = `SELECT (IFNULL(a.sisa_claim ,0)) as sisa_claim ,(IFNULL(a.saldo_claim ,0)) as saldo_claim , c.id as id_ajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, a.*
     FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b
     WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%'  AND a.status!='Cancel' AND a.status LIKE '%${stauts}%'`
    
      // var query7 = `SELECT b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'`;
    var query7 = `SELECT
    CASE
    WHEN ( a.approve_status OR a.approve_status='Pending') IS NULL AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
    WHEN  (a.approve_status  OR a.approve_status='Rejected') IS NULL AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

    ELSE "Approve"
    END AS approve_status,
    CASE
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
    WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
    

    ELSE "Approve"
    END AS approve2_status,
    a.dari_jam,
    a.sampai_jam,
    a.approve_by,
    a.approve2_by,
    a.em_delegation,
    a.atten_date,
    a.uraian,
    a.nomor_ajuan,
    a.em_id,
    a.approve_id,
    a.place_in,
    a.place_out,
    a.status,
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
     b.full_name,a.status as leave_status FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b
     WHERE a.em_id=b.em_id  AND b.em_report_to LIKE '%${em_id}% AND a.status LIKE '%${stauts}%' AND a.status!='Cancel' AND a.ajuan='3' AND a.status_transaksi=1`;
    
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: []
        });
      } else {
        if (url_data == "cuti") {
          connection.query(
            query2,
            function (error, dataCuti) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve cuti!",
                jenis: 'cuti',
                data: dataCuti
              });
            }
          );

        } else if (url_data == "tidak_hadir") {
          connection.query(
            query1,
            function (error, dataTidakHadir) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Tidak Hadir!",
                jenis: 'tidak_hadir',
                data: dataTidakHadir
              });
            }
          );

        } else if (url_data == "lembur") {
          connection.query(
            query3,
            function (error, dataLembur) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Lembur!",
                jenis: 'lembur',
                data: dataLembur
              });
            }
          );

        } else if (url_data == "tugas_luar") {
          connection.query(
            query4,
            function (error, dataTugasLuar) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Tugas Luar!",
                jenis: 'Tugas Luar',
                data: dataTugasLuar
              });
            }
          );

        } else if (url_data == "dinas_luar") {
          connection.query(
            query5,
            function (error, dataDinasLuar) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Dinas Luar!",
                jenis: 'Dinas Luar',
                data: dataDinasLuar
              });
            }
          );

        } else if (url_data == "klaim") {
          connection.query(
            query6,
            function (error, dataKlaim) {
              connection.release();
              res.send({  
                message: "Berhasil ambil data approve klaim!",
                jenis: 'Klaim',
                data: dataKlaim
              });
            }
          );

        } else if (url_data == "absensi") {
          connection.query(
            query7,
            function (error, dataAbsensi) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve klaim!",
                jenis: 'absensi',
                data: dataAbsensi
              });
            }
          );

        }
      }

    })
  },

  async ApprovalAbsensi(req,res){
    console.log("approval employee attendance new")
    var database=req.query.database;
    var email=req.query.email;
    var emId=req.body.em_id;
    let records;
    var emId = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var status=req.body.status;
    var signinTime=req.body.signin_time;
    var signOutTime=req.body.signout_time;
    var date=req.body.date;
    var approveId=req.body.approved_id;
    var approvedBy=req.body.approved_by;
    var id=req.body.id;
    var alasanRejected=req.body.alasan_reject;
    var status=req.body.status;
    var image=req.body.image
    var note=req.body.image;
    var placeIn=req.body.place_in;
    var placeOut=req.body.place_out 
    var placeOut=req.body.pola;
  

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

var pola=req.body.pola;

    if (pola=="1"){
      const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
      console.log(`database dynamic ${namaDatabaseDynamic}`)
        try{
            const connection=await model.createConnection(database);
            connection.connect((err) => {
              if (err) {
                console.error('Error connecting to the database:', err);
                return;
              }  
              connection.beginTransaction((err) => {
                if (err) {
                  console.error('Error beginning transaction:', err);
                  connection.end();
                  return;
                }
  
      var approveDate1=req.body.approve_date1;
      var approveBy1=req.body.approve_by1;
   
      var approveId1=req.body.approve_id1
  
  
      var approveBy2=req.body.approve_by2;
      var approveDate2=req.body.approve_Date2
      var approveId2=req.body.approve_id2
            
  
                var query1="";
  
                query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approveDate1}' , approve_by='${approveBy1}',approve_id='${approveId1}',approve2_date='' , approve2_by='',approve2_id=''  WHERE id='${id}'`;
               
                // if (status=='Approve'){
              
                //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}',approve_date='${approvedDate}' , approve_by='${approvedBy}' ,approve_id='${approveId}' WHERE id='${id}' `;
                // }else{
                //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approvedDate}' , approve_by='${approvedBy}',approve_id='${approveId}'  WHERE id='${id}'`;
               
               
                // }


                    connection.query( query1, (err, results) => {
                    
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: false,
                            message: 'gagal ambil data',
                            data:[]
                          
                          });
                        });
                        return;
                      }
  
                      console.log("tes")
                      if (
                        status=="Rejected"
                      ){
                        connection.commit((err) => {
                          if (err) {
                            console.error('Error committing transaction:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                         message: "Terjadi kesalahan",
                          
                          
                          
                          
                                         data:[]
                              
                              });
                            });
                            return;
                          }
                          
  
                        
                      
                        });
  
                        connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: "Berhasil approve pengajuan absensi",
                            data:records
                          
                          });
    
  
                      }
                      
  
                  connection.query(`SELECT * FROM ${namaDatabaseDynamic}.attendance  WHERE  atten_date='${date}' AND em_id='${emId}'`, (err,results) => {
                  if (err) {
                    console.error('Error executing UPDATE statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'terjadi kesalahan',
                        data:[]
                      
                      });
                    });
                    return;
                  }
                    records=results
             
                  
  
                    if (records.length>0){
                      console.log("masuk sini update data")
                      
  
                    connection.query(`UPDATE TOP 1 ${namaDatabaseDynamic}.attendance SET signin_time='${signinTime}',signout_time='${signOutTime}' WHERE em_id='${emId}' AMD atten_date=''  `, (err,results) => {
                      if (err) {
                        console.error('Error executing UPDATE statement:', err);
                        connection.rollback(() => {
                       
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'terjadi kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }
  
                   
  
  
          
  
                      connection.commit((err) => {
                        if (err) {
                          console.error('Error committing transaction:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                                       message: "Kombinasi email & password Anda Salah",
                              data:[]
                            
                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log('Transaction completed successfully!');
                        return res.status(200).send({
                          status: true,
                          message: "Kombinasi email & password Anda Salah",
                          data:records
                        
                        });
  
                    
                      });
                    });
  
                    }
                    
                    else{
                   
  
                        var queryInsert=`INSERT INTO 
                        ${namaDatabaseDynamic}.attendance(em_id,
                        atten_date,
                        signin_time,
                        signout_time,
                        place_in,
                        place_out,
                        signin_longlat,
                        signout_longlat,
                        signin_pict,
                        signout_pict,
                        signin_note,
                        signout_note,
                        signin_addr,
                        signout_addr,
                        atttype,
                        reg_type,working_hour,absence,overtime,earnleave,status)
                      VALUES ('${emId}','${date??""}','${signinTime??""}','${signOutTime??""}','${placeIn??""}','${placeOut??""}','','','${image??""}','${image??""}','${note??""}','${note??""}','','',1,1,"","","","","") `
                          console.log(queryInsert)  
                    connection.query(queryInsert, (err,results) => {
                      if (err) {
                        console.error('Error executing UPDATE statement:', err);
                        connection.rollback(() => {
                       
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'terjadi kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      console.log("berhasi insert absen ",results)
  
                   
  
  
          
  
                      connection.commit((err) => {
                        if (err) {
                          console.error('Error committing transaction:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                                       message: "Terjadi kesalahan",
                        
                        
                        
                        
                                       data:[]
                            
                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log('Transaction completed successfully!');
                        return res.status(200).send({
                          status: true,
                          message: "Berhasil approve pengajuan absensi",
                          data:records
                        
                        });
  
                    
                      });
                    });
  
                      
                    }
  
                  });
                });
              });
            });
            
            
          
        }catch($e){
          return res.status(400).send({
            status: true,
            message: 'Gagal ambil data',
            data:[]
          
          });
    
        }
    }else{
      console.log(req.body)

       const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
      console.log(`database dynamic ${namaDatabaseDynamic}`)
        try{
            const connection=await model.createConnection(database);
            connection.connect((err) => {
              if (err) {
                console.error('Error connecting to the database:', err);
                return;
              }  
              connection.beginTransaction((err) => {
                if (err) {
                  console.error('Error beginning transaction:', err);
                  connection.end();
                  return;
                }
  
      var approveDate1=req.body.approve_date1;
      var approveBy1=req.body.approve_by1;
   
      var approveId1=req.body.approve_id1
      var approveStatus=req.body.approve_status;
      var approve2Status=req.body.approve2_status;
  
  
      var approveBy2=req.body.approve_by2;
      var approveDate2=req.body.approve_Date1
      var approveId2=req.body.approve_id2
            
  
                var query1="";
                  if (approveId2==""){
                    query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approveDate1}' , approve_by='${approveBy1}',approve_id='${approveId1}',approve2_date='' , approve2_by='',approve2_id='' ,approve_status='${approveStatus}'  WHERE id='${id}'`;
               

                  }else{
                    query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='Approve2', alasan_reject='${alasanRejected}',approve_date='${approveDate1}' , approve_by='${approveBy1}',approve_id='${approveId1}',approve2_date='${approveDate2}' , approve2_by='${approveBy2}',approve2_id='${approveId2}'  ,approve2_status='${approve2Status}' WHERE id='${id}'`;
              

                  }
             
                // if (status=='Approve'){
              
                //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}',approve_date='${approvedDate}' , approve_by='${approvedBy}' ,approve_id='${approveId}' WHERE id='${id}' `;
                // }else{
                //   query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}',approve_date='${approvedDate}' , approve_by='${approvedBy}',approve_id='${approveId}'  WHERE id='${id}'`;
               
               
                // }
            
  
            
                    connection.query( query1, (err, results) => {
                    
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: false,
                            message: 'gagal ambil data',
                            data:[]
                          
                          });
                        });
                        return;
                      }
  
                  
                      if (
                        status=="Rejected"
                      ){
                        connection.commit((err) => {
                          if (err) {
                            console.error('Error committing transaction:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                         message: "Terjadi kesalahan",
                          
                          
                          
                          
                                         data:[]
                              
                              });
                            });
                            return;
                          }
                          
  
                        
                      
                        });
  
                        connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: "Berhasil reject pengajuan absensi",
                            data:records
                          
                          });
    
  
                      }

                      if (approveId2=="" ||  approveId2=="null" || approveId2==undefined){
                        connection.commit((err) => {
                          if (err) {
                            console.error('Error committing transaction:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                         message: "Terjadi kesalahan",
                          
                          
                          
                          
                                         data:[]
                              
                              });
                            });
                            return;
                          }
                          
  
                        
                      
                        });
  
                        connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: "Berhasil reject pengajuan absensi",
                            data:records
                          
                          });
    

                      }
                      
  
                  connection.query(`SELECT * FROM ${namaDatabaseDynamic}.attendance  WHERE  atten_date='${date}' AND em_id='${emId}'`, (err,results) => {
                  if (err) {
                    console.error('Error executing UPDATE statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'terjadi kesalahan',
                        data:[]
                      
                      });
                    });
                    return;
                  }
                    records=results
             
                  
  
                    if (records.length>0){
                      console.log("masuk sini update data")
                      
  
                    connection.query(`UPDATE  ${namaDatabaseDynamic}.attendance SET signin_time='${signinTime}',signout_time='${signOutTime}' WHERE em_id='${emId}' AND atten_date='${date}'  `, (err,results) => {
                      if (err) {
                        console.error('Error executing UPDATE statement:', err);
                        connection.rollback(() => {
                       
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'terjadi kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }
  
                   
  
  
          
  
                      connection.commit((err) => {
                        if (err) {
                          console.error('Error committing transaction:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                                       message: "Kombinasi email & password Anda Salah",
                              data:[]
                            
                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log('Transaction completed successfully!');
                        return res.status(200).send({
                          status: true,
                          message: "Kombinasi email & password Anda Salah",
                          data:records
                        
                        });
  
                    
                      });
                    });
  
                    }
                    
                    else{
                   
  
                        var queryInsert=`INSERT INTO 
                        ${namaDatabaseDynamic}.attendance(em_id,
                        atten_date,
                        signin_time,
                        signout_time,
                        place_in,
                        place_out,
                        signin_longlat,
                        signout_longlat,
                        signin_pict,
                        signout_pict,
                        signin_note,
                        signout_note,
                        signin_addr,
                        signout_addr,
                        atttype,
                        reg_type,working_hour,absence,overtime,earnleave,status)
                      VALUES ('${emId}','${date??""}','${signinTime??""}','${signOutTime??""}','${placeIn??""}','${placeOut??""}','','','${image??""}','${image??""}','${note??""}','${note??""}','','',1,1,"","","","","") `
                          console.log(queryInsert)  
                    connection.query(queryInsert, (err,results) => {
                      if (err) {
                        console.error('Error executing UPDATE statement:', err);
                        connection.rollback(() => {
                       
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'terjadi kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      console.log("berhasi insert absen ",results)
  
                   
  
  
          
  
                      connection.commit((err) => {
                        if (err) {
                          console.error('Error committing transaction:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                                       message: "Terjadi kesalahan",
                        
                        
                        
                        
                                       data:[]
                            
                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log('Transaction completed successfully!');
                        return res.status(200).send({
                          status: true,
                          message: "Berhasil approve pengajuan absensi",
                          data:records
                        
                        });
  
                    
                      });
                    });
  
                      
                    }
  
                  });
                });
              });
            });
            
            
          
        }catch($e){
          return res.status(400).send({
            status: true,
            message: 'Gagal ambil data',
            data:[]
          
          });
    
        }
    }
 

      // var email = req.body.email;
      // var password = sha1(req.body.password);
      // var token_notif = req.body.token_notif;
  
      // pool.getConnection(function (err, connection) {
  
      //   if (err) console.log(err);
      //   connection.query(
      //    ,
      //     function (error, results) {
      //       if (error) console.log(error);
      //       if (results.length == 0) {
      //         res.send({
      //           status: false,
      //           message: "Kombinasi email & password Anda Salah",
      //         });
      //       } else {
      //         var updateToken = `UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${email}'`;
      //         connection.query(
      //           updateToken,
      //           function (error, results) {
      //           }
      //         )
      //         res.send({
      //           status: true,
      //           message: "Berhasil ambil data!",
      //           data: results,
      //         });
      //       }
      //     }
      //   );
      //   connection.release();
      // });
    
  },
  // spesifik_approval(req, res) {
  //   console.log('-----spesifik approval----------')
  //   var database = req.query.database;
  //   var em_id = req.body.em_id;
  //   var url_data = req.body.name_data;
  //   var getbulan = req.body.bulan;
  //   var gettahun = req.body.tahun;
  //   var approvename=req.body.name;
  //   var approveid=req.body.approveId;
  //   var approvedDate=req.body.approve_daet;
  //   var alasanRejected=req.body.alasan_rejected;


  //   var status=req.body.status;
  //   var id=req.body.id;

  //   var date=req.body.date


  //   const tahun = `${gettahun}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (getbulan.length == 1) {
  //     convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
  //   } else {
  //     convertBulan = getbulan;
  //   }
  //   const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
  //   var query1="";
  //   if (status=='Approve'){
  
  //     query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}',approve_date='${approvedDate}' , approve_by='${approveBy}' ,approve_id='${approveid}' WHERE id='${id}' `;
  //   }else{
  //     query1 = `UPDATE ${namaDatabaseDynamic}.emp_labor SET status='${status}', alasan_reject='${alasanRejected}' WHERE id='${id}'`;
  //   }

 

  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: '15.10.1.197',//myhris.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.send({
  //         status: false,
  //         message: "Database tidak ditemukan",
  //         data: []
  //       });
  //     } else {
       
  //         connection.query(
  //           query1,
  //           function (error, results) {
  //             if (error) {
  //               res.send({
  //                 status: false,
  //                 message: "Database tidak ditemukan",
  //                 data: []
  //               });
  //             }else{

  //               `SELECT TOP 1 FROM attendance WHERE em_id='${em_id}' AND date='${date}' `
  //               connection.query(
  //                 query1,
  //                 function (error, results) {
  //                   if (error) {
  //                     res.send({
  //                       status: false,
  //                       message: "Database tidak ditemukan",
  //                       data: []
  //                     });
  //                   }else{
      
  //                     `SELECT TOP 1 FROM attendance WHERE em_id='${em_id}' AND date='${date}' `
      
  //                   }
                   
  //                 }
  //               );
      

  //             }
             
  //           }
  //         );

        
  //     }

  //   })
  // },
  spesifik_approval_multi(req, res) {
    console.log('-----spesifik approval multi approvedd----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var url_data = req.body.name_data;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var stauts=req.body.status==undefined?"Pending":req.body.status;
    var conditionStatus="";
    var conditionStatusLabor="";

    console.log(req.body)

    if (stauts=="pending" || stauts=="PENDING"){
      conditionStatus="AND a.leave_status IN ('Pending','Approve')"
    }else{
      conditionStatus="AND a.leave_status IN ('Approve2','Rejected')"

    }

    if (stauts=="pending" || stauts=="PENDING"){

      conditionStatusLabor="AND a.status IN ('Pending','Approve')"
    }else{
      conditionStatusLabor="AND a.status  IN  ('Approve2','Rejected')"

    }

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    var query1 = `SELECT
    CASE
     WHEN ( a.apply_status OR a.apply_status='Pending') IS NULL AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  OR a.apply_status='Rejected') IS NULL AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
     c.name as nama_penagjuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id 
    AND   (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  ${conditionStatus}  AND a.leave_status!='Cancel' AND a.ajuan IN ('2', '3')`;
   
    //cuti 
     var query2 = `SELECT
     CASE
     WHEN ( a.apply_status OR a.apply_status='Pending') IS NULL AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  OR a.apply_status='Rejected') IS NULL AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
     


  
      d.name AS nama_divisi, a.nomor_ajuan, c.name as nama_penagjuan,  b.em_report_to as em_report_to,  
     b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, c.category FROM ${namaDatabaseDynamic}.emp_leave a 
     INNER JOIN ${database}_hrm.leave_types c ON a.typeid=c.id JOIN ${database}_hrm.employee b  JOIN ${database}_hrm.designation  d ON d.id=b.des_id 
     WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') 
 ${conditionStatus}   AND a.ajuan='1'`;
     
     
     var query3 = `SELECT 
     CASE
     WHEN ( a.approve_status OR a.approve_status='Pending') IS NULL AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status  OR a.approve_status='Rejected') IS NULL AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     a.status,
   
    
   
     o.name as nama_pengajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b LEFT JOIN ${database}_hrm.overtime o ON o.id=a.typeId  WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor}AND a.status!='Cancel' AND a.ajuan='1'`;
     var query4 = `SELECT
     CASE
     WHEN ( a.approve_status OR a.approve_status='Pending') IS NULL AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status  OR a.approve_status='Rejected') IS NULL AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     a.status,
      b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='2' `;
    
     var query5 = `SELECT
     CASE
     WHEN ( a.apply_status OR a.apply_status='Pending') IS NULL AND (a.apply_by IS NULL OR a.apply_by='') THEN "Pending"
     WHEN  (a.apply_status  OR a.apply_status='Rejected') IS NULL AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS apply_status,
     CASE
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Pending') AND (a.apply_by ='') THEN "Pending"
     WHEN (a.apply2_status IS NULL OR a.apply2_status='Rejected') AND (a.apply_by!='') AND a.leave_status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS apply2_status,
     a.leave_duration,
     a.em_delegation,
     a.apply_by,
     a.apply2_by,
     a.atten_date,
     a.reason,
     a.em_id,
     a.leave_files,
     a.start_date,
     a.end_date,
     a.leave_status,
     a.nomor_ajuan,
     
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name  FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  ${conditionStatus}  AND a.leave_status!='Cancel' AND a.ajuan='4'`;
     
     var query6 = `SELECT (IFNULL(a.sisa_claim ,0)) as sisa_claim ,(IFNULL(a.saldo_claim ,0)) as saldo_claim , c.id as id_ajuan, b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,   b.full_name, c.name as nama_tipe, a.*
      FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b
      WHERE a.em_id=b.em_id AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%')  AND a.status!='Cancel' ${conditionStatusLabor}`
     
       // var query7 = `SELECT b.full_name, c.name as nama_tipe, c.category, a.* FROM ${namaDatabaseDynamic}.emp_claim a INNER JOIN ${database}_hrm.cost c ON a.cost_id=c.id JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND b.em_report_to LIKE '%${em_id}%' AND a.status='Pending'`;
     var query7 = `SELECT b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
      b.full_name, a.*,a.status as leave_status FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b
      WHERE a.em_id=b.em_id  AND  (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') AND ${conditionStatusLabor} AND a.status!='Cancel' AND a.ajuan='3' AND a.status_transaksi=1`;
  
  
    var query8 = `SELECT
    CASE
     WHEN ( a.approve_status OR a.approve_status='Pending') IS NULL AND (a.approve_by IS NULL OR a.approve_by='') THEN "Pending"
     WHEN  (a.approve_status  OR a.approve_status='Rejected') IS NULL AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"

     ELSE "Approve"
     END AS approve_status,
     CASE
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Pending') AND (a.approve_by!='') THEN "Pending"
     WHEN (a.approve2_status IS NULL OR a.approve2_status='Rejected') AND (a.approve_by!='') AND a.status='Rejected'THEN "Rejected"
     

     ELSE "Approve"
     END AS approve2_status,
     a.dari_jam,
     a.sampai_jam,
     a.approve_by,
     a.approve2_by,
     a.em_delegation,
     a.atten_date,
     a.uraian,
     a.nomor_ajuan,
     a.em_id,
     a.approve_id,
     a.place_in,
     a.place_out,
     
     b.em_report_to as em_report_to,  b.em_report2_to as em_report2_to,  
     b.full_name,a.status as leave_status FROM ${namaDatabaseDynamic}.emp_labor a 
     JOIN ${database}_hrm.employee b WHERE a.em_id=b.em_id AND (b.em_report_to LIKE '%${em_id}%' OR b.em_report2_to LIKE '%${em_id}%') ${conditionStatusLabor} AND a.ajuan='3' AND a.status_transaksi=1`;
   

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: []
        });
      } else {
        if (url_data == "cuti") {
          connection.query(
            query2,
            function (error, dataCuti) {
              console.log(dataCuti)
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve cuti!",
                jenis: 'cuti',
                data: dataCuti
              });
            }
          );

        } else if (url_data == "tidak_hadir") {
          connection.query(
            query1,
            function (error, dataTidakHadir) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Tidak Hadir!",
                jenis: 'tidak_hadir',
                data: dataTidakHadir
              });
            }
          );

        } else if (url_data == "lembur") {
          connection.query(
            query3,
            function (error, dataLembur) {
              console.log(query3)
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Lembur!",
                jenis: 'lembur',
                data: dataLembur
              });
            }
          );

        } else if (url_data == "tugas_luar") {
          connection.query(
            query4,
            function (error, dataTugasLuar) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Tugas Luar!",
                jenis: 'Tugas Luar',
                data: dataTugasLuar
              });
            }
          );

        } else if (url_data == "dinas_luar") {
          console.log(query5)
          connection.query(
            query5,
            function (error, dataDinasLuar) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Dinas Luar!",
                jenis: 'Dinas Luar',
                data: dataDinasLuar
              });
            }
          );

        } else if (url_data == "klaim") {
          connection.query(
            query6,
            function (error, dataKlaim) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve Klaim!",
                jenis: 'Klaim',
                data: dataKlaim
              });
            }
          );

        }else if (url_data == "absensi") {
          connection.query(
            query8,
            function (error, dataAbsensi) {
              connection.release();
              console.log(dataAbsensi)
              res.send({
                status: true,
                message: "Berhasil ambil data approve Klaim!",
                jenis: 'Klaim',
                data: dataAbsensi
              });
            }
          );

        }
      }

    })
  },
  listApprovalPayroll(req, res) {
    console.log('-----spesifik approval----------')
    console.log(req.body)
    var database = req.query.database;
    var em_id = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var dateNow=req.body.date;


    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT designation.name as nama_divisi, employee.full_name,employee.em_email,emp_mobile_approval.* FROM emp_mobile_approval JOIN ${database}_hrm.employee ON employee.em_id=emp_mobile_approval.em_id JOIN ${database}_hrm.designation ON employee.des_id=designation.id AND (emp_mobile_approval.approved_id IS NULL) AND created_date='${req.body.date}'`;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
          data: []
        });
      } else {
       
          connection.query(
            query1,
            function (error, dataCuti) {
              connection.release();
              res.send({
                status: true,
                message: "Berhasil ambil data approve payroll",
                jenis: 'cuti',
                data: dataCuti
              });
            }
          );

        
      }

    })
  },

  
  // checkSlipGajiValidation(req, res) {
  //   console.log('-----spesifik ----------')
  //   console.log(req.body)
  //   var database = req.query.database;
  //   var em_id = req.body.em_id;
  //   var getbulan = req.body.bulan;
  //   var gettahun = req.body.tahun;
  //   var dateNow=req.body.date;
  //   var des_id=req.body.des_id;


  //   const tahun = `${gettahun}`;
  //   const convertYear = tahun.substring(2, 4);
  //   var convertBulan;
  //   if (getbulan.length == 1) {
  //     convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
  //   } else {
  //     convertBulan = getbulan;
  //   }
  //   const namaDatabaseDynamic = `${database}_hrm`;

    // var query1 = `SELECT * FROM employee JOIN designation ON desination.id=employee.des_id WHERE employee.em_id='${em_id}' AND designation.id='${des_id}' AND designation is NOT NULL`;


  //   const configDynamic = {
  //     multipleStatements: true,
  //     host: '15.10.1.197',//myhris.siscom.id (ip local)
  //     user: 'pro',
  //     password: 'Siscom3519',
  //     database: `${namaDatabaseDynamic}`,
  //     connectionLimit: 1000,
  //     connectTimeout: 60 * 60 * 1000,
  //     acquireTimeout: 60 * 60 * 1000,
  //     timeout: 60 * 60 * 1000,
  //   };
  //   const mysql = require("mysql");
  //   const poolDynamic = mysql.createPool(configDynamic);

  //   poolDynamic.getConnection(function (err, connection) {

  //     if (err) {
  //       res.status(404).send({
  //         status: false,
  //         message: "Database tidak ditemukan",
  //         data: []
  //       });
  //     } else {
       
  //         connection.query(
  //           query1,
  //           function (error, data) {
              
  //             console.log(data)
  //             if (data.length>0){
  //               res.status(200).send({
  //                 status: false,
  //                 message: "Database tidak ditemukan",
  //                 data: []
  //               });

  //             }else{
  //               res.status(400).send({
  //                 status: false,
  //                 message: "Database tidak ditemukan",
  //                 data: []
  //               });
  //             }
           
              
  //           }
  //         );

        
  //     }

  //   })
  // },



  load_notifikasi(req, res) {
    console.log('-----load aktifitas----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var query1 = `SELECT atten_date FROM notifikasi WHERE em_id='${em_id}' ORDER BY id DESC`;
    var query2 = `SELECT * FROM notifikasi WHERE em_id='${em_id}'`;

    var getTahun = req.body.tahun;
    var getBulan = req.body.bulan;



    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${getBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {

      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan"
        });
      } else {
        connection.query(
          query1,
          function (error, dataTanggal) {
            connection.release();
            var listTanggal = dataTanggal;
            let filter1 = [];
            listTanggal.forEach(element => {
              filter1.push(element['atten_date']);
            });
            filter1 = filter1.filter((value, index, arr) => arr.indexOf(value) == index);

            connection.query(
              query2,
              function (error, dataAll) {
                var allData = dataAll;
                var hasilFinal = [];
                filter1.forEach(element => {
                  var turunan = [];
                  allData.forEach(element2 => {
                    if (element2['atten_date'] == element) {
                      turunan.push(element2)
                    }
                  });
                  var data = {
                    tanggal: element,
                    notifikasi: turunan
                  };
                  hasilFinal.push(data);
                });
                res.send({
                  status: true,
                  message: "Berhasil ambil!",
                  data: hasilFinal
                });
              }
            );

          }
        );

      }

    });
  },
  load_laporan_absensi(req, res) {
    console.log('-----load laporan absensi----------')
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var status = req.body.status;

    var database = req.query.database;

    const tahun = gettahun;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getbulan.length > 1) {
      convertBulan = getbulan;
    } else {
      var bulan_convert = getbulan <= 9 ? `0${getbulan}` : getbulan;
      convertBulan = bulan_convert;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    console.log(req.body);
    console.log(namaDatabaseDynamic);

    // var query1 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN hris_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' ) AND A.status='ACTIVE' ORDER BY A.full_name`;
    // var query2 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN hris_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' ) AND A.dep_id='${status}' AND A.status='ACTIVE' ORDER BY A.full_name`;

    var query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id) AND A.status='ACTIVE' GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;
    var query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id) AND A.dep_id='${status}' AND A.status='ACTIVE' GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;

    var url;
    if (status == '0') {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results
            });
          }
        );
      }
    });
  },

  load_laporan_absensi_filter_lokasi(req, res) {
    console.log('-----load laporan absensi filter lokasi----------')
    var database = req.query.database;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var status = req.body.status;

    const tahun = gettahun;
    const convertYear = tahun.substring(2, 4);

    var convertBulan;
    if (getbulan.length > 1) {
      convertBulan = getbulan;
    } else {
      var bulan_convert = getbulan <= 9 ? `0${getbulan}` : getbulan;
      convertBulan = bulan_convert;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.place_in FROM ${namaDatabaseDynamic}.attendance C INNER JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE month(C.atten_date)='${getbulan}' AND A.status='ACTIVE' ORDER BY A.full_name`;
    var query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.place_in FROM ${namaDatabaseDynamic}.attendance C INNER JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE month(C.atten_date)='${getbulan}' AND A.status='ACTIVE' AND A.dep_id='${status}' ORDER BY A.full_name`;

    var url;
    if (status == '0') {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results
            });
          }
        );
      }
    });
  },

  load_laporan_absensi_tanggal(req, res) {
    console.log('-----log laporan absensi tanggal----------')
    var database = req.query.database;
    var atten_date = req.body.atten_date;
    var status = req.body.status;

    var array = atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    // var query1 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' AND atten_date='${atten_date}' ) AND A.status='ACTIVE' ORDER BY A.full_name`;
    // var query2 = `SELECT A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atttype='1' AND atten_date='${atten_date}' ) AND A.status='ACTIVE' AND A.dep_id='${status}' ORDER BY A.full_name`;

    var query1 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atten_date='${atten_date}') AND A.status='ACTIVE' GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;
    var query2 = `SELECT A.full_name, A.job_title, C.id as id_absen, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.signin_longlat, C.signout_longlat, C.signin_note, C.place_in FROM ${namaDatabaseDynamic}.attendance C RIGHT JOIN ${database}_hrm.employee A ON A.em_id=C.em_id WHERE CONCAT(C.atten_date,C.signin_time)=(SELECT MAX(CONCAT(atten_date,signin_time)) FROM ${namaDatabaseDynamic}.attendance WHERE em_id=C.em_id AND atten_date='${atten_date}') AND A.dep_id='${status}' AND A.status='ACTIVE' GROUP BY A.full_name, A.job_title, C.em_id, C.atten_date, C.signin_time, C.signout_time, C.place_in, C.signin_note`;


    var url;
    if (status == '0') {
      url = query1;
    } else {
      url = query2;
    }

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results
            });
          }
        );
      }
    });
  },

  load_laporan_absensi_harian(req, res) {
    console.log('-----load lapoarn absensi  ----------')
    var database = req.query.database;

    var status = req.body.status;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    var query1 = `SELECT a.atten_date, a.signin_time, a.place_in, b.em_id, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.attendance a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE' ORDER BY a.id DESC`;
    var query2 = `SELECT a.atten_date, a.signin_time, a.place_in, b.em_id, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.attendance a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE' AND b.dep_id='${status}' ORDER BY a.id DESC`;

    var url;
    if (status == '0') {
      url = query1;
    } else {
      url = query2;
    }


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results,
              jumlah: results.length
            });
          }
        );
      }
    });
  },

  load_laporan_absensi_harian_telat(req, res) {
    console.log('-----load lapoarn absensi harian telat dev----------')
    var database = req.query.database;

    var status = req.body.status;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    var query1 = `SELECT DISTINCT emp.full_name AS full_name,
    cb.name AS branch_name,att.atten_date,att.signin_time,emp.job_title,emp.em_id,att.place_in,
    (
      (
        (
          TIMEDIFF (
            att.signin_time,
            (
              IFNULL (
                (SELECT
                  b.time_in
                FROM
                ${namaDatabaseDynamic}.emp_shift a,
                  ${database}_hrm.work_schedule b
                WHERE a.work_id = b.id
                  AND a.em_id = att.em_id
                  AND a.atten_date = att.atten_date),
                (SELECT
                  c.time_in
                FROM
                  ${database}_hrm.work_schedule c
                WHERE c.id = '2')
              )
            )
          )
        )
      )
    ) AS selisih,IFNULL (
      IFNULL (
        IFNULL (
          (SELECT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN LEFT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN LEFT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D03'),
          (SELECT DISTINCT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN LEFT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN LEFT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D02')
        ),
        IFNULL (
          (SELECT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN RIGHT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN RIGHT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D03'),
          (SELECT DISTINCT
            ax.late_time
          FROM
            ${database}_hrm.late_rate ax
          WHERE (
              CASE
                WHEN LENGTH (ax.places) = '1'
                THEN RIGHT (ax.places, 1)
                WHEN LENGTH (ax.places) > '1'
                THEN RIGHT (ax.places, 2)
              END
            ) =
            (SELECT
              pc.id
            FROM
              ${database}_hrm.places_coordinate pc
            WHERE pc.place = att.place_in)
            AND
            (SELECT
              sx.initial
            FROM
              ${database}_hrm.cut sx
            WHERE sx.id = ax.cut_id) = 'D02')
        )
      ),
      10
    ) AS batas_toleransi
  FROM
   ${namaDatabaseDynamic}.attendance AS att,
   ${database}_hrm.employee emp,
  ${database}_hrm.branch cb
  WHERE emp.em_id = att.em_id
    AND cb.code = emp.branch_id
    AND att.atten_date='2023-07-06'
   
    AND att.place_in IN
    (SELECT DISTINCT
      a.place
    FROM
    ${database}_hrm.places_coordinate a,
    ${database}_hrm.late_rate b
    WHERE (
        LEFT (b.places, 2) = a.id
        OR RIGHT (b.places, 2) = a.id
      ))
   `;

    var query2 = `SELECT DISTINCT emp.full_name AS full_name,
   cb.name AS branch_name,att.atten_date,att.signin_time,emp.job_title,emp.em_id,att.place_in,
   (
     (
       (
         TIMEDIFF (
           att.signin_time,
           (
             IFNULL (
               (SELECT
                 b.time_in
               FROM
               ${namaDatabaseDynamic}.emp_shift a,
                 ${database}_hrm.work_schedule b
               WHERE a.work_id = b.id
                 AND a.em_id = att.em_id
                 AND a.atten_date = att.atten_date),
               (SELECT
                 c.time_in
               FROM
                 ${database}_hrm.work_schedule c
               WHERE c.id = '2')
             )
           )
         )
       )
     )
   ) AS selisih,IFNULL (
     IFNULL (
       IFNULL (
         (SELECT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN LEFT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN LEFT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D03'),
         (SELECT DISTINCT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN LEFT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN LEFT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D02')
       ),
       IFNULL (
         (SELECT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN RIGHT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN RIGHT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D03'),
         (SELECT DISTINCT
           ax.late_time
         FROM
           ${database}_hrm.late_rate ax
         WHERE (
             CASE
               WHEN LENGTH (ax.places) = '1'
               THEN RIGHT (ax.places, 1)
               WHEN LENGTH (ax.places) > '1'
               THEN RIGHT (ax.places, 2)
             END
           ) =
           (SELECT
             pc.id
           FROM
             ${database}_hrm.places_coordinate pc
           WHERE pc.place = att.place_in)
           AND
           (SELECT
             sx.initial
           FROM
             ${database}_hrm.cut sx
           WHERE sx.id = ax.cut_id) = 'D02')
       )
     ),
     10
   ) AS batas_toleransi
 FROM
  ${namaDatabaseDynamic}.attendance AS att,
  ${database}_hrm.employee emp,
 ${database}_hrm.branch cb
 WHERE emp.em_id = att.em_id
   AND cb.code = emp.branch_id
   AND att.atten_date='2023-07-06'
  
   AND att.place_in IN
   (SELECT DISTINCT
     a.place
   FROM
   ${database}_hrm.places_coordinate a,
   ${database}_hrm.late_rate b
   WHERE (
       LEFT (b.places, 2) = a.id
       OR RIGHT (b.places, 2) = a.id
     ))
  `;

    //   var query2 = `
    //   SELECT DISTINCT emp.full_name AS full_name,
    //   cb.name AS branch_name,att.atten_date,att.signin_time,emp.job_title,emp.em_id,att.place_in,
    //   (
    //     (
    //       (
    //         TIMEDIFF (
    //           att.signin_time,
    //           (
    //             IFNULL (
    //               (SELECT
    //                 b.time_in
    //               FROM
    //               dpi_hrm2307.emp_shift a,
    //                 dpi_hrm.work_schedule b
    //               WHERE a.work_id = b.id
    //                 AND a.em_id = att.em_id
    //                 AND a.atten_date = att.atten_date),
    //               (SELECT
    //                 c.time_in
    //               FROM
    //                 dpi_hrm.work_schedule c
    //               WHERE c.id = '2')
    //             )
    //           )
    //         )
    //       )
    //     )
    //   ) AS selisih
    // FROM
    //   dpi_hrm2307.attendance AS att,
    //  dpi_hrm.employee emp,
    // dpi_hrm.branch cb
    // WHERE emp.em_id = att.em_id
    //   AND cb.code = emp.branch_id
    //   AND att.atten_date='2023-07-06'

    //   AND att.place_in IN
    //   (SELECT DISTINCT
    //     a.place
    //   FROM
    //   ${database}_hrm.places_coordinate a,
    //   ${database}_hrm.late_rate b
    //   WHERE (
    //       LEFT (b.places, 2) = a.id
    //       OR RIGHT (b.places, 2) = a.id
    //     ))
    //  `;

    var url;
    if (status == '0') {
      url = query1;
    } else {
      url = query2;
    }


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results,
              jumlah: results.length
            });
          }
        );
      }
    });
  },

  whereOnceAttendate(req, res) {
    console.log('----- where once attendance----------')
    var database = req.query.database;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE id='${req.body.id_absen}'`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          query1,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            });
          }
        );
      }
    });
  },
  load_laporan_belum_absen(req, res) {
    console.log('-----load laporan belum absensi----------')
    var database = req.query.database;

    var status = req.body.status;
    console.log(`status ${status}`)

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    // var query1 = `SELECT a.full_name, a.job_title FROM ${database}_hrm.employee a WHERE a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    // var query2 = `SELECT a.full_name, a.job_title FROM ${database}_hrm.employee a WHERE a.dep_id='${status}' AND a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    // var query3 = `SELECT b.full_name, b.job_title, c.name as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_leave a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;
    // var query4 = `SELECT b.full_name, b.job_title, a.ajuan as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_labor a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;

    var query1 = `SELECT a.full_name,a.em_id, a.job_title FROM ${database}_hrm.employee a WHERE a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    var query2 = `SELECT a.full_name,a.em_id, a.job_title FROM ${database}_hrm.employee a WHERE a.dep_id='${status}' AND a.em_id NOT IN (SELECT em_id FROM ${namaDatabaseDynamic}.attendance WHERE atten_date='${req.body.atten_date}') AND a.status='ACTIVE' ORDER BY a.id DESC`;
    var query3 = `SELECT b.full_name,b.em_id, b.job_title, c.name as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_leave a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;
    var query4 = `SELECT b.full_name,a.em_id, b.job_title, a.ajuan as ket_izin, c.category FROM ${namaDatabaseDynamic}.emp_labor a LEFT JOIN ${database}_hrm.employee b ON a.em_id=b.em_id LEFT JOIN ${database}_hrm.leave_types c ON a.typeid=c.id WHERE a.atten_date='${req.body.atten_date}' AND b.status='ACTIVE'`;

    var url;
    if (status == '0') {
      url = query1;
    } else {
      url = query2;
    }


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          `${url};${query3};${query4};`,
          function (error, results) {
            if (error) console.log(error);
            var all_jumlah = results[0].length + results[1].length + results[2].length;
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results[0],
              data_pengajuan1: results[1],
              data_pengajuan2: results[2],
              jumlah: all_jumlah
            });
          }
        );
      }
    });
  },

  load_laporan_pengajuan(req, res) {
    console.log('-----load laporan pengajuan----------')
    var database = req.query.database;

    var status = req.body.status;
    var type = req.body.type;

    const tahun = `${req.body.tahun}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = req.body.bulan;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1_tidak_hadir = `SELECT  a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan IN ('2','3') GROUP BY b.full_name`;
    var query2_tidak_hadir = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan IN ('2','3') GROUP BY b.full_name`;
    var query1_cuti = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query2_cuti = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query1_lembur = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query2_lembur = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query1_tugas_luar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='2' GROUP BY b.full_name`;
    var query2_tugas_luar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='2' GROUP BY b.full_name`;
    var query1_dinasluar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND a.ajuan='4' GROUP BY b.full_name`;
    var query2_dinasluar = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.atten_date)='${req.body.bulan}' AND year(a.atten_date)='${req.body.tahun}' AND b.dep_id='${status}' AND a.ajuan='4' GROUP BY b.full_name`;
    var query1_klaim = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.created_on)='${req.body.bulan}' AND year(a.created_on)='${req.body.tahun}' GROUP BY b.full_name`;
    var query2_klaim = `SELECT a.*, b.full_name, b.job_title, count(*) as jumlah_pengajuan , b.em_image as image FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE month(a.created_on)='${req.body.bulan}' AND year(a.created_on)='${req.body.tahun}' AND b.dep_id='${status}' GROUP BY b.full_name`;

    var url;
    if (status == '0') {
      if (type == 'tidak_hadir') {
        url = query1_tidak_hadir;
      } else if (type == 'cuti') {
        url = query1_cuti;
      } else if (type == 'lembur') {
        url = query1_lembur;
      } else if (type == 'tugas_luar') {
        url = query1_tugas_luar;
      } else if (type == 'dinas_luar') {
        url = query1_dinasluar;
      } else if (type == 'klaim') {
        url = query1_klaim;
      }
    } else {
      if (type == 'tidak_hadir') {
        url = query2_tidak_hadir;
      } else if (type == 'cuti') {
        url = query2_cuti;
      } else if (type == 'lembur') {
        url = query2_lembur;
      } else if (type == 'tugas_luar') {
        url = query2_tugas_luar;
      } else if (type == 'dinas_luar') {
        url = query2_dinasluar;
      } else if (type == 'klaim') {
        url = query2_klaim;
      }
    }


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//my${database}.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results,
              jumlah: 1
            });
          }
        );
      }
    });
  },

  load_laporan_pengajuan_harian(req, res) {
    console.log('-----load laporan pengajuanm harian----------')
    var database = req.query.database;

    var status = req.body.status;
    var type = req.body.type;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1_tidak_hadir = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan IN ('2','3') GROUP BY b.full_name`;
    var query2_tidak_hadir = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan IN ('2','3') GROUP BY b.full_name`;
    var query1_cuti = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query2_cuti = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query1_lembur = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query2_lembur = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='1' GROUP BY b.full_name`;
    var query1_tugas_luar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='2' GROUP BY b.full_name`;
    var query2_tugas_luar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_labor a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='2' GROUP BY b.full_name`;
    var query1_dinasluar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND a.ajuan='4' GROUP BY b.full_name`;
    var query2_dinasluar = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE a.atten_date='${req.body.atten_date}' AND b.dep_id='${status}' AND a.ajuan='4' GROUP BY b.full_name`;
    var query1_klaim = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE DATE(a.created_on)='${req.body.atten_date}' GROUP BY b.full_name`;
    var query2_klaim = `SELECT a.*, b.full_name, b.job_title FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.employee b ON a.em_id=b.em_id WHERE DATE(a.created_on)='${req.body.atten_date}' AND b.dep_id='${status}' GROUP BY b.full_name`;

    var url;
    if (status == '0') {
      if (type == 'tidak_hadir') {
        url = query1_tidak_hadir;
      } else if (type == 'cuti') {
        url = query1_cuti;
      } else if (type == 'lembur') {
        url = query1_lembur;
      } else if (type == 'tugas_luar') {
        url = query1_tugas_luar;
      } else if (type == 'dinas_luar') {
        url = query1_dinasluar;
      } else if (type == 'klaim') {
        url = query1_klaim;
      }
    } else {
      if (type == 'tidak_hadir') {
        url = query2_tidak_hadir;
      } else if (type == 'cuti') {
        url = query2_cuti;
      } else if (type == 'lembur') {
        url = query2_lembur;
      } else if (type == 'tugas_luar') {
        url = query2_tugas_luar;
      } else if (type == 'dinas_luar') {
        url = query2_dinasluar;
      } else if (type == 'klaim') {
        url = query2_klaim;
      }
    }


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.release();
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results,
              jumlah: results.length
            });
          }
        );
      }
    });
  },

  load_detail_laporan_pengajuan(req, res) {
    console.log('-----load detail laporan pengajuan----------')
    var database = req.query.database;

    var em_id = req.body.em_id;
    var type = req.body.type;

    const tahun = `${req.body.tahun}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = req.body.bulan;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query_tidak_hadir = `SELECT a.*, b.name, b.category FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan IN ('2', '3') AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_cuti = `SELECT a.*, b.name, b.category FROM ${namaDatabaseDynamic}.emp_leave a JOIN ${database}_hrm.leave_types b ON a.typeid=b.id WHERE a.ajuan='1' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_lembur = `SELECT a.* FROM ${namaDatabaseDynamic}.emp_labor a WHERE a.ajuan='1' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_tugas_luar = `SELECT a.* FROM ${namaDatabaseDynamic}.emp_labor a WHERE a.ajuan='2' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_dinasluar = `SELECT a.* FROM ${namaDatabaseDynamic}.emp_leave a WHERE a.ajuan='4' AND a.em_id='${em_id}' ORDER BY a.id DESC`;
    var query_klaim = `SELECT a.*, b.name FROM ${namaDatabaseDynamic}.emp_claim a JOIN ${database}_hrm.cost b ON a.cost_id=b.id WHERE a.em_id='${em_id}' ORDER BY a.id DESC`;

    var url;
    if (type == 'tidak_hadir') {
      url = query_tidak_hadir;
    } else if (type == 'cuti') {
      url = query_cuti;
    } else if (type == 'lembur') {
      url = query_lembur;
    } else if (type == 'tugas_luar') {
      url = query_tugas_luar;
    } else if (type == 'dinas_luar') {
      url = query_dinasluar;
    } else if (type == 'klaim') {
      url = query_klaim;
    }


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(
          url,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results,
              jumlah: results.length
            });
          }
        );
        connection.release();
      }
    });
  },

  emp_leave_lastrow(req, res) {
    console.log('-----emp leave lastrow----------')
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM emp_leave WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          script,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil berhasil di tambah!",
              data: results
            });
          }
        );
      }
    });
  },
  emp_labor_lastrow(req, res) {
    console.log('----em labor lastrow----------')
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM emp_labor WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          script,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil berhasil di tambah!",
              data: results
            });
          }
        );
      }
    });
  },
  emp_klaim_lastrow(req, res) {
    console.log('-----emp klaim last row---------')
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM emp_claim WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          script,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil berhasil di tambah!",
              data: results
            });
          }
        );
      }
    });
  },
  async emp_request_lastrow(req, res) {
    console.log('-----emp request last row----------')
    var database = req.query.database;

    var pola = req.body.pola;

    var script = `SELECT nomor_ajuan FROM employee_request WHERE nomor_ajuan LIKE '%${pola}%' ORDER BY id DESC LIMIT 1`;

    const connection = await model.createConnection(database);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     

        connection.query(script, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
            return;
          }
          records = results;
          if (records.length == 0) {
            return res.status(200).send({
              status: false,
              message: "Terjadi kesalahan",
              data: []

            });
          }
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: []

                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message: "Successfuly get data",
              data: results

            });


          });
        });

      });
    });

    // pool.getConnection(function (err, connection) {
    //   if (err) {
    //     res.send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.query(
    //       script,
    //       function (error, results) {
    //         if (error != null) console.log(error)
    //         res.send({
    //           status: true,
    //           message: "Berhasil ambil di tambah!",
    //           data: results
    //         });
    //       }
    //     );
    //     connection.release();
    //   }
    // });
  },

  view_last_absen_user(req, res) {
    console.log('-----view last absen----------')


    var em_id = req.body.em_id;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var startDate=req.body.start_date;
    var endDate=req.body.end_date;
    var startTime=req.body.start_time;
    var endTime=req.body.end_time;


    console.log(namaDatabaseDynamic);

     var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' ORDER BY id DESC LIMIT 1`;
// SELECT 
//   * FROM attendance WHERE CONCAT(atten_date, ' ', signin_time) >= '2023-10-02 05:00:00' AND CONCAT(atten_date, ' ', signin_time)<= '2023-10-03 09:00:00'
  //  var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
  //   AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1`;

   console.log("last abseen ",script)
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          script,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results
            });
          }
        );
      }
    });
  },
  
  view_last_absen_user1(req, res) {
  console.log('-----view last absen----------')

  

    var em_id = req.body.em_id;

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var startDate=req.body.start_date;
    var endDate=req.body.end_date;
    var startTime=req.body.start_time;
    var endTime=req.body.end_time;


    console.log(namaDatabaseDynamic);

//     var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' ORDER BY id DESC LIMIT 1`;
// SELECT 
//   * FROM attendance WHERE CONCAT(atten_date, ' ', signin_time) >= '2023-10-02 05:00:00' AND CONCAT(atten_date, ' ', signin_time)<= '2023-10-03 09:00:00'
   var script = `SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
    AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1`;

   console.log("last abseen ",script)
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          script,
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results
            });
          }
        );
      }
    });
  },

  potong_cuti(req, res) {
    console.log('-----potong cuti----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    var terpakai = req.body.terpakai;
    var query1 = `SELECT terpakai,dateyear FROM assign_leave WHERE em_id='${em_id}' ORDER BY dateyear DESC  `;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    // var query2 = ``;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        query1,
        function (error, results) {
          if (error != null) console.log(error)
          var terpakaiUser = results[0].terpakai;
          var hitung = parseInt(terpakaiUser) + parseInt(terpakai);
          connection.query(
            `UPDATE assign_leave SET terpakai='${hitung}' WHERE em_id='${em_id}' AND  dateyear='${results[0].dateyear}' `,
            function (error, results1) {
              res.send({
                status: true,
                message: "Berhasil Potong cuti!",
                data: results1,
              });
            }
          )
        }
      );
      connection.release();
    });
  },

  edit_last_login(req, res) {
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET last_login='${last_login}' WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil edit last login!",
            data: results,
          });
        }
      );

    });
  },
  edit_last_login_id_mobile(req, res) {
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    var em_id = req.body.em_id;
    var last_login = req.body.last_login;
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE employee SET last_login='${last_login}',id_mobile='${req.body.id_mobile}' WHERE em_id='${em_id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil edit last login!",
            data: results,
          });
        }
      );

    });
  },

  edit_status_kandidat(req, res) {
    console.log('-----edit status kandidat----------')
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var id = req.body.id;
    var bodyValue = req.body;
    // var status = req.body.status;
    // var alasan_terima = req.body.alasan_terima;

    var script = `UPDATE candidate SET ? WHERE id='${id}'`;

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      delete bodyValue.id;
      connection.query(
        // `UPDATE candidate SET status='${status}', alasan_terima='${alasan_terima}' WHERE id='${id}'`,
        script, [bodyValue],
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil edit data kandidat !",
            data: results,
          });
        }
      );

    });

  },
  edit_statusAkhir_kandidat(req, res) {
    console.log('-----edit status akhir kandidat----------')
    var id = req.body.id;
    var status = req.body.status_akhir;
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE candidate SET status_akhir='${status}' WHERE id='${id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil edit status kandidat !",
            data: results,
          });
        }
      );

    });
  },
  tolak_kandidat(req, res) {
    console.log('-----total kandidat----------')
    var id = req.body.id;
    var status = req.body.status;
    var status_akhir = req.body.status_akhir;
    var alasan_tolak = req.body.alasan_tolak;
    var status_remaks = req.body.status_remaks;
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);
    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `UPDATE candidate SET status='${status}', status_akhir='${status_akhir}', status_remaks='${status_remaks}', alasan_tolak='${alasan_tolak}' WHERE id='${id}'`,
        function (error, results) {
          connection.release();
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil edit status kandidat !",
            data: results,
          });
        }
      );
    });
  },
  insert_absen_approve_pengajuan(req, res) {
    console.log('-----insert absen approve pengajuan----------')
    var data = req.body.dataAbsen;
    var database = req.query.database;
    var listTanggal = data[0].date_selected.split(',');
    var loopData = [];
    for (var i = 0; i < listTanggal.length; i++) {
      var insert = [data[0].em_id, listTanggal[i], '00:00:00', '00:00:00', '', 'pengajuan', 'pengajuan', '', '', '', '', 'pengajuan', 'pengajuan', '', '', data[0].nama_tipe, data[0].nama_tipe, '', '', '',];
      loopData.push(insert);
    }

    var array = listTanggal[0].split('-');

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var script = `INSERT INTO ${namaDatabaseDynamic}.attendance (em_id, atten_date, signin_time, signout_time, working_hour, place_in, place_out, absence, overtime, earnleave, status, signin_longlat, signout_longlat, signin_pict, signout_pict, signin_note, signout_note, signin_addr, signout_addr, atttype) VALUES ?`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(
          script, [loopData],
          function (error, results) {
            connection.release();
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil input absensi pengajuan employee!",
              data: results,
            });
          }
        );
      }


    });

  },
  notifikasi_reportTo(req, res) {
    console.log('-----notifikasi report to----------')
    var emIdPengaju = req.body.emId_pengaju;
    var title = req.body.title;
    var deskripsi = req.body.deskripsi;
    var url = req.body.url;
    var atten_date = req.body.atten_date;
    var jam = req.body.jam;
    var status = req.body.status;
    var database = req.query.database;
    var view = req.body.view;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };

    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT em_report_to FROM employee WHERE em_id='${emIdPengaju}'`,
        function (error, results) {
          var emReportTo = results[0].em_report_to;
          var emReportToList = emReportTo.split(',');
          var loopData = [];
          for (var i = 0; i < emReportToList.length; i++) {
            var insert = [emReportToList[i], title, deskripsi, url, atten_date, jam, status, view];
            loopData.push(insert);
          }

          var array = atten_date.split('-');

          const tahun = `${array[0]}`;
          const convertYear = tahun.substring(2, 4);
          const convertBulan = array[1];
          const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

          var script = `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id, title, deskripsi, url, atten_date, jam, status, view) VALUES ?`;

          const configDynamic = {
            multipleStatements: true,
            host: '15.10.1.197',//myhris.siscom.id (ip local)
            user: 'pro',
            password: 'Siscom3519',
            database: `${namaDatabaseDynamic}`,
            connectionLimit: 1000,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
          };
          const mysql = require("mysql");
          const poolDynamic = mysql.createPool(configDynamic);

          poolDynamic.getConnection(function (err, connection) {
            if (err) {
              res.send({
                status: false,
                message: "Database tidak di temukan",
              });
            } else {
              connection.query(
                script, [loopData],
                function (error, results) {

                  if (error != null) console.log(error)
                  res.send({
                    status: true,
                    message: "Berhasil input absensi pengajuan employee!",
                    data: results,
                  });
                }
              );
              connection.release();
            }
          });
        }
      );
      connection.release();
    });

  },
  insert_permintaan_kandidat(req, res) {
    console.log('-----inser permintaan kandidat----------')
    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    var database = req.query.database;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var script = `INSERT INTO employee_request SET ?`;

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT * FROM employee_request WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
        function (error, results) {
          if (results.length == 0) {
            connection.query(
              script,
              [bodyValue],
              function (error, results) {
                if (error != null) console.log(error)
                res.send({
                  status: true,
                  message: "Berhasil berhasil di tambah!",
                });
              }
            );
          } else {
            res.send({
              status: false,
              message: "ulang",
              data: results
            });
          }
        }
      );
      connection.release();
    });
  },

  insert_kandidat_baru(req, res) {
    console.log('-----inert kandidat baru----------')
    var bodyValue = req.body;
    var database = req.query.database;

    var script = `INSERT INTO candidate SET ?`;
    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${database}_hrm`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        script,
        [bodyValue],
        function (error, results) {
          if (error != null) console.log(error)
          res.send({
            status: true,
            message: "Berhasil berhasil di tambah!",
          });
        }
      );
      connection.release();
    });
  },

  insert_emp_control_employee(req, res) {
    console.log('-----insert emp controll----------')

    var emId = req.body.em_id;
    var atten_date = req.body.atten_date;
    var jam = req.body.jam;
    var latLangKontrol = req.body.latLangKontrol;
    var alamat = req.body.alamat;

    var array = atten_date.split('-');
    var database = req.query.database;

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_control SET ?`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    var insertData = {
      "em_id": emId,
      "atten_date": atten_date,
      "time": jam,
      "longlat": latLangKontrol,
      "address": alamat
    };

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak di temukan",
        });
      } else {
        connection.query(
          script, [insertData],
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil input absensi pengajuan employee!",
              data: results,
            });
          }
        );
        connection.release();
      }
    });
  },

  load_history_kontrol(req, res) {
    console.log('-----load hostory kontrol----------')

    var em_id = req.body.em_id;

    var array = req.body.atten_date.split('-');

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    var database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT * FROM ${namaDatabaseDynamic}.emp_control WHERE atten_date='${req.body.atten_date}' AND em_id='${em_id}' ORDER BY id DESC`;

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(
          query1,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil!",
              data: results
            });
          }
        );
        connection.release();
      }
    });
  },
  
  
  async checkSlipGajiValidation(req, res) {

    var database = req.query.database;
    


    var database = req.query.database;
    var em_id = req.body.em_id;
    var getbulan = req.body.bulan;
    var gettahun = req.body.tahun;
    var dateNow=req.body.date;
    var des_id=req.body.des_id;
    console.log(req.body)

    var array = req.body.date.split("-");
  
    const getTahun = array[0];
    const getBulan = array[1];


    const tahun = `${getTahun}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (getBulan.length == 1) {
      convertBulan = getBulan <= 9 ? `0${getBulan}` : getBulan;
    } else {
      convertBulan = getBulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;



    const connection = await model.createConnection(database);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }
        //-------end check koneksi-----     

        connection.query(`SELECT * FROM employee JOIN designation ON designation.id=employee.des_id WHERE employee.em_id='${em_id}' AND designation.id='${des_id}' AND designation.payroll_approval is NOT NULL`, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(404).send({
                status: false,
                message: 'Terjadi kesahalan',
                data: []

              });
            });
         
          }
          records = results;
       
          if (records.length == 0) {
            return res.status(200).send({
              status: false,
           
              data: [],
              approved:"not"

            });
          }

          connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_mobile_approval WHERE em_id='${em_id}' AND created_date='${req.body.date}' `, (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(404).send({
                  status: false,
                  message: 'Terjadi kesahalan',
                  data: [],
                });
              });
           
            }
            records = results;

            if (records.length == 0) {
              return res.status(200).send({
                status: false,
               
                data: [],
                approved:"not_yet"
  
              });
            }
          
          
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: false,
                  message: "Terjadi kesalahan",
                  data: [],
                approved:"approved"

                });
              });
              return;
            }
          
            return res.status(200).send({
              status: false,
              message: "Terjadi kesalahan",
              data: [],
            approved:records[0].approved_id==null?"pending": "approved"

            });
          
            // connection.end();
            // console.log('Transaction completed successfully!');
            // return res.status(200).send({
            //   status: true,
            //   message: "Successfuly get data",
            //   data: results

            // });


          });
          });
        });

      });
    });

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);;
    //   connection.query(
    //     `SELECT * FROM shift WHERE default_shift='1';`,
    //     function (error, results) {
    //       connection.release();
    //       if (error) console.log(error);
    //       res.send({
    //         status: true,
    //         message: "Berhasil ambil data!",
    //         data: results,
    //       });
    //     }
    //   );

    // });
  },


  cekApprovalPayroll(req, res) {
    console.log('-----check validasi lapoarn----------')

    var emId = req.body.em_id;
    var designationId = req.body.designation_id
    var date = req.body.date;
    var database = req.query.database;
    const databaseMaster = `${database}_hrm`;

    var description = "";

    if (req.body.type == "pph21") {
      description = "Pengajuan PPh21"

    } else if (req.body.type == "slip_gaji") {
      description = "Pengajuan Slip gaji"
    }

    var array = date.split('-');

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    var database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var query1 = `SELECT * FROM ${databaseMaster}.designation WHERE id='${req.body.designation_id}'`;
    var queryCekApproval = `SELECT * FROM ${namaDatabaseDynamic}.emp_mobile_approval WHERE created_date='${date}' AND em_id='${emId}'`
    var queryCekApprovalInsert = `INSERT INTO ${namaDatabaseDynamic}.emp_mobile_approval (created_date,em_id,description) VALUES ('${date}','${emId}','${description}')`


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };



    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(
          query1,
          function (error, results) {
            if (error != null) console.log(error)

            if (results.length > 0) {

              if (results[0].payroll_approval == "" || results[0].payroll_approval == null || results[0].payroll_approval == "") {
                return res.send({
                  status: true,
                  message: "Tidak butuh approval",
                  // em_id:results[0].payroll_approval  
                }, 200);
              } else {

                //cek transaksi aproval
                connection.query(
                  queryCekApproval,
                  function (error, data) {
                    if (error != null) console.log(error)


                    if (data.length > 0) {
                      if (data[0].approved_id == null || data[0].approved_id == "" || data[0].approved_id == "null" || data[0].approved_id == "0") {

                        return res.send({
                          status: true,
                          message: "Data pengajuanmu belum di approve, tunggu beberapa saat lagi",
                          data: data
                        }, 400);

                      } else {
                        return res.send({
                          status: true,
                          message: "Data has been approved",

                        }, 200);

                      }



                    } else {
                      //insert data to pengajuan 
                      connection.query(
                        queryCekApprovalInsert,
                        function (error, data) {
                          if (error != null) console.log(error)
                          return res.send({
                            status: true,
                            message: "data has been insert",
                            em_ids: results[0].payroll_approval

                          }, 400);
                        }
                      );



                    }


                  }
                );

              }

            } else {
              return res.send({
                status: true,
                message: "data tidak ditemukanh!",

              });
            }



          }
        );
        connection.release();
      }
    });
  },
  approvePayroll(req, res) {
    console.log('-----check validasi lapoarn----------')

    var emId = req.body.em_id;
    var designationId = req.body.designation_id
    var date = req.body.date;
    var database = req.query.database;
    var id=req.body.id;
    const databaseMaster = `${database}_hrm`;
    console.log(req.body)

    

    var description = "";

    if (req.body.type == "pph21") {
      description = "Pengajuan PPh21"

    } else if (req.body.type == "slip_gaji") {
      description = "Pengajuan Slip gaji"
    }

    var array = date.split('-');

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
    var database = req.query.database;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var date=req.body.date;
    var emId=req.body.em_id;

    var query1 = `UPDATE  ${namaDatabaseDynamic}.emp_mobile_approval SET approved_date='${date}',approved_id='${emId}' WHERE id='${id}'`;
   

    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };



    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.status(404).send({
          status: false,
          message: "Database tidak ditemukan",
        });
      } else {
        connection.query(
          query1,
          function (error, results) {
            if (error != null) console.log(error)

            return res.status(200).send({
              status: true,
              message: "data tidak telah di approved",

            });


          }
        );
        connection.release();
      }
    });
  },
  info_aktifitas_employee(req, res) {
    console.log('-----info aktifitas employee----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    const getbulanStart = req.body.bulan_start;
    const gettahunStart = req.body.tahun_start;
    const getbulanEnd = req.body.bulan_end;
    const gettahunEnd = req.body.tahun_end;
    var startDate=req.body.start_date;
    var endDate=req.body.end_date;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    const tahunStart = `${gettahunStart}`;
    const convertYearStart = tahunStart.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulanStart;
    if (getbulanStart.length == 1) {
      convertBulanStart = getbulanStart <= 9 ? `0${getbulanStart}` : getbulanStart;
    } else {
      convertBulanStart = getbulan;
    }

    const namaDatabaseDynamiStart = `${database}_hrm${convertYearStart}${convertBulanStart}`;

    const tahunEnd = `${gettahunEnd}`;
    const convertYearEnd = tahunEnd.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulanEnd;
    if (getbulanEnd.length == 1) {
      convertBulanEnd = getbulanEnd <= 9 ? `0${getbulanEnd}` : getbulanEnd;
    } else {
      convertBulanEnd = getbulan;
    }

    const namaDatabaseDynamiEnd = `${database}_hrm${convertYearEnd}${convertBulanEnd}`;

    var query_masuk_kerja=""
    var query_izin="";
    var query_sakit="";
    var query_lembur="";
    var query_cuti=""
    var query_masuk_wfh=""
    var query_absen_tepat_waktu=""

    if (convertBulanStart==convertBulanEnd){
       query_masuk_kerja = `SELECT atten_date FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_izin = `SELECT COUNT(*) as jumlah_izin FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='3' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_sakit = `SELECT COUNT(*) as jumlah_sakit FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='2' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_cuti = `SELECT COUNT(*) as jumlah_cuti FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND ajuan='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
      query_lembur = `SELECT COUNT(*) as jumlah_lembur FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND ajuan='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_masuk_wfh = `SELECT COUNT(*) as jumlah_masuk_wfh FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND place_in='WFH' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_absen_tepat_waktu = `SELECT signin_time FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND atttype='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
  

    }else{

       query_masuk_kerja = `SELECT atten_date FROM ${namaDatabaseDynamiStart}.attendance WHERE em_id='${em_id}' AND atttype='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}' UNION  SELECT atten_date FROM ${namaDatabaseDynamiEnd}.attendance WHERE em_id='${em_id}' AND atttype='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_izin = `SELECT COUNT(*) as jumlah_izin FROM ${namaDatabaseDynamiStart}.emp_leave WHERE em_id='${em_id}' AND atten_date>='${startDate}' AND atten_date<='${endDate}' AND ajuan='3' UNION SELECT COUNT(*) as jumlah_izin FROM ${namaDatabaseDynamiEnd}.emp_leave WHERE em_id='${em_id}' AND ajuan='3' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_sakit = `SELECT COUNT(*) as jumlah_sakit FROM ${namaDatabaseDynamiStart}.emp_leave WHERE em_id='${em_id}' AND atten_date>='${startDate}' AND atten_date<='${endDate}' AND ajuan='2' UNION SELECT COUNT(*) as jumlah_sakit FROM ${namaDatabaseDynamiEnd}.emp_leave WHERE em_id='${em_id}' AND ajuan='2' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_cuti = `SELECT COUNT(*) as jumlah_cuti FROM ${namaDatabaseDynamiStart}.emp_leave WHERE em_id='${em_id}' AND ajuan='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}' UNION SELECT COUNT(*) as jumlah_cuti FROM ${namaDatabaseDynamiEnd}.emp_leave WHERE em_id='${em_id}' AND ajuan='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_lembur = `SELECT COUNT(*) as jumlah_lembur FROM ${namaDatabaseDynamiStart}.emp_labor WHERE em_id='${em_id}' AND ajuan='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}' UNION SELECT COUNT(*) as jumlah_lembur FROM ${namaDatabaseDynamiEnd}.emp_labor WHERE em_id='${em_id}' AND ajuan='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_masuk_wfh = `SELECT COUNT(*) as jumlah_masuk_wfh FROM ${namaDatabaseDynamiStart}.attendance WHERE em_id='${em_id}' AND place_in='WFH' AND atten_date>='${startDate}' AND atten_date<='${endDate}' UNION SELECT COUNT(*) as jumlah_masuk_wfh FROM ${namaDatabaseDynamiEnd}.attendance WHERE em_id='${em_id}' AND place_in='WFH' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
       query_absen_tepat_waktu = `SELECT signin_time FROM ${namaDatabaseDynamiStart}.attendance WHERE em_id='${em_id}' AND atttype='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}' UNION SELECT signin_time FROM ${namaDatabaseDynamiEnd}.attendance WHERE em_id='${em_id}' AND atttype='1' AND atten_date>='${startDate}' AND atten_date<='${endDate}'`;
  


    }




    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `${query_masuk_kerja};${query_izin};${query_sakit};${query_cuti};${query_lembur};${query_masuk_wfh};${query_absen_tepat_waktu};`,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data_masuk_kerja: results[0],
              data_izin: results[1],
              data_sakit: results[2],
              data_cuti: results[3],
              data_lembur: results[4],
              data_masukwfh: results[5],
              data_absentepatwaktu: results[6],
            });

          }
        );
        connection.release();
      }


    });
  },

  employeeAttendance(req, res) {
    console.log('-----Employee attemdamce  ----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date=req.body.date;


    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `SELECT * FROM attendance WHERE atten_date='${date}' AND em_id='${em_id}'`,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            
            });

          }
        );
        connection.release();
      }


    });
  },


  UpdateEmployeeAttendance(req, res) {
    console.log('-----Employee attemdamce  ----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date=req.body.date;


    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          `UPDATE emp_labor SET status_transaksi=0 WHERE em_id='${em_id}'AND atten_date='${date}'`,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            
            });

          }
        );
        connection.release();
      }


    });
  },



  saveEmployeeAttendance(req, res) {
    console.log('-----Employee attemdamce ----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date=req.body.date;
    var checkin=req.body.checkin;
    var checkout=req.body.checkout;
    var status=req.body.status;
    var tanggalAjuan=req.body.tgl_ajuan;
    var nomorAjuan="";
    var catatan=req.body.catatan;
    var nameFile=req.body.file;
    var lokasiMasuk=req.body.lokasi_masuk_id;
    var lokasiKeluar=req.body.lokasi_keluar_id
 



    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.status(400).send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(
          "SELECT * FROM emp_labor WHERE ajuan='3' AND em_id=? AND atten_date=? AND (status='Approve'OR status='Pending')",[em_id,date],
          function (error, results) {
            if (error != null) console.log(error)

            if (results.length>0){
              res.status(400).send({
                status: false,
                message: "Data sudah tersedia",
              });



            }else{

             
              connection.query(
             ` SELECT nomor_ajuan FROM emp_labor WHERE ajuan='3' ORDER BY id DESC `,
                function (error, data) {
                  if (error != null) {
                    res.status(400).send({
                      status: false,
                      message: error,
                    });
                  }
      
               
             
              if (data.length > 0) {
                var text = data[0]['nomor_ajuan'];
                nomor = parseInt(text.substring(8, 13)) + 1;
                var nomorStr = String(nomor).padStart(4, '0')
                nomorAjuan = `RQ20${convertYear}${convertBulan}` + nomorStr;
        
              } else {
                nomor = 1;
                var nomorStr = String(nomor).padStart(4, '0')
                nomorAjuan  = `RQ20${convertYear}${convertBulan}` + nomorStr;
              }

              connection.query(
                `INSERT INTO emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,uraian,ajuan,em_delegation,req_file,place_in,place_out,approve_status)
                 VALUES ('${nomorAjuan}','${em_id}','${date}','${checkin}','${checkout}','${tanggalAjuan}','${status}','1','${catatan}','3','','${nameFile}','${lokasiMasuk}','${lokasiKeluar}','Pending')`,
                function (error, results) {
                  if (error != null) console.log(error)
      
                  res.status(200).send({
                    status: true,
                    message: "Pengajuan berhasil",
                  });
      
                }
              );

      
                }
              );
        

              


             
            }
          }
        );
        connection.release();
      }


    });
  },


  
  getEmployeeAttendance(req, res) {
    console.log('-----Employee attemdamce  ----------')
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date=req.body.date;


    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;


    const configDynamic = {
      multipleStatements: true,
      host: '15.10.1.197',//myhris.siscom.id (ip local)
      user: 'pro',
      password: 'Siscom3519',
      database: `${namaDatabaseDynamic}`,
      timezone: "+00:00",
      connectionLimit: 1000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    };
    const mysql = require("mysql");
    const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) {
        res.send({
          status: false,
          message: "Database tidak tersedia",
        });
      } else {
        connection.query(     
          `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`,
          function (error, results) {
            if (error != null) console.log(error)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: results,
            
            });

          }
        );
        connection.release();
      }


    });
  },

  async loadCutiMelahirkan(req,res){
    console.log("---------place coodinate----------------")
    var database=req.query.database;
    var typeId=req.body.type_id;
    let ms = Date.now();
    var d = new Date(ms),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
        
        var date=[year, month, day].join('-')


    
        var em_id=req.query.id
        console.log(req.body)

        var array = date.split("-");
        console.log("date now ",date)

        const tahun = `${array[0]}`;
        const convertYear = tahun.substring(2, 4);
        var convertBulan;
        if (array[1].length == 1) {
          convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
        } else {
          convertBulan = array[1];
        }
    
        const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
        
        try{
            const connection=await model.createConnection(database);
            connection.connect((err) => {
                if (err) {
                console.error('Error connecting to the database:', err);
                return;
                }  
                connection.beginTransaction((err) => {
                if (err) {
                    console.error('Error beginning transaction:', err);
                    connection.end();
                    return;
                }
             // 
             
             connection.query( `
             SELECT name FROM sysdata WHERE kode='013'`
             , (err, sysdata) => {
              if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                  status: false,
                  message: 'gagal ambil data',
                  data:[]
                  
                  });
            });
            return;
          }
             connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE typeId='${typeId}' AND em_id='${em_id}' AND start_date>CURDATE() AND  end_date<CURDATE() AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' ORDER BY ID DESC`
             , (err, results) => {
              if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                  status: false,
                  message: 'gagal ambil data',
                  data:[]
                  
                  });
            });
            return;
          }


          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                           message: "Kombinasi email & password Anda Salah",
                  data:[]
                
                });
              });
              return;
            }
            connection.end();
            console.log('Transaction completed successfully!');
            return res.status(200).send({
              status: true,
              message:"Succesfuly ",
              data:results
            
            });

        
          });
          


     
                  
                });
              });
            });
          

          });
        
      }catch($e){
        return res.status(400).send({
          status: true,
          message: 'Gagal ambil data',
          data:[]
        
        });
  
      }


    
  },


};


// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`
