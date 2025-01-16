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

 async cabang(req, res) {
  var database=req.query.database;
  var email=req.query.email;
  var periode=req.body.periode;
 var emId=req.headers.em_id;


  let records;
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

            connection.query(`
            SELECT * FROM employee WHERE em_id='${emId}'
            `, (err, results) => {
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
             //var branchidSplit=results[0].branch_access.split(',');
             var branchidSplit=''.split(',');
             var emIds='';

             for (var i=0; i<=branchidSplit.length;i++){
              emIds=`${emIds}"${branchidSplit[i]}",`


             }
            var newEmids='';

            if (emIds==''){
               newEmids=`${results[0].branch_id}`
            }else{
             newEmids=`${emIds}`.slice(0,-1)
            }

console.log(`  SELECT * FROM branch WHERE id IN(${results[0].branch_id})`)
         
                connection.query(`
                 SELECT * FROM branch WHERE id IN(${results[0].branch_id})
                 `, (err, results) => {
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
                      data:results 
                    
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






}

