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
const configSftp = {
  host: 'imagehris.siscom.id',
  port: 3322, // Default SFTP port is 22
  username: 'siscom',
  password: 'siscom!@#$%'
};
module.exports = { 
  async store(req,res){
    console.log("cek no hp");
    var database=req.query.database;
    var email=req.query.email;
    var nomorAjuan=req.body.nomor_ajuan;
    
    let records;
console.log('data',req.body)

var emIdSender=req.body.em_id_pengirim
var emIdPeneriman=req.body.em_id_penerima
var message=req.body.pesan
var images=req.body.images
var tanggal=req.body.tanggal;
var waktu=req.body.waktu;
var type=req.body.type
var nameFile=''
let ts = Date.now();
let date_ob = new Date(ts);
let date = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hour = date_ob.getHours();
let menit = date_ob.getMinutes();
if (type=='.png' || type=='.jpg' || type=='.jpeg'){

  var randomstring = require("randomstring"); 
  var image = req.body.lampiran;
  var bitmap = Buffer.from(image, 'base64');
  var stringRandom = randomstring.generate(5);
  var nameFile = stringRandom + date + month + year + hour + menit + type;
 
  const remoteFilePath = `${remoteDirectory}/${database}/chat/${nameFile}`;
  sftp.connect(configSftp)
 .then(() => {
   // SFTP connection successful
   return sftp.put(bitmap, remoteFilePath);
 })
 .then(() => {
   console.log("berhasil upload image")
   
   sftp.end(); // Disconnect after the upload is complete
 })
 .catch(err => {
   console.log(`gagal upload image ${err}`)
   sftp.end(); // Disconnect if an error occurs
  return res.status(400).send({
     status: false,
     message: "Gagal registrasi wajah",
   });
 
 });

 sftp.end();


}

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
              var queryUpdate=`INSERT INTO ${database}_hrm.emp_chat (em_id_penerima,em_id_pengirim,pesan,tanggal,waktu,tipe_lampiran,lampiran) VALUES
               ('${emIdPeneriman}','${emIdSender}','${message}','${tanggal}','${waktu}','${type}','${nameFile}')`
               connection.query(`SELECT * FROM  ${database}_hrm.employee WHERE em_id='${emIdPeneriman}'`, (err, employee) => {
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
                      if (employee.length>0){

                        var title=employee[0].full_name
          
                        utility.notifikasiChat(employee[0].token_notif,title,message,emIdSender,emIdPeneriman,employee[0].em_image,employee[0].job_title)
                      }
                      
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: "Berhasil kirim chat",
                        data:results
                      
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

  async storeBulk(req,res){
    console.log("cek no hp");
    var database=req.query.database;
    var email=req.query.email;
    var nomorAjuan=req.body.nomor_ajuan;
    
    let records;


var bullk=req.body.data;
console.log(bullk)



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
              var queryUpdate=`INSERT INTO ${database}_hrm.emp_chat (em_id_penerima,em_id_pengirim,message,tanggal,waktu) VALUES
               ?`
                connection.query( queryUpdate,[bullk],(err, results) => {
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




  async history(req,res){
    console.log("cek no hp");
    var database=req.query.database;

    
    let records;

var emIdPegirim=req.query.em_id_pengirim;
var emIdPenerima=req.query.em_id_penerima;

console.log(req.query)

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
             
              var queryHistory=`SELECT *,'mesasge' as type FROM emp_chat WHERE (em_id_pengirim = '${emIdPegirim}' AND em_id_penerima = '${emIdPenerima}') OR (em_id_pengirim = '${emIdPenerima}' AND em_id_penerima= '${emIdPegirim}')`
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
                     
                        data:employee
                      
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


  async updateStatus(req,res){
  console.log("tes")

    var emIdPengirim=req.query.em_id_pengirim
    var emIdPenerima=req.query.em_id_penerima
    var  database=req.query.database
    
    
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
                 
                  var update=`UPDATE ${database}_hrm.emp_chat SET dibaca=1  WHERE (em_id_penerima = '${emIdPengirim}' AND em_id_pengirim = '${emIdPenerima}')`


                  console.log(update)
                  
                  console.log(update)
                  connection.query(update, (err, employee) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: false,
                          message: 'gagal am',
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
                            message: "berhasil update data",
                           
                          
                          });
                      
                      });
                   
                  });
                });
              });
              
          }catch(e){
            return res.status(400).send({
              status: true,
              message: 'Gagal ambil data' +e,
              data:[]
            
            });
      
          }
    
      },

      
      async employee(req,res){
        console.log("tes")
        
            var emId=req.query.em_id
      
            var  database=req.query.database
    
            var search=req.query.search==undefined?"":req.query.search
    
            
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
    
                          if (search=='' || search==undefined || search==null){
    
                            selectData=`SELECT * FROM  employee WHERE full_name LIKE '%${search}%'`;
                            //  selectData=`  SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_pengirim=employee.em_id AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira,MAX(em_id_penerima) AS em_id_penerima,MAX(em_id_pengirim) AS em_id_pengirim FROM  emp_chat JOIN employee ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' GROUP BY employee.em_id`
                           
            
                           }else{
                            selectData=`SELECT * FROM  employee WHERE full_name LIKE '%${search}%'`;
                            
            
                           }
                         
                          // if (search=='' || search==undefined || search==null){
                          //   selectData=`  SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_pengirim=employee AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira FROM  emp_chat JOIN employee ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' GROUP BY employee.em_id`
                          
    
                          // }else{
                          //   selectData=` SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_penerima=employee.em_id AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira FROM  employee LEFT JOIN emp_chat ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' AND (employee.full_name LIKE '%${search}%' || employee.job_title LIKE '%${search}%' || employee.em_id LIKE '%${search}%') GROUP BY employee.em_id `
    
    
                          // }
                         
                          console.log(req.query)
                         console.log(selectData)
                          connection.query(selectData, (err, employee) => {
                            if (err) {
                              console.error('Error executing SELECT statement:', err);
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: false,
                                  message: 'gagal am',
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
                                  return res.status(200).send(employee);
                              
                              });
                           
                          });
                        });
                      });
                      
                  }catch(e){
                    return res.status(400).send({
                      status: true,
                      message: 'Gagal ambil data' +e,
                      data:[]
                    
                    });
              
                  }
            
              },
    
    
      
  async historyChat(req,res){
   
    
        var emId=req.query.em_id
  
        var  database=req.query.database

        var search=req.query.search==undefined?"":req.query.search

        
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

                      if (search=='' || search==undefined || search==null){

                        selectData=`SELECT 
                        employee.job_title as job_title,
                        (SELECT COUNT(*) FROM emp_chat AS e  WHERE e.em_id_penerima='${emId}' AND e.dibaca=0 AND em_id=e.em_id_pengirim) AS jumlah,
                        employee.full_name,employee.em_id,MAX(emp_chat.id ) AS pesan_id,
                        (SELECT e.pesan FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS pesan,
                        (SELECT e.tipe_lampiran FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS tipe_lampiran,
                        (SELECT e.lampiran FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS lampiran,
                        (SELECT e.tanggal FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS tanggal,
                        (SELECT e.em_id_pengirim FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS em_id_pengirim,
                        (SELECT e.em_id_penerima FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS em_id_penerima,
                        (SELECT e.dibaca FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS dibaca,
                        (SELECT e.status FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS status,
                        (SELECT e.waktu FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS waktu FROM emp_chat  JOIN employee ON (em_id=em_id_pengirim OR em_id=em_id_penerima) WHERE (em_id_pengirim='${emId}' OR em_id_penerima='${emId}') AND employee.em_id!='${emId}'  AND employee.full_name LIKE '%${search}%'   GROUP BY employee.full_name ORDER BY MAX (emp_chat.id )DESC;
                        `
                        //  selectData=`  SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_pengirim=employee.em_id AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira,MAX(em_id_penerima) AS em_id_penerima,MAX(em_id_pengirim) AS em_id_pengirim FROM  emp_chat JOIN employee ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' GROUP BY employee.em_id`
                       
        
                       }else{
                        selectData=`SELECT 
                        employee.job_title as job_title,
                        (SELECT COUNT(*) FROM emp_chat AS e  WHERE e.em_id_penerima='${emId}' AND e.dibaca=0 AND em_id=e.em_id_pengirim) AS jumlah,
                        employee.full_name,employee.em_id,MAX(emp_chat.id ) AS pesan_id,
                        (SELECT e.pesan FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS pesan,
                        (SELECT e.tipe_lampiran FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS tipe_lampiran,
                        (SELECT e.lampiran FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS lampiran,
                        (SELECT e.tanggal FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS tanggal,
                        (SELECT e.em_id_pengirim FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS em_id_pengirim,
                        (SELECT e.em_id_penerima FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS em_id_penerima,
                        (SELECT e.dibaca FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS dibaca,
                        (SELECT e.status FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS status,
                        (SELECT e.waktu FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS waktu FROM emp_chat  JOIN employee ON (em_id=em_id_pengirim OR em_id=em_id_penerima) WHERE (em_id_pengirim='${emId}' OR em_id_penerima='${emId}') AND employee.em_id!='${emId}'  AND employee.full_name LIKE '%${search}%'  GROUP BY employee.full_name ORDER BY  MAX (emp_chat.id ) DESC;
                        `
        
                       }
                     
                      // if (search=='' || search==undefined || search==null){
                      //   selectData=`  SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_pengirim=employee AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira FROM  emp_chat JOIN employee ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' GROUP BY employee.em_id`
                      

                      // }else{
                      //   selectData=` SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_penerima=employee.em_id AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira FROM  employee LEFT JOIN emp_chat ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' AND (employee.full_name LIKE '%${search}%' || employee.job_title LIKE '%${search}%' || employee.em_id LIKE '%${search}%') GROUP BY employee.em_id `


                      // }
                     
                     
                      connection.query(selectData, (err, employee) => {
                        if (err) {
                          console.error('Error executing SELECT statement:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: false,
                              message: 'gagal am',
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
                              return res.status(200).send(employee);
                          
                          });
                       
                      });
                    });
                  });
                  
              }catch(e){
                return res.status(400).send({
                  status: true,
                  message: 'Gagal ambil data' +e,
                  data:[]
                
                });
          
              }
        
          },


          
      
  async countChat(req,res){
    console.log("tes")
    
        var emId=req.query.em_id
  
        var  database=req.query.database

        
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
                     
                      var selectData=`SELECT COUNT(*) AS total  FROM  ${database}_hrm.emp_chat WHERE dibaca='0' AND em_id_penerima='${emId}'`

                      console.log(selectData)
                      
                     
                      connection.query(selectData, (err, employee) => {
                        if (err) {
                          console.error('Error executing SELECT statement:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: false,
                              message: 'gagal mengambil data',
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
                                      message: "gagal mengambil data",
                                     
                                  
                                  });
                                });
                                return;
                              }
                            
                  
                     
                              connection.end();
                              console.log('Transaction completed successfully!');
                              return res.status(200).send({
                                status: true,
                                message: "Sucessfuly get data",
                                total:employee[0].total
                               
                              
                              });
                          
                          });
                       
                      });
                    });
                  });
                  
              }catch(e){
                return res.status(400).send({
                  status: true,
                  message: 'Gagal ambil data' +e,
                  data:[]
                
                });
          
              }
        
          },




                
  async deleteMessage(req,res){
    console.log("tes")
        var id=req.body.id;
        var  database=req.query.database
        var search=req.query.search==undefined?"":req.query.search
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
                    var queryDelete=`UPDATE ${database}_hrm.emp_chat  SET status=0  WHERE id='${id}'`
                     
                  
                      connection.query(queryDelete, (err, employee) => {
                        if (err) {
                          console.error('Error executing SELECT statement:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: false,
                              message: 'gagal am',
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
                                message: "Successfuly Hapus data",
                            
                               
                              
                              });
                          
                          });
                       
                      });
                    });
                  });
                  
              }catch(e){
                return res.status(400).send({
                  status: true,
                  message: 'Gagal ambil data' +e,
                  data:[]
                
                });
          
              }
        
          },



}

