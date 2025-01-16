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

const table='pengaduan_kerusakan'
const tableDetail='pengaduan_kerusakan_detail'
module.exports = {
    

    async store(req,res){

     
        console.log('-----Insert pengaduan kerusakan----------')
      
        var database=req.query.database;

        var emId=req.body.em_id;
        var nama=req.body.nama;
    
        var posisi=req.body.posisi;
        var namaPeralatan=req.body.nama_peralatan;
        var jenisKerusakan=req.body.jenis_kerusakan
        var lokasiPenempatan=req.body.lokasi_penempatan
        var  telp=req.body.telp
        var lokasiPeralatanRusak=req.body.lokasi_peralatan_rusak;
        var jumlahPeralatanRusal=req.body.jumlah_peralatan_rusak;
        var catatan=req.body.catatan

        var details=req.body.details

      
        var array = utility.dateNow2().split("-");
        

        const tahun = `${array[0]}`;
        const convertYear = tahun.substring(2, 4);
        var convertBulan;
        if (array[1].length == 1) {
          convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
        } else {
          convertBulan = array[1];
        }
    
    console.log('detaul',details)
        var dataInsert = {
            posisi: posisi,
            nama_peralatan: namaPeralatan,
            jenis_kerusakan: jenisKerusakan,
            lokasi_penempatan: lokasiPenempatan,
            em_id:emId,
            nama:nama,
            created_by:nama,
            created_on:utility.dateNow2(),
            modified_on:utility.dateNow2(),
            modified_by:nama,
            telp:telp
            
          }
    
        var query= `INSERT INTO ${table} SET ?`
    
    
    var nomorAjuan=''
    
    
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

                //   connection.query(` SELECT nomor_ajuan FROM  ${table} ORDER BY id DESC `,
                //   (err, results) => {
                //  if (err) {
                //    console.error('Error executing SELECT statement:', err);
                //    connection.rollback(() => {
                //      connection.end();
                //      return res.status(400).send({
                //        status: true,
                //        message: 'Data gagal terkirim',
                //        data:results
                     
                //      });
                //    });
                //    return;
                //  }
                //  if (results.length > 0) {
                //    var text = results[0]['nomor_ajuan'];
                //    nomor = parseInt(text.substring(8, 13)) + 1;
                //    var nomorStr = String(nomor).padStart(4, '0')
                //    nomorAjuan = `FF20${convertYear}${convertBulan}` + nomorStr;
           
                //  } else {
                //    nomor = 1;
                //    var nomorStr = String(nomor).padStart(4, '0')
                //    nomorAjuan  = `FF20${convertYear}${convertBulan}` + nomorStr;
                //  }
    
              
                      connection.query( query,[dataInsert], (err, results) => {
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

                        console.log(details)
                        
                        
                     
                        for (var i=0;i<details.length;i++){
                          
                          
                          
                          
                          console.log(details[i])
                            details[i]['pengaduan_kerusakan_id']=records.insertId;

                            connection.query( `INSERT INTO ${tableDetail} (nama_kerusakan,jumlah_kerusakan,lokasi_kerusakan,pengaduan_kerusakan_id,alasan_kerusakan)  
                            VALUES ('${details[i]['nama_kerusakan']}','${details[i]['jumlah_kerusakan']}','${details[i]['lokasi_kerusakan']}','${records.insertId   }','${details[i]['alasan_kerusakan']}')`,details, (err, results) => {
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
                            }); 



                        }
                
                        // var query2= `INSERT INTO ${tableDetail} (nama_kerusakan,jumlah_kerusakan,lokasi_kerusakan,pengaduan_kerusakan_id)  VALUES ?`

                        // console.log('data ',query2)
    
                        // connection.query( query2,details, (err, results) => {
                        //     if (err) {
                        //       console.error('Error executing SELECT statement:', err);
                        //       connection.rollback(() => {
                        //         connection.end();
                        //         return res.status(400).send({
                        //           status: false,
                        //           message: 'gagal ambil data',
                        //           data:[]
                                
                        //         });
                        //       });
                        //       return;
                        //     }
                            
                          
                        connection.commit((err) => {
                          if (err) {
                            console.error('Error committing transaction:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                         message: "failed insert data",
                                data:[]
                              
                              });
                            });
                            return;
                          }
                          connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: "Success insert data",
                          
                          
                          });
    
                      // });
    
                    //});
    
                      
                      
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
          async store(req,res){

     
        console.log('-----Insert pengaduan kerusakan----------')
      
        var database=req.query.database;

        var emId=req.body.em_id;
        var nama=req.body.nama;
    
        var posisi=req.body.posisi;
        var namaPeralatan=req.body.nama_peralatan;
        var jenisKerusakan=req.body.jenis_kerusakan
        var lokasiPenempatan=req.body.lokasi_penempatan
        var  telp=req.body.telp
        var lokasiPeralatanRusak=req.body.lokasi_peralatan_rusak;
        var jumlahPeralatanRusal=req.body.jumlah_peralatan_rusak;
        var catatan=req.body.catatan

        var details=req.body.details

      
        var array = utility.dateNow2().split("-");
        

        const tahun = `${array[0]}`;
        const convertYear = tahun.substring(2, 4);
        var convertBulan;
        if (array[1].length == 1) {
          convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
        } else {
          convertBulan = array[1];
        }
    
    console.log('detaul',details)
      
    
        var query= `INSERT INTO ${table} SET ?`
    
    
    var nomorAjuan='PK'
    
    
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

                  connection.query(` SELECT nomor_ajuan FROM  ${table} ORDER BY id DESC `,
                  (err, results) => {
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
                 if (results.length > 0) {
                   var text = results[0]['nomor_ajuan'];
                   nomor = parseInt(text.substring(8, 13)) + 1;
                   var nomorStr = String(nomor).padStart(4, '0')
                   nomorAjuan = `PK20${convertYear}${convertBulan}` + nomorStr;
           
                 } else {
                   nomor = 1;
                   var nomorStr = String(nomor).padStart(4, '0')
                   nomorAjuan  = `PK20${convertYear}${convertBulan}` + nomorStr;
                 }
    
                 var dataInsert = {
                  posisi: posisi,
                  nama_peralatan: namaPeralatan,
                  jenis_kerusakan: jenisKerusakan,
                  lokasi_penempatan: lokasiPenempatan,
                  em_id:emId,
                  nama:nama,
                  created_by:nama,
                  created_on:utility.dateNow2(),
                  modified_on:utility.dateNow2(),
                  modified_by:nama,
                  telp:telp,
                  nomor_ajuan:nomorAjuan
                  
                }
              
                      connection.query( query,[dataInsert], (err, results) => {
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

                           
                        for (var i=0;i<details.length;i++){
                          
                          
                          
                          
                          console.log(details[i])
                            details[i]['pengaduan_kerusakan_id']=records.insertId;

                            connection.query( `INSERT INTO ${tableDetail} (nama_kerusakan,jumlah_kerusakan,lokasi_kerusakan,pengaduan_kerusakan_id,alasan_kerusakan)  
                            VALUES ('${details[i]['nama_kerusakan']}','${details[i]['jumlah_kerusakan']}','${details[i]['lokasi_kerusakan']}','${records.insertId   }','${details[i]['alasan_kerusakan']}')`,details, (err, results) => {
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
                            }); 



                        }

                       
                        
                        
                        // for (var i=0;i<details.length;i++){
                        //     console.log(details[i])
                        //     details[i]['pengaduan_kerusakan_id']=records.insertId
                        // }
                        // console.log("tes",details)
                
                        // var query2= `INSERT INTO ${tableDetail} SET ?`
    
                        // connection.query( query2,details, (err, results) => {
                        //     if (err) {
                        //       console.error('Error executing SELECT statement:', err);
                        //       connection.rollback(() => {
                        //         connection.end();
                        //         return res.status(400).send({
                        //           status: false,
                        //           message: 'gagal ambil data',
                        //           data:[]
                                
                        //         });
                        //       });
                        //       return;
                        //     }
                            
                        //     records = results;
                        connection.commit((err) => {
                          if (err) {
                            console.error('Error committing transaction:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                         message: "failed insert data",
                                data:[]
                              
                              });
                            });
                            return;
                          }
                          connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: "Success insert data",
                            data:records
                          
                          });
    
                        });
    
                    //});
    
                      
                      
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

     
        console.log('-----Insert pengaduan kerusakan----------',req.body)
      
        var database=req.query.database;
      
        var emId=req.body.em_id;
        var nama=req.body.nama;
    
        var posisi=req.body.posisi;
        var namaPeralatan=req.body.nama_peralatan;
        var jenisKerusakan=req.body.jenis_kerusakan
        var lokasiPenempatan=req.body.lokasi_penempatan
        var  telp=req.body.telp
        var lokasiPeralatanRusak=req.body.lokasi_peralatan_rusak;
        var jumlahPeralatanRusal=req.body.jumlah_peralatan_rusak;
        var catatan=req.body.catatan

        var details=req.body.details
    console.log(req.body)
        var dataInsert = {
            posisi: posisi,
            nama_peralatan: namaPeralatan,
            jenis_kerusakan: jenisKerusakan,
            lokasi_penempatan: lokasiPenempatan,
            em_id:emId,
            nama:nama,
            created_by:nama,
            created_on:utility.dateNow2(),
            modified_on:utility.dateNow2(),
            modified_by:nama,
            telp:telp
            
          }
    var id=req.params.id
        var query= `UPDATE  ${table} SET  ? WHERE id='${id}'`
        var query2=`DELETE  FROM ${tableDetail}  WHERE pengaduan_kerusakan_id='${id}'` 
    
    
    
    
    
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
                  connection.query( query2, (err, results) => {
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
                    
    
              
                      connection.query( query,[dataInsert], (err, results) => {
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

                        for (var i=0;i<details.length;i++){
                          
                          
                          
                          
                          console.log(details[i])
                            details[i]['pengaduan_kerusakan_id']=records.insertId;

                            connection.query( `INSERT INTO ${tableDetail} (nama_kerusakan,jumlah_kerusakan,lokasi_kerusakan,pengaduan_kerusakan_id,alasan_kerusakan)  
                            VALUES ('${details[i]['nama_kerusakan']}','${details[i]['jumlah_kerusakan']}','${details[i]['lokasi_kerusakan']}','${id}','${details[i]['alasan_kerusakan']}')`,details, (err, results) => {
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
                            }); 



                        }
                        // console.log(details)
                        // for (var i=0;i<details.length;i++){
                        //     console.log(details[i])
                        //     details[i]['pengaduan_kerusakan_id']=id
                        // }
                        
                
                        // var query3= `INSERT INTO ${tableDetail} SET ?`
    
                        // connection.query( query3,details, (err, results) => {
                        //     if (err) {
                        //       console.error('Error executing SELECT statement:', err);
                        //       connection.rollback(() => {
                        //         connection.end();
                        //         return res.status(400).send({
                        //           status: false,
                        //           message: 'gagal ambil data',
                        //           data:[]
                                
                        //         });
                        //       });
                        //       return;
                        //     }
                            
                        //     records = results;
                        connection.commit((err) => {
                          if (err) {
                            console.error('Error committing transaction:', err);
                            connection.rollback(() => {
                              connection.end();
                              return res.status(400).send({
                                status: true,
                                         message: "failed insert data",
                                data:[]
                              
                              });
                            });
                            return;
                          }
                          connection.end();
                          console.log('Transaction completed successfully!');
                          return res.status(200).send({
                            status: true,
                            message: "Success insert data",
                            data:records
                          
                          });
    
                        });
    
                      
                      
                    //  });
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
    
  async delete(req,res){

var database=req.query.database
      var id=req.params.id

   // var query= `UPDATE ${table} SET status_transaksi='0' WHERE id='${id}'`
   var query= `DELETE  FROM ${table} WHERE id='${id}'`
    



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

          
                  connection.query( query, (err, results) => {
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
                                  message: "Gagal hapus data",
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
                                     message: "gagal hapus data",
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Berhasil hapus data",
                        data:records
                      
                      });

                  
                  
                  });
                });
              });
            });
          
          
        
      }catch(e){
        console.log(e)
        return res.status(400).send({
          status: true,
          message: 'Gagal ambil data',
          data:[]
        
        });
  
      }

      
 
    
  },

  async detail(req,res){


    console.log('-----kirim tidak masuk kerja izin----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;

    console.log("cek no hp");
    var database=req.query.database;
  
    var emId=req.headers.em_id;
    var id=req.params.id;

    console.log(id)


    var query=`SELECT ${table}.status as status_format,${table}.* FROM ${table} WHERE  status_transaksi='1' AND id='${id}'`
    var queryDetail=`SELECT * FROM ${tableDetail} WHERE pengaduan_kerusakan_id='${id}'`
    






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

          
                  connection.query( query, (err, results) => {
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
                                  message: "Data tidak tersedia",
                        data:[]
                      
                      });
                    }
            

                    connection.query( queryDetail, (err, results) => {
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
                        records[0].detail=results
        

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
                      console.log(records[0])
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Kombinasi email & password Anda Salah",
                        data:records[0]
                      
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


  async show(req,res){


    console.log('-----kirim tidak masuk kerja izin----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;

    console.log("cek no hp");
    var database=req.query.database;
  
    var emId=req.headers.em_id;

    console.log(req.headers)


    var query=`SELECT ${table}.status as status_format,${table}.* FROM ${table} WHERE em_id='${emId}' AND status_transaksi='1'`
    






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

          
                  connection.query( query, (err, results) => {
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
                   host: ipServer,//my${database}.siscom.id (ip local)
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

