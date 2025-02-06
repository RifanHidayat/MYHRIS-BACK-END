const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
// const faceApiService = require('./faceapiService');
const utility=require('../utils/utility')

var request = require('request');

const model = require('../utils/models');

    pool.on("error", (err) => {
  console.error(err);
});

var remoteDirectory = 'public_html/7H202305001'
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();
const configSftp = {
  host: 'imagehris.siscom.id',
  port: 3322, // Default SFTP port is 22
  username: 'siscom',
  password: 'siscom!@#$%'
};
module.exports = {
  // async PalceCoordinate(req,res){
  //   console.log("---------place coodinate----------------")
  //   var database=req.query.database;
  //   var attenDate=req.query_date;

  //   let ms = Date.now();

  //   var d = new Date(ms),
  //       month = '' + (d.getMonth() + 1),
  //       day = '' + d.getDate(),
  //       year = d.getFullYear();
  //   if (month.length < 2) 
  //       month = '0' + month;
  //   if (day.length < 2) 
  //       day = '0' + day;
        
  //       var date=[year, month, day].join('-')

  //       var em_id=req.query.id
  //       console.log(req.body)


  //       var array = date.split("-");
  //       console.log("date now ",date)

        
  //       const tahun = `${array[0]}`;
  //       const convertYear = tahun.substring(2, 4);
  //       var convertBulan;
  //       if (array[1].length == 1) {
  //         convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
  //       } else {
  //         convertBulan = array[1];
  //       }
    
  //       const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
        
  //       try{
  //           const connection=await model.createConnection(database);
  //           connection.connect((err) => {
  //               if (err) {
  //               console.error('Error connecting to the database:', err);
  //               return;
  //               }  
  //               connection.beginTransaction((err) => {
  //               if (err) {
  //                   console.error('Error beginning transaction:', err);
  //                   connection.end();
  //                   return;
  //               }
  //            // 
             


  //            connection.query( `
  //            SELECT name FROM sysdata WHERE kode='013'
  //            `
  //            , (err, sysdata) => {
  //             if (err) {
  //             console.error('Error executing SELECT statement:', err);
  //             connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                 status: false,
  //                 message: 'gagal ambil data',
  //                 data:[]
                  
  //                 });
  //           });
  //           return;
  //         }





 
  //            connection.query( `
  //            SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE atten_date='${date}' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='TL' ) AND status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}'
  //            UNION ALL
  //            SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${date}%' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='DL' ) AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}'
  //            `
             
             
  //            , (err, tugasLuar) => {
  //             if (err) {
  //             console.error('Error executing SELECT statement:', err);
  //             connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                 status: false,
  //                 message: 'gagal ambil data',
  //                 data:[]
                  
  //                 });
  //           });
  //           return;
  //         }

          


  //         if (tugasLuar.length>0){

  //           connection.query( `SELECT places,dep_id FROM employee WHERE em_id='${em_id}' `, (err, results) => {
  //             if (err) {
  //             console.error('Error executing SELECT statement:', err);
  //             connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                 status: false,
  //                 message: 'gagal ambil data',
  //                 data:[]
                  
          
  //               });
            
  //         });
  //           return;

  //         }
  //         connection.query( `SELECT *  FROM department WHERE id='${results[0].dep_id}' `, (err, dep) => {
  //           if (err) {
  //           console.error('Error executing SELECT statement:', err);
  //           connection.rollback(() => {
  //               connection.end();
  //               return res.status(400).send({
  //               status: false,
  //               message: 'gagal ambil data',
  //               data:[]
                
        
  //             });
          
  //       });
  //         return;

  //       }
  //       var conditionarketing=""

  //       if (dep.length>0)
  //       {
  //         if (dep[0].inisial=='MKT'){
  //           conditionarketing=` OR trx='TLM' OR trx='DLM'  `
  //         }
  //       }

          
  //         records = results;
  //         var data=records[0].places.split(',')
         
  //         connection.query( `SELECT * FROM places_coordinate WHERE trx ='${tugasLuar[0].nomor_ajuan.substring(0, 2)}' OR ID IN (?) ${conditionarketing}`,[data], (err, palceCoordinate) => {
  //             if (err) {
  //               console.error('Error executing SELECT statement:', err);
  //               connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                   status: false,
  //                   message: 'gagal ambil data',
  //                   data:[]
                  
  //                 });
  //               });
           
  //             }
              

  //         connection.commit((err) => {
  //           if (err) {
  //             console.error('Error committing transaction:', err);
  //             connection.rollback(() => {
  //               connection.end();
  //               return res.status(400).send({
  //                 status: true,
  //                          message: "Kombinasi email & password Anda Salah",
  //                 data:[]
                
  //               });
  //             });
  //             return;
  //           }
  //           connection.end();
  //           console.log('Transaction completed successfully!');
  //           return res.status(200).send({
  //             status: true,
  //             message: "Kombinasi email & password Anda Salah",
  //             data:palceCoordinate
            
  //           });
  //         });

        
  //         });
  //       });
  //       });
         
          


  //         }else{

  //           connection.query( `SELECT places,dep_id FROM employee WHERE em_id='${em_id}' `, (err, results) => {
  //             if (err) {
  //             console.error('Error executing SELECT statement:', err);
  //             connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                 status: false,
  //                 message: 'gagal ambil data',
  //                 data:[]
                  
  //                 });
  //           });
  //           return;
  //         }
  //         connection.query( `SELECT *  FROM department WHERE id='${results[0].dep_id}' `, (err, dep) => {
  //           if (err) {
  //           console.error('Error executing SELECT statement:', err);
  //           connection.rollback(() => {
  //               connection.end();
  //               return res.status(400).send({
  //               status: false,
  //               message: 'gagal ambil data',
  //               data:[]
                
        
  //             });
          
  //       });
  //         return;

  //       }
  //       var conditionarketing=""

  //       if (dep.length>0)
  //       {
  //         if (dep[0].inisial=='MKT'){
  //           conditionarketing=` OR trx='TLM' OR trx='DLM'  `
  //         }
  //       }
          
  //         records = results;
  //         var data=records[0].places.split(',')
         
  //         connection.query( `SELECT * FROM places_coordinate WHERE ID IN (?) ${conditionarketing}`,[data], (err, palceCoordinate) => {
  //             if (err) {
  //               console.error('Error executing SELECT statement:', err);
  //               connection.rollback(() => {
  //                 connection.end();
  //                 return res.status(400).send({
  //                   status: false,
  //                   message: 'gagal ambil data',
  //                   data:[]
                  
  //                 });
  //               });
           
  //             }
              

  //         connection.commit((err) => {
  //           if (err) {
  //             console.error('Error committing transaction:', err);
  //             connection.rollback(() => {
  //               connection.end();
  //               return res.status(400).send({
  //                 status: true,
  //                          message: "Kombinasi email & password Anda Salah",
  //                 data:[]
                
  //               });
  //             });
  //             return;
  //           }
  //           connection.end();
  //           console.log('Transaction completed successfully!');
  //           return res.status(200).send({
  //             status: true,
  //             message: "Kombinasi email & password Anda Salah",
  //             data:palceCoordinate
            
  //           });

        
  //         });
  //       });
  //       });
  //       });


  //         }
                  
  //               });
  //             });
  //           });
          

  //         });
        
  //     }catch($e){
  //       return res.status(400).send({
  //         status: true,
  //         message: 'Gagal ambil data',
  //         data:[]
        
  //       });
  
  //     }


    
  // },
  async PalceCoordinate(req,res){
    console.log("---------place coodinate----------------")
    var database=req.query.database;
    var attenDate=req.query_date;

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
             SELECT name FROM sysdata WHERE kode='013'
             `
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





 
             connection.query( `
             SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE atten_date='${date}' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='TL' ) AND status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}'
             UNION ALL
             SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${date}%' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='DL' ) AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}'
             `
             
             
             , (err, tugasLuar) => {
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

          


          if (tugasLuar.length>0){

     

          
          records = results;
          var data=records[0].places.split(',')
       
          connection.query( ` SELECT * FROM places_coordinate WHERE trx ='${tugasLuar[0].nomor_ajuan.substring(0, 2)}' OR em_ids LIKE '%${em_id}%' OR em_ids IS NULL  OR trx='0'`, (err, palceCoordinate) => {
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
              data:palceCoordinate
            
            });
          });

        
          });
       
         
          



        }else{

          connection.query( ` SELECT * FROM places_coordinate WHERE  em_ids LIKE '%${em_id}%' OR em_ids IS NULL  OR trx='0'`, (err, palceCoordinate) => {
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
              data:palceCoordinate
            
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


    
  },
  async PalceCoordinatePengajuan(req,res){
    console.log("---------place coodinate----------------")
    var database=req.query.database;
    var attenDate=req.query_date;

    let ms = Date.now();

    var d = new Date(ms),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
        
        var date=req.query.date


    
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
             SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE atten_date='${date}' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='TL' ) AND status='Approve'
             UNION ALL
             SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${date}%' AND em_id='${em_id}' AND (SUBSTRING(nomor_ajuan, 1, 2)='DL' ) AND leave_status='Approve'
             `
             
             
             , (err, tugasLuar) => {
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

          


          if (tugasLuar.length>0){

            connection.query( `SELECT places FROM employee WHERE em_id='${em_id}' `, (err, results) => {
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
          
          records = results;
          var data=records[0].places.split(',')
         
          connection.query( `SELECT * FROM places_coordinate WHERE trx ='${tugasLuar[0].nomor_ajuan.substring(0, 2)}' OR ID IN (?) AND `,[data], (err, palceCoordinate) => {
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
              data:palceCoordinate
            
            });

        
          });
        });
        });
         
          
        //   records = tugasLuar;

          
      
        //   connection.query( `SELECT * FROM places_coordinate WHERE trx ='${records[0].nomor_ajuan.substring(0, 2)}'`, (err, palceCoordinate) => {
        //       if (err) {
        //         console.error('Error executing SELECT statement:', err);
        //         connection.rollback(() => {
        //           connection.end();
        //           return res.status(400).send({
        //             status: false,
        //             message: 'gagal ambil data',
        //             data:[]
                  
        //           });
        //         });
           
        //       }
              

        //   connection.commit((err) => {
        //     if (err) {
        //       console.error('Error committing transaction:', err);
        //       connection.rollback(() => {
        //         connection.end();
        //         return res.status(400).send({
        //           status: true,
        //                    message: "Kombinasi email & password Anda Salah",
        //           data:[]
                
        //         });
        //       });
        //       return;
        //     }
        //     connection.end();
        //     console.log('Transaction completed successfully!');
        //     return res.status(200).send({
        //       status: true,
        //       message: "Kombinasi email & password Anda Salah",
        //       data:palceCoordinate
            
        //     });

        
        
        // });
        // });



          }else{

            connection.query( `SELECT places FROM employee WHERE em_id='${em_id}' `, (err, results) => {
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
          
          records = results;
          var data=records[0].places.split(',')
         
          connection.query( `SELECT * FROM places_coordinate WHERE ID IN (?)`,[data], (err, palceCoordinate) => {
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
              data:palceCoordinate
            
            });

        
          });
        });
        });


          }
                  
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
  edit_foto_user(req, res) {
    const SftpClient = require('ssh2-sftp-client');



  const config = {
      host: 'Kantor.siscom.id',
      port: 22, // Default SFTP port is 22
      username: 'siscom',
      password: 'siscom!@#$%'
    };
 

    const localFilePath = 'public/face_recog/regis_SIS202210039.png';
    const remoteFilePath = 'public_html/6H202305001/foto_profile/regis_SIS202210039.png';

    const sftp = new SftpClient();

   sftp.connect(config)
  .then(() => {
    // SFTP connection successful
    return sftp.put(localFilePath, remoteFilePath);
  })
  .then(() => {
    console.log('File uploaded successfully!');
    sftp.end(); // Disconnect after the upload is complete
  })
  .catch(err => {
    console.error('Error:', err);
    sftp.end(); // Disconnect if an error occurs
  });
  sftp.end();




  },

 async database(req, res) {
  var database=req.body.database;
  var email=req.query.email;
  var periode=req.body.periode;



  let records;
    try{
        const connection=await model.sisAdmin();
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
          
            // insert
            // connection.query(sqlStatements[0], params[0], (err) => {
            //   if (err) {
            //     console.error('Error executing INSERT statement:', err);
            //     connection.rollback(() => {
            //       connection.end();
            //     });
            //     return;
            //   }

            //update
        
              // connection.query(sqlStatements[1], [params[1], params[2]], (err) => {
              //   if (err) {
              //     console.error('Error executing UPDATE statement:', err);
              //     connection.rollback(() => {
              //       connection.end();
              //     });
              //     return;
              //   }
             
              // SELECT cust.email, cust_order.dbname, cust_order.pos, cust.password, company.name FROM cust_order JOIN cust ON cust.id=cust_order.cust_id JOIN company ON company.id=cust_order.company_id WHERE cust.email ='${email}'

                connection.query(` SELECT DISTINCT co.dbname,ess.email,c.name FROM cust_order co  JOIN company c ON c.id=co.company_id  JOIN ess ON ess.dbname=co.dbname WHERE ess.email='${email}' `, (err, results) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'gaga ambil data',
                        data:[]
                      
                      });
                    });
                    return;
                  }
                  records = results;
                  if (records.length==0){
                    return res.status(400).send({
                      status: true,
                      message: 'Data tidak ditemukan',
                      data:[]
                    
                    });
                  }
                  connection.commit((err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'Gagal ambil data',
                          data:[]
                        
                        });
                      });
                      return;
                    }
                    connection.end();
                    console.log('Transaction completed successfully!');
                    return res.status(200).send({
                      status: true,
                      message: 'Data berhasil di ambil',
                      data:records
                    
                    });
              
                
                  });
                });
              });
            });
        
      

    }catch(e){
      return res.status(400).send({
        status: true,
        message: e,
        data:[]
      
      });

    }
   
  },
  async absenPulangCepatDanTerlambat(req, res) {
    var database=req.query.database;
    var email=req.query.email;
    var periode=req.body.periode;
    var emId=req.headers.em_id;
      try{
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
            
                  connection.query(`SELECT attendance.* FROM attendance JOIN emp_shift ON emp_shift.atten_date=attendance.atten_date JOIN work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${emId}' AND work_schedule.time_in> attendance.signin_time `, (err, datangTerlambat) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'gaga ambil data',
                          data:[]
                        
                        });
                      });
                      return;
                    }
                   
                    connection.query(`SELECT * FROM attendance JOIN emp_shift ON emp_shift.atten_date=attendance.atten_date JOIN work_schedule ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${emId}' AND work_schedule.time_out> attendance.signout_time `, (err, pulangCepat) => {
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'gaga ambil data',
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
                            message: 'Gagal ambil data',
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: 'Data berhasil di ambil',
                        data_absen_terlambat:datangTerlambat,
                        data_absen_pulang_cepat:pulangCepat
                      
                      });
                    });
                
                  
                    });
                  });
                });
              });
          
        
  
      }catch(e){
        return res.status(400).send({
          status: true,
          message: e,
          data:[]
        
        });
  
      }
     
    },

    async absenPulangCepat(req, res) {
      var database=req.query.database;
      var email=req.query.email;
      var periode=req.body.periode;
      var emId=req.query.em_id;
      var  startDate=req.query.startPeriode;
      var endDate=req.query.endPeriode;


      var dates=req.query.dates==undefined?'2024-08,2024-09':req.query.dates;

      console.log(req.query)


      var query=``

      var datesplits=dates.split(',')

      for (var i=0;i<datesplits.length;i++){

        var date=datesplits[i].split('-')
       console.log(date)
        var bulan=date[1];
        var tahun=date[0]
        var convertYear = tahun.toString().substring(2, 4);
      
 
        var finalDatabase=`${database}_hrm${convertYear}${bulan}`
        var databaseMaster=`${database}_hrm`
        if (i==0){
          query=`  WITH RankedAttendance${i+1} AS (
            SELECT *,
            (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE 
              em_id='${emId}' AND leave_status='Approve2'   AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                   ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
            FROM ${finalDatabase}.attendance WHERE em_id='${emId}'  AND signout_time != '00:00:00' AND atten_date>='${startDate}' AND atten_date<='${endDate}'  ORDER BY id DESC
          )`
      
          
    
        }else{
          query= `${query},  RankedAttendance${i+1}  AS (
            SELECT *,
            (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                   ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
                   
            FROM ${finalDatabase}.attendance WHERE em_id='${emId}' AND signout_time != '00:00:00' AND atten_date>='${startDate}' AND atten_date<='${endDate}'  ORDER BY id DESC
          )`
  
        }

        // if (i==0){
        //   query=`  WITH RankedAttendance${i+1} AS (
        //     SELECT *,
        //     (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND leave_status='Approve2' AND ajuan='1'  LIMIT 1) AS cuti ,
                
        //     ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
        //     FROM ${finalDatabase}.attendance
        //   )`
      
          
    
        // }else{
        //   query= `${query},  RankedAttendance${i+1}  AS (
        //     SELECT *,
        //     (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND leave_status='Approve2' AND ajuan='1'  LIMIT 1) AS cuti ,
        //            ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
                   
        //     FROM ${finalDatabase}.attendance
        //   )`
  
        // }

      


      } 

      

      for (var i=0;i<datesplits.length;i++){

        var date=datesplits[i].split('-')
       console.log(date)
        var bulan=date[1];
        var tahun=date[0]
        var convertYear = tahun.toString().substring(2, 4);
      
 
        var finalDatabase=`${database}_hrm${convertYear}${bulan}`
        var databaseMaster=`${database}_hrm`


       

        
       if (i==0){
        query=`${query} SELECT RankedAttendance${i+1} .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
        FROM RankedAttendance${i+1} 
        JOIN ${finalDatabase}.emp_shift ON RankedAttendance${i+1} .em_id = emp_shift.em_id 
        AND emp_shift.atten_date = RankedAttendance${i+1}.atten_date
                                 
        LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
        WHERE RankedAttendance${i+1} .row_num = 1
        AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance${i+1} .signout_time
        AND RankedAttendance${i+1} .em_id = '${emId}'
   
        
        `
    
        
  
      }else{
        query= `${query} UNION ALL SELECT RankedAttendance${i+1} .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
        FROM RankedAttendance${i+1} 
        JOIN ${finalDatabase}.emp_shift ON RankedAttendance${i+1} .em_id = emp_shift.em_id 
                                 AND emp_shift.atten_date = RankedAttendance${i+1}.atten_date
        LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
        WHERE RankedAttendance${i+1} .row_num = 1
        AND IFNULL(work_schedule.time_out, '18:00') > RankedAttendance${i+1} .signout_time
        AND RankedAttendance${i+1} .em_id = '${emId}'
   
        
        `

      }


      } 


     
      var queryFinal=`SELECT * FROM (${query}) AS TBL WHERE TBL.cuti IS NULL`
      console.log(queryFinal)
        try{
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
              
             
                      connection.query(queryFinal, (err, pulangCepat) => {
                        if (err) {
                          console.error('Error executing SELECT statement:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: 'gaga ambil data',
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
                              message: 'Gagal ambil data',
                              data:[]
                            
                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log('Transaction completed successfully!');
                        return res.status(200).send({
                          status: true,
                          message: 'Data berhasil di ambil',
                          data:pulangCepat,
                    
                        
                        });
                      });
                  
                    
                      });
                    });
                  });
               
            
          
    
        }catch(e){
          return res.status(400).send({
            status: true,
            message: e,
            data:[]
          
          });
    
        }
       
      },

      async absenDatangTerlambat(req, res) {
        var database=req.query.database;
        var email=req.query.email;
        var periode=req.body.periode;
        var emId=req.query.em_id;

        var  startDate=req.query.startPeriode;
        var endDate=req.query.endPeriode;

  
  
        var dates=req.query.dates==undefined?'2024-08,2024-09':req.query.dates;
  
        console.log(req.query)
  
  
        var query=``
  
        var datesplits=dates.split(',')
  
        for (var i=0;i<datesplits.length;i++){
  
          var date=datesplits[i].split('-')
         console.log(date)
          var bulan=date[1];
          var tahun=date[0]
          var convertYear = tahun.toString().substring(2, 4);
        
   
          var finalDatabase=`${database}_hrm${convertYear}${bulan}`
          var databaseMaster=`${database}_hrm`
  
  
          if (i==0){
            query=`  WITH RankedAttendance${i+1} AS (
              SELECT *,
              (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND leave_status='Approve2'   AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                     ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
              FROM ${finalDatabase}.attendance WHERE em_id='${emId}' AND atten_date>='${startDate}' AND atten_date<='${endDate}' ORDER BY id DESC
            )`
        
            
      
          }else{
            query= `${query},  RankedAttendance${i+1}  AS (
              SELECT *,
              (SELECT b.name FROM ${finalDatabase}.emp_leave JOIN leave_types b ON emp_leave.typeid=b.id WHERE em_id='${emId}' AND leave_status='Approve2'  AND date_selected  LIKE CONCAT('%',attendance.atten_date,'%')  AND ajuan='1'  LIMIT 1) AS cuti ,
                     ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
                     
              FROM ${finalDatabase}.attendance WHERE em_id='${emId}' AND atten_date>='${startDate}' AND atten_date<='${endDate}' ORDER BY id DESC
            )`
    
          }
  
        
  
  
        } 
  
        
  
        for (var i=0;i<datesplits.length;i++){
  
          var date=datesplits[i].split('-')
         console.log(date)
          var bulan=date[1];
          var tahun=date[0]
          var convertYear = tahun.toString().substring(2, 4);
        
   
          var finalDatabase=`${database}_hrm${convertYear}${bulan}`
          var databaseMaster=`${database}_hrm`
  
  
         
  
          
         if (i==0){
          query=`${query} SELECT RankedAttendance${i+1} .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
          FROM RankedAttendance${i+1} 
          JOIN ${finalDatabase}.emp_shift ON RankedAttendance${i+1} .em_id = emp_shift.em_id 
          AND emp_shift.atten_date = RankedAttendance${i+1}.atten_date                    
          LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
          WHERE RankedAttendance${i+1} .row_num = 1
          AND IFNULL(work_schedule.time_in, '08:30') < RankedAttendance${i+1} .signin_time
          AND RankedAttendance${i+1} .em_id = '${emId}'
        
          `
      
          
    
        }else{
          query= `${query} UNION ALL SELECT RankedAttendance${i+1} .*, work_schedule.time_out AS jam_pulang, work_schedule.time_in AS jam_kerja
          FROM RankedAttendance${i+1} 
          JOIN ${finalDatabase}.emp_shift ON RankedAttendance${i+1} .em_id = emp_shift.em_id 
           AND emp_shift.atten_date = RankedAttendance${i+1}.atten_date
          LEFT JOIN work_schedule ON emp_shift.work_id = work_schedule.id
          WHERE RankedAttendance${i+1} .row_num = 1
          AND IFNULL(work_schedule.time_in, '08:30') < RankedAttendance${i+1} .signin_time
          
          AND RankedAttendance${i+1} .em_id = '${emId}'
       
          
          `
  
        }
  
  
        } 
  
  
         
        var queryFinal=`SELECT * FROM (${query}) AS TBL WHERE TBL.cuti IS NULL ORDER BY id`
        console.log(queryFinal)
          try{
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
                
               
                        connection.query(queryFinal, (err, pulangCepat) => {
                          if (err) {
                            console.error('Error executing SELECT statement:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                message: 'gaga ambil data',
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
                                message: 'Gagal ambil data',
                                data:[]
                              
                              });
                            });
                            return;
                          }
                          connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: 'Data berhasil di ambil',
                            data:pulangCepat,
                      
                          
                          });
                        });
                    
                      
                        });
                      });
                    });
                 
              
            
      
          }catch(e){
            return res.status(400).send({
              status: true,
              message: e,
              data:[]
            
            });
      
          }
