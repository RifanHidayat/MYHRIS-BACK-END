const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');

pool.on("error", (err) => {
  console.error(err);
});


module.exports = {
    
    async store(req,res){

      console.log("param query " ,req.query)
      console.log("param body " ,req.body)


        console.log('-----insert tracking----------')
        var database=req.body.database;
        var database=req.body.database;
        var email=req.query.email;
        let records;
        var error=false;

        var latitude=req.body.latitude;
        var longitude=req.body.longitude;
        var address=req.body.alamat;
      
        var time=req.body.waktu;
        var date=req.body.tanggal;

        var emId=req.body.em_id;

        var array = date.split("-");
    
            
      
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

                var longlat=`${longitude},${latitude}`
                    connection.query(`INSERT INTO ${namaDatabaseDynamic}.emp_control (em_id, atten_date, time, longlat,address)
                    VALUES ('${emId}', '${date}', '${time}','${longlat}','${address}')`, (err, results) => {
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
    },


    async index(req,res){

        console.log('-----insert tracking ----------')
        var database=req.body.database;
        var email=req.query.email;
        let records;
        var error=false;

        var lat=req.body.latitude;
        var longitude=req.body.longitude;
        var alamat=req.body.alamat;
      
        var time=req.body.waktu;
        var date=req.body.tanggal;

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

                    connection.query(`SELECT * FROM emp_control where atten_date='${date}'`, (err, results) => {
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
    },


    async groupDate(req,res){

        console.log('-----insert tracking ----------')
        var database=req.body.database;
        var database=req.query.database;
        var email=req.query.email;
        let records;
        var error=false;

        var lat=req.body.latitude;
        var longitude=req.body.longitude;
        var alamat=req.body.alamat;
      
        var time=req.body.waktu;
        var date=req.body.tanggal;

        var array = date.split("-");
    
        var emId=req.body.em_id_employee;
      
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

                    connection.query(`SELECT atten_date FROM ${namaDatabaseDynamic}.emp_control WHERE em_id='${emId}' GROUP BY atten_date `, (err, results) => {
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
    },



    async employee(req,res){

        console.log('-----insert tracking ----------      ' )
        var database=req.body.database;
        var database=req.query.database;
        var email=req.query.email;
        let records;
        var error=false;

        var lat=req.body.latitude;
        var longitude=req.body.longitude;
        var alamat=req.body.alamat;
      
        var time=req.body.waktu;
        var date=req.body.tanggal;
        var emId=req.body.em_id;

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
var queryNew=`SELECT * FROM employee WHERE (em_report_to LIKE "%${emId}%" OR em_report2_to LIKE "%${emId}%" ) AND em_control='1'`
         
console.log(queryNew)
connection.query(queryNew, (err, results) => {
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

                     if (records.length<=0){
                        return res.status(400).send({
                            status: true,
                            message: 'data tidak tersedia',
                           
                          
                          });

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
                        console.log(records)
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
    },



    

    async employeeControllDetail(req,res){

        console.log(' -----insert tracking----------')
        var database=req.body.database;
        var database=req.query.database;
        var email=req.query.email;
        let records;
        var error=false;

        var lat=req.body.latitude;
        var longitude=req.body.longitude;
        var alamat=req.body.alamat;
      
        var time=req.body.waktu;
        var date=req.body.tanggal;

        var array = date.split("-");
        var emId=req.body.em_id_employee;

        var offset=req.query.offset==undefined?"0":req.query.offset; 
        var limit=req.query.limit==undefined?"10":req.query.limit; 
    console.log(req.body)
            
      
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

                var query=`SELECT * FROM ${namaDatabaseDynamic}.emp_control WHERE atten_date='${date}' AND em_id='${emId}' LIMIT ${limit} OFFSET ${offset}`
                console.log(query)

                    connection.query(query, (err, results) => {
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
                     console.log(records)

                     if (records.length<=0){
                        return res.status(400).send({
                            status: true,
                            message: 'Data tidak tersedia',
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
                          message: 'Data tersedia',
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
    },




    
    async updateTracking(req,res){

        console.log(' -----update  em tracking tracking----------')
        var database=req.body.database;
        var database=req.query.database;
      
        var emId=req.body.em_id;
        var status=req.body.status;
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
                var query=`UPDATE employee SET em_tracking='${status}'  WHERE em_id='${emId}'`
                console.log(query)

                    connection.query(query, (err, results) => {
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
                          message: 'Berhasil update data',
                      
                        
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
    },
    async clearTrackinng(req,res){

      console.log(' -----update  em tracking tracking----------')
      var database=req.body.database;
      var database=req.query.database;
    
      var emId=req.body.em_id;
      var status=req.body.status;
      var date=req.body.date;
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
              var query=`DELETE  FROM ${database}_hrm2409.emp_control WHERE atten_date='${date}' AND em_id='${emId}'`
              console.log(query)

                  connection.query(query, (err, results) => {
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
                        message: 'Berhasil Hapus data',
                    
                      
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
  },





}

