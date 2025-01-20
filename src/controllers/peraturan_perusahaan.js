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

const table='peraturan_perusahaan'
const tableDetail='peraturan_perusahaan_employee'
module.exports = {







  
  
  
  
  
  async show(req,res){
    console.log('-----peraturan perusahaan----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;
    console.log("cek no hp");
    var database=req.query.database;
    var emId=req.headers.em_id;
    var branchId=req.headers.branch_id;
    console.log(req.headers)

    var query=`SELECT * FROM ${table} WHERE  status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids='' AND status='1' 
    AND (   branch_id LIKE '%${branchId.toString().padStart(2, '0')}%'  OR    branch_id LIKE '%${branchId}%' )
     `
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
                                  message: "Data  tidak ditemukan",
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
          
          
        
      }catch(e){
        return res.status(400).send({
          status: true,
          message: 'Gagal ambil data',
          data:[]
        
        });
  
      }

      
 
    
  },

  
  async lastShow(req,res){

    console.log('-----kirim tidak masuk kerja izin----------')
    var nama=req.body.nama;
    var emId=req.body.em_id;

    console.log("cek no hp");
    var database=req.query.database;
  
    var emId=req.headers.em_id;

    console.log(req.headers)


    var query=`SELECT * FROM ${table} WHERE  status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids='' ORDER BY id DESC LIMIT 1`
    

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
                                  message: "Data tidak ditemukan",
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
                        message: "successfuly get data",
                        data:records[0]
                      
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


    
  async checkData(req,res){

    console.log("datawww")

    console.log(' cek data')
    var nama=req.body.nama;


    console.log("cek no h qqp" );
    var database=req.query.database;
  
    var emId=req.headers.em_id;
    var branchId=req.headers.branch_id;

    console.log(req.headers)


    var query=`SELECT ${table}.* FROM ${database}_hrm.${table} LEFT JOIN ${tableDetail} ON ${table}.id=${tableDetail}.peraturan_perusahaan_id  WHERE 
     ${tableDetail}.em_id='${emId}' AND status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids='' AND status='1' 
        AND (   branch_id LIKE '%${branchId.toString().padStart(2, '0')}%'  OR    branch_id LIKE '%${branchId}%' )
    AND ${tableDetail}.peraturan_perusahaan_id IS  NULL AND tipe!='Utama'  ORDER BY ${table}.id DESC LIMIT 1`

    console.log(query)
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

          
                  connection.query( query, (err, dataPerusahaan) => {
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
                    
                 
                    if (dataPerusahaan.length==0){
                      return res.status(400).send({
                        status: false,
                                  message: "Data  tidak ditemukan",
                        data:[]
                      
                      });
                    }
               
               
                
                
                
                

                    
                var queryCek=`SELECT * FROM ${tableDetail} WHERE em_id='${emId}' AND peraturan_perusahaan_id='${dataPerusahaan[0].id}'`
                console.log(queryCek)

                    connection.query( queryCek, (err, results) => {
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


                        var isCheck=false;
                        if (results.length>0){
                            isCheck=true;
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
                        message: "Susccesfuly get data perusahan",
                        is_check:isCheck,   
                        data:dataPerusahaan[0]
                      
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
  async checkDataByEmployee(req,res){

    console.log(' cek data EULAee  new')
    var nama=req.body.nama;
    var branchId=req.headers.branch_id;


    console.log("cek no hp");
    var database=req.query.database;
  
    var emId=req.headers.em_id;

    console.log(req.headers)


  


    var password = sha1(req.body.password);
    var email = req.body.email
    
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

              console.log('QUER ',`SELECT em_id FROM employee WHERE em_email='${email}' AND em_password='${password}'`)
              connection.query( `SELECT em_id,branch_id FROM employee WHERE em_email='${email}' AND em_password='${password}'`, (err, employee) => {
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
                
                if (employee.length==0)
                {
                  console.log('data tidak tersedia')
                  return res.status(400).send({
                    status: false,
                    message: "Kombinasi email & password Anda Salah",
                    data:[]
                  
                  });

                }
                var query=`SELECT * FROM ${table} WHERE  status_transaksi='1' AND tipe='utama' AND status='1'  
                AND (   branch_id LIKE '%${employee[0].branch_id.toString().padStart(2, '0')}%'  OR    branch_id LIKE '%${employee[0].branch_id}%' )
             ORDER BY id DESC LIMIT 1`

          
                  connection.query( query, (err, dataPerusahaan) => {
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
                    console.log(dataPerusahaan.length)

                    if (dataPerusahaan.length==0){
                       return res.status(200).send({
                        status: true,
                        message: "Susccesfuly get data perusahan",
                        is_check:true,   
                        data:""
                      
                      });
                    }
                 
                
                var queryCek=`SELECT * FROM ${tableDetail} WHERE em_id='${employee[0].em_id}' AND peraturan_perusahaan_id='${dataPerusahaan[0].id}'`

                console.log(queryCek)
               

                    connection.query( queryCek, (err, results) => {
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
                        var isCheck=false;
                        if (results.length>0){
                            isCheck=true;
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

                      console.log("is check",isCheck)

                      console.log("is check",dataPerusahaan[0])

                   
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Susccesfuly get data perusahan",
                        is_check:isCheck,   
                        data:dataPerusahaan[0]
                      
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


      
  async saveDataCheck(req,res){

    console.log('-----kirim data --')
    var nama=req.body.nama;
    var emId=req.body.em_id;

    console.log("cek no hp");
    var database=req.query.database;
    var peruasturanPerusahaanId=req.body.peraturan_perusahaan_id;
  
 

    console.log(req.body)
  


    var query=`SELECT * FROM ${table} WHERE  status_transaksi='1' AND em_ids LIKE '%${emId}%' OR em_ids=''  ORDER BY id DESC LIMIT 1`
    

    
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

                    
                    
                    let records = results;
                    if (records.length==0){
                      return res.status(400).send({
                        status: false,
                                  message: "Data  tidak ditemukan",
                        data:[]
                      
                      });
                    }
                 
                    var queryCek=`SELECT * FROM ${tableDetail} WHERE em_id='${emId}' AND peraturan_perusahaan_id='${peruasturanPerusahaanId}'`
                    console.log(queryCek)

                    connection.query( queryCek, (err, results) => {
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
                        var dataInsert={
                            'peraturan_perusahaan_id':peruasturanPerusahaanId,
                            'em_id':emId,

                            
                        }
                        console.log("data ",dataInsert)
                        var queryInsert=`INSERT INTO ${tableDetail} SET ?`
                
                        if (results.length>0){


                            return res.status(400).send({
                                status: false,
                                message: 'terjadi kesalahaan',
                                data:[]
                              
                              });

                           
                        }
        
                        
                        connection.query( queryInsert,[dataInsert], (err, results) => {
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
a;
                    connection.commit((err) => {
                      if (err) {
                        console.error('Error committing transaction:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                                     message: "Kombinasi email & password Anda Salah salah",
                            data:[]
                          
                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Susccesfuly  save data",
                       
                      
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