//         var database=req.query.database;
//         var emId=req.query.em_id;
//         var dates=req.query.dates==undefined?'2024-08,2024-09':req.query.dates;

//         console.log(req.query)


//         var query=``

//         var datesplits=dates.split(',')

//         for (var i=0;i<datesplits.length;i++){

//           var date=datesplits[i].split('-')
//          console.log(date)
//           var bulan=date[1];
//           var tahun=date[0]
//           var convertYear = tahun.toString().substring(2, 4);
        

//           var finalDatabase=`${database}_hrm${convertYear}${bulan}`

//           console.log('tes',finalDatabase)
         

          
//          if (i==0){

//           query=`WITH RankedAttendance AS (
//             SELECT *, 
//                    ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
//             FROM ${finalDatabase}.attendance
//         )
//         SELECT RankedAttendanc.*,work_schedule.time_in as jam_kerja 
//         FROM RankedAttendance 
//         JOIN ${finalDatabase}.emp_shift ON RankedAttendance.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance.atten_date
//         LEFT JOIN .work_schedule ON emp_shift.work_id=work_schedule.id
//         WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance.signin_time
//         AND RankedAttendance.em_id='${emId}' `


//           //  query= ` SELECT  attendance.*,work_schedule.time_in as jam_kerja FROM ${finalDatabase}.attendance   JOIN ${finalDatabase}.emp_shift
//           //   ON emp_shift.atten_date=attendance.atten_date  AND emp_shift.em_id=attendance.em_id JOIN work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${emId}' AND work_schedule.time_in < attendance.signin_time `
          
