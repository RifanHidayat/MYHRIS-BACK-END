const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
const nodemailer = require('nodemailer');

const fcm = require('fcm-notification');
const admin = require('firebase-admin');


// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');

pool.on("error", (err) => {
  console.error(err);
});


const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host:'siscomonline.co.id',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'no-reply@siscomonline.co.id',

      
      pass: 'siscomnoplayoke515'
    }
  });

module.exports = {


 async notifikasi(req, res) {
  var database=req.query.database;
  var email=req.query.email;
  var periode=req.body.periode;
  var emId=req.query.em_id;
  

  var title=req.body.title;
  var pola=req.body.pola;
  var statusApproval=req.body.status_approval;
  var status=req.body.status;
  var emId=req.body.em_id;
  var nomor=req.body.nomor;
  var nameUser=req.body.nama_user;
  var nameUser=req.body.nama_user;
  var id=req.body.id;

  var delegasi=req.body.delegasi;
  var emIdApproval2=req.body.em_id_approval2==null || req.body.em_id_approval2=="null"?"":req.body.em_id_approval2 .split(',');

  


  var message=''
  var tokens=[];
  var messageNotif=""
  var titleNotif=""
  var titleMessage

  console.log(req.body)
  
  
  if (title=="cuti"){
    titleNotif="Approval Cuti"
    titleMessage='Cuti'
  }else if (title=="Izin"){
    titleNotif='Approval Izin'
    titleMessage='Izin'
  }else if (title=="lembur"){
    titleNotif='Approval Lembur'
    titleMessage='Lembur'
  }else if (title=="tugas_luar"){
    titleMessage='Tugas Luar'
    titleNotif="Approval Tugas Luar"
  }else if (title=="Dinas Luar"){
    titleMessage='Dinas Luar'
    titleNotif="Approval Dinas Luar"
  }else if (title=="Klaim"){
    titleMessage='Klaim'
    titleNotif="Approval Klaim"
  }else if (title=="Absensi"){
    titleMessage='Absensi'
    titleNotif='Approval Absensi'
  }else if (title=="payroll"){
    titleNotif="Approval Payroll"
    titleMessage='Payroll'
  }


  const connection=await model.createConnection(database);


//   if (pola=='1'){

//     connection.connect((err) => {
//         if (err) {
//           console.error('Error connecting to the database:', err);
//           return;
//         }  
//         connection.beginTransaction((err) => {
//           if (err) {
//             console.error('Error beginning transaction:', err);
//             connection.end();
//             return;
//           }
//           connection.query( `SELECT * FROM employee WHERE em_id='${emId}'`, (err, results) => {
//                 if (err) {
//                   console.error('Error executing SELECT statement:', err);
//                   connection.rollback(() => {
//                     connection.end();
//                     return res.status(400).send({
//                       status: false,
//                       message: 'gagal ambil data1',
//                       data:[]
                    
//                     });
//                   });
//                   return;
//                 }
//                 records = results;
//                 console.log(records);
//                 if (records.length>0){
//                 messageNotif=`Hello ,Pengajuan ${titleMessage}mu  telah di approve oleh bapak/ibuk ${nameUser} dengan ajuan nomor ajuan ${nomor}`
//                   tokens.push(records[0]['token_notif'])
//                   var message = {
//                     data: {
//                       route: title,
//                       status:'pengajuan',
//                       nomor:nomor,
//                       em_id:emId,
//                       delegasi:'',
//                       id:id,
//                       delegasi:delegasi
//                     },
//                     notification: {
//                       title: `${titleNotif}`,
//                       body: `${messageNotif}`,
//                     },
                    
//                   };
  
  
//                   admin
//                   .messaging()
//                   .sendToDevice(tokens,message)
//                   .then((response) => {
//                     return res.send({
//                         status: true,
//                         message: "Berhasil kirim notif",
                     
//                       });
//                   })
//                   .catch((error) => {
//                     return res.send({
//                         status: true,
//                         message: "gagal kirim notif",
//                         error:error
//                       });
//                   });
      
                  
//                 }

                
//                 connection.commit((err) => {
//                   if (err) {
//                     console.error('Error committing transaction:', err);
//                     connection.rollback(() => {
//                       connection.end();
//                       return res.status(400).send({
//                         status: true,
//                                  message: err,
//                         data:[]
                      
//                       });
//                     });
//                     return;
//                   }
//                   connection.end();
//                   console.log('Transaction completed successfully!');
//                   return res.status(200).send({
//                     status: true,
//                     message: "Berhasil kirim notif",
                   
                  
//                   });
    
              
//                 });
            
//             });
//           });
//         });


  
//  }else if (pola=='2'){


//   if (statusApproval==1){

//     connection.connect((err) => {
//       if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//       }  

//       connection.beginTransaction((err) => {
//         if (err) {
//           console.error('Error beginning transaction:', err);
//           connection.end();
//           return;
//         }
//         connection.query( `SELECT * FROM employee WHERE em_id='${emId}'`, (err, results) => {
//               if (err) {
//                 console.error('Error executing SELECT statement:', err);
//                 connection.rollback(() => {
//                   connection.end();
//                   return res.status(400).send({
//                     status: false,
//                     message: 'gagal ambil data1',
//                     data:[]
                  
//                   });
//                 });
//                 return;
//               }
              
//               records = results;
//               if (records.length>0){
          
//                 messageNotif=`Hello ,Pengajuan ${titleMessage}mu  telah di approve2 oleh bapak/ibuk ${nameUser} dengan ajuan nomor ajuan${nomor}`
//               tokens.push(records[0]['token_notif'])

            
//               var message = {
//                 data: {
//                   route: title,
//                   status:'approval',
//                   nomor:nomor,
//                   em_id:emId,
//                   id:id,
//                   delegasi:delegasi

//                 },
//                 notification: {
//                   title: `${titleNotif}`,
//                   body: `${messageNotif}`,
//                 },
                
//               };
//               admin
//               .messaging()
//               .sendToDevice(tokens,message)
//               .then((response) => {
//                 return res.send({
//                     status: true,
//                     message: "Berhasil kirim notif",
//                     response:response
//                   });
//               })
//               .catch((error) => {
//                 return res.send({
//                     status: true,
//                     message: "gagal kirim notif",
//                     error:error
//                   });
//               });

            
//               }

              


//               connection.query( `SELECT * FROM employee WHERE em_id IN (?)`,emIdApproval2, (err, results) => {
//                 if (err) {
//                   console.error('Error executing SELECT statement:', err);
//                   connection.rollback(() => {
//                     connection.end();
//                     return res.status(400).send({
//                       status: false,
//                       message: 'gagal ambil data1',
//                       data:[]
                    
//                     });
//                   });
//                   return;
//                 }
  
//                 records = results;
//                 tokens=[];
//                 for (var i=0;i<records.length;i++){

//                   messageNotif=`Hello Bapak/ibuk Pengajuan ${titleMessage} dengan nomor ajuan ${nomor} membutuhkan approve 2`
//                   var message = {
//                     data: {
//                   route: title,
//                       status:'approval',
//                       nomor:nomor,
//                       id:id,
//                       delegasi:delegasi 
//                     },
//                     notification: {
//                       title: `${titleNotif}`,
//                       body: `${messageNotif}`,
//                     },
                    
//                   };
//                   tokens.push(records[i]['token_notif'])
                  
//                   admin
//                   .messaging()
//                   .sendToDevice(tokens,message)
//                   .then((response) => {
//                     return res.send({
//                         status: true,
//                         message: "Berhasil kirim notif",
//                         response:response
//                       });
//                   })
//                   .catch((error) => {
//                     return res.send({
//                         status: true,
//                         message: "gagal kirim notif",
//                         error:error
//                       });
//                   });
    

//                 }
  
//               connection.commit((err) => {
//                 if (err) {
//                   console.error('Error committing transaction:', err);
//                   connection.rollback(() => {
//                     connection.end();
//                     return res.status(400).send({
//                       status: true,
//                                message: "Kombinasi email & password Anda Salah",
//                       data:[]
                    
//                     });
//                   });
//                   return;
//                 }
//                 connection.end();
//                 console.log('Transaction completed successfully!');
//                 return res.status(200).send({
//                   status: true,
//                   message: "Berhasil kirim notif",
                
                
//                 });
  
            
//               });
          
//           });
//         });
//         });
//       });


    
    

//   }else{

    
//     connection.connect((err) => {
//       if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//       }  
     
     
//       connection.beginTransaction((err) => {
//         if (err) {
//           console.error('Error beginning transaction:', err);
//           connection.end();
//           return;
//         }
//         connection.query( `SELECT * FROM employee WHERE em_id='${emId}'`, (err, results) => {
//               if (err) {
//                 console.error('Error executing SELECT statement:', err);
//                 connection.rollback(() => {
//                   connection.end();
//                   return res.status(400).send({
//                     status: false,
//                     message: 'gagal notifikasi',
//                     data:[]
                  
//                   });
//                 });
//                 return;
//               }
              
//               records = results;
//               if (records.length>0){
//                 messageNotif=`Hello ,Pengajuan ${titleMessage}mu  telah di approve1 oleh bapak/ibuk ${nameUser} dengan nomor ajuan ${nomor}`
//                 tokens.push(records[0]['token_notif'])
                
//               }
  
//               var message = {
//                 data: {
//                   route: title,
//                   status:'pengajuan',
//                   nomor:nomor,
//                   em_id:emId,
//                   delegasi:''
//                 },
//                 notification: {
//                   title: `${titleNotif}`,
//                   body: `${messageNotif}`,
//                 },
                
//               };
  
  
//               admin
//               .messaging()
//               .sendToDevice(tokens,message)
//               .then((response) => {
//                 return res.send({
//                     status: true,
//                     message: "Berhasil kirim notif",
//                     response:response
//                   });
//               })
//               .catch((error) => {
//                 return res.send({
//                     status: true,
//                     message: "gagal kirim notif",
//                     error:error
//                   });
//               });
  
//               connection.commit((err) => {
//                 if (err) {
//                   console.error('Error committing transaction:', err);
//                   connection.rollback(() => {
//                     connection.end();
//                     return res.status(400).send({
//                       status: true,
//                                message: "Kombinasi email & password Anda Salah",
//                       data:[]
                    
//                     });
//                   });
//                   return;
//                 }
//                 connection.end();
//                 console.log('Transaction completed successfully!');
//                 return res.status(200).send({
//                   status: true,
//                   message: "Berhasil kirim notifikasi",
                  
                
//                 });
  
            
//               });
          
//           });
//         });
//       });



//   }




 




//   }


  
 
//     try{
  

//     }catch(e){
 

//     }
   


   },


 async insertNotifikasi(req, res) {
    console.log('-----insert notifikasi ----------')
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

    var script = `INSERT INTO ${namaDatabaseDynamic}.notifikasi SET ?`;
    // const configDynamic = {
    //   multipleStatements: true,
    //   host: ipServer,//my${database}.siscom.id (ip local)
    //   user: 'pro',
    //   password: 'Siscom3519',
    //   database: `${namaDatabaseDynamic}`,
    //   connectionLimit: 1000,
    //   connectTimeout: 60 * 60 * 1000,
    //   acquireTimeout: 60 * 60 * 1000,
    //   timeout: 60 * 60 * 1000,
    // };
    const mysql = require("mysql");
   
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

              connection.query(script,[bodyValue], (err, results) => {
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
               
               records=results;


           
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
                    data:records
                  
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


};






