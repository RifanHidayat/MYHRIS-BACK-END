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
const tableAset='assets'
const table='assets_transaction'
const tableDetail='assets_transaction_detail'
module.exports = {

  async  update (req,res){

     
    console.log('-----Insert pengaduan kerusakan----------' ,req.body)
  
    var database=req.query.database;

    var emId=req.headers.em_id;
    var nama=req.body.nama;

    var posisi=req.body.posisi;
    var namaPeralatan=req.body.nama_peralatan;
    var jenisKerusakan=req.body.jenis_kerusakan
    var lokasiPenempatan=req.body.lokasi_penempatan
    var  telp=req.body.telp
    var lokasiPeralatanRusak=req.body.lokasi_peralatan_rusak;
    var jumlahPeralatanRusal=req.body.jumlah_peralatan_rusak;
    var catatan=req.body.catatan

    var id=req.params.id



    var tanggal=req.body.tanggal_ajuan;
    var catatan=req.body.keterangan;
    var status='Pending';
    var createdEmid=req.headers.em_id==undefined?"":req.headers.em_id;
    

    var details=req.body.details
    console.log(details.length)

  
    var array = utility.dateNow2().split("-");
    

    const tahun = `${array[0]}`;
    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

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

      
              var query= `SELECT * FROM ${table} WHERE id='${id}'`


              connection.query( query, (err, transaksi) => {
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
    
    var dataInsert = {
        tgl_ajuan:tanggal,
        remark:catatan,
        status:status,
        em_id:createdEmid,
   

        
      }

                var query= `UPDATE ${table} SET remark='${catatan}',tgl_ajuan='${tanggal}' WHERE id='${id}'`


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

                    connection.query( `DELETE  FROM ${tableDetail} WHERE nomor_ajuan='${transaksi[0].nomor_ajuan}'`, (err, results) => {
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
                      
                    console.log(transaksi)
                 
           
                    for (var i=0;i<details.length;i++){
                        var noUrut=i+1;
                      
                        console.log(details[i])
                    
                        
                        var tanggalPinjam=details[i]['tanggal_pinjam'];
                        var assetId=details[i]['assets_id']
                        var qty=details[i]['qty']
                        var remark=details[i]['keterangan']
                        var tglPengembalian=details[i]['tanggal_pengembalian']

                        connection.query( `INSERT INTO ${tableDetail} (trx_id,nomor_ajuan,tgl_ajuan,em_id,qty,remark,nourut,assets_id,tgl_pengembalian_ekstimasi) 
                        VALUES ('${id}','${transaksi[0].nomor_ajuan}','${tanggalPinjam}','${emId}','${qty}','${remark}','${noUrut}','${assetId}','${tglPengembalian}') `, (err, results) => {
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
                    });

                  // });

                //});

                  
                 
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
    

    async store(req,res){

     
        console.log('-----Insert pengaduan kerusakan----------')
      
        var database=req.query.database;

        var emId=req.headers.em_id;
        var nama=req.body.nama;
    
        var posisi=req.body.posisi;
        var namaPeralatan=req.body.nama_peralatan;
        var jenisKerusakan=req.body.jenis_kerusakan
        var lokasiPenempatan=req.body.lokasi_penempatan
        var  telp=req.body.telp
        var lokasiPeralatanRusak=req.body.lokasi_peralatan_rusak;
        var jumlahPeralatanRusal=req.body.jumlah_peralatan_rusak;
        var catatan=req.body.catatan



        var tanggal=req.body.tanggal_ajuan;
        var catatan=req.body.keterangan;
        var status='Pending';
        var createdEmid=req.headers.em_id==undefined?"":req.headers.em_id;
        

        var details=req.body.details
        console.log(details.length)

      
        var array = utility.dateNow2().split("-");
        

        const tahun = `${array[0]}`;
        const convertYear = tahun.substring(2, 4);
        var convertBulan;
        if (array[1].length == 1) {
          convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
        } else {
          convertBulan = array[1];
        }
  
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

          
    
                  connection.query(` SELECT nomor_ajuan FROM  ${table} ORDER BY nomor_ajuan DESC `,
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
               

                 console.log(details)
                 if (results.length > 0) {
                     var text = results[0]['nomor_ajuan'];
                     nomor = parseInt(text.substring(8, 13)) + 1;
                     var nomorStr = String(nomor).padStart(4, '0')
                     nomorAjuan = `AP20${convertYear}${convertBulan}` + nomorStr;
             
                   } else {
                     nomor = 1;
                     var nomorStr = String(nomor).padStart(4, '0')
                     nomorAjuan  = `AP20${convertYear}${convertBulan}` + nomorStr;
                   }
                 
                   
        var dataInsert = {
            tgl_ajuan:tanggal,
            remark:catatan,
            status:status,
            em_id:createdEmid,
            nomor_ajuan:nomorAjuan,
            typeId:1
            
          }
    
                    var query= `INSERT INTO ${table} SET ?`
    
    
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
                        
                     
               
                        for (var i=0;i<details.length;i++){
                            var noUrut=i+1;
                          
                            console.log(details[i])
                        
                            
                            var tanggalPinjam=details[i]['tanggal_pinjam'];
                            var assetId=details[i]['assets_id']
                            var qty=details[i]['qty']==undefined || details[i]['qty']==""?"1":details[i]['qty']
                            var remark=details[i]['keterangan']
                            var tglPengembalian=details[i]['tanggal_pengembalian'];
                            //var tglPengembalian=details[i]['tanggal_pinjam'];

                            connection.query( `INSERT INTO ${tableDetail} (trx_id,nomor_ajuan,tgl_ajuan,em_id,qty,remark,nourut,assets_id,tgl_pengembalian_ekstimasi) 
                            VALUES ('${results.insertId}','${nomorAjuan}','${tanggalPinjam}','${emId}','${qty}','${remark}','${noUrut}','${assetId}','${tglPengembalian}') `, (err, results) => {
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
                });
              
              
            
          }catch($e){
            return res.status(400).send({
              status: true,
              message: 'Gagal ambil data',
              data:[]
            
            });
      
          }
    
          
     
        
      },

    
    //   async update(req,res){

     
    //     console.log('-----Insert pengaduan kerusakan----------',req.body)
      
    //     var database=req.query.database;
      
    //     var emId=req.body.em_id;
    //     var nama=req.body.nama;
    
    //     var posisi=req.body.posisi;
    //     var namaPeralatan=req.body.nama_peralatan;
    //     var jenisKerusakan=req.body.jenis_kerusakan
    //     var lokasiPenempatan=req.body.lokasi_penempatan
    //     var  telp=req.body.telp
    //     var lokasiPeralatanRusak=req.body.lokasi_peralatan_rusak;
    //     var jumlahPeralatanRusal=req.body.jumlah_peralatan_rusak;
    //     var catatan=req.body.catatan

    //     var details=req.body.details
    // console.log(req.body)
    //     var dataInsert = {
    //         posisi: posisi,
    //         nama_peralatan: namaPeralatan,
    //         jenis_kerusakan: jenisKerusakan,
    //         lokasi_penempatan: lokasiPenempatan,
    //         em_id:emId,
    //         nama:nama,
    //         created_by:nama,
    //         created_on:utility.dateNow2(),
    //         modified_on:utility.dateNow2(),
    //         modified_by:nama,
    //         telp:telp
            
    //       }
    // var id=req.params.id
    //     var query= `UPDATE  ${table} SET  ? WHERE id='${id}'`
    //     var query2=`DELETE  FROM ${tableDetail}  WHERE pengaduan_kerusakan_id='${id}'` 
    
    
    
    
    
    //     console.log(req.body)
    //       try{
    //           const connection=await model.createConnection(database);
    //           connection.connect((err) => {
    //             if (err) {
    //               console.error('Error connecting to the database:', err);
    //               return;
    //             }  
    //             connection.beginTransaction((err) => {
    //               if (err) {
    //                 console.error('Error beginning transaction:', err);
    //                 connection.end();
    //                 return;
    //               }
    //               connection.query( query2, (err, results) => {
    //                 if (err) {
    //                   console.error('Error executing SELECT statement:', err);
    //                   connection.rollback(() => {
    //                     connection.end();
    //                     return res.status(400).send({
    //                       status: false,
    //                       message: 'gagal ambil data',
    //                       data:[]
                        
    //                     });
    //                   });
    //                   return;
    //                 }
                    
    
              
    //                   connection.query( query,[dataInsert], (err, results) => {
    //                     if (err) {
    //                       console.error('Error executing SELECT statement:', err);
    //                       connection.rollback(() => {
    //                         connection.end();
    //                         return res.status(400).send({
    //                           status: false,
    //                           message: 'gagal ambil data',
    //                           data:[]
                            
    //                         });
    //                       });
    //                       return;
    //                     }
                        
    //                     records = results;

    //                     for (var i=0;i<details.length;i++){
                          
                          
                          
                          
    //                       console.log(details[i])
    //                         details[i]['pengaduan_kerusakan_id']=records.insertId;

    //                         connection.query( `INSERT INTO ${tableDetail} (nama_kerusakan,jumlah_kerusakan,lokasi_kerusakan,pengaduan_kerusakan_id,alasan_kerusakan)  
    //                         VALUES ('${details[i]['nama_kerusakan']}','${details[i]['jumlah_kerusakan']}','${details[i]['lokasi_kerusakan']}','${id}','${details[i]['alasan_kerusakan']}')`,details, (err, results) => {
    //                           if (err) {
    //                             console.error('Error executing SELECT statement:', err);
    //                             connection.rollback(() => {
    //                               connection.end();
    //                               return res.status(400).send({
    //                                 status: false,
    //                                 message: 'gagal ambil data',
    //                                 data:[]
                                  
    //                               });
    //                             });
    //                             return;
    //                           }
    //                         }); 



    //                     }
                
    //                     //     records = results;
    //                     connection.commit((err) => {
    //                       if (err) {
    //                         console.error('Error committing transaction:', err);
    //                         connection.rollback(() => {
    //                           connection.end();
    //                           return res.status(400).send({
    //                             status: true,
    //                                      message: "failed insert data",
    //                             data:[]
                              
    //                           });
    //                         });
    //                         return;
    //                       }
    //                       connection.end();
    //                       console.log('Transaction completed successfully!');
    //                       return res.status(200).send({
    //                         status: true,
    //                         message: "Success insert data",
    //                         data:records
                          
    //                       });
    
    //                     });
    
                      
                      
    //                 //  });
    //                 });
    //               });
    //             });
              
    //         });
              
              
            
    //       }catch($e){
    //         return res.status(400).send({
    //           status: true,
    //           message: 'Gagal ambil data',
    //           data:[]
            
    //         });
      
    //       }
    
          
     
        
    //   },
    
  async delete(req,res){

    var database=req.query.database
    var id=req.params.id
    var query= `UPDATE ${table} SET status_transaksi='0' WHERE id='${id}'`
    
    
    
    
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


    var query=`SELECT nomor_ajuan,tgl_ajuan,remark,status FROM ${table} WHERE  status_transaksi='1' AND id='${id}'`
    var queryDetail=`SELECT ${tableAset}.name as nama_assets,${tableDetail}.tgl_ajuan,${tableDetail}.remark,${tableDetail}.qty, 
    ${tableAset}.purchase_qty as stok,${tableDetail}.tgl_pengembalian_ekstimasi as tanggal_pengembalian FROM ${tableDetail} LEFT JOIN ${tableAset} ON ${tableAset}.id=${tableDetail}.assets_id WHERE trx_id='${id}'`


    console.log(queryDetail)
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





  async assets(req,res){
    console.log('-----kirim tidak masuk kerja izin----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;
    console.log("cek no hp");
    var database=req.query.database;
    var emId=req.headers.em_id;
    console.log(req.headers)

      var query=`SELECT * FROM ( SELECT assets.id,  name,model,
        ( purchase_qty - 
        
        ((SELECT IFNULL( SUM(IFNULL(qty,0) - IFNULL(qty_pengembalian,0) ),0) FROM assets_transaction_detail JOIN assets_transaction ON assets_transaction_detail.nomor_ajuan=assets_transaction.nomor_ajuan WHERE assets_transaction.typeid='1' AND assets_transaction.status IN ('Pending','Approve') AND assets_transaction.status_transaksi='1' AND assets_transaction_detail.assets_id=assets.id))
        + 
        
        (SELECT IFNULL(SUM(IFNULL(qty,0)),0) FROM assets_transaction_detail JOIN assets_transaction ON assets_transaction_detail.trx_id=assets_transaction.id WHERE assets_transaction.typeid='2' 
        AND assets_transaction.status IN ('Pending','Approve') AND assets_transaction_detail.assets_id=assets.id) 
         )  AS qty FROM assets WHERE  STATUS='1'  ) AS TBL WHERE qty>0  `

console.log(query)
 //  var query=`SELECT name,model,purchase_qty as qty,id FROM  ${tableAset} WHERE  status='1'`
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



  async checked(req,res){
    console.log('-----kirim tidak masuk kerja izin----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;
    console.log("cek no hp");
    var database=req.query.database;
    var emId=req.headers.em_id;
    console.log(req.headers)

    isChecked=false;
    // var query=`SELECT tgl_pengembalian_ekstimasi as tgl_pengembalian, assets_transaction.nomor_ajuan AS nomor_ajuan,assets.name,assets_transaction_detail.qty FROM assets_transaction_detail  
    // JOIN assets_transaction ON assets_transaction_detail.trx_id=assets_transaction.id 
    // JOIN assets ON assets.id=assets_transaction_detail.assets_id WHERE tgl_pengembalian_ekstimasi IS NOT NULL`
    var query=`SELECT tgl_pengembalian_ekstimasi AS tgl_pengembalian, assets_transaction.nomor_ajuan AS nomor_ajuan,assets.name,(assets_transaction_detail.qty -IFNULL(assets_transaction_detail.qty_pengembalian,0)) AS qty FROM assets_transaction_detail  
    JOIN assets_transaction ON assets_transaction_detail.nomor_ajuan=assets_transaction.nomor_ajuan
    LEFT JOIN assets ON assets.id=assets_transaction_detail.assets_id 
    WHERE status_transaksi='1'  AND assets_transaction.status IN ('Approve')  AND assets_transaction.em_id='${emId}' AND tgl_pengembalian_ekstimasi<=CURDATE() + INTERVAL 1 DAY  AND IFNULL(qty_pengembalian,0)<qty

`

    
    console.log(`SELECT assets_transaction_detail.tgl_pengembalian_ekstimasi as tgl, assets_transaction.nomor_ajuan AS nomor_ajuan,assets.name,assets_transaction_detail.qty FROM assets_transaction_detail  
    JOIN assets_transaction ON assets_transaction_detail.trx_id=assets_transaction.id 
    JOIN assets ON assets.id=assets_transaction_detail.assets_id 
    WHERE assets_transaction.em_id='${emId}' AND tgl_pengembalian>=CURDATE() + INTERVAL 1 DAY AND IFNULL(qty_pengembalian,0)<qty `)
      
    
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

                    connection.query( `SELECT * FROM sysdata WHERE kode='043'`, (err, sysdata) => {
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

                      var datanew=[];
                      if (sysdata.length>0){
                        
                        if (sysdata[0].name=="" || sysdata[0].name==null ){

                        
                          
                        }else{
                          results.forEach(item => {
                            var dateNow=new Date(utility.dateNow2());
                            console.log("daa pengembalian ",item['tgl_pengembalian'])
                            var datePengembalian =new Date(utility.addDate(item['tgl_pengembalian'],parseInt(''+sysdata[0].name)))
                            console.log("daa pengembalian ",datePengembalian)
                            item['toleransi']=datePengembalian;

                            console.log("toleransi ",item['toleransi'])
                           if (dateNow>datePengembalian){
                            //cpm
                             ischecked=true;
                            datanew.push(item)
                           }
                        });
                        }
                      }
                      
                    console.log("data new ",datanew);
                    console.log("data new ",isChecked);
                
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
                        message: "successfully get data",
                        is_checked:datanew.length>0?true:false,
                        data:results,
                        data_new:datanew
                      
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




  async  show(req,res){
    console.log('-----kirim tidak masuk kerja izin----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;
    console.log("cek no hp");
    var database=req.query.database;
    var emId=req.headers.em_id;
    console.log(req.headers)
    var query=`SELECT id,nomor_ajuan,tgl_ajuan as tanggal,remark,status FROM  ${table} WHERE   status_transaksi='1' AND em_id='${emId}' AND typeid='1'`
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


//   async  detail(req,res){


//     console.log('-----kirim tidak masuk kerja izin----------')
//     var nama=req.body.nama;
//     var emId=req.body.em_id;
//     console.log("cek no hp");
//     var database=req.query.database;
//     var emId=req.headers.em_id;
//     console.log(req.headers)
//     var query=`SELECT trx_id,nomor_ajuan,qty FROM  ${tableDetail} WHERE em_id='${emId}' AND status_transaksi='1'`
//       try{
//           const connection=await model.createConnection(database);
//           connection.connect((err) => {
//             if (err) {
//               console.error('Error connecting to the database:', err);
//               return;
//             }  
//             connection.beginTransaction((err) => {
//               if (err) {
//                 console.error('Error beginning transaction:', err);
//                 connection.end();
//                 return;
//               }

          
//                   connection.query( query, (err, results) => {
//                     if (err) {
//                       console.error('Error executing SELECT statement:', err);
//                       connection.rollback(() => {
//                         connection.end();
//                         return res.status(400).send({
//                           status: false,
//                           message: 'gagal ambil data',
//                           data:[]
                        
//                         });
//                       });
//                       return;
//                     }
                    
//                     records = results;
//                     if (records.length==0){
//                       return res.status(400).send({
//                         status: false,
//                                   message: "Data user tidak ditemukan",
//                         data:[]
                      
//                       });
//                     }
//                     connection.commit((err) => {
//                       if (err) {
//                         console.error('Error committing transaction:', err);
//                         connection.rollback(() => {
//                           connection.end();
//                           return res.status(400).send({
//                             status: true,
//                                      message: "Kombinasi email & password Anda Salah",
//                             data:[]
                          
//                           });
//                         });
//                         return;
//                       }
//                       connection.end();
//                       console.log('Transaction completed successfully!');
//                       return res.status(200).send({
//                         status: true,
//                         message: "Kombinasi email & password Anda Salah",
//                         data:records
                      
//                       });
//                   });
//                 });
//               });
//             });

//       }catch($e){
//         return res.status(400).send({
//           status: true,
//           message: 'Gagal ambil data',
//           data:[]
        
//         });
  
//       }

      
 
    
//   },






}