//          }else{
// //          query=query +`UNION ALL  SELECT  attendance.*,work_schedule.time_in as jam_kerja FROM ${finalDatabase}.attendance  JOIN ${finalDatabase}.emp_shift ON emp_shift.atten_date=attendance.atten_date AND emp_shift.em_id=attendance.em_id JOIN work_schedule  ON work_schedule.id=emp_shift.work_id  WHERE attendance.em_id='${emId}' AND work_schedule.time_in < attendance.signin_time `

//           query=query +`UNION ALL

//           WITH RankedAttendance AS (
//             SELECT *, 
//                    ROW_NUMBER() OVER (PARTITION BY atten_date ORDER BY id) AS row_num
//             FROM ${finalDatabase}.attendance
//         )
//         SELECT RankedAttendanc.*,work_schedule.time_in as jam_kerja 
//         FROM RankedAttendance 
//         JOIN ${finalDatabase}.emp_shift ON RankedAttendance.em_id=emp_shift.em_id AND emp_shift.atten_date=RankedAttendance.atten_date
//         LEFT JOIN .work_schedule ON emp_shift.work_id=work_schedule.id
//         WHERE row_num = 1 AND IFNULL(work_schedule.time_in,'08:30') < RankedAttendance.signin_time
//         AND RankedAttendance.em_id='${emId}'
          
         
//           `

        
//         }
//         }
//        // query= ` SELECT attendance.* FROM ${finalDatabase}.attendance WHERE attendance.em_id='${emId}'  `
          

