const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");


var request = require('request');

const model = require('../../utils/models');
const utility = require('../../utils/utility');
var remoteDirectory = 'public_html/7H202305001'
pool.on("error", (err) => {
  console.error(err);
});

const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();
module.exports = { 
  async history(req,res){
    console.log("cek no hp");
    var database=req.query.database;



    
    
    let records;
  var emIdPegirim=req.query.em_id_pengirim;
  var emIdPenerima=req.query.em_id_penerima;

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
             
              var queryHistory=`SELECT * FROM messages WHERE (sender = '${emIdPegirim}' AND recipient = '${emIdPenerima}') OR (sender = '${emIdPenerima}' AND recipient = '${emIdPegirim}')`
               connection.query(queryHistory, (err, employee) => {
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






}

