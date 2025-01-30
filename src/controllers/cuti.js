const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');
const utility = require("../utils/utility");
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
        var nameTable = convert1.substring(convert1.lastIndexOf("-") + 1).replace("?database=" + req.query.database, "")
        .replace("&start_periode=" + req.query.start_periode, "").replace("&end_periode=" + req.query.start_periode, "");

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
        //var script = `INSERT INTO ${nameTable} SET ?`;
        
      var isError=false;
      var pesan="";

    var array = req.body.atten_date.split("-");

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }
    const databaseMaster = `${database}_hrm`;
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    var nomorLb=`CT20${convertYear}${convertBulan}`;
    var script = `INSERT INTO ${namaDatabaseDynamic}.emp_leave SET ?`;
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
                var query='' 
                var splits=req.body.date_selected.split(',')

                var query=``

              
                 for (var i=0;i<splits.length;i++){
                  console.log(i)

                  if (i==0 || i=="0"){
                    query=`  
                    SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                    WHERE em_id='${req.body.em_id}' 
                    AND (date_selected LIKE '%${splits[i]}%')  
                    AND  status_transaksi=1 
                     AND leave_status IN ('Pending','Approve','Approve2')
                    `

                  }else{

            
                    query=` ${query} UNION ALL   
                     SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                    WHERE em_id='${req.body.em_id}' 
                    AND (date_selected LIKE '%${splits[i]}%')  
                    AND  status_transaksi=1 
                     AND leave_status IN ('Pending','Approve','Approve2')
                    `  

                  }

                 


                 }
                 console.log(query)

              //    splits.forEach(function(number) {

              //     if ()
              
              // });




                connection.query( query, (err, data) => {
                 
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

                  console.log(`SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
                  WHERE em_id='${req.body.em_id}' 
                  AND (date_selected LIKE '%${req.body.date_selected}%')  
                  AND  status_transaksi=1 
                   AND leave_status IN ('Pending','Approve','Approve2')`)
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
              isError=true;
              pesan=`Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`

                // return res.status(400).send({
                //     status: false,
                //     message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                //     data:[]
                  
                //   });

                  
            } 

                }else if(req.body.leave_type=="FULLDAY" || req.body.leave_type=="FULL DAY" || req.body.leave_type=="Full Day" ) {
                    console.log(data[i].ajuan)
                  
                    if (data[i].ajuan=="1" ||data[i].ajuan==1){
                      isError=true;
                      pesan=`Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.date_selected}  dengan status ${data[i].leave_status}`
                      // return res.status(400).send({
                      //   status: false,
                      //   message: `Kamu telah melakaukan pengajuan Cuti  pada tanggal ${req.body.atten_date}  dengan status ${data[i].leave_status}`,
                      //   data:[]
                    
                      // });


                    
                  }



                  if (data[i].ajuan=="2" ||data[i].ajuan==2){

                    isError=true;
                    pesan= `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.date_selected}  dengan status ${data[i].leave_status}`
                
                    // return res.status(400).send({
                    //   status: false,
                    //   message: `Kamu telah melakaukan pengajuan Sakit  pada tanggal ${req.body.atten_date}  dengan status ${data[i].leave_status}`,
                    //   data:[]
                    
                    // });
                    
                  }

                
                }
        }

             }


            
          //   query=''
            //  for (var i=1;i<splits.length;i++){


            //   if (i==0 || i=='0'){
                
                
            //     query=`  
                
                
            //     SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${splits[i]}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2')
                
            //     `


               
            //   }else{

            //     query=`  
                
            //     ${query}
            //    UNION ALL SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${req.body.em_id}' AND atten_date='${splits[i]}' AND status_transaksi=1 AND ( ajuan='1' OR ajuan='2') AND status IN ('Pending','Approve','Approve2')
            //     `
                
            //     // query=`UNION ALL   
            //     // SELECT * FROM ${namaDatabaseDynamic}.emp_leave 
            //     // WHERE em_id='${req.body.em_id}' 
            //     // AND (date_selected LIKE '%${number}%')  
            //     // AND  status_transaksi=1 
            //     //  AND leave_status IN ('Pending','Approve','Approve2')
            //     // `  

            //   }

             


            //  }
   
             connection.query(query, (err, data) => {
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
                      isError=true;
                      pesan=  `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`
                        // return res.status(400).send({
                        //     status: false,
                        //     message: `Kamu telah melakaukan pengajuan ${transaksi} pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                        //     data:[]
                          
                        //   });

                    }else{

                        if (isDateInRange(timeParam2,time1,time2)){
                          isError=true;
                          pesan= `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`
                        // return res.status(400).send({
                        //     status: false,
                        //     message: `Kamu telah melakaukan pengajuan lembur pada tanggal ${time1} s.d. ${time2} dengan status ${data[0].status}`,
                        //     data:[]
                          
                        //   });



                        }
    


                    }


                
                }
                  




                    }
                   console.log('is errr',isError)

                    if (isError==true || isError=='true'){
                   return res.status(200).send({
                            status: false,
                            message: pesan,
                            data:[]
                          
                          });


                    }else{
                      connection.query( `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan LIKE '%CT%' ORDER BY id DESC LIMIT 1`, (err, results) => {
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
                        var dates=bodyValue.date_selected.split(',')
                        bodyValue.start_date=dates[0];
                        bodyValue.end_date=dates[dates.length-1]
  
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
                          connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${bodyValue.nomor_ajuan}'`,
                            (err, transaksi) => {
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
                           
                            connection.query( `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${bodyValue.em_id}'`,
                              [bodyValue], (err, employee) => {
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
                              connection.query( `SELECT * FROM sysdata WHERE kode IN ('031','012')`, (err, sysdataCuti) => {
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
  
                              connection.query( `SELECT * FROM assign_leave WHERE  em_id='${bodyValue.em_id}' AND dateyear='${tahun}'`, (err, cutiData) => {
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
              
            
            
                          utility.insertNotifikasi(employee[0].em_report_to,'Approval Cuti','Cuti',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
                          utility.insertNotifikasi(sysdataCuti[1].name,'Pengajuan CUti','Cuti',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
     
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

                          if (cutiData.length>0){

                            return res.status(200).send({
                              status: true,
                              message: "Kombinasi email & password Anda Salah",
                              tipe:sysdataCuti[0].name,
                              sisa_cuti: ( (cutiData[0].saldo_cut_off+cutiData[0].saldo_cuti_bulan_lalu+cutiData[0].saldo_cuti_tahun_lalu+cutiData[0].perolehan_cuti-cutiData[0].expired_cuti-cutiData[0].cuti_bersama)- cutiData[0].terpakai) ,
                              total_cuti:0,
                              keterangan:"Anda memiliki beberapa pengajuan cuti"
    
                             
                            });
                          }else{
                            return res.status(200).send({
                              status: true,
                              message: "Kombinasi email & password Anda Salah",
                              tipe:sysdataCuti[0].name,
                              sisa_cuti: 0,
                              total_cuti:0,
                              keterangan:"Anda memiliki beberapa pengajuan cuti"
    
                             
                            });


                          }
                      
                          // return res.status(200).send({
                          //   status: true,
                          //   message: "Kombinasi email & password Anda Salah",
                          //   tipe:sysdataCuti[0].name,
                          //   sisa_cuti:(cutiData[0].adjust_cuti + cutiData[0].total_day - cutiData[0].terpakai) ,
                          //   total_cuti:0,
                          //   keterangan:"Anda memiliki beberapa pengajuan cuti"
  
                           
                          // });
    
                      
                  
                    });
                  });
                });
              });
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
        const databaseMaster= `${database}_hrm${convertYear}${convertBulan}`;
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
              

                            connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE nomor_ajuan='${bodyValue.nomor_ajuan}'`,
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

                              connection.query( `SELECT *  FROM ${databaseMaster}.employee WHERE em_id='${bodyValue.em_id}'`
                              , (err, employee) => {
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
      
                        utility.insertNotifikasi(employee[0].em_report_to,'Approval Cuti','Cuti',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
       
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
        
    


          async historyCuti(req, res) {

            console.log("tes")
            var database=req.query.database;
            var email=req.query.email;
            var periode=req.body.periode;
            var emId=req.query.em_id;
        
        
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

              console.log(finalDatabase)
        
        

           console.log(`ini apapan ${i}`);
             
          //  query= ` SELECT a.id as idd, a.*, b.name, b.id as id_type FROM ${finalDatabase}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${emId}'  
          //  AND a.status_transaksi='1'    `
              
             if (i==0 || i=='0'){
               query= ` SELECT a.id as idd, a.*, b.name, b.id as id_type FROM ${finalDatabase}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${emId}'  
               AND a.status_transaksi='1' AND b.cut_leave='1'    `
              
             }else{
              query=query +`UNION ALL SELECT a.id as idd, a.*, b.name, b.id as id_type FROM ${finalDatabase}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${emId}'  
              AND a.status_transaksi='1'  AND b.cut_leave='1'  `
        
             }
        
        
            } 
        
            if (datesplits.length>0){
              query=query+" ORDER BY idd DESC"
        
            }

      console.log(query)
        var tahun=datesplits[0].split('-')[0];
        
          
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
                    
                   
                            connection.query(query, (err, pulangCepat) => {
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

                              connection.query(`SELECT (adjust_cuti+total_day-terpakai) as sisa_cuti,assign_leave.* FROM assign_leave WHERE dateyear='${tahun}' AND em_id='${emId}'`, (err, total) => {
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
                            console.log(`SELECT (total_day-terpakai) as sisa_cuti FROM assign_leave WHERE dateyear='${tahun}' AND em_id='${emId}'`)
                              connection.end();
                              console.log('Transaction completed successfully!');
                              return res.status(200).send({
                                status: true,
                                message: 'Data berhasil di ambil',
                                
                      
                                sisa_cuti:total.length>0?total[0].sisa_cuti:0 ,
                                data:pulangCepat,
                                filter:"approve"
                          
                              
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
        


            
      //     async historyCuti(req, res) {

      //       console.log("tes")
      //       var database=req.query.database;
      //       var email=req.query.email;
      //       var periode=req.body.periode;
      //       var emId=req.query.em_id;
        
        
      //       var dates=req.query.dates==undefined?'2024-08,2024-09':req.query.dates;
        
      //       console.log(req.query)
        
      //       var query=``
        
        
      //       var datesplits=dates.split(',')
        
      //       for (var i=0;i<datesplits.length;i++){
        
      //         var date=datesplits[i].split('-')
      //        console.log(date)
      //         var bulan=date[1];
      //         var tahun=date[0]
      //         var convertYear = tahun.toString().substring(2, 4);
            
        
      //         var finalDatabase=`${database}_hrm${convertYear}${bulan}`

      //         console.log(finalDatabase)
        
        

      //      console.log(i)
             
      //     //  query= ` SELECT a.id as idd, a.*, b.name, b.id as id_type FROM ${finalDatabase}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${emId}'  
      //     //  AND a.status_transaksi='1'    `
              
      //        if (i==0 || i=='0'){
      //          query= ` SELECT a.id as idd, a.*, b.name, b.id as id_type FROM ${finalDatabase}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${emId}'  
      //          AND a.status_transaksi='1' AND b.cut_leave='1'    `
              
      //        }else{
      //         query=query +`UNION ALL SELECT a.id as idd, a.*, b.name, b.id as id_type FROM ${finalDatabase}.emp_leave a INNER JOIN ${database}_hrm.leave_types as b ON a.typeid=b.id WHERE a.em_id='${emId}'  
      //         AND a.status_transaksi='1'  AND b.cut_leave='1'  `
        
      //        }
        
        
      //       } 
        
      //       if (datesplits.length>0){
      //         query=query+" ORDER BY idd DESC"
        
      //       }

      // console.log(query)
      //   var tahun=datesplits[0].split('-')[0];
        
          
      //         try{
      //           const connection = await model.createConnection(database);
      //             connection.connect((err) => {
      //               if (err) {
      //                 console.error('Error connecting to the database:', err);
      //                 return;
      //               }
                  
      //               connection.beginTransaction((err) => {
      //                 if (err) {
      //                   console.error('Error beginning transaction:', err);
      //                   connection.end();
      //                   return;
      //                 }
                    
                   
      //                       connection.query(query, (err, pulangCepat) => {
      //                         if (err) {
      //                           console.error('Error executing SELECT statement:', err);
      //                           connection.rollback(() => {
      //                             connection.end();
      //                             return res.status(400).send({
      //                               status: true,
      //                               message: 'gaga ambil data',
      //                               data:[]
                                  
      //                             });
      //                           });
      //                           return;
      //                         }

      //                         connection.query(`SELECT (adjust_cuti+total_day-terpakai) as sisa_cuti,assign_leave.* FROM assign_leave WHERE dateyear='${tahun}' AND em_id='${emId}'`, (err, total) => {
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
      //                       connection.commit((err) => {
      //                         if (err) {
      //                           console.error('Error committing transaction:', err);
      //                           connection.rollback(() => {
      //                             connection.end();
      //                             return res.status(400).send({
      //                               status: true,
      //                               message: 'Gagal ambil data',
      //                               data:[]
                                  
      //                             });
      //                           });
      //                           return;
      //                         }
      //                       console.log(`SELECT (total_day-terpakai) as sisa_cuti FROM assign_leave WHERE dateyear='${tahun}' AND em_id='${emId}'`)
      //                         connection.end();
      //                         console.log('Transaction completed successfully!');
      //                         return res.status(200).send({
      //                           status: true,
      //                           message: 'Data berhasil di ambil',
                                
                      
      //                           sisa_cuti:total.length>0?total[0].sisa_cuti:0 ,
      //                           data:pulangCepat,
      //                           filter:"approve"
                          
                              
      //                         });
      //                       });
                        
                          
      //                       });
      //                     });
      //                   });
      //                 });
                     
                  
                
          
      //         }catch(e){
      //           return res.status(400).send({
      //             status: true,
      //             message: e,
      //             data:[]
                
      //           });
          
      //         }
             
      //       },



            

            
          async tipeCuti(req, res) {

            console.log("tes")
            var database=req.query.database;
            var email=req.query.email;
            var periode=req.body.periode;
            var emId=req.query.em_id;
            var durasi=req.body.durasi;
        
        
            var dates=req.query.dates==undefined?'2024-08,2024-09':req.query.dates;
        
            console.log(req.query)
        
            var query=``
        
        
            var datesplits=dates.split(',')
        
        
        
            
        
            query=`SELECT * FROM leave_types WHERE submission_period<='${durasi}' AND 
             status IN (1) `
            console.log(query)
              
            
          
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
                    
                   
                              connection.query(query, (err, data) => {
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
                                
                      
                                data:data
                          
                              
                             
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
        
        
    

  }