//         try{
//             const connection = await model.createConnection(database);
//               connection.connect((err) => {
//                 if (err) {
//                   console.error('Error connecting to the database:', err);
//                   return;
//                 }
              
//                 connection.beginTransaction((err) => {
//                   if (err) {
//                     console.error('Error beginning transaction:', err);
//                     connection.end();
//                     return;
//                   }

                

                
                 
//                         connection.query(query, (err, datangTerlambat) => {
//                           if (err) {
//                             console.error('Error executing SELECT statement:', err);
//                             connection.rollback(() => {
//                               connection.end();
//                               return res.status(400).send({
//                                 status: true,
//                                 message: 'gaga ambil data',
//                                 data:[]
                              
//                               });
//                             });
//                             return;
//                           }
//                         connection.commit((err) => {
//                           if (err) {
//                             console.error('Error committing transaction:', err);
//                             connection.rollback(() => {
//                               connection.end();
//                               return res.status(400).send({
//                                 status: true,
//                                 message: 'Gagal ambil data',
//                                 data:[]
                              
//                               });
//                             });
//                             return;
//                           }
//                           connection.end();
//                           console.log('Transaction completed successfully!');
//                           return res.status(200).send({
//                             status: true,
//                             message: 'Data berhasil di ambil',
//                             data:datangTerlambat,
                                                    
