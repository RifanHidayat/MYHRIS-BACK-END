const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
const utility=require('./../utils/utility')
// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');
const { emit } = require("nodemon");

pool.on("error", (err) => {
  console.error(err);
});
require('dotenv').config();

var ipServer=process.env.API_URL

module.exports = {
    
  async store(req,res){

    function isDateInRange(date, startDate, endDate) {
        return date >= startDate && date <= endDate;
    }
    
        var database = req.query.database;
        let name_url = req.originalUrl;
        var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
        var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");

        var menu_name = req.body.menu_name;
        var activity_name = req.body.activity_name;
        var createdBy = req.body.created_by;

        
        var bodyValue = req.body;
        var tasks=req.body.tasks
        console.log('task  ',tasks[0])
        delete bodyValue.menu_name;
        delete bodyValue.activity_name;
        delete bodyValue.created_by;
        delete bodyValue.tasks;

        let now = new Date();

        console.log(bodyValue)

        let year = now.getFullYear();
        let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
        let date = now.getDate();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();

        var dateNow=`${year}-${month.toString().padStart(2, '0')}-${date} ${hours}:${minutes}:${seconds}`
        bodyValue.tgl_ajuan=utility.dateNow4()
         bodyValue.created_on=dateNow

      
         // bodyValue.is_mobile="1"
        
   
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
    
      
        var script = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;
        
 

    
    const databaseMaster = `${database}_hrm`;
    var nomorLb=`LB20${convertYear}${convertBulan}`;
    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;
    var transaksi="";
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

                connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                WHERE em_id='${req.body.em_id}' 
                AND (date_selected LIKE '%${req.body.atten_date}%')  
                AND  status_transaksi=1 
                 AND leave_status IN ('Pending','Approve','Approve2')`, (err, data) => {
                 
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: false,
                        message: 'gagal ambil data',
                        data:[]
                      
                      })
                    });
                    return;
                  }

             for (var i=0;i<data.length;i++){
              if (data.length>0){    
                    
                    
                if (data[0].leave_type=="HALFDAY"){
                var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
                /// jika suda ada data     
                var time1 = new Date(`${data[i].atten_date}T${data[i].time_plan}`);
                var time2 = new Date(`${data[i].atten_date}T${data[i].time_plan_to}`);
            if (time1 > time2) {
                time2.setDate(time2.getDate() + 1);
            } 

            if (timeParam1 > timeParam2) {
                timeParam2.setDate(time2.getDate() + 1);
            }

            transaksi="Izin"


            if (isDateInRange(timeParam1,time1,time2)){

                return res.status(400).send({
                    status: false,
                    message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                    data:[]
                  
                  });

                  
            } 

                }else if(req.body.leave_type=="FULLDAY" || req.body.leave_type=="FULL DAY") {

                  
                    if (data[i].ajuan=="1" ||data[i].ajuan==1){
                      return res.status(400).send({
                        status: false,
                        message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                        data:[]
                    
                      });


                    
                  }



                  if (data[i].ajuan=="2" ||data[i].ajuan==2){
                
                    return res.status(400).send({
                      status: false,
                      message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                      data:[]
                    
                    });
                    
                  }

                
                }
        }

             }




    connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.atten_date}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2')`, (err, data) => {
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


                    for (var i=0;i<data.length;i++){

                      if (data.length>0){    
                        var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                        var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);

                        /// jika suda ada data
                        var time1 = new Date(`${data[i].atten_date}T${data[i].dari_jam}`);
                        var time2 = new Date(`${data[i].atten_date}T${data[i].sampai_jam}`);
    
                    if (time1 > time2) {
                        time2.setDate(time2.getDate() + 1);
                      
                    } 

                    if (timeParam1 > timeParam2) {
                        timeParam2.setDate(time2.getDate() + 1);
                      

                    }

                    if (data[i].ajuan=="2"){
                      transaksi="Tugas Luar"

                    }

                    if (data[i].ajuan=="1"){
                      transaksi="Lembur"
                    }

                    if (isDateInRange(timeParam1,time1,time2)){

                        return res.status(400).send({
                            status: false,
                            message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                            data:[]
                          
                          });

                    }else{

                        if (isDateInRange(timeParam2,time1,time2)){
                            
                        return res.status(400).send({
                            status: false,
                            message: `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                            data:[]
                          
                          });



                        }
    


                    }


                
                }
                  




                    }
                   
                  
  
            
                    connection.query( `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' ORDER BY id DESC LIMIT 1`, (err, results) => {
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
                    
                    //   if (results.length>0){
                       
                    //   }else{

                    //     nomorLb=`20${convertYear}${convertBulan}0001`
                    //   }
                      
                    
                    
                   
                    
                  if (results.length > 0) {
                        var text = results[0]['nomor_ajuan'];
                        var nomor = parseInt(text.substring(8, 13)) + 1;
                        var nomorStr = String(nomor).padStart(4, '0')
                        nomorLb = nomorLb + nomorStr
                      } else {
                        var nomor = 1;
                        var nomorStr = String(nomor).padStart(4, '0')
                        nomorLb = nomorLb+ nomorStr;
                      }

                      bodyValue.nomor_ajuan=nomorLb
                      connection.query( script,
                        [bodyValue], (err, results) => {
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

                      
                      
                        connection.query( `UPDATE ${database}_hrm.overtime SET pakai='Y' WHERE id='${bodyValue.typeid}' `,
                        [bodyValue], (err, updateEmpLabor) => {
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


                        connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan ='${bodyValue.nomor_ajuan}'`,
                          [bodyValue], (err, transaksi) => {
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
  

                      
                    //Proses Notifikasi
                        connection.query( "SELECT name FROM sysdata WHERE KODE IN (024)",
                          (err, sysData) => {
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
                            //proses notifikasi
                          }
                          
                          connection.query( `SELECT * FROM  ${databaseMaster}.employee WHERE em_id='${bodyValue.em_id}' `,
                          (err, user) => {
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
                            //proses notifikasi

                          }
                          
                        console.log(task)
        
                          for (var i=0;i<tasks.length;i++){
                            var task=tasks[i]['task']
                            connection.query( `INSERT INTO ${namaDatabaseDynamic}.emp_labor_task (task,persentase,nomor_ajuan) VALUES('${task}','0','${nomorLb}')`,
                            (err, user) => {
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
                              //proses notifikasi
                            }
                          });


                          }

                          var title='Approval Lembur'
                          
                         /// var listDataAtasan=user[0].em_report_to.toString().split(',')
                      
                          utility.insertNotifikasi(user[0].em_report_to,'Approval Lembur','Lembur',user[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,user[0].full_name,namaDatabaseDynamic,databaseMaster)
                        
                            if (sysData[0].name=="" || sysData[0].name==null){

                            }else{
                              var listData=sysData[0].name.toString().split(',')
                              utility.insertNotifikasi(listData,'Pengajuan Lembur','Lembur',user[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,user[0].full_name,namaDatabaseDynamic,databaseMaster)
                            

                            }
                           
                          
                          // `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','Lembur',CURDATE(),CURTIME(),2,0,'${bodyValue.em_id}','${transaksi[0].id}')`,
  
                        //  console.log(listDataAtasan)
                             
                          // for (var i=0;i<listDataAtasan.length;i++){
                            
                          //   if (listDataAtasan[i]!=''){
                          //     var title='';
                          //     var deskripsi='';
                           
                          //     var emidUser=listData[i]

                          //     connection.query(
                          //       `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                          //       (err, employee) => {
                          //       if (err) {
                          //         console.error('Error executing SELECT statement:', err);
                          //         connection.rollback(() => {
                          //           connection.end();
                          //           return res.status(400).send({
                          //             status: true,
                          //             message: 'gaga ambil data',
                          //             data:[]
                                    
                          //           });
                          //         });
                          //         return;
                          //       } 

                          //       if (employee.length>0){
                          //         console.log("gender ,",employee[0].full_name)
                              
                              
                              
                          //         var deskripsi=`Hello Bapak ,${employee[0].full_name}, Saya ${user[0].full_name} - ${bodyValue.em_id} mengajukan lembur dengan nomor ajuan ${bodyValue.nomor_ajuan}`                             
                               
  
  
                          //       connection.query(
                          //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','Lembur',CURDATE(),CURTIME(),2,0,'${bodyValue.em_id}','${transaksi[0].id}')`,
  
                          //         (err, results) => {
                          //         if (err) {
                          //           console.error('Error executing SELECT statement:', err);
                          //           connection.rollback(() => {
                          //             connection.end();
                          //             return res.status(400).send({
                          //               status: true,
                          //               message: 'gaga ambil data',
                          //               data:[]
                                      
                          //             });
                          //           });
                          //           return;
                          //         } 
                             
                              
                          //           utility.notifikasi(employee[0].token_notif,'Approval Lembur',deskripsi)
  
                          //         });


                          //       }
                              
                               
                          //   });
                          //   }
                          // }

                         
                          // for (var i=0;i<listData.length;i++){
                          //     if (listData[i]!=''){
                          //       var title='';
                          //       var deskripsi='';
                          //       var title='Pengajuan Lembur'
                          //       var emidUser=listData[i]

                          //       connection.query(
                          //         `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                          //         (err, employee) => {
                          //         if (err) {
                          //           console.error('Error executing SELECT statement:', err);
                          //           connection.rollback(() => {
                          //             connection.end();
                          //             return res.status(400).send({
                          //               status: true,
                          //               message: 'gaga ambil data',
                          //               data:[]
                                      
                          //             });
                          //           });
                          //           return;
                          //         } 
                          //       var deskripsi=`Hello ${employee[0].em_gender=='PRIA'?"Bapak":employee[0].em_gender=='Wanita'?'Ibu':""} ,${employee[0].full_name}, Saya ${user[0].full_name} - ${bodyValue.em_id} mengajukan lembur dengan nomor ajuan ${bodyValue.nomor_ajuan}`                             
                               
                          //       connection.query(
                          //         `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','Lembur',CURDATE(),CURTIME(),2,0,'${bodyValue.em_id}','${transaksi[0].id}')`,

                          //         (err, results) => {
                          //         if (err) {
                          //           console.error('Error executing SELECT statement:', err);
                          //           connection.rollback(() => {
                          //             connection.end();
                          //             return res.status(400).send({
                          //               status: true,
                          //               message: 'gaga ambil data',
                          //               data:[]
                                      
                          //             });
                          //           });
                          //           return;
                          //         } 
                             
                              
                          //           utility.notifikasi(employee[0].token_notif,title,deskripsi)

                          //         });
                          //     });
                          //     }
                          //   }



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
           
        
        }catch($e){
          return res.status(400).send({
            status: true,
            message: 'Gagal ambil data',
            data:[]
          
          });
    
        }
  

      },



      async updateLembur(req,res){

        function isDateInRange(date, startDate, endDate) {
            return date >= startDate && date <= endDate;
        }
        var id=req.body.id;
        var nomorLb=req.body.nomor_ajuan;
            var database = req.query.database;
            let name_url = req.originalUrl;
            var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
            var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
    
            var menu_name = req.body.menu_name;
            var activity_name = req.body.activity_name;
            var createdBy = req.body.created_by;
    
            
            var bodyValue = req.body;
            var tasks=req.body.tasks
            console.log('task  ',tasks[0])
            delete bodyValue.menu_name;
            delete bodyValue.activity_name;
            delete bodyValue.created_by;
            delete bodyValue.tasks;
            delete bodyValue.nomor_ajuan;
            delete bodyValue.cari;
            delete bodyValue.id;
    
            let now = new Date();
    
            console.log(bodyValue)
    
            let year = now.getFullYear();
            let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
            let date = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
    
            var dateNow=`${year}-${month.toString().padStart(2, '0')}-${date} ${hours}:${minutes}:${seconds}`
            bodyValue.tgl_ajuan=utility.dateNow4()
             bodyValue.created_on=dateNow
    
          
             // bodyValue.is_mobile="1"
            
       
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
        
          
            var script = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE id='${id}'`;
            
     
    
        
        const databaseMaster = `${database}_hrm`;
        //var nomorLb=`LB20${convertYear}${convertBulan}`;
        var script = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE id='${id}'`;

        console.log(script)
            
     
        var transaksi="";
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
    
                    connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                    WHERE em_id='${req.body.em_id}' 
                    AND (date_selected LIKE '%${req.body.atten_date}%')  
                    AND  status_transaksi=1 
                     AND leave_status IN ('Pending','Approve','Approve2')`, (err, data) => {
                     
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: false,
                            message: 'gagal ambil data',
                            data:[]
                          
                          })
                        });
                        return;
                      }
    
                 for (var i=0;i<data.length;i++){
                  if (data.length>0){    
                        
                        
                    if (data[0].leave_type=="HALFDAY"){
                    var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                    var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
                    /// jika suda ada data     
                    var time1 = new Date(`${data[i].atten_date}T${data[i].time_plan}`);
                    var time2 = new Date(`${data[i].atten_date}T${data[i].time_plan_to}`);
                if (time1 > time2) {
                    time2.setDate(time2.getDate() + 1);
                } 
    
                if (timeParam1 > timeParam2) {
                    timeParam2.setDate(time2.getDate() + 1);
                }
    
                transaksi="Izin"
    
    
                if (isDateInRange(timeParam1,time1,time2)){
    
                    return res.status(400).send({
                        status: false,
                        message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                        data:[]
                      
                      });
    
                      
                } 
    
                    }else if(req.body.leave_type=="FULLDAY" || req.body.leave_type=="FULL DAY") {
    
                      
                        if (data[i].ajuan=="1" ||data[i].ajuan==1){
                          return res.status(400).send({
                            status: false,
                            message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                            data:[]
                        
                          });
    
    
                        
                      }
    
    
    
                      if (data[i].ajuan=="2" ||data[i].ajuan==2){
                    
                        return res.status(400).send({
                          status: false,
                          message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                          data:[]
                        
                        });
                        
                      }
    
                    
                    }
            
                  }
    
            
                }
    
    
    
    
        connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.atten_date}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2') AND id!='${id}'`, (err, data) => {
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
    
    
                        for (var i=0;i<data.length;i++){
    
                          if (data.length>0){    
                            var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                            var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
    
                            /// jika suda ada data
                            var time1 = new Date(`${data[i].atten_date}T${data[i].dari_jam}`);
                            var time2 = new Date(`${data[i].atten_date}T${data[i].sampai_jam}`);
        
                        if (time1 > time2) {
                            time2.setDate(time2.getDate() + 1);
                          
                        } 
    
                        if (timeParam1 > timeParam2) {
                            timeParam2.setDate(time2.getDate() + 1);
                          
    
                        }
    
                        if (data[i].ajuan=="2"){
                          transaksi="Tugas Luar"
    
                        }
    
                        if (data[i].ajuan=="1"){
                          transaksi="Lembur"
                        }
    
                        if (isDateInRange(timeParam1,time1,time2)){
    
                            return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                                data:[]
                              
                              });
    
                        }else{
    
                            if (isDateInRange(timeParam2,time1,time2)){
                                
                            return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                                data:[]
                              
                              });
    
    
    
                            }

                        }

                    
                    }
                      
    
                        }
                       
                      
                        connection.query( script,
                          [bodyValue], (err, results) => {
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
  
                        
                          
                            connection.query( `UPDATE ${database}_hrm.overtime SET pakai='Y' WHERE id='${bodyValue.typeid}' `,
                            [bodyValue], (err, updateEmpLabor) => {
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
    
    
                          
                        //Proses Notifikasi
                            connection.query( "SELECT name FROM sysdata WHERE KODE IN (024)",
                              (err, sysData) => {
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
                                //proses notifikasi
                              }
                              
                              connection.query( `SELECT * FROM  ${databaseMaster}.employee WHERE em_id='${bodyValue.em_id}' `,
                              (err, user) => {
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
                                //proses notifikasi
                              }

                              connection.query( `DELETE FROM ${namaDatabaseDynamic}.emp_labor_task WHERE nomor_ajuan LIKE '%${nomorLb}%'`,
                              (err, user) => {
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
                                //proses notifikasi
    
                              }
                              
                          
            
                              for (var i=0;i<tasks.length;i++){
                                var task=tasks[i]['task']
                                connection.query( `INSERT INTO ${namaDatabaseDynamic}.emp_labor_task (task,persentase,nomor_ajuan) VALUES('${task}','0','${nomorLb}')`,
                                (err, user) => {
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
                                  //proses notifikasi
                                }
                              });
    
    
                              }
    
                      


                              
                          
                          var title='Approval Lembur'
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
    
               
            
            }catch($e){
              return res.status(400).send({
                status: true,
                message: 'Gagal ambil data',
                data:[]
              
              });
        
            }
      
    
          },


      async update(req,res){

        function isDateInRange(date, startDate, endDate) {
            return date >= startDate && date <= endDate;
        }
        
    
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
            let now = new Date();
    
            let year = now.getFullYear();
            let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
            let date = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
    
            var dateNow=`${year}-${month.toString().padStart(2, '0')}-${date} ${hours}:${minutes}:${seconds}`
        bodyValue.created_on=dateNow
        bodyValue.is_mobile="1"
            
            
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
        var nomorLb=`LB20${convertYear}${convertBulan}`;
        var script = `INSERT INTO ${namaDatabaseDynamic}.emp_labor SET ?`;
        var transaksi="";
       
       
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
    
                    connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                    WHERE em_id='${req.body.em_id}' 
                    AND (date_selected LIKE '%${req.body.atten_date}%')  
                    AND  status_transaksi=1 
                     AND leave_status IN ('Pending','Approve','Approve2')`, (err, data) => {
                     
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: false,
                            message: 'gagal ambil data',
                            data:[]
                          
                          })
                        });
                        return;
                      }
    
                      if (data.length>0){  
                        
                        for (var i=0;i<data.length;i++){


                           
                        if (data[i].leave_type=="HALFDAY"){
                          var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                          var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
                          /// jika suda ada data     
                          var time1 = new Date(`${data[i].atten_date}T${data[i].time_plan}`);
                          var time2 = new Date(`${data[i].atten_date}T${data[i].time_plan_to}`);
                      if (time1 > time2) {
                          time2.setDate(time2.getDate() + 1);
                      } 
      
                      if (timeParam1 > timeParam2) {
                          timeParam2.setDate(time2.getDate() + 1);
                      }
      
                      transaksi="Izin"
      
      
                      if (isDateInRange(timeParam1,time1,time2)){
      
                          return res.status(400).send({
                              status: false,
                              message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                              data:[]
                            
                            });
      
                            
                      } 
      
                          }else if(req.body.leave_type=="FULLDAY" || req.body.leave_type=="FULL DAY") {
      
                            
                              if (data[0].ajuan=="1" ||data[0].ajuan==1){
                                return res.status(400).send({
                                  status: false,
                                  message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                                  data:[]
                              
                                });
      
      
                              
                            }
      
      
      
                            if (data[0].ajuan=="2" ||data[0].ajuan==2){
                          
                              return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                                data:[]
                              
                              });
                              
                            }
      
                          
                          }

                          
                        }
                        
                       
                }
    
    
    
    
    
        connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${req.body.atten_date}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2')`, (err, data) => {
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
                        if (data.length>0){    
                            var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                            var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
    
                            /// jika suda ada data
                            var time1 = new Date(`${data[0].atten_date}T${data[0].dari_jam}`);
                            var time2 = new Date(`${data[0].atten_date}T${data[0].sampai_jam}`);
        
                        if (time1 > time2) {
                            time2.setDate(time2.getDate() + 1);
                          
                        } 
    
                        if (timeParam1 > timeParam2) {
                            timeParam2.setDate(time2.getDate() + 1);
                          
    
                        }
    
                        if (data[0].ajuan=="2"){
                          transaksi="Tugas Luar"
    
                        }
    
                        if (data[0].ajuan=="1"){
                          transaksi="Lembur"
                        }
    
                        if (isDateInRange(timeParam1,time1,time2)){
    
                            return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                                data:[]
                              
                              });
    
                        }else{
    
                            if (isDateInRange(timeParam2,time1,time2)){
                                
                            return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                                data:[]
                              
                              });
    
    
    
                            }
        
    
    
                        }
    
    
                    
                    }
                      
                      
      
                
                        connection.query( `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan LIKE '%LB%' ORDER BY id DESC LIMIT 1`, (err, results) => {
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
                        
                        //   if (results.length>0){
                           
                        //   }else{
    
                        //     nomorLb=`20${convertYear}${convertBulan}0001`
                        //   }
                          if (results.length > 0) {
                            var text = results[0]['nomor_ajuan'];
                            var nomor = parseInt(text.substring(8, 13)) + 1;
                            var nomorStr = String(nomor).padStart(4, '0')
                            nomorLb = nomorLb + nomorStr
                          } else {
                            var nomor = 1;
                            var nomorStr = String(nomor).padStart(4, '0')
                            nomorLb = nomorLb+ nomorStr;
                          }
                          bodyValue.nomor_ajuan=nomorLb
    
                          connection.query( script,
                            [bodyValue], (err, results) => {
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
                              message: "Kombinasi email & password Anda Salah",
                 
                             
                            });
      
                        
                    
                      });
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
    



      async update(req,res){

        function isDateInRange(date, startDate, endDate) {
            return date >= startDate && date <= endDate;
        }
        
        var nameWhere = req.body.val;
         var cariWhere = req.body.cari;
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
            

            delete bodyValue.val;
            delete bodyValue.cari;
        
        
            console.log(req.body)
        
            let now = new Date();

            let year = now.getFullYear();
            let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
            let date = now.getDate();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
    
            var dateNow=`${year}-${month.toString().padStart(2, '0')}-${date} ${hours}:${minutes}:${seconds}`
        bodyValue.modified_on=dateNow
            
    
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
    
      

        var script = `UPDATE ${namaDatabaseDynamic}.emp_labor SET ? WHERE ${nameWhere} = '${cariWhere}'`;
       
    
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
                    connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                    WHERE em_id='${req.body.em_id}' 
                    AND (date_selected LIKE '%${req.body.atten_date}%')  
                    AND  status_transaksi=1 
                     AND leave_status IN ('Pending','Approve','Approve2')`, (err, data) => {
                     
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: false,
                            message: 'gagal ambil data',
                            data:[]
                          
                          })
                        });
                        return;
                      }
    
                      if (data.length>0){    
                        
                        
                        if (data[0].leave_type=="HALFDAY"){
                        var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                        var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
                        /// jika suda ada data     
                        var time1 = new Date(`${data[0].atten_date}T${data[0].time_plan}`);
                        var time2 = new Date(`${data[0].atten_date}T${data[0].time_plan_to}`);
                    if (time1 > time2) {
                        time2.setDate(time2.getDate() + 1);
                    } 
    
                    if (timeParam1 > timeParam2) {
                        timeParam2.setDate(time2.getDate() + 1);
                    }
    
                    transaksi="Izin"
    
    
                    if (isDateInRange(timeParam1,time1,time2)){
    
                        return res.status(400).send({
                            status: false,
                            message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                            data:[]
                          
                          });
    
                          
                    } 
    
                        }else if(req.body.leave_type=="FULLDAY" || req.body.leave_type=="FULL DAY") {
    
                          
                            if (data[0].ajuan=="1" ||data[0].ajuan==1){
                              return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                                data:[]
                            
                              });
    
    
                            
                          }
    
    
    
                          if (data[0].ajuan=="2" ||data[0].ajuan==2){
                        
                            return res.status(400).send({
                              status: false,
                              message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[0].leave_status}`,
                              data:[]
                            
                            });
                            
                          }
    
                        
                        }
                }
    
    var queryLembur=`SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}'
    AND atten_date='${req.body.atten_date}' AND status_transaksi=1  AND 
   ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2') AND id!=${cariWhere }`
    
                    connection.query( queryLembur, (err, data) => {
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
                        console.log(queryLembur)
                        if (data.length>0){    

                         
                         
                          for (var i=0;i<data.length;i++){
                            var timeParam1= new Date(`${req.body.atten_date}T${req.body.dari_jam}`);
                            var timeParam2= new Date(`${req.body.atten_date}T${req.body.sampai_jam}`);
    
                            /// jika suda ada data
                            var time1 = new Date(`${data[i].atten_date}T${data[i].dari_jam}`);
                            var time2 = new Date(`${data[i].atten_date}T${data[i].sampai_jam}`);
        
                        if (time1 > time2) {
                            time2.setDate(time2.getDate() + 1);
                          
                        } 
    
                        if (timeParam1 > timeParam2) {
                            timeParam2.setDate(time2.getDate() + 1);
                          
    
                        }

                        var transaksi="";
                        if (data[i].ajuan=="2"){
                          transaksi="Tugas Luar"
                          

                        }
                        if (data[i].ajuan=="1"){
                          transaksi="Lembur"
                          

                        }
    
                        if (isDateInRange(timeParam1,time1,time2)){
                            
                          
                          return res.status(400).send({
                                status: false,
                                message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                                data:[]
                              
                              });

    


                        
                            }else{
  
                          
                          
                          if (isDateInRange(timeParam2,time1,time2)){

                              
                            
                            return res.status(400).send({
                          
                                status: false,
                                message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                                data:[]

                              });
                          
                          
                            }
                       
                       
                          }
                          
                      
                      }

                    
                    }
                    console.log(queryLembur)
                          connection.query( script,
                            [bodyValue], (err, results) => {
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
                              message: "Kombinasi email & password Anda Salah",
                 
                            
                            });
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
        
    
    
          async detailTask(req,res){
            console.log("detail task")

                var database = req.query.database;
                let name_url = req.originalUrl;
                var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
                var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
                var nomorAjuan=req.body.nomor_ajuan;
        
                
                var menu_name = req.body.menu_name;
                var activity_name = req.body.activity_name;
                var createdBy = req.body.created_by;
        
                

                var bodyValue = req.body;
                delete bodyValue.menu_name;
                delete bodyValue.activity_name;
                delete bodyValue.created_by;
                let now = new Date();
        
                let year = now.getFullYear();
                let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
                let date = now.getDate();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                let seconds = now.getSeconds();
        
                
                 var dateNow=`${year}-${month.toString().padStart(2, '0')}-${date} ${hours}:${minutes}:${seconds}`
                 bodyValue.created_on=dateNow
                 bodyValue.is_mobile="1"
                
                
                 var array = utility.dateNow2().split('-');
        
                  const tahun = `${array[0]}`;
                  const convertYear = tahun.substring(2, 4);

                  console.log('tahun ',tahun)
                  var convertBulan;
                  if (array[1].length == 1) {
                    convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
                  } else {
                    convertBulan = array[1];
                  }
                  const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

                  console.log('nama dataabse  ',array)
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
                            
                        console.log(`SELECT * FROM ${namaDatabaseDynamic}.emp_labor_task WHERE nomor_ajuan LIKE '${nomorAjuan}'`)
                        
                           connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor_task WHERE nomor_ajuan LIKE '${nomorAjuan}'`, (err, results) => {
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
                                      message: "Successfuly get data",
                                      data:[]
                                    
                                    });
                                  });
                                  return;
                                }
           
                                connection.end();
                                console.log('Transaction completed successfully!');
                                return res.status(200).send({
                                  status: true,
                                  message: "Successfuly get data",
                                  data:results
                     
                                 
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

              async approvalTransaksi(req,res){

                var database = req.query.database;
                let name_url = req.originalUrl;
                var convert1 = name_url.substring(name_url.lastIndexOf("/") + 1);
                var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "");
                var nomorAjuan=req.boy.nomor_ajuan;
        
                
                var menu_name = req.body.menu_name;
                var activity_name = req.body.activity_name;
                var createdBy = req.body.created_by;
        
                

                var bodyValue = req.body;
                delete bodyValue.menu_name;
                delete bodyValue.activity_name;
                delete bodyValue.created_by;
                let now = new Date();
        
                let year = now.getFullYear();
                let month = now.getMonth() + 1; // Bulan dimulai dari 0, jadi tambahkan 1
                let date = now.getDate();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                let seconds = now.getSeconds();
        
                
                 var dateNow=`${year}-${month.toString().padStart(2, '0')}-${date} ${hours}:${minutes}:${seconds}`
                 bodyValue.created_on=dateNow
                 bodyValue.is_mobile="1"
                
                
                 var array = utility.dateNow2;
        
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
                            
                        
                        
                           connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor_task WHERE nomor_ajuan LIKE '${nomorAjuan}'`, (err, results) => {
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
                                      message: "Successfuly get data",
                                      data:[]
                                    
                                    });
                                  });
                                  return;
                                }
           
                                connection.end();
                                console.log('Transaction completed successfully!');
                                return res.status(200).send({
                                  status: true,
                                  message: "Successfuly get data",
                                  data:results
                     
                                 
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


  }




