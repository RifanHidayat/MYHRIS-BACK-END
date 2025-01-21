const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const utility=require('./../utils/utility')
const e = require("express");
// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');
require('dotenv').config();

var ipServer=process.env.API_URL
pool.on("error", (err) => {
  console.error(err);
});
// var utility.ipServerHris()=utility.utility.ipServerHris()Hris()

module.exports = {
  
async loginUser(req,res){
    var database=req.body.database;
    var email=req.query.email;
    let records;
    var password = sha1(req.body.password);
    var token_notif = req.body.token_notif;
 

    console.log("token notif",token_notif ,email)


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
              console.log(`SELECT
              a.em_tracking AS is_tracking,
              file_face,
              (SELECT name FROM sysdata WHERE id='006') AS interval_tracking,
              (SELECT name FROM sysdata WHERE kode='012') AS is_view_tracking,
              (SELECT name FROM sysdata WHERE kode='021') AS back_date,
                (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,(SELECT name FROM sysdata WHERE id='18') as time_attendance,
              (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll, branch.name AS branch_name, em_id, full_name, em_email, des_id, dep_id, dep_group_id AS dep_group, em_mobile AS em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title AS posisi, em_hak_akses, last_login, STATUS AS status_aktif,
              em_control, em_controlaccess AS em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working AS emp_att_working FROM employee a LEFT JOIN designation b ON a.des_id=b.id LEFT JOIN department c ON a.dep_id=c.id JOIN branch ON branch.id=a.branch_id where em_email='${req.body.email}' AND em_password='${password}'`)
                      
                  connection.query( `SELECT
                  branch.id as branch_id,
                  a.em_tracking AS is_tracking,
                  file_face,
                  (SELECT name FROM sysdata WHERE id='006') AS interval_tracking,
                  (SELECT name FROM sysdata WHERE kode='012') AS is_view_tracking,
                  (SELECT name FROM sysdata WHERE kode='043') AS toleransi_pengembalian,
                  (SELECT name FROM sysdata WHERE kode='021') AS back_date,
                  IFNULL(MAX(employee_history.end_date) ,'')AS tanggal_berakhir_kontrak,
                    (SELECT beginday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS begin_payroll,(SELECT name FROM sysdata WHERE id='18') as time_attendance,
                  (SELECT endday_payroll FROM payment_schedule WHERE is_default='Y' LIMIT 1) AS end_payroll, branch.name AS branch_name, em_id, full_name, em_email, des_id, dep_id, dep_group_id AS dep_group, em_mobile AS em_phone, em_birthday, em_blood_group, em_gender, em_image, em_joining_date, em_status, job_title AS posisi, em_hak_akses, last_login, STATUS AS status_aktif,
                   em_control, em_controlaccess AS em_control_access, b.name AS emp_jobTitle,c.name AS emp_departmen,em_att_working AS emp_att_working 
                   FROM employee a 
                   LEFT JOIN designation b ON a.des_id=b.id
                    LEFT JOIN department c ON a.dep_id=c.id 
                    LEFT  JOIN branch ON branch.id=a.branch_id 
                    LEFT JOIN employee_history ON a.em_id=employee_history.em_id
                    where em_email='${req.body.email}' AND em_password='${password}'`, (err, results) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
			console.log("data login,",results)

                        return res.status(400).send({
                          status: false,
                          message: 'gagal ambil data',
                          data:[]
                        
                        });
                      });
                      return;
                    }
                    
                    records = results;
                    if (records.length==0){
                      return res.status(400).send({
                        status: false,
                                  message: "Kombinasi email & password Anda Salah",
                        data:[]
                      
                      });
                    }
                  connection.query(`SELECT * FROM peraturan_perusahaan WHERE  status_transaksi='1' AND tipe='utama' AND status='1'  
                  AND (   branch_id LIKE '%${results[0].branch_id.toString().padStart(2, '0')}%'  OR    branch_id LIKE '%${results[0].branch_id}%' )
               ORDER BY id DESC LIMIT 1`, (err,dataPerusahaan) => {
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
                

                connection.query(`SELECT * FROM peraturan_perusahaan_employee WHERE  em_id='${results[0].em_id}' AND peraturan_perusahaan_id='${dataPerusahaan[0].id}' ORDER BY id DESC LIMIT 1`, (err,data) => {
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

                  if (data.length==0){

                        var dataInsert={
                          'peraturan_perusahaan_id':dataPerusahaan[0].id,
                          'em_id':results[0].em_id,
      
                          
                      }
                      var queryInsert=`INSERT INTO peraturan_perusahaan_employee  SET ?`

                      connection.query(queryInsert,[dataInsert], (err) => {
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

                      
                    connection.query(`UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${req.body.email}'`, (err) => {
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
                          console.log("data login akhir b",records)
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
                  

                  }else{
                    
                connection.query(`UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${req.body.email}'`, (err) => {
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
                      console.log("data login akhir c",records)
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Kombinasi email & password Anda Salahq",
                        data:records
                      
                      });
                    });

                  
                    });


                  }

              
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
      //         var updateToken = UPDATE employee SET token_notif='${token_notif}' WHERE em_email='${email}';
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
  async cekNoHp(req,res){
    console.log("cek no hp");
    var database=req.query.database;
    var email=req.query.email;
    
    let records;
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

          
                  connection.query( `SELECT em_mobile,full_name,em_email FROM employee where em_email='${req.query.email}'`, (err, results) => {
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
                    if (records.length==0){
                      return res.status(400).send({
                        status: false,
                                  message: "Data user tidak ditemukan",
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
    // const fs = require('fs');
    // const ftp = require('ftp');
    
    // const localImagePath = 'public/face_recog/regis_SIS202210039.png';
    // const remoteDirectory = 'public_html/6H202305001/foto_profile';
    // const remoteFileName = '/uploaded_image.jpg';
    // var foto=req.body.foto;
    
    // // Create a new FTP client instance
    // const client = new ftp();
    
    // // Connect to the FTP server
    // client.connect({
    //   host: 'Kantor.siscom.id',
    // // host: '192.168.100.86',
    //   user: 'siscom',
    //   password: 'siscom!@#$%'  
    // });
    
    // // Handle successful FTP connection
    // client.on('ready', () => {
    //   // Read the local image file
    //   fs.readFile(localImagePath, (err, data) => {
    //     if (err) throw err;
    
    //     // Upload the image to the remote directory
    //     client.put(data, remoteDirectory + remoteFileName, err => {
    //       if (err) throw err;
    
    //       console.log('Image uploaded successfully');
    
    //       // Close the FTP connection
    //       client.end();
    //     });
    //   });
    // });
    
    // // Handle FTP connection error
    // client.on('error', err => {
    //   console.log('FTP connection error:', err);
    // });





   // upload gambar
    // let ts = Date.now();
    // let date_ob = new Date(ts);
    // let date = date_ob.getDate();
    // let month = date_ob.getMonth() + 1;
    // let year = date_ob.getFullYear();
    // let hour = date_ob.getHours();
    // let menit = date_ob.getMinutes();
    // var randomstring = require("randomstring");
    // var fs = require("fs");
    // var image = req.body.base64_foto_profile;
    // var bitmap = Buffer.from(image, 'base64');
    // var stringRandom = randomstring.generate(5);
    // var nameFile = stringRandom + date + month + year + hour + menit + ".png";
    // fs.writeFileSync("public/foto_profile/" + nameFile, bitmap);



    // var em_id = req.body.em_id;
    // var menu_name = req.body.menu_name;
    // var activity_name = req.body.activity_name;

    // var script = `UPDATE employee SET em_image='${nameFile}' WHERE em_id='${em_id}'`;

    // var dataInsertLog = {
    //   menu_name: menu_name,
    //   activity_name: activity_name,
    //   acttivity_script: script,
    //   createdUserID: em_id
    // }

    // pool.getConnection(function (err, connection) {
    //   if (err) console.log(err);
    //   connection.query(
    //     script,
    //     function (error, results) {
    //       connection.release();
    //       if (error != null) console.log(error)
    //       res.send({
    //         status: true,
    //         message: "Berhasil di update!",
    //         nama_file: nameFile,
    //       });
    //     }
    //   );

    // });
  },

 async database(req, res) {
  var database=req.body.database;
  var email=req.query.email;
  var periode=req.body.periode;

  console.log("masuk sini")

  console

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
            //     });fl
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
             var query=`SELECT DISTINCT co.dbname,ess.email,CONCAT(c.name,' (',co.dbname,')') as name FROM cust_order co  JOIN company c ON c.id=co.company_id  JOIN ess ON ess.dbname=co.dbname WHERE ess.email='${email}' AND ess.aktif='Y'`
             console.log(query) 
             console.log(query)
                connection.query(query, (err, results) => {
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
                  console.log(records)
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
  async updateVersion(req, res) {
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
              //     });fl
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
                
                  connection.query(`SELECT * FROM mobile_versions `, (err, results) => {
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


    async updateVersionLast(req, res) {
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
                //     });fl
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
                  
                    connection.query(`SELECT * FROM mobile_versions ORDER BY id DESC LIMIT 1`, (err, results) => {
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
                          data:records[0]
                        
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


  async deleteFoto(req,res){
    console.log("hhapus foro");
    var database=req.query.database;
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
                  connection.query(`UPDATE employee SET em_image=NULL WHERE em_id='${em_id}'`, (err) => {
                if (err) {
                  console.error('Error executing UPDATE statement:', err);
                  connection.rollback(() => {
                 
                    connection.end();
                    return res.status(400).send({
                      status: false,
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
                            status: false,
                                     message: 'terjadi kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "berhasil update foto",
                     
                      
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
  async isAuth(req,res,next){
    console.log("---------Cek valid token----------------")

   
    var database=req.query.database;
    const token = req.headers.token;
    const emId=req.headers.em_id;
    console.log(`---------Token --------------- ${token}`)
    console.log(`-----em id---------- ${database}`)
    const configDynamic = {
        multipleStatements: true,
                   host: process.env.API_URL,
        user: 'pro',
        password: 'Siscom3519',
        database: `${database}_hrm`,
        connectionLimit: 10000000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
      };
      const mysql = require("mysql");
      const poolDynamic = mysql.createPool(configDynamic);

    poolDynamic.getConnection(function (err, connection) {
      if (err) console.log(err);
      connection.query(
        `SELECT * FROM employee WHERE em_id='${emId}' and token_notif='${token}'`,
      
        function (error, results) {
            if (error) {
                console.log(error)
              } 

              console.log(results)
            
         
          if (results.length==0){
            console.log("token tidak valied")
            res.status(401).json({
                status: false,
                message: 'Authorization failed'
            });

          }
          next();
          
        }
      );
      connection.release();
    });
  
  },



}





// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`



