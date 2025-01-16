const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");


var request = require('request');

const model = require('../../utils/models');
const utility = require('../../utils/utility');

pool.on("error", (err) => {
  console.error(err);
});


module.exports = { 
  async store(req,res){
    console.log('-----masuk sisni----------')
    console.log('-----kirim tidak WFH----------')
    var database=req.query.database;
    var email=req.query.email;
    let records;
    var error=false;
    var array = req.body.date.split("-");
        const tahun = `${array[0]}`;
        const convertYear = tahun.substring(2, 4);
        var convertBulan;
        if (array[1].length == 1) {
          convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
        } else {
          convertBulan = array[1];
        }
        const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
        const databaseMaster = `${database}_hrm`;
    
    
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }

    var time=req.body.time;
    var emId=req.body.em_id;
    var status=req.body.status;
    var uraian=req.body.uraian;
    var place=req.body.place;
    var date=req.body.date;
    var nomorAjuan=`WH${tahun}${convertBulan}`;
    var signingAddr=req.body.lokasi;
    var sigingLonglat=req.body.latLang;
   
    
    try{ 
        var database = req.query.database;
        const connection=await model.createConnection(database);
              connection.connect((err) => {
                  if (err) {
                    console.error('Error connecting to the database1:', err);
                    return;
                  }  
             
                  connection.beginTransaction((err) => {
                    if (err) {
                      console.error('Error beginning transaction:', err);
                      connection.end();
                      return;
                    }
                    connection.query( `SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor  WHERE nomor_ajuan LIKE  '%WH%' ORDER BY nomor_ajuan DESC LIMIT 1 `, (err, empLabor) => {
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({                           
                              status: false,
                              message: 'Terjadi Kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      if (empLabor.length > 0) {
                        var text = empLabor[0]['nomor_ajuan'];
                        var nomor = parseInt(text.substring(8, 13)) + 1;
                        var nomorStr = String(nomor).padStart(4, '0')
                        nomorAjuan = nomorAjuan+ nomorStr;
                
                      } else {
                        nomor = 1;
                        var nomorStr = String(nomor).padStart(4, '0')
                        nomorAjuan = nomorAjuan+ nomorStr;
                      }
                
                
                connection.query( `INSERT INTO ${namaDatabaseDynamic}.emp_labor
                (nomor_ajuan,em_id,dari_jam,sampai_jam,durasi,atten_date,status,status_transaksi,approve_status,uraian,em_delegation,ajuan,place_in,signin_longlat,signin_addr,tgl_ajuan) 
                VALUES ('${nomorAjuan}','${emId}',CURTIME(),CURDATE(),'00:00','${date}','Pending','1','Pending','${uraian}','${emId}','4','${place}','${sigingLonglat}','${signingAddr}',CURDATE()) `, (err, results) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({                           
                          status: false,
                          message: 'Terjadi Kesalahan',
                        data:[]
                      
                      });
                    });
                    return;
                  }
                  connection.query( `SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE nomor_ajuan='${nomorAjuan}'`, (err, transaksi) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({                           
                            status: false,
                            message: 'Terjadi Kesalahan',
                          data:[]
                        
                        });
                      });
                      return;
                    }
                    connection.query( `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${emId}'`, (err, employee) => {
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({                           
                              status: false,
                              message: 'Terjadi Kesalahan',
                            data:[]
                          
                          });
                        });
                        return;
                      }

                  utility.insertNotifikasi(employee[0].em_report_to,'Approval WFH','WFH',employee[0].em_id,transaksi[0].id,transaksi[0].nomor_ajuan,employee[0].full_name,namaDatabaseDynamic,databaseMaster);
       

            //  proses memasukan data 
        connection.commit((err) => {
          if (err) {
            console.error('Error committing transaction:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: false,
                         message: "gagal pengajuan",
                data:[]
              
              });
            });
            return;
          }
          connection.end();
          console.log('Transaction completed successfully! 2');
          return res.status(200).send({
            status: true,
            message: "BErhasil pengajuan",
            data:records
          
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


  

  async destroy(req,res){
    console.log("cek no hp");
    var database=req.query.database;
    var email=req.query.email;
    var nomorAjuan=req.body.nomor_ajuan;
    
    let records;
console.log('data',req.body)

    var array = [];
    try {
      array = req.body.date.split("-");
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
              var queryUpdate=`UPDATE ${namaDatabaseDynamic}.emp_labor SET status_transaksi=0 WHERE nomor_ajuan='${nomorAjuan}'`
              console.log(queryUpdate)
                  connection.query( queryUpdate, (err, results) => {
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
                              message: "Berhasil delete pengajuan WFH",
                             data:[]
                          
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Berhasil delete pengajuan WFH",
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


  async approveWfh(req,res){
    var database=req.body.database;

    console.log('-----approval wfh ----------')
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
    delete bodyValue.pola;
    var nomorAjuan=req.body.nomor_ajuan;
    var approveId=req.body.approve_id==undefined?req.body.apply_id:req.body.approve_id;
    var approve2Date=req.body.approve2_date;
    var bodyStatusFinal=req.body.status==undefined?req.body.leave_status:req.body.status
    var pola=req.body.pola;
    var approval=req.body.approval

    var emId = req.body.em_id;
    
    console.log(req.body)  
    
    var dataInsertLog = {
      menu_name: menu_name,
      activity_name: activity_name,
      acttivity_script: script,
      createdUserID: createdBy
      
    }
    console.log(req.body);
    // BATAL PENGAJUAN BERMASALAH
    // var array = atten_date.split("-");

var  urlTransaksi=''
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
    
    const databaseMaster = `${database}_hrm`;
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
                  connection.query(script,[bodyValue], (err) => {
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
                connection.query(`INSERT INTO ${ namaDatabaseDynamic}.logs_actvity SET ?;`,[dataInsertLog], (err) => {
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
              
                    connection.query(`SELECT * FROM ${ namaDatabaseDynamic}.emp_labor WHERE ${nameWhere} = '${cariWhere}'`, (err,pengajuan) => {
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
                      connection.query(`SELECT * FROM employee WHERE em_id ='${pengajuan[0].em_id}'`, (err,employee) => {
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
                        if (pola=="1" || pola==1){
                          connection.query(`INSERT INTO  ${ namaDatabaseDynamic}.attendance 
                          (em_id,branch_id,atten_date,signing_time,signout_time,
                          place_in,signin_longlat,signout_longlat,signin_pict,signout_pict,
                          signing_note,signin_addr,atttype,reg_type) VALUES 
                          ('${emId}','${employee[0].branch_id}','${pengajuan[0].atten_date}','${pengajuan[0].dari_jam}',
                          '${pengajuan[0].place_in}',
                          '${pengajuan[0].signin_longlat}',
                          '','${pengajuan[0].req_file}',
                          '${pengajuan[0].uraian}',
                          '${pengajuan[0].signin_addr}','1','0')`, (err) => {
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
                          });
                   
                        }else{
                          if (approve2Date!=""){
                            connection.query(`INSERT INTO ${namaDatabaseDynamic}.attendance 
                            (em_id,branch_id,atten_date,signin_time,signout_time,
                            place_in,signin_longlat,signout_longlat,signin_pict,signout_pict,
                            signin_note,signin_addr,atttype,reg_type) VALUES 
                            ('${emId}','${employee[0].branch_id}','${pengajuan[0].atten_date}','${pengajuan[0].dari_jam}','00:00:00',
                            '${pengajuan[0].place_in}',
                            '${pengajuan[0].signin_longlat}',
                            '','${pengajuan[0].req_file}','',
                            '${pengajuan[0].uraian}',
                            '${pengajuan[0].signin_addr}','1','0')`, (err) => {
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
                            });
                          }

                        }
                   
                        connection.query( `SELECT IFNULL(name,'') as name FROM ${database}_hrm.sysdata WHERE KODE IN ('022','023','013')`, (err, sysdata) => {
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
                        
    
                          connection.query( `SELECT * FROM employee WHERE em_id='${approveId}'`, (err, employeeApproved) => {
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
        
                     
              var namaTransaksi='Pengajuan WFH'

              
                    // alur 1  approval
                    if (sysdata[0].name=="1" ||sysdata[0].name==1){


                      //keti approve
                      if (bodyStatusFinal=='Approve' || bodyStatusFinal=='Approve'){
                   
                      var listData=sysdata[2].name.toString().split(',')
  
                
                        for (var i=0;i<listData.length;i++){
  
                          if (listData[i]!=''){
                          var title='';
                          var deskripsi='';
                          title=`Approval ${namaTransaksi}`
                          deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`
                         
                          
                          connection.query(
                            `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                           
                           
                            (err, employee) => {
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
                          
                          connection.query(`INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0,'${emId}','${pengajuan[0].id}')`,
                           
                           
                            (err, results) => {
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
                           
                              utility.notifikasi(employee[0].token_notif,title,message)
                          });
                        });
  
                          
                                
                      }
  
                        }
  
  
              
                        //jika approve
                      }
                      //ketika rejected
                      if (bodyStatusFinal=='Rejected' || bodyStatusFinal=='Rejected'){ 
                        console.log("Masuk reject query")
                        var listData=sysdata[1].name.toString().split(',')
                       
                          for (var i=0;i<listData.length;i++){
                            console.log("Masuk reject query 1")
                            console.log(namaTransaksi)
                         
                            
  
                            if (listData[i]!=''){
                            title=`Rejection ${namaTransaksi}`
                            deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`
    
                            connection.query(
                              `SELECT  * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                             
                             
                              (err, employee) => {
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
                            connection.query(
                              `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0,'${emId}','${pengajuan[0].id}')`,
                             (err, results) => {
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
                              }     });
  
                             
                                utility.notifikasi(employee[0].token_notif,title,deskripsi)
                            });
                                  
    
    
                          }
  
                        }
    
                      
                          //jika approve
                    
                        }
  
  
  
                        
                        
                      }
  
                      // alur 2  approval
                      console.log('sys data',sysdata)
                      if (sysdata[0].name=="2" ||sysdata[0].name==2){
  
  
                      //keti approve
                      if (bodyStatusFinal=='Approve2' || bodyStatusFinal=='Approve2'){
                      console.log('data  em id approve',sysdata[2].toString())
                       var listData=sysdata[2].name.toString().split(',')
                      console.log('data  em id approve',listData)
  
                        for (var i=0;i<listData.length;i++){
                          console.log('proses ',i,listData[i])
  
  
                          if (listData[i]!=''){
  
                            var title='';
                            var deskripsi='';
                            console.log(listData[i])                      
                            title=`Approval ${namaTransaksi}`
                            deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan telah di ${bodyStatusFinal} oleh ${employeeApproved[0].full_name}`
                            connection.query(
                              `SELECT *  FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                             
                             
                              (err, employee) => {
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
                          
                            connection.query(
                              `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi
                              }',CURDATE(),CURTIME(),1,0,'${emId}','${pengajuan[0].id}')`,
                             
                             
                              (err, results) => {
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
                              
                                console.log("employee id ",listData[i])
                                utility.notifikasi(employee[0].token_notif,title,deskripsi)
                            });    
                            
                            
                            });
                                  
  
                          }
                   
  
  
                        }
                        //jika approve
                  
                      }
  
                      //keti approve
                      if (bodyStatusFinal=='Rejected' || bodyStatusFinal=='Rejected'){
                        var listData=sysdata[1].name.toString().split(',')
    
                          for (var i=0;i<listData.length;i++){
                           
    
                          if (listData[i]!=''){
                           
                            title=`Rejection ${namaTransaksi}`
                            deskripsi=`Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${emId} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`
    
                            connection.query(
                              `SELECT * FROM ${databaseMaster}.employee WHERE em_id='${listData[i]}'`,
                             
                             
                              (err, employee) => {
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
                            connection.query(
                              `INSERT INTO ${namaDatabaseDynamic }.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0,0,'${emId}','${pengajuan[0].id}')`,
                             (err, results) => {
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
                            
                             
                                utility.notifikasi(employee[0].token_notif,title,deskripsi)
                            });
                            
                            });
                          }
                                  
    
    
                          }
                          //jika approve
                    
                        }
  
                      }

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
                        message: "Berhasil approval",
                     
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


}

