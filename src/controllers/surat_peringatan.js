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
  
async  suratPeringatan(req,res){
    var database=req.query.database;
    var emId=req.headers.em_id;
    var branchId=req.body_query_id;
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
               

                    connection.query( `SELECT letter.name as sp,employee.full_name as nama,employee.job_title as posisi,employee.file_esign , employee_letter.* FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id LEFT JOIN letter ON letter.id=employee_letter.letter_id WHERE employee_letter.em_id LIKE '%${emId}%' AND employee_letter.status='Approve' AND employee_letter.branch_id='${branchId}'`, (err, employee) => {
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
          console.log( `SELECT letter.name as sp,employee.full_name as nama,employee.job_title as posisi, employee_letter.* FROM employee_letter JOIN employee ON employee_letter.em_id=employee.em_id LEFT JOIN letter ON letter.id=employee_letter.letter_id WHERE employee_letter.em_id LIKE '%${emId}%' AND employee_letter.status='Approve'`)
                        
                  connection.commit((err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                                   message: "data tidak tersedia",
                          data:[]
                        
                        });
                      });
                      return;
                    }
                    console
                
                    connection.end();
                    console.log('Transaction completed successfully!');
                    return res.status(200).send({
                      status: true,
                      message: "data tersedia",
                      data:employee
                    
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

  async  detailAlasan(req,res){
    var database=req.query.database;
    var emId=req.headers.em_id;
    var id=req.params.id;
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
               

                    connection.query( `SELECT * FROM employee_letter_reason WHERE employee_letter_id='${id}'`, (err, employee) => {
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
                                   message: "data tidak tersedia",
                          data:[]
                        
                        });
                      });
                      return;
                    }

                    console.log('tes ne ',employee)
                
                    connection.end();
                    console.log('Transaction completed successfully!');
                    return res.status(200).send({
                      status: true,
                      message: "data tersedia",
                      data:employee
                    
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

  async  approvalSp(req,res){
    var database=req.query.database;
    var emId=req.body.em_id;
    var id=req.body.id
    var status=req.body.status
    console.log(req.body)

    var branchId=req.body.branch_id;

    var databseMaster=`${database}_hrm`
    var date=utility.dateNow2().split('-');

    var tahun=date[0].toString().substring(2,4)
    var bulan=date[1];

    var databasedinamik=`${database}_hrm${tahun}${bulan}`

    
    


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
               

              
       
            connection.query( `SELECT * FROM employee WHERE em_id='${emId}'`, (err, employee) => {
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
                        connection.query( `UPDATE employee_letter SET status='${status}',approve_by='${employee[0].full_name}',approve_date=CURDATE(),approve_id='${emId}' WHERE id='${id}'`, (err, employeqqe) => {
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

                            connection.query( `SELECT * FROM employee_letter WHERE id='${id}'`, (err,dataSp) => {
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

                            if (status=='Approve' || status=='Approved' || status=='Approve')
                            {
                                var text=`⚠️ Peringatan: Surat Peringatan telah diterbitkan. Anda mendapatkan surat peringatan dengan alasan  ${dataSp[0].alasan} 
                                Anda perlu segera diperbaiki. Mohon perhatian serius!`
                                console.log(employee[0])
     
                              
                            //    utility.insertNotifikasiGlobal(employee[0].em_id,'Info SP','sp',employee[0].em_id,'','',employee[0].full_name,databasedinamik,databseMaster,text)
               
               
                            }
                          
                  connection.commit((err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                                   message: "data tidak tersedia",
                          data:[]
                        
                        });
                      });
                      return;
                    }
                
                    connection.end();
                    console.log('Transaction completed successfully!');
                    return res.status(200).send({
                      status: true,
                      message: "data tersedia",
                      data:employee
                    
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


}





// var query = `SELECT employee.first_name, employee.last_name, leave_types.name, emp_leave.* FROM emp_leave LEFT JOIN employee ON employee.em_id=emp_leave.em_id LEFT JOIN leave_types ON leave_types.type_id=emp_leave.typeid WHERE emp_leave.em_delegation='${em_id}' AND emp_leave.leave_status='Pending'`



