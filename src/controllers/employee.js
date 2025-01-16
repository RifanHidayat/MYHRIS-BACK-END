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
  
async  employeeMonitoring(req,res){
    var database=req.query.database;
    console.log("masuk sni")
    var emId=req.headers.em_id;
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
                  connection.query( `SELECT IFNULL(em_report_monitoring ,'') as em_report_monitoring FROM employee WHERE em_id='${emId}' LIMIT 1 `, (err, results) => {
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
                 
                    var emids=results[0].em_report_monitoring.split(',')
                    var emidsConver=""
                    for (var i=0;i<emids.length;i++){
                        emidsConver=emidsConver+`'${emids[i]}',`
                    }

                    emidsConver =  emidsConver.slice(0, -1);
                    console.log('tes tes',results[0])
                 
       

                    connection.query( `SELECT employee.em_email,employee.full_name,employee.em_id FROM employee WHERE em_id  IN (${emidsConver})
                     UNION ALL SELECT employee.em_email,employee.full_name,employee.em_id FROM employee WHERE em_id='${emId}' `, (err, employee) => {
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
                    console.log("data login akhir aa",records)
                    connection.end();
                    console.log('Transaction completed successfully!');
                    return res.status(200).send({
                      status: true,
                      message: "Kombinasi email & password Anda Salah",
                      data:employee
                    
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

}





// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`