//                           });
//                         });
                    
                
//                       });
//                     });
//                   });
              
            
      
//           }catch(e){
//             return res.status(400).send({
//               status: true,
//               message: e,
//               data:[]
            
//             });
      
//           }
         
        },
  async viewLastAbsen(req, res) {
  
 
  
    const database = req.query.database;
    var email=req.query.email;
    var periode=req.body.periode;

  
   // g('-----view last absen 1 2----------')

    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    const convertBulan = array[1];
  
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    
    var startDate=req.body.start_date;
    var endDate=req.body.end_date;
    var startTime=req.body.start_time;
    var endTime=req.body.end_time;
    var pola=req.body.pola;


    console.log(namaDatabaseDynamic);

    console.log('body nih lastAbsen2',req.body);

var script='';
    let records;
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

              connection.query(`SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' ORDER BY id DESC`, (err, absensi) => {
                if (err) {
                  console.error('Error executing SELECT statement:', err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: 'gaga ambil data',
                      data:[]
                    
                    });
                  });
                  return;
                }
                
                connection.query(`SELECT * FROM ${database}_hrm.sysdata WHERE kode='018'`, (err, sysdata) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'gaga ambil data',
                        data:[]
                      
                      });
                    });
                    return;
                  }

                  if (sysdata.length>0){
                    const array1 = sysdata[0].name.split(",");
             

                    
                    if ((array1[0].toString().trim()=="00:00") &&( array1[1].toString().trim()=="00:00") ){
                      startTime=absensi[0]['signin_time']
                      startDate=absensi[0]['atten_date']

                      endTime=absensi[0]['signin_time']


                      var date = new Date( startDate);
                      date.setDate(date.getDate() + 1);
                      
                      
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
                      const day = String(date.getDate()).padStart(2, '0');


                      
                      endDate = `${year}-${month}-${day}`;
                      
                    

                    }



                  }

                  
                  var script = `SELECT places_coordinate.trx, attendance.* FROM ${namaDatabaseDynamic}.attendance LEFT JOIN ${database}_hrm.places_coordinate ON attendance.place_in=places_coordinate.place WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', signin_time) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                  AND (CONCAT(atten_date, ' ', signin_time)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND atttype='1' ORDER BY id DESC LIMIT 1`;
                
                  // if (sysdata.length>0){

                  //   const array2 = sysdata[0].name.split(",");

                  //   var dataJam=array2[2];

                  //   console.log("data jam ",dataJam)

                  //   if (dataJam>0){
                  //     startTime=absensi[0]['signin_time']
                  //     startDate=absensi[0]['atten_date']
                     
                  //     var combineDate=`${startDate}T${startTime}`
                  //     let customDate = new Date(combineDate);

                  //     customDate.setHours(customDate.getHours() + 3);
                  //     endTime=`${customDate.getHours().toString().padStart(2,'0')} ${customDate.getMinutes.toString().padStart(2,'0')}`;

                  //     endDate= new Date(`${customDate.getFullYear()}-${customDate.getMonth().toString().padStart(2,'0')}-${customDate.getDate().toString().padStart(2,'0')}`);
                         
                  //  script=`SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${em_id}' AND '${startDate} ${startTime}'<=NOW()  AND  NOW() <= '${endDate} ${endTime}' ORDER BY id DESC LIMIT 1`
                  //   }

                  // }
                 

          
                  console.log('-----view last absen 1 2---------- new',script)
                 connection.query(`${script}`, (err, absensiNow) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'gaga ambil data',
                        data:[]
                      
                      });
                    });
                    return;
                  }
                  var wfh=""
                  var absenOffline=""
                  if (pola=="2" || pola==2){
              
                     wfh = `SELECT emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                  AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='4' AND status_transaksi='1' AND (status='Pending' OR status='Approve') ORDER BY id DESC LIMIT 1`;
              
              
                  }else{
                     wfh = `SELECT emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                  AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='4' AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`;
              
                  }


                  //(CONCAT(${absensiNow[0].atten_date}, ' ', ${absensiNow[0].signin_time})

                  if (absensiNow.length>0){
                    if (pola=="2" || pola==2){

                   
           
                      absenOffline = `SELECT emp_labor.atten_date,  emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan,emp_labor.sampai_jam as signout_time  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND  (CONCAT('${absensiNow[0].atten_date}', ' ', '${absensiNow[0].signin_time}') >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                      AND (CONCAT(atten_date, ' ', dari_jam) <= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' OR status='Approve' ) ORDER BY id DESC LIMIT 1`;                   
                     }else{
                      absenOffline = `SELECT emp_labor.atten_date,  emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.sampai_jam as signout_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT('${absensiNow[0].atten_date}', ' ', '${absensiNow[0].signin_time}') >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                      AND (CONCAT(atten_date, ' ', dari_jam) <= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`
                     }

                  }else{
                    if (pola=="2" || pola==2){

                   
              
                    absenOffline = `SELECT emp_labor.atten_date, emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.nomor_ajuan,emp_labor.sampai_jam as signout_time  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                     AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' OR status='Approve') ORDER BY id DESC LIMIT 1`;
                      
                     
                    }else{
                      absenOffline = `SELECT emp_labor.atten_date,  emp_labor.status,emp_labor.dari_jam as signing_time,emp_labor.sampai_jam as signout_time,emp_labor.nomor_ajuan  FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND (CONCAT(atten_date, ' ', dari_jam) >= '${startDate} ${startTime}' AND NOW() >= '${startDate} ${startTime}')
                     AND (CONCAT(atten_date, ' ', dari_jam)<= '${endDate} ${endTime}'  AND NOW()<= '${endDate} ${endTime}' )   AND ajuan='5' AND status_transaksi='1' AND (status='Pending' )  ORDER BY id DESC LIMIT 1`;
                 
                     }
                    
                  }
                  
                  console.log('query absen offline ',absenOffline)
                  connection.query(`${script};${wfh};${absenOffline}`, (err, results) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'gaga ambil data',
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
                            message: 'Gagal ambil data',
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');

                      
                      if (results[0].length>0){
                        

                        if (results[0][0].signin_time!='00:00:00'){
                        if (  results[0][0].signout_time!='00:00:00'){

                          if (results[2].length>0){
                            results[0]=[]
                            console.log(script)
                          }
                         
                        }else{

                          if (results[2].length>0){

                            var date1=new Date(`${results[2][0].atten_date} ${results[2][0].signout_time}`)

                            console.log(`${results[2].atten_date} ${results[2].signout_time}`)
                            const timeDifference = Math.abs(new Date()- date1); // Use Math.abs to ensure a positive value

                            // Convert the time difference to hours and minutes
                            const hours = Math.floor(timeDifference / (1000 * 60 * 60)); // Convert to hours
                            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes
                        
                            console.log(`Time difference: ${hours} hours and ${minutes} minutes`);
                            if (hours > 24) {
                              results[2]=[]
                            } else {
                                console.log("The date is within 24 hours from now.");
                            }
                          }

                        }
                        }

                        if (results[1].length>0){
                         return   res.status(200).send({
                            status: true,
                            message: "Berhasil ambil data!",
                            data:[],
                            wfh: results[1],
                            offiline:results[2]
                            
                          });
          
                        }else{
                         return  res.status(200).send({
                            status: true,
                            message: "Berhasil ambil data!",
                            data: results[0],
                            wfh: results[1],
                            offiline:results[2]
                            
                          });
                        }
                      }else{
                      return   res.status(200).send({
                          status: true,
                          message: "Berhasil ambil data!",
                          data: results[0],
                          wfh: results[1],
                          offiline:results[2]
                          
                        });
          
                      }
                      
                      // return res.status(200).send({
                      //   status: true,
                      //   message: 'Data berhasil di ambil',
                      //   data:records
                      
                      // });
                
                  
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
          message: e,
          data:[]
        
        });
  
      }
     
    },
  

  async editLastLogin(req,res){
    var database=req.body.database;

   var em_id = req.body.em_id;
    var last_login = req.body.last_login;
  console.log(req.body)
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
                  connection.query(`UPDATE employee SET last_login='${last_login}' WHERE em_id='${em_id}'`, (err) => {
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



  async  historyAttendance(req,res){
    console.log("---------history absensi new----------------")
    var database=req.query.database;
   // var attenDate=req.query_date;
    var em_id=req.body.em_id;
    var em_id=req.body.em_id;

    let ms = Date.now();

    var d = new Date(ms),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
        
        var date=req.query.date


    
        // var em_id=req.query.id
        console.log(req.body)
        var bulan = req.body.bulan;
        var tahun = req.body.tahun;

        var startPeriode=req.body.start_periode;
        var endPeriode=req.body.end_periode;
    
    
    
    
        const convertYear = tahun.substring(2, 4);
        var convertBulan;
        if (bulan.length == 1) {
          convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
        } else {
          convertBulan = bulan;
        }
        var namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

        var startPeriode=req.query.start_periode==undefined?"2024-02-03":req.query.start_periode;
        var endPeriode=req.query.end_periode==undefined?"2024-02-03":req.query.end_periode;
        var array1=startPeriode.split('-')
        var array2=endPeriode.split('-')
        
        const startPeriodeDynamic=`${database}_hrm${array1[0].substring(2,4)}${array1[1]}`
        const endPeriodeDynamic=`${database}_hrm${array2[0].substring(2,4)}${array2[1]}`
        
        let date1 = new Date(startPeriode);
        let date2 = new Date(endPeriode);
        const montStart = date1.getMonth() +1; 
        const monthEnd = date2.getMonth() +1; 
        if (montStart<monthEnd || date1.getFullYear()<date2.getFullYear()){
          namaDatabaseDynamic=startPeriodeDynamic
        }
        console.log("month endd" ,monthEnd);
        console.log("month start  ",montStart)

// If you want the month as a 1-based index (1 = January, 2 = February, ..., 12 = December)
         
    
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
                 
              connection.query( `SELECT * FROM ${database}_hrm.sysdata WHERE KODE='013'`  
             ,(err, sysdata) => {
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

          console.log('data ',sysdata)

          var query=`WITH RECURSIVE DateRange AS (
            SELECT DATE_FORMAT('${startPeriode}' ,'%Y-%m-01') AS DATE
            UNION ALL
            SELECT DATE + INTERVAL 1 DAY
            FROM DateRange
            WHERE DATE + INTERVAL 1 DAY <= LAST_DAY(DATE_FORMAT('${startPeriode}' ,'%Y-%m-01'))
        )
        SELECT
         DateRange.date,
        (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor LEFT JOIN ${database
        }_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='1' AND status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS lembur ,
        (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='2' AND status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS tugas_luar ,
        (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database
        }_hrm.leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND date_selected  LIKE CONCAT('%',DateRange.date,'%')  AND ajuan='1' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS cuti ,
        (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database
        }_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='2' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}'  LIMIT 1) AS sakit ,
        (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database
        }_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='3' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}'  LIMIT 1) AS izin ,
        (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND date_selected LIKE '%DateRange.date%' AND ajuan='4' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS dinas_luar ,
        (SELECT  IFNULL(off_date ,0) FROM ${namaDatabaseDynamic}.emp_shift WHERE em_id='${em_id}' AND atten_date LIKE DateRange.date) AS off_date,
        
        IFNULL((SELECT  IFNULL(work_schedule.time_in ,attendance.signin_time) FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'08:31:00')AS jam_kerja,
        IFNULL((SELECT  IFNULL(work_schedule.time_out ,attendance.signout_time) FROM ${namaDatabaseDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'17:01:00')AS jam_pulang,
        holiday.name  AS hari_libur,attendance.*
        FROM DateRange 
        LEFT JOIN ${namaDatabaseDynamic}.attendance ON attendance.atten_date=DateRange.date AND em_id='${em_id}'
        LEFT JOIN ${database}_hrm.holiday_date ON holiday_date.holiday_date=DateRange.date LEFT JOIN ${database}_hrm.holiday ON holiday.id=holiday_date.holiday_id
        WHERE DateRange.date <=CURDATE()  AND DateRange.date>='${startPeriode}'
        ORDER BY DateRange.date DESC;`

      

        

          var query1=`

        WITH RECURSIVE DateRange AS (
          SELECT DATE_FORMAT('${endPeriode} ','%Y-%m-01') AS DATE
          UNION ALL
          SELECT DATE + INTERVAL 1 DAY
          FROM DateRange
          WHERE DATE + INTERVAL 1 DAY <= LAST_DAY(DATE_FORMAT('${endPeriode}' ,'%Y-%m-01'))
      )
      SELECT
       DateRange.date,
      (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_labor LEFT JOIN ${database
      }_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='1' AND status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS lembur ,
      (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_labor WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='2' AND status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS tugas_luar ,
      (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database
      }_hrm.leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND date_selected  LIKE CONCAT('%',DateRange.date,'%')  AND ajuan='1' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS cuti ,
      (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database
      }_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='2' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS sakit ,
      (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database
      }_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='3' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS izin ,
      (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND date_selected LIKE '%DateRange.date%' AND ajuan='4' AND leave_status='${sysdata[0].name=="1" || sysdata[0].name==1?"Approve":"Approve2"}' LIMIT 1) AS dinas_luar ,
      (SELECT  IFNULL(off_date ,0) FROM ${endPeriodeDynamic}.emp_shift WHERE em_id='${em_id}' AND atten_date LIKE DateRange.date) AS off_date,
      IFNULL((SELECT  IFNULL(work_schedule.time_in ,attendance.signin_time) FROM ${endPeriodeDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'08:31:00')AS jam_kerja,
      IFNULL((SELECT  IFNULL(work_schedule.time_out ,attendance.signout_time) FROM ${endPeriodeDynamic}.emp_shift LEFT JOIN ${database}_hrm.work_schedule ON emp_shift.work_id=work_schedule.id WHERE emp_shift.em_id='${em_id}' AND emp_shift.atten_date LIKE DateRange.date) ,'17:00:00')AS jam_pulang,
       
      holiday.name  AS hari_libur,attendance.*
      FROM DateRange 
      LEFT JOIN ${endPeriodeDynamic}.attendance ON attendance.atten_date=DateRange.date AND em_id='${em_id}'
      LEFT JOIN ${database}_hrm.holiday_date ON holiday_date.holiday_date=DateRange.date LEFT JOIN ${database}_hrm.holiday ON holiday.id=holiday_date.holiday_id
      WHERE (DateRange.date <=CURDATE()  AND DateRange.date<='${endPeriode}')
      ORDER BY DateRange.date DESC;


        
        `


      
        
console.log(query)

 
              connection.query( query 
             ,(err, result) => {
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
         
          connection.query( query1 
            ,(err, result2) => {
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
         let resultFinal=[];
         resultFinal=result2
         if (montStart<monthEnd || date1.getFullYear()<date2.getFullYear()){
        
          for (var i=0;i<result.length;i++){
            result2.push(result[i])
          }

         }

     
       
        // resultFinal.sort((a, b) => new Date(a.atten_date) - new Date(b.atten_date));
      
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
              data:result2
            
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
          message: 'Gagal ambil data',
          data:[]
        
        });
  
      }
 
  },

  

  async  kirimAbsensiOffline(req,res){
 console.log("kirim absen offline")

  
    var database=req.query.database;
   // var attenDate=req.query_date;
    var em_id=req.body.em_id;
    var emId=req.body.em_id;
    var attenDate=req.body.atten_date;
    var signingTime=req.body.signin_time==""?"00:00:00":req.body.signin_time;
    var signoutTime=req.body.signout_time==""?"00:00:00":req.body.signout_time;
    var placeIn=req.body.place_in
    var placeOut=req.body.place_out;
    var signinLonglat=req.body.signin_longlat;
    var signOutLonglat=req.body.signout_longlat;
    var signinPict=req.body.signin_pict;
    var signoutPict=req.body.signout_pict;
    var signinNote=req.body.signin_note;
    var signoutOutNote=req.body.signout_note;
    var signinAddr=req.body.signin_addr;
    var signoutAddr=req.body.signout_addr;
    var array=attenDate.split('-');
    var bulan=array[1];
    var tahun=array[0]
    var tahunConver=tahun.substring(2, 4);
    var status='Pending'

    var nomorAjuan="";




 
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    var nameFileMasuk='';
    var nameFileKeluar='';
    var id=req.body.id;
    if (signinPict == "" ||signinPict == null  ) {


    }else{

      var randomstring = require("randomstring");
 
      var image = signinPict;
      var bitmap = Buffer.from(image, 'base64');
      var stringRandom = randomstring.generate(5);
      nameFileMasuk = 'absenmasukoffline'+stringRandom + date + month + year + hour + menit + ".png";
     
      const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFileMasuk}`;
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

    if (signoutPict == "" ||signoutPict == null  ) {


    }else{

      var randomstring = require("randomstring");
 
      var image = signoutPict;
      var bitmap = Buffer.from(image, 'base64');
      var stringRandom = randomstring.generate(5);
      nameFileKeluar = 'absenkeluaroffline'+stringRandom + date + month + year + hour + menit + ".png";
     
      const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${nameFileKeluar}`;
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



        const namaDatabaseDynamic = `${database}_hrm${tahunConver}${bulan}`;
        const databaseMaster= `${database}_hrm`;
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


                 
              connection.query( `SELECT * FROM ${database}_hrm.sysdata WHERE KODE='013'`  
             ,(err, sysdata) => {
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
            var query=`SELECT * FROM employee WHERE em_id='${emId}'`
              connection.query( query 
             ,(err, employee) => {
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
          connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE ajuan='4' AND em_id='${em_id}' AND atten_date='${req.body}' AND (status='Approve' OR status='Pending')`, (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'Data sudah tersedia',
                  data:results
                
                });
              });
              return;
            }
           
        if (results.length>0){
          return res.status(400).send({
            status: true,
            message: 'Data sudah tersedia',
            data:results
          
          });
        }
        var date=new Date('2024-09-16 14:02:02')
        var timestampInSeconds = Math.floor(date / 1000);
      if (signingTime=='00:00:00' || signingTime==''){
        var date=new Date(`${attenDate} ${signoutTime}`)
         timestampInSeconds = Math.floor(date / 1000);
      }else{
        var date=new Date(`${attenDate} ${signingTime}`)
        timestampInSeconds = Math.floor(date / 1000);
      }

        connection.query(` SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND idx='${timestampInSeconds}'  `,
               (err, dataOffline) => {
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

              if (dataOffline.length>0){
                return res.status(400).send({
                  status: true,
                  message: 'Data gagal terkirim',
                  data:results
                
                });
             
              }
        connection.query(` SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE ajuan='5' ORDER BY id DESC `,
               (err, data) => {
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
              if (data.length > 0) {
                var text = data[0]['nomor_ajuan'];
                nomor = parseInt(text.substring(8, 13)) + 1;
                var nomorStr = String(nomor).padStart(4, '0')
                nomorAjuan = `RO20${tahunConver}${bulan}` + nomorStr;
        
              } else {
                nomor = 1;
                var nomorStr = String(nomor).padStart(4, '0')
                nomorAjuan  = `RO20${tahun}${bulan}` + nomorStr;
              }
        connection.query( `INSERT INTO ${ namaDatabaseDynamic}.emp_labor (nomor_ajuan,em_id,atten_date,dari_jam,sampai_jam,tgl_ajuan,status,status_transaksi,
          signin_note,signout_note,ajuan,em_delegation,signin_pict,signout_pict,place_in,place_out,approve_status,signin_longlat,signout_longlat,signin_addr,signout_addr,uraian,idx)
        VALUES ('${nomorAjuan}','${em_id}','${attenDate}','${signingTime}','${signoutTime}',CURDATE(),'${status}','1','${signinNote}','${signoutOutNote}','5','','${nameFileMasuk}','${nameFileKeluar}','${placeIn}','${placeOut}','Pending','${signinLonglat}','${signOutLonglat}','${signinAddr}','${signoutAddr}','${signinNote}','${timestampInSeconds}')`
        , (err, results) => {
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

            connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan='${nomorAjuan}' AND ajuan='5'`,
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
           connection.query(`SELECT * FROM ${databaseMaster}.employee WHERE em_id='${em_id}'`,
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

       utility.insertNotifikasi(employee[0].em_report_to,'Approval Absensi','Absensi',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);

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
              message: "sucess insert data",
            
            
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
            });
          });
          
          
        
      }catch(e){
        return res.status(400).send({
          status: true,
          message: 'Gagal ambil data',
          data:[]
        
        });
  
      }
 
  },


  

};







