const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');
const utility = require('../utils/utility');

pool.on("error", (err) => {
  console.error(err);
});
require('dotenv').config();

var ipServer=process.env.API_URL
module.exports = {







  async store(req, res) {
    console.log('-----insert data tugas luar----------')
    console.log('data absen ',req.body)
    var database = req.query.database;
    let name_url = req.originalUrl;
    var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
    var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");

    var menu_name = req.body.menu_name;
    var activity_name = req.body.activity_name;
    var createdBy = req.body.created_by;
console.log('em_id',req.body)
console.log('em_id 1',req.query)
    var bodyValue = req.body;
    delete bodyValue.menu_name;
    delete bodyValue.activity_name;
    delete bodyValue.created_by;
    
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
    const databaseMaster=`${database}_hrm`
  
    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;

    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy
    }

var dateNow=utility.dateNow4()
bodyValue.tgl_ajuan=dateNow


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

                connection.query(    `SELECT * FROM ${namaDatabaseDynamic}.emp_labor  WHERE nomor_ajuan='${req.body.nomor_ajuan}'`, (err, results) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'Data gagal terkirim',
                        data:results
                      
                      });
                    });
                    return;
                  }
                 
              if (results.length>0){
                return res.send({
                    status: false,
                    message: "ulang",
                    data: results
                  });
              }
              connection.query(     script,
                [bodyValue], (err, results) => {
                if (err) {
                  console.error('Error executing SELECT statement:', err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: 'Data gagal terkirim',
                      data:results
                    
                    });
                  });
                  return;
                }
                connection.query( `INSERT INTO ${namaDatabaseDynamic}.logs_actvity SET ?;`,
                [dataInsertLog], (err, results) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'Data gagal terkirim',
                          data:results
                        
                        });
                      });
                      return;
                    }
                    connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan='${req.body.nomor_ajuan}'`,
                         (err, transaksi) => {
                        if (err) {
                          console.error('Error executing SELECT statement:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: 'Data gagal terkirim',
                              data:results
                            
                            });
                          });
                          return;
                        }
                        connection.query(`SELECT * FROM ${databaseMaster}.employee WHERE em_id='${transaksi[0].em_id}'`,
                         (err, employee) => {
                            if (err) {
                              console.error('Error executing SELECT statement:', err);
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: 'Data gagal terkirim',
                                  data:results
                                
                                });
                              });
                              return;
                            }

                            connection.query(`SELECT * FROM sysdata WHERE kode='034'`,
                         (err, sysdata) => {
                            if (err) {
                              console.error('Error executing SELECT statement:', err);
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: 'Data gagal terkirim',
                                  data:results
                                
                                });
                              });
                              return;
                            }

                    utility.insertNotifikasi(employee[0].em_report_to,'Approval Tugas Luar','TugasLuar',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
                    utility.insertNotifikasi(sysdata[0].name,'Pengajuan  Tugas Luar','TugasLuar',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
                         
                    if (sysdata.length>0){
                              if (sysdata[0].name==null){

                                utility.insertNotifikasi(sysdata[0].name,'Pengajuan  Tugas Luar','TugasLuar',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
                         
                              }
                            }
                  connection.commit((err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'Data gagal terkirim',
                          data:[]
                        
                        });
                      });
                      return;
                    }
                    connection.end();
                    console.log('Transaction completed successfully!');
                    return res.status(200).send({
                      status: true,
                      message: 'data berhasil terkirm',
                  
                    
                    });
              
                
                  });
                });
                });
              });
            });
        });
    });
        
});
        
});
        




    }catch(e){
        return res.status(400).send({
            status: true,
            message: 'Gagal simpan data',
            data:[]
          
          });

    }


    // poolDynamic.getConnection(function (err, connection) {
    //   if (err) {
    //     res.send({
    //       status: false,
    //       message: "Database tidak tersedia",
    //     });
    //   } else {
    //     connection.release();
    //       connection.query(
    //         script,
    //         [bodyValue],
    //         function (error, results) {
    //           if (error != null) console.log(error)
    //           connection.query(
    //             `INSERT INTO logs_actvity SET ?;`,
    //             [dataInsertLog],
    //             function (error,) {
    //               if (error != null) console.log(error)
    //             }
    //           );
    //           res.send({
    //             status: true,
    //             message: "Berhasil berhasil di tambah!",
    //           });
    //         }
    //       );
        

    //   }


    // });
  },




}





// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`



