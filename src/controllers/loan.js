const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");

var utility = require('../../src/utils/utility')

// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');

pool.on("error", (err) => {
  console.error(err);
});


module.exports = {

  async store(req, res) {

    var database = req.query.database;
    var tanggalPinjaman = req.body.tanggal_pinjaman;
    var totalPinjaman = req.body.total_pinjaman;
    var periode = req.body.periode;
    var ket = req.body.ket;

    var durasiCicil = req.body.durasi_cicil == undefined ? 0 : req.body.durasi_cicil;

    var tanggal = req.body.tanggal;
    var emId = req.body.em_id;

    var loanNumber = '';

    var tahun = tanggal.split('-')[0]
    console.log(req.body)
    var convertBulan = (tanggal.split('-')[1])


    var nomorDefaut = `LO${tahun}${convertBulan}`
    try {


      const connection = await model.createConnection(database);
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
          connection.query(`SELECT * FROM employee WHERE em_id='${emId}' `, (err, employee) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error inserting into table2:', err);
                connection.end(); // Close connection
              });
            }

            connection.query(`SELECT nomor_ajuan FROM emp_loan ORDER BY  nomor_ajuan DESC LIMIT 1 `, (err, data) => {
              if (err) {
                return connection.rollback(() => {
                  console.error('Error inserting into table2:', err);
                  connection.end(); // Close connection
                });
              }

              if (data.length > 0) {
                var text = data[0]['nomor_ajuan'];
                var nomor = parseInt(text.substring(8, 13)) + 1;
                var nomorStr = String(nomor).padStart(4, '0')
                nomorDefaut = nomorDefaut + nomorStr
              } else {
                var nomor = 1;
                var nomorStr = String(nomor).padStart(4, '0')
                nomorDefaut = nomorDefaut + nomorStr;
              }


              connection.query(`INSERT INTO emp_loan 
                (tgl_ajuan,em_id,total_loan,description,tgl_mulai_cicil,periode_mulai_cicil,nomor_ajuan,status_transaksi,status_pinjaman,branch_id,durasi_cicil,status,jml_cicil)               
                VALUES(CURDATE(),'${emId}', '${totalPinjaman}', '${ket}','${tanggalPinjaman}','${periode}','${nomorDefaut}',1,'Belum Lunas','${employee[0].branch_id}','${durasiCicil}','Pending','${durasiCicil}')`, (err, results) => {
                if (err) {
                  console.error('Error executing SELECT statement:', err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: 'Data gagal terkirim',
                      data: results

                    });
                  });
                  return;
                }
                connection.query(`SELECT * FROM emp_loan WHERE nomor_ajuan='${nomorDefaut}'`, (err, transaksi) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'Data gagal terkirim',
                        data: results

                      });
                    });
                    return;
                  }

                  connection.query(`SELECT * FROM employee WHERE em_id='${emId}'`, (err, employee) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'Data gagal terkirim',
                          data: results

                        });
                      });
                      return;
                    }
                    console.log(transaksi[0].tgl_ajuan)
                    var array = transaksi[0].tgl_ajuan.toString().split("-");

                    console.log('', array)
                    var tglAjuan = new Date();
                    const tahun = tglAjuan.getFullYear();

                    const convertYear = tahun.toString().substring(2, 4);
                    var convertBulan = tglAjuan.getMonth() + 1;
                    // if (array[1].length == 1) {
                    //   convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
                    // } else {
                    //   convertBulan = array[1];
                    // }

                    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
                    const databaseMaster = `${database}_hrm`

                    connection.query(`SELECT * FROM sysdata WHERE kode='019'`, (err, sysdata) => {
                      if (err) {
                        console.error('Error executing SELECT statement:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'Data gagal terkirim',
                            data: results

                          });
                        });
                        return;
                      }


                      var detailCicilan = req.body.cicilan;
                      {
                        for (var i = 0; i < detailCicilan.length; i++) {
                          var array = detailCicilan[i]['periode'].split('-')

                          var motnh = parseInt(array[1]);
                          var year = parseInt(array[0]);

                          var motnh1 = motnh.toString().padStart(2, '0')


                          var amount = detailCicilan[0]['total'];
                          periodeCicilan = `${year}-${motnh1}`
                          connection.query(`INSERT INTO emp_loan_installment(loan_id,description,ins_amount,status_payment,periode) VALUE ('${transaksi[0].id}','${transaksi[0].description}','${amount}','Belum Lunas','${periodeCicilan}')`, (err, results) => {
                            if (err) {
                              console.error('Error executing SELECT statement:', err);
                              connection.rollback(() => {
                                connection.end();
                                return res.status(400).send({
                                  status: true,
                                  message: 'Data gagal terkirim',
                                  data: results

                                });
                              });
                              return;
                            }
                          });



                        }

                      }

                      if (sysdata.length > 0) {
                        if (sysdata[0].name == null) {

                        } else {
                          utility.insertNotifikasi(sysdata[0].name, 'Mengajukan Kasbon', 'kasbon', employee[0].em_id, transaksi[0].id, transaksi[0].nomor_ajuan, employee[0].full_name, namaDatabaseDynamic, databaseMaster);


                        }

                      } else {

                      }

                      utility.insertNotifikasi(employee[0].em_report_to, 'Approval Kasbon', 'kasbon', employee[0].em_id, transaksi[0].id, transaksi[0].nomor_ajuan, employee[0].full_name, namaDatabaseDynamic, databaseMaster);


                      connection.commit((err) => {
                        if (err) {
                          console.error('Error committing transaction:', err);
                          connection.rollback(() => {
                            connection.end();
                            return res.status(400).send({
                              status: true,
                              message: 'Data gagal terkirim',
                              data: []

                            });
                          });
                          return;
                        }
                        connection.end();
                        console.log('Transaction completed successfully!');
                        return res.status(200).send({
                          status: true,
                          message: 'data berhasil terkirm',


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

    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }


  },

  async detailCicilan(req, res) {

    var database = req.query.database;
    var tanggalPinjaman = req.body.tanggal_pinjaman;
    var totalPinjaman = req.body.total_pinjaman;
    var periode = req.body.periode;
    var ket = req.body.ket;

    var durasiCicil = req.body.durasi_cicil == undefined ? 0 : req.body.durasi_cicil;


    var tanggal = req.body.tanggal;
    var emId = req.body.em_id;

    var loanNumber = '';
    // var array = req.body.tanggal.split("-");

    // const tahun = `${array[0]}`;

    // console.log(req.body)

    // const convertYear = tahun.substring(2, 4);
    // var convertBulan;
    // if (array[1].length == 1) {
    //   convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    // } else {
    //   convertBulan = array[1];
    // }

    // var id=req.body.id;

    // var nomorDefaut=`LO${tahun}${convertBulan}`
    try {


      const connection = await model.createConnection(database);
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


          var q = `SELECT  status_payment as status,ins_amount as amount,periode FROM emp_loan_installment WHERE loan_id='${req.body.id}'`
          console.log(q)
          connection.query(`${q}`, (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'Data gagal terkirim',
                  data: results

                });
              });
              return;
            }

            console.log(results)



            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: 'Data gagal terkirim',
                    data: []

                  });
                });
                return;
              }
              connection.end();
              console.log('Transaction completed successfully!');
              return res.status(200).send({
                status: true,
                message: 'Berhasil get data',
                data: results


              });


            });
          });
        });

      });

    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }
  },


  async update(req, res) {

    var database = req.query.database;
    var tanggalPinjaman = req.body.tanggal_pinjaman;
    var totalPinjaman = req.body.total_pinjaman;
    var periode = req.body.periode;
    var ket = req.body.ket;

    var durasiCicil = req.body.durasi_cicil == undefined ? 0 : req.body.durasi_cicil;


    var tanggal = req.body.tanggal;
    var emId = req.body.em_id;

    var loanNumber = '';
    var array = req.body.tanggal.split("-");

    const tahun = `${array[0]}`;

    console.log(req.body)

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (array[1].length == 1) {
      convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    } else {
      convertBulan = array[1];
    }

    var id = req.body.id;

    var nomorDefaut = `LO${tahun}${convertBulan}`
    try {


      const connection = await model.createConnection(database);
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


          var q = `Update emp_loan SET durasi_cicil='${durasiCicil}', total_loan='${totalPinjaman}',description='${ket}',tgl_mulai_cicil='${tanggalPinjaman}',periode_mulai_cicil='${periode}' WHERE id='${id}'`
          console.log(q)
          connection.query(`${q}`, (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'Data gagal terkirim',
                  data: results

                });
              });
              return;
            }
            connection.query(`DELETE FROM emp_loan_installment WHERE loan_id='${id}'`, (err, results) => {
              if (err) {
                console.error('Error executing SELECT statement:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: 'Data gagal terkirim',
                    data: results

                  });
                });
                return;
              }


              var detailCicilan = req.body.cicilan;
              {
                for (var i = 0; i < detailCicilan.length; i++) {
                  var array = detailCicilan[i]['periode'].split('-')

                  var motnh = parseInt(array[1]);
                  var year = parseInt(array[0]);

                  var motnh1 = motnh.toString().padStart(2, '0')


                  var amount = detailCicilan[0]['total'];
                  periodeCicilan = `${year}-${motnh1}`
                  connection.query(`INSERT INTO emp_loan_installment(loan_id,description,ins_amount,status_payment,periode) VALUE ('${id}','${ket}','${amount}','Belum Lunas','${periodeCicilan}')`, (err, results) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'Data gagal terkirim',
                          data: results

                        });
                      });
                      return;
                    }
                  });



                }

              }


              connection.commit((err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: 'Data gagal terkirim',
                      data: []

                    });
                  });
                  return;
                }
                connection.end();
                console.log('Transaction completed successfully!');
                return res.status(200).send({
                  status: true,
                  message: 'data berhasil terkirm',


                });

              });


            });
          });
        });

      });

    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }
  },

  async destroy(req, res) {

    var database = req.query.database;
    var tanggalPinjaman = req.body.tanggal_pinjaman;
    var totalPinjaman = req.body.total_pinjaman;
    var periode = req.body.periode;
    var ket = req.body.ket;
    var id = req.body.id;

    var ket = req.body.durasi_cicil == undefined ? 0 : req.body.durasi_cicil;

    var tanggal = req.body.tanggal;
    var emId = req.body.em_id;

    var loanNumber = '';
    // var array = req.body.tanggal.split("-");

    // const tahun = `${array[0]}`;

    // const convertYear = tahun.substring(2, 4);
    // var convertBulan;
    // if (array[1].length == 1) {
    //   convertBulan = array[1] <= 9 ? `0${array[1]}` : array[1];
    // } else {
    //   convertBulan = array[1];
    // }

    // var nomorDefaut=`LO${tahun}${convertBulan}`
    try {


      const connection = await model.createConnection(database);
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



          connection.query(`UPDATE emp_loan SET status_transaksi=0 WHERE id='${id


            }'  `, (err, results) => {
              if (err) {
                console.error('Error executing SELECT statement:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: 'Data gagal terkirim',
                    data: results

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
                      data: []

                    });
                  });
                  return;
                }
                connection.end();
                console.log('Transaction completed successfully!');
                return res.status(200).send({
                  status: true,
                  message: 'data berhasil terkirm',


                });


              });
            });
        });

      });

    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }



  },






  async index(req, res) {
    var database = req.query.database;
    var emId = req.body.em_id;
    var description='';
    try {
      const connection = await model.createConnection(database);
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
          connection.query(`SELECT approve_by, emp_loan.jml_cicil as durasi_cicil,emp_loan.id, status, nomor_ajuan as nomor,tgl_ajuan as tanggal_ajuan,em_id,description,total_loan,periode_mulai_cicil as periode,tgl_mulai_cicil as tanggal_pinjaman
                 FROM emp_loan WHERE status_transaksi=1 AND em_id='${emId}'`, (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'Data gagal terkirim',
                });
              });
              return;
            }
            connection.query(`SELECT nomor_ajuan,emp_loan.status FROM emp_loan LEFT JOIN emp_loan_installment ON emp_loan.id=emp_loan_installment.loan_id WHERE emp_loan.status_transaksi=1 AND 
            emp_loan_installment.status_payment='Belum Lunas' AND em_id='${emId}' GROUP BY emp_loan.nomor_ajuan ORDER BY emp_loan.status ASC
            
            `, (err, loan) => {
       if (err) {
         console.error('Error executing SELECT statement:', err);
         connection.rollback(() => {
           connection.end();
           return res.status(400).send({
             status: true,
             message: 'Data gagal terkirim',
           });
         });
         return;
       }

       if (loan.length>0){
        if (loan[0]['status']=="Pending"){
          description="Anda tidak bisa mengajukan kasbon, karna anda mempuyai pengajuan dengan status pending"
        }
        if (loan[0]['status']=="Approve"){
          description=`Anda tidak bisa mengajukan kasbon, Pengajuan anda dengan nomor ajuan ${loan[0]['nomor_ajuan']} belum lunas!`
        }
       }
            connection.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: 'Data gagal terkirim',
                    data: []

                  });
                });
                return;
              }
              connection.end();
              console.log('Transaction completed successfully!');
              return res.status(200).send({
                status: true,
                message: 'data berhasil terkirm',
                data: results,
            description:description

              });
                });
              


            });
            
          });
        });
      });
  


    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }
  },



  async indexw(req, res) {
    var database = req.query.database;
    var emId = req.body.em_id;

    try {
      const connection = await model.createConnection(database);
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
          connection.query(`SELECT nomor_ajuan as nomor,tgl_ajuan as tanggal_ajuan,em_id,description,total_loan,periode_mulai_cicil as periode,tgl_ajuan as tanggal_pinjaman
                 FROM emp_loan`, (err, results) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'Data gagal terkirim',
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
                    data: []

                  });
                });
                return;

              }
              connection.end();
              console.log('Transaction completed successfully!');
              return res.status(200).send({
                status: true,
                message: 'data berhasil terkirm',
                data: results

              });


            });
          });
        });
      });


    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }
  },




  async approval(req, res) {

    var database = req.query.database;
    var nomor = req.body.nomor_ajuan;
    var tanggal = req.body.tanggal;
    var emid = req.body.em_id;
    var status = req.body.status
    console.log(req.body)
    var databaseMaster = `${database}_hrm`


    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let convertBulan = month < 9 ? '0' + month : month;

    const namaDatabaseDynamic = `${database}_hrm${year.toString().substring(year.toString().length - 2)}${month.toString().padStart(2, '0')}`

    var durasi=req.body.durasi;




    try {
      const connection = await model.createConnection(database);
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
          connection.query(`SELECT * FROM  employee WHERE em_id='${emid}'`, (err, employee) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'Data gagal terkirim',
                  data: results

                });
              });
              return;
            }

            var query = `UPDATE emp_loan SET approve_date='${tanggal}' ,approve_id='${emid}',approve_by='${employee[0].full_name}',status='${status}',approve_date=CURDATE() WHERE nomor_ajuan='${nomor}'`
            console.log('employee ', query)
            connection.query(query, (err, results) => {
              if (err) {
                console.error('Error executing SELECT statement:', err);
                connection.rollback(() => {
                  connection.end();
                  return res.status(400).send({
                    status: true,
                    message: 'Data gagal terkirim',


                  });
                });
                return;
              }


              connection.query(`SELECT * FROM emp_loan WHERE nomor_ajuan='${nomor}'`, (err, results) => {
                if (err) {
                  console.error('Error executing SELECT statement:', err);
                  connection.rollback(() => {
                    connection.end();
                    return res.status(400).send({
                      status: true,
                      message: 'Data gagal terkirim',
                      data: results

                    });
                  });
                  return;
                }
                console.log(results)
                if (results.length == 0) {
                  return res.status(400).send({
                    status: true,
                    message: 'Data tidak tersedia',
                    data: []

                  });

                }

                var amount = parseFloat(results[0].total_loan) / parseFloat(results[0].durasi_cicil);
                console.log("amount ", amount)


                var array = results[0].periode_mulai_cicil.split('-');
                var motnh = parseInt(array[1]);
                var year = parseInt(array[0]);
                console.log(motnh)

                // if (status=="Approve" || status=="Approved")
                // {
                //   for (var i=0;i<parseInt(results[0].durasi_cicil);i++){
                //     var motnh1=motnh.toString().padStart(2, '0')

                //     console.log
                //     var periodeCicilan=`${year}-${motnh1}`

                //       connection.query(`INSERT INTO emp_loan_installment(loan_id,description,ins_amount,status_payment,periode) VALUE ('${results[0].id}','${results[0].description}','${amount}','Belum Lunas','${periodeCicilan}')`, (err, results) => {
                //           if (err) {
                //             console.error('Error executing SELECT statement:', err);
                //             connection.rollback(() => {
                //               connection.end();
                //               return res.status(400).send({
                //                 status: true,
                //                 message: 'Data gagal terkirim',
                //                 data:results

                //               });
                //             });
                //             return;
                //           }
                //       });

                //       if (parseFloat(motnh)>=12){
                //         year=year+1
                //         motnh=1;

                //       }else{
                //         motnh=parseInt(1)+1;
                //       }

                //   }

                // }

                connection.query(`SELECT IFNULL(name,'') as name FROM ${database}_hrm.sysdata WHERE KODE IN ('022','023','013')`, (err, sysdata) => {
                  if (err) {
                    console.error('Error executing SELECT statement:', err);
                    connection.rollback(() => {
                      connection.end();
                      return res.status(400).send({
                        status: true,
                        message: 'Data gagal terkirim',
                        data: results

                      });
                    });
                    return;
                  }
                  connection.query(`SELECT * FROM employee WHERE em_id='${results[0].em_id}'`, (err, user) => {
                    if (err) {
                      console.error('Error executing SELECT statement:', err);
                      connection.rollback(() => {
                        connection.end();
                        return res.status(400).send({
                          status: true,
                          message: 'gaga ambil data',
                          data: []

                        });
                      });
                      return;
                    }

                    var namaTransaksi = 'Kasbon'
                    var urlTransaksi = 'kasbon'
                    var title = ''
                    var title = `Approval ${namaTransaksi}`
                    var deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${user[0].full_name} - ${user[0].em_id} dengan nomor ajuan  telah di ${status} oleh ${employee[0].full_name}`


                    //keti approve
                    if (status == 'Approve' || status == 'Approve') {

                      var listData = sysdata[2].name.toString().split(',')


                      for (var i = 0; i < listData.length; i++) {

                        if (listData[i] != '') {


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
                                    data: []

                                  });
                                });
                                return;
                              }

                              connection.query(
                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),1,0,'${user[0].em_id}','${results[0].id}')`,


                                (err, results) => {
                                  if (err) {
                                    console.error('Error executing SELECT statement:', err);
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: 'gaga ambil data',
                                        data: []

                                      });
                                    });
                                    return;
                                  }

                                  utility.notifikasi(employee[0].token_notif, title, deskripsi)
                                });
                            });



                        }

                      }



                      //jika approve
                    }
                    //ketika rejected
                    if (status == 'Rejected' || status == 'Rejected') {
                      console.log("Masuk reject query")
                      var listData = sysdata[1].name.toString().split(',')

                      for (var i = 0; i < listData.length; i++) {
                        console.log("Masuk reject query 1")
                        console.log(namaTransaksi)



                        if (listData[i] != '') {
                          title = `Rejection ${namaTransaksi}`
                          deskripsi = `Notifikasi Pengajuan ${namaTransaksi}  dari ${employee[0].full_name} - ${employee[0].em_id} dengan nomor ajuan  telah di Tolak oleh ${employeeApproved[0].full_name}`

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
                                    data: []

                                  });
                                });
                                return;
                              }
                              connection.query(
                                `INSERT INTO ${namaDatabaseDynamic}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx) VALUES ('${employee[0].em_id}','${title}','${deskripsi}','${urlTransaksi}',CURDATE(),CURTIME(),0 ,0,'${user[0].em_id}','${results[0].id}')`,
                                (err, results) => {
                                  if (err) {
                                    console.error('Error executing SELECT statement:', err);
                                    connection.rollback(() => {
                                      connection.end();
                                      return res.status(400).send({
                                        status: true,
                                        message: 'gaga ambil data',
                                        data: []

                                      });
                                    });
                                    return;
                                  }
                                });


                              utility.notifikasi(employee[0].token_notif, title, deskripsi)
                            });



                        }

                      }


                      //jika approve

                    }



                    connection.commit((err) => {
                      if (err) {
                        console.error('Error committing transaction:', err);
                        connection.rollback(() => {
                          connection.end();
                          return res.status(400).send({
                            status: true,
                            message: 'Data gagal terkirim',
                            data: []

                          });
                        });
                        return;
                      }
                      connection.end();
                      console.log('Transaction completed successfully!');
                      return res.status(200).send({
                        status: true,
                        message: 'data berhasil terkirm',


                      });
                    });


                  });
                });
              });
            });
          });
        });
      });



    } catch ($e) {
      return res.status(400).send({
        status: true,
        message: 'Gagal ambil data',
        data: []

      });

    }
  },


}

