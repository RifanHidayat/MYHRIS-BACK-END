const fcm = require("fcm-notification");
const FCM = new fcm("./keyprivate.json");
const crypto = require("crypto");

//prod
require("dotenv").config();

var ipServer = process.env.API_URL;
const mysql = require("mysql");

const model = require("./models");
module.exports = {
  ipServerHris() {
    return "myhrisdev.siscom.id";
  },

  decryptText(textToDecrypt, key) {
    const ciphering = "aes-256-cbc";
    // The initialization vector (must match the one used during encryption)
    const decryptionIv = Buffer.from("1983759874219020", "utf-8");
    // Ensure the key is of length 32 (256 bits for AES-256)
    const decryptionKey = Buffer.from(key, "utf-8");
    // Decoding the text from base64 (assuming the encrypted text is base64-encoded)
    const encryptedText = Buffer.from(textToDecrypt, "base64");
    // Create the decipher object
    const decipher = crypto.createDecipheriv(
      ciphering,
      decryptionKey,
      decryptionIv
    );
    let decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    // Return the decrypted text as a string
    return decrypted.toString("utf-8");
  },
  dateConvert(ts) {
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let convertBulan = month < 9 ? "0" + month : month;
    //  const tanggal = `${date} + '-' + ${convertBulan} + '-' + ${year};`
    const tanggal = `${year}-${convertBulan
      .toString()
      .padStart(2, "0")}-${date}`;
    return tanggal;
  },

  mounthNow() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let month = date_ob.getMonth() + 1;
    let convertBulan = month < 9 ? "0" + month : month;
    const tanggal = `${convertBulan}`;
    return tanggal;
  },

  dateNow1() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hour = date_ob.getHours();
    let menit = date_ob.getMinutes();
    const tanggal = `${date} +  ${month}  +  ${year} +  ${hour} +  ${menit}`;
    return tanggal;
  },
  //   dateNow2() {
  //   let ts = Date.now();
  //   let date_ob = new Date(ts);
  //   let date = date_ob.getDate();
  //   let month = date_ob.getMonth() + 1;
  //   let year = date_ob.getFullYear();
  //   let convertBulan =  month < 9 ? '0'+month : month;
  // //  const tanggal = `${date} + '-' + ${convertBulan} + '-' + ${year};`
  // const tanggal = `${date}-${convertBulan.toString().padStart(2, '0')  }-${year}`
  // return tanggal;
  // },
  dateNow2() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let convertBulan = month < 9 ? "0" + month : month;
    //  const tanggal = `${date} + '-' + ${convertBulan} + '-' + ${year};`
    const tanggal = `${year}-${convertBulan.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
    return tanggal;
  },
  addDate(date1, days) {
    const date_ob = new Date(date1);
    date_ob.setDate(date_ob.getDate() + days);
    // let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let convertBulan = month < 9 ? "0" + month : month;
    //  const tanggal = `${date} + '-' + ${convertBulan} + '-' + ${year};`
    const tanggal = `${year}-${convertBulan.toString().padStart(2, "0")}-${date
      .toString()
      .padStart(2, "0")}`;
    console.log(tanggal);
    return tanggal;
  },

  dateNow3() {
    return tanggal;
  },
  dateNow4() {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let convertBulan = month < 9 ? "0" + month : month;
    //  const tanggal = `${date} + '-' + ${convertBulan} + '-' + ${year};`
    const tanggal = `${year}-${convertBulan
      .toString()
      .padStart(2, "0")}-${date}`;
    return tanggal;
  },
  dateNow3() {
    return tanggal;
  },

  time(i) {
    let ts = Date.now();
    let date_ob = new Date(ts);

    let hour = date_ob.getHours() + i;
    let menit = date_ob.getMinutes().toString().padStart(2, "0");
    var second = date_ob.getSeconds().toString().padStart(2, "0");
    const tanggal = `${hour}:${menit}:${second}`;
    return tanggal;
  },

  notifikasi(token, titile, message) {
    var token = `${token}`;
    var title = `${titile}`;
    var message = message;

    var message = {
      data: {
        route: "Pesan",
      },
      notification: {
        title: `${title}`,
        body: `${message}`,
      },
      token: token,
    };

    console.log("ini message notif", message);

    FCM.send(message, function (err, response) {
      if (err) {
        console.log("error found notif", err);
      } else {
        console.log("response here notif", response);
      }
    });
  },

  notifikasiWeb(token, titile, message, req, res) {
    var tokens = `${token}`.split(",");
    var title = `${titile}`;
    var pesan = message;
    console.log(message);

    tokens.forEach(function (number) {
      var message = {
        data: {
          route: "Pesan",
        },
        notification: {
          title: `${title}`,
          body: `${pesan}`,
        },
        // token: token
        token: number,
      };

      FCM.send(message, function (err, response) {
        if (err) {
          console.log("error found notif", err);
          // res.status(400).send({
          //   status: true,
          //   message: "gagal kirim notif !",
          // });
        } else {
          // console.log('response here notif', response);
          // res.status(200).send({
          //   status: true,
          //   message: "Berhasil kirim notif !",
          // });
        }
      });

      res.status(200).send({
        status: true,
        message: "Berhasil kirim notif !",
      });
    });

    console.log(tokens);
  },

  pushNotifikasiApproval(token, titile, message, url, emIdPengajuan, idx) {
    var token = `${token}`;
    var title = `${titile}`;
    var message = message;

    var message = {
      data: {
        route: url,
        em_id_pengajuan: emIdPengajuan,
        idx: idx.toString(),
      },
      notification: {
        title: `${title}`,
        body: `${message}`,
      },
      token: token,
    };

    FCM.send(message, function (err, response) {
      if (err) {
        console.log("error found notif", err);
      } else {
        console.log("response here notif", response);
      }
    });
  },

  async insertNotifikasi(
    emIds,
    title,
    url,
    emIdPengajuan,
    idx,
    nomorAjuan,
    namaPegajuan,
    databasePeriode,
    databseMaster
  ) {
    function pushNotifikasiApproval(
      token,
      titile,
      message,
      url,
      emIdPengajuan,
      idx,
      nomorAjuan
    ) {
      if (token == "" || token == null) {
      } else {
        var token = `${token}`;
        var title = `${titile}`;
        var message = message;
        var nomorAjuan = nomorAjuan;

        var message = {
          data: {
            route: url,
            em_id_pengajuan: emIdPengajuan,
            idx: idx.toString(),
          },

          notification: {
            title: `${title}`,
            body: `${message}`,
          },
          token: token,
        };

        console.log(message);

        FCM.send(message, function (err, response) {
          if (err) {
            console.log("error found notif", err);
          } else {
            console.log("response here notif", response);
          }
        });
      }
    }

    console.log("masuk ke funcsi notifikasi ", databasePeriode);
    console.log("emids ", emIds);

    var listData = emIds.toString().split(",");

    try {
      const connection = await model.createConnection1(databseMaster);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }
          console.log("masuk sini new");
          for (var i = 0; i < listData.length; i++) {
            if (listData[i] == "" || listData[i] == null) {
            } else {
              console.log("masuk sini");

              var queryEmployee = `SELECT * FROM ${databseMaster}.employee WHERE em_id='${listData[i]}'`;

              connection.query(queryEmployee, (err, e) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    // return res.status(400).send({
                    //   status: true,
                    //   message: 'Data gagal terkirim',
                    //   data:results

                    // });
                  });
                  return;
                }
                // var deskripsi=`Hello ${e[0].em_gender=='PRIA'?"Bapak":e[0].em_gender=='Wanita'?'Ibu':""} ,${e[0].full_name}, Saya ${namaPegajuan} - ${emIdPengajuan} mengajukan ${url=="TugasLuar"?"Tugas Luar":url} dengan nomor ajuan ${nomorAjuan}`
                var deskripsi = `${namaPegajuan} mengajukan ${
                  url == "TugasLuar" ? "Tugas Luar" : url
                } dengan nomor  ${nomorAjuan}`;

                var query = `INSERT INTO ${databasePeriode}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx)
                 VALUES ('${e[0].em_id}','${title}','${deskripsi}','${url}',CURDATE(),CURTIME(),2,0,'${emIdPengajuan}','${idx}')`;
                console.log(query);
                connection.query(query, (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      // return res.status(400).send({
                      //   status: true,
                      //   message: 'Data gagal terkirim',
                      //   data:results

                      // });
                    });
                    return;
                  }
                  pushNotifikasiApproval(
                    e[0].token_notif,
                    title,
                    deskripsi,
                    url,
                    emIdPengajuan,
                    idx
                  );
                });
              });
            }
          }

          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                // return res.status(400).send({
                //   status: true,
                //   message: 'Data gagal terkirim',
                //   data:[]

                // });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            // return res.status(200).send({
            //   status: true,
            //   message: 'data berhasil terkirm',

            // });
          });
        });
      });
    } catch (e) {}
  },

  async insertNotifikasiGlobal(
    emIds,
    title,
    url,
    emIdPengajuan,
    idx,
    nomorAjuan,
    namaPegajuan,
    databasePeriode,
    databseMaster,
    description
  ) {
    function pushNotifikasiApprovalGlobal(
      token,
      titile,
      message,
      url,
      emIdPengajuan,
      idx,
      nomorAjuan
    ) {
      if (token == "" || token == null) {
      } else {
        var token = `${token}`;
        var title = `${titile}`;
        var message = message;
        var nomorAjuan = nomorAjuan;

        var message = {
          data: {
            route: url,
            em_id_pengajuan: emIdPengajuan,
            idx: idx.toString(),
          },

          notification: {
            title: `${title}`,
            body: `${message}`,
          },
          token: token,
        };

        console.log(message);

        FCM.send(message, function (err, response) {
          if (err) {
            console.log("error found notif", err);
          } else {
            console.log("response here notif", response);
          }
        });
      }
    }

    console.log("masuk ke funcsi notifikasi ", databasePeriode);
    console.log("emids ", emIds);

    var listData = emIds.toString().split(",");

    try {
      const connection = await model.createConnection1(databseMaster);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }
          console.log("masuk sini new");
          for (var i = 0; i < listData.length; i++) {
            if (listData[i] == "" || listData[i] == null) {
            } else {
              console.log("masuk sini");

              var queryEmployee = `SELECT * FROM ${databseMaster}.employee WHERE em_id='${listData[i]}'`;

              connection.query(queryEmployee, (err, e) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    // return res.status(400).send({
                    //   status: true,
                    //   message: 'Data gagal terkirim',
                    //   data:results

                    // });
                  });
                  return;
                }
                // var deskripsi=`Hello ${e[0].em_gender=='PRIA'?"Bapak":e[0].em_gender=='Wanita'?'Ibu':""} ,${e[0].full_name}, Saya ${namaPegajuan} - ${emIdPengajuan} mengajukan ${url=="TugasLuar"?"Tugas Luar":url} dengan nomor ajuan ${nomorAjuan}`
                var query = `INSERT INTO ${databasePeriode}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx)
                  VALUES ('${e[0].em_id}','${title}','${description}','${url}',CURDATE(),CURTIME(),2,0,'${emIdPengajuan}','${idx}')`;
                console.log(query);
                connection.query(query, (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      // return res.status(400).send({
                      //   status: true,
                      //   message: 'Data gagal terkirim',
                      //   data:results

                      // });
                    });
                    return;
                  }
                  pushNotifikasiApprovalGlobal(
                    e[0].token_notif,
                    title,
                    description,
                    url,
                    emIdPengajuan,
                    idx
                  );
                });
              });
            }
          }

          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                // return res.status(400).send({
                //   status: true,
                //   message: 'Data gagal terkirim',
                //   data:[]

                // });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            // return res.status(200).send({
            //   status: true,
            //   message: 'data berhasil terkirm',

            // });
          });
        });
      });
    } catch (e) {}
  },

  async insertNotifikasiApproval(
    emIds,
    title,
    url,
    emIdPengajuan,
    idx,
    nomorAjuan,
    namaPegajuan,
    databasePeriode,
    databseMaster
  ) {
    function pushNotifikasiApproval(
      token,
      titile,
      message,
      url,
      emIdPengajuan,
      idx,
      nomorAjuan
    ) {
      if (token == "" || token == null) {
      } else {
        var token = `${token}`;
        var title = `${titile}`;
        var message = message;
        var nomorAjuan = nomorAjuan;

        var message = {
          data: {
            route: url,
            em_id_pengajuan: emIdPengajuan,
            idx: idx.toString(),
          },

          notification: {
            title: `${title}`,
            body: `${message}`,
          },
          token: token,
        };

        console.log(message);

        FCM.send(message, function (err, response) {
          if (err) {
            console.log("error found notif", err);
          } else {
            console.log("response here notif", response);
          }
        });
      }
    }

    console.log("masuk ke funcsi notifikasi ", databasePeriode);
    console.log("emids ", emIds);

    var listData = emIds.toString().split(",");

    try {
      const connection = await model.createConnection1(databseMaster);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }
          console.log("masuk sini new");
          for (var i = 0; i < listData.length; i++) {
            if (listData[i] == "" || listData[i] == null) {
            } else {
              console.log("masuk sini");

              var queryEmployee = `SELECT * FROM ${databseMaster}.employee WHERE em_id='${listData[i]}'`;

              connection.query(queryEmployee, (err, e) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    // return res.status(400).send({
                    //   status: true,
                    //   message: 'Data gagal terkirim',
                    //   data:results

                    // });
                  });
                  return;
                }
                var deskripsi = `${e[0].full_name} mengajukan ${
                  url == "TugasLuar" ? "Tugas Luar" : url
                } dengan nomor  ${nomorAjuan}`;
                var query = `INSERT INTO ${databasePeriode}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx)
                      VALUES ('${e[0].em_id}','${title}','${deskripsi}','${url}',CURDATE(),CURTIME(),2,0,'${emIdPengajuan}','${idx}')`;
                console.log(query);
                connection.query(query, (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      // return res.status(400).send({
                      //   status: true,
                      //   message: 'Data gagal terkirim',
                      //   data:results

                      // });
                    });
                    return;
                  }
                  pushNotifikasiApproval(
                    e[0].token_notif,
                    title,
                    deskripsi,
                    url,
                    emIdPengajuan,
                    idx
                  );
                });
              });
            }
          }

          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                // return res.status(400).send({
                //   status: true,
                //   message: 'Data gagal terkirim',
                //   data:[]

                // });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            // return res.status(200).send({
            //   status: true,
            //   message: 'data berhasil terkirm',

            // });
          });
        });
      });
    } catch (e) {}
  },
  notifikasiChat(
    token,
    titile,
    message,
    emIdPengirim,
    emIdPenerima,
    emImage,
    jobTitle
  ) {
    var token = `${token}`;
    var title = `${titile}`;
    var message = message;

    var message = {
      data: {
        route: "pesan",
        em_id_penerima: emIdPenerima,
        em_id_pengirim: emIdPengirim,
        em_image: emImage,
        job_title: jobTitle,
        full_name: titile,
      },
      notification: {
        title: `${title}`,
        body: `${message}`,
      },
      token: token,
    };

    FCM.send(message, function (err, response) {
      if (err) {
        console.log("error found notif", err);
      } else {
        console.log("Berhasil", response);
      }
    });
  },

  async insertNotifikasiAbsensi(
    emIds,
    title,
    url,
    emIdPengajuan,
    idx,
    nomorAjuan,
    namaPegajuan,
    databasePeriode,
    databseMaster
  ) {
    var cekData = {
      emIds: emIds,
    title: title,
    url: url,
    emIdPengajuan: emIdPengajuan,
    idx: idx,
    nomorAjuan: nomorAjuan,
    namaPegajuan: namaPegajuan,
    databasePeriode: databasePeriode,
    databseMaster: databseMaster
    };

    console.log("cek data ", cekData);
    console.log("database master ", databseMaster);
    console.log("database periode ", databasePeriode);
    function pushNotifikasiApproval(
      token,
      titile,
      message,
      url,
      emIdPengajuan,
      idx,
      nomorAjuan
    ) {
      if (token == "" || token == null) {
      } else {
        var token = `${token}`;
        var title = `${titile}`;
        var message = message;
        var nomorAjuan = nomorAjuan;
        var message = {
          data: {
            route: url,
            em_id_pengajuan: "",
            idx: idx.toString(),
          },
          notification: {
            title: `${title}`,
            body: `${message}`,
          },
          token: token,
        };
        console.log(message);
        FCM.send(message, function (err, response) {
          if (err) {
            console.log("error found notif", err);
          } else {
            console.log("response here notif", response);
          }
        });
      }
    }
    var listData = emIds.toString().split(",");
    try {
      console.log(listData);
      const connection = await model.createConnection1(databseMaster);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }
        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }
          console.log("masuk sini new notifikasi absensi");
          for (var i = 0; i < listData.length; i++) {
            if (listData[i] == "" || listData[i] == null) {
            } else {
              console.log("masuk sini");
              var queryEmployee = `SELECT * FROM ${databseMaster}.employee WHERE em_id='${listData[i]}'`;
              connection.query(queryEmployee, (err, e) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    // return res.status(400).send({
                    //   status: true,
                    //   message: 'Data gagal terkirim',
                    //   data:results
                    // });
                  });
                  return;
                }
                var deskripsi = `Hello ${
                  e[0].em_gender == "PRIA"
                    ? "Bapak"
                    : e[0].em_gender == "Wanita"
                    ? "Ibu"
                    : ""
                } ,${
                  e[0].full_name
                }, Saya ${namaPegajuan} - ${emIdPengajuan}  ${
                  url == "terlambat"
                    ? "Absen Datang terlambat"
                    : "Absen Pulang Cepat"
                } `;
                if (url == "terlambat") {
                  deskripsi = `${e[0].full_name} absen terlambat`;
                } else {
                  deskripsi = `${e[0].full_name} absen pulang cepat`;
                }
                var query = `INSERT INTO ${databasePeriode}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan)
                    VALUES ('${e[0].em_id}','${title}','${deskripsi}','${url}',CURDATE(),CURTIME(),2,0,'${emIdPengajuan}')`;
                console.log(query);
                connection.query(query, (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      // return res.status(400).send({
                      //   status: true,
                      //   message: 'Data gagal terkirim',
                      //   data:results
                      // });
                    });
                    return;
                  }
                  pushNotifikasiApproval(
                    e[0].token_notif,
                    title,
                    deskripsi,
                    url,
                    emIdPengajuan,
                    idx
                  );
                });
              });
            }
          }
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                // return res.status(400).send({
                //   status: true,
                //   message: 'Data gagal terkirim',
                //   data:[]
                // });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            // return res.status(200).send({
            //   status: true,
            //   message: 'data berhasil terkirm',
            // });
          });
        });
      });
    } catch (e) {}
  },

  async insertNotifikasiAbsensiSp(
    emIds,
    title,
    url,
    emIdPengajuan,
    idx,
    nomorAjuan,
    namaPegajuan,
    databasePeriode,
    databseMaster,
    nameSp
  ) {
    console.log("database master ", databseMaster);
    console.log("database periode ", databasePeriode);
    function pushNotifikasiApproval(
      token,
      titile,
      message,
      url,
      emIdPengajuan,
      idx,
      nomorAjuan
    ) {
      if (token == "" || token == null) {
      } else {
        var token = `${token}`;
        var title = `${titile}`;
        var message = message;
        var nomorAjuan = nomorAjuan;
        var message = {
          data: {
            route: url,
            em_id_pengajuan: "",
            idx: idx.toString(),
          },
          notification: {
            title: `${title}`,
            body: `${message}`,
          },
          token: token,
        };
        console.log(message);
        FCM.send(message, function (err, response) {
          if (err) {
            console.log("error found notif", err);
          } else {
            console.log("response here notif", response);
          }
        });
      }
    }
    var listData = emIds.toString().split(",");
    try {
      console.log(listData);
      const connection = await model.createConnection1(databseMaster);
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to the database:", err);
          return;
        }
        connection.beginTransaction((err) => {
          if (err) {
            console.error("Error beginning transaction:", err);
            connection.end();
            return;
          }
          console.log("masuk sini new notifikasi absensi");
          for (var i = 0; i < listData.length; i++) {
            if (listData[i] == "" || listData[i] == null) {
            } else {
              console.log("masuk sini");
              var queryEmployee = `SELECT * FROM ${databseMaster}.employee WHERE em_id='${listData[i]}'`;
              connection.query(queryEmployee, (err, e) => {
                if (err) {
                  console.error("Error executing SELECT statement:", err);
                  connection.rollback(() => {
                    connection.end();
                    // return res.status(400).send({
                    //   status: true,
                    //   message: 'Data gagal terkirim',
                    //   data:results
                    // });
                  });
                  return;
                }
                var deskripsi = `${
                  e[0].em_gender == "PRIA"
                    ? "Bapak"
                    : e[0].em_gender == "Wanita"
                    ? "Ibu"
                    : ""
                } ,${
                  e[0].full_name
                }, karyawan dengan ${namaPegajuan} - ${emIdPengajuan}  ${
                  url == "terlambat"
                    ? "akan diberikan surat peringatan Absen Datang terlambat karna telah melebihi toleranssi yang di berikan"
                    : " akan di berikan surat peringatan Absen Pulang Cepat karna telah melebihi toleransi yang di berikan"
                } `;
                if (url == "terlambat") {
                  //  deskripsi=`Hi ${e[0].full_name}, mau kasih info, karyawan dengan ${namaPegajuan} ${url=="terlambat"?"akan diberikan surat peringatan Absen Datang terlambat karna telah melebihi toleransi yang di berikan":" akan di berikan surat peringatan Absen Pulang Cepat karna telah melebihi toleransi yang di berikan"}`
                  deskripsi = `Hi ${
                    e[0].full_name
                  }, mau kasih info, karyawan dengan ${namaPegajuan} ${
                    url == "terlambat"
                      ? "akan diberikan surat peringatan Absen Datang terlambat karna telah melebihi toleransi yang di berikan"
                      : " akan di berik4an surat peringatan Absen Pulang Cepat karna telah melebihi toleransi yang di berikan"
                  }`;
                  deskripsi = `${nameSp} ${namaPegajuan} dengan nomor ${nomorAjuan}`;
                } else if (url == "tidak_masuk_kerja") {
                  deskripsi = `Hi ${e[0].full_name}, mau kasih info, karyawan dengan ${namaPegajuan} ,Akan diberikan surat peringatan tidak masuk kerja karna telah melebihi toleransi yang di berikan`;
                } else {
                  deskripsi = `${nameSp} ${namaPegajuan} dengan nomor ${nomorAjuan}`;
                  // deskripsi=`Hi ${e[0].full_name}, mau kasih info, karyawan dengan ${namaPegajuan}  ${url=="terlambat"?"akan diberikan surat peringatan Absen Datang terlambat karna telah melebihi toleransi yang di berikan":" akan di berikan surat peringatan Absen Pulang Cepat karna telah melebihi toleransi yang di berikan"}`
                }
                var query = `INSERT INTO ${databasePeriode}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan)
                    VALUES ('${e[0].em_id}','${title}','${deskripsi}','${url}',CURDATE(),CURTIME(),2,0,'${emIdPengajuan}')`;
                console.log(query);
                connection.query(query, (err, results) => {
                  if (err) {
                    console.error("Error executing SELECT statement:", err);
                    connection.rollback(() => {
                      connection.end();
                      // return res.status(400).send({
                      //   status: true,
                      //   message: 'Data gagal terkirim',
                      //   data:results
                      // });
                    });
                    return;
                  }
                  pushNotifikasiApproval(
                    e[0].token_notif,
                    title,
                    deskripsi,
                    url,
                    emIdPengajuan,
                    idx
                  );
                });
              });
            }
          }
          connection.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              connection.rollback(() => {
                connection.end();
                // return res.status(400).send({
                //   status: true,
                //   message: 'Data gagal terkirim',
                //   data:[]
                // });
              });
              return;
            }
            connection.end();
            console.log("Transaction completed successfully!");
            // return res.status(200).send({
            //   status: true,
            //   message: 'data berhasil terkirm',
            // });
          });
        });
      });
    } catch (e) {}
  },
};
