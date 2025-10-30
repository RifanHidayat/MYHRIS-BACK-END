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
  pushNotifikasiApproval2(
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
          idx: `${idx}`,
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
    databaseMaster
  ) {
    console.log("masuk ke fungsi notifikasi ", databasePeriode);
    console.log("emIds ", emIds);
  
    const listData = emIds.toString().split(",");
    const connection = await model.createConnection1(databaseMaster);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
  
      for (const emId of listData) {
        if (emId) {
          console.log("Memproses em_id:", emId);
  
          const queryEmployee = `SELECT * FROM ${databaseMaster}.employee WHERE em_id = ?`;
          const [employees] = await conn.query(queryEmployee, [emId]);
  
          if (employees.length === 0) {
            console.warn(`Employee dengan ID ${emId} tidak ditemukan.`);
            continue;
          }
  
          const employee = employees[0];
          const deskripsi = `${namaPegajuan} mengajukan ${
            url === "TugasLuar" ? "Tugas Luar" : url
          } dengan nomor ${nomorAjuan}`;
  
          const queryInsert = `
            INSERT INTO ${databasePeriode}.notifikasi 
            (em_id, title, deskripsi, url, atten_date, jam, status, view, em_id_pengajuan, idx) 
            VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), 2, 0, ?, ?)
          `;
  
          const insertValues = [
            employee.em_id,
            title,
            deskripsi,
            url,
            emIdPengajuan,
            idx,
          ];
  
          await conn.query(queryInsert, insertValues);
  
          // Memanggil notifikasi approval
          this.pushNotifikasiApproval2(
            employee.token_notif,
            title,
            deskripsi,
            url,
            emIdPengajuan,
            idx,
            nomorAjuan
          );
        }
      }
  
      await conn.commit();
      console.log("Transaction completed successfully!");
  
    } catch (err) {
      console.error("Error occurred:", err);
  
      if (conn) {
        await conn.rollback();
      }
  
    } finally {
      if (conn) {
        conn.release();
      }
    }
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
    databaseMaster
  ) {
    console.log("masuk ke fungsi notifikasi ", databasePeriode);
    console.log("emIds ", emIds);
  
    const listData = emIds.toString().split(",");
    const connection = await model.createConnection1(databaseMaster);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
  
      for (const emId of listData) {
        if (emId) {
          console.log("Memproses em_id:", emId);
  
          const queryEmployee = `SELECT * FROM ${databaseMaster}.employee WHERE em_id = ?`;
          const [employees] = await conn.query(queryEmployee, [emId]);
  
          if (employees.length === 0) {
            console.warn(`Employee dengan ID ${emId} tidak ditemukan.`);
            continue;
          }
  
          const employee = employees[0];
          var deskripsi = `${employee.full_name} mengajukan ${
            url == "TugasLuar" ? "Tugas Luar" : url
          } dengan nomor  ${nomorAjuan}`;
          var query = `INSERT INTO ${databasePeriode}.notifikasi (em_id,title,deskripsi,url,atten_date,jam,status,view,em_id_pengajuan,idx)
                VALUES ('${employee.em_id}','${title}','${deskripsi}','${url}',CURDATE(),CURTIME(),2,0,'${emIdPengajuan}','${idx}')`;
          console.log(query);
  
          const insertValues = [
            employee.em_id,
            title,
            deskripsi,
            url,
            emIdPengajuan,
            idx,
          ];
  
          await conn.query(queryInsert);
  
          // Memanggil notifikasi approval
          this.pushNotifikasiApproval2(
            employee.token_notif,
            title,
            deskripsi,
            url,
            emIdPengajuan,
            idx,
            nomorAjuan
          );
        }
      }
  
      await conn.commit();
      console.log("Transaction completed successfully!");
  
    } catch (err) {
      console.error("Error occurred:", err);
  
      if (conn) {
        await conn.rollback();
      }
  
    } finally {
      if (conn) {
        conn.release();
      }
    }
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
      title,
      message,
      url,
      emIdPengajuan,
      idx,
      nomorAjuan
    ) {
      if (token) {
        const notificationMessage = {
          data: {
            route: url,
            em_id_pengajuan: emIdPengajuan,
            idx: `${idx}`,
          },
          notification: {
            title: title,
            body: message,
          },
          token: token,
        };
        FCM.send(notificationMessage, (err, response) => {
          if (err) {
            console.log("Error sending notification:", err);
          } else {
            console.log("Notification sent successfully:", response);
          }
        });
      }
    }
  
    console.log("Initializing notification process", databasePeriode);
    const connection = await model.createConnection1(databseMaster);
    let conn;
    const listData = emIds.toString().split(",");
  
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
  
      const employeeQueries = listData
        .filter((emId) => emId)
        .map((emId) =>
          conn
            .query(
              `SELECT * FROM ${databseMaster}.employee WHERE em_id='${emId}'`
            )
        );
  
      const employeeResults = await Promise.all(employeeQueries);
      const insertQueries = [];
  
      for (const [e] of employeeResults) {
        if (e.length > 0) {
          const query = `
            INSERT INTO ${databasePeriode}.notifikasi 
            (em_id, title, deskripsi, url, atten_date, jam, status, view, em_id_pengajuan) 
            VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), 2, 0, ?)
          `;
          
            const insertValues = [
              e[0].em_id,
              title,
              description,
              url,
              emIdPengajuan,
            ];
          insertQueries.push(conn.query(query, insertValues));
  
          pushNotifikasiApprovalGlobal(
            e[0].token_notif,
            title,
            description,
            url,
            emIdPengajuan,
            idx,
            nomorAjuan
          );
        }
      }
  
      await Promise.all(insertQueries);
      await conn.commit();
      console.log("Transaction completed successfully!");
    } catch (err) {
      console.error("Error during transaction:", err);
      if (conn) await conn.rollback();
    } finally {
      if (conn) conn.release();
    }
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
    databaseMaster
) {

  const connection = await model.createConnection1(databaseMaster);
  let conn;
    try {
        conn = await connection.getConnection();
        await conn.beginTransaction();

        console.log("Mulai transaksi untuk notifikasi absensi");

        // Mendapatkan data pegawai yang mengajukan
        const [employeeData] = await conn.query(
            `SELECT * FROM ${databaseMaster}.employee WHERE em_id = ?`,
            [emIdPengajuan]
        );

        if (employeeData.length === 0) {
            throw new Error("Data pegawai pengajuan tidak ditemukan");
        }
        
        const employee = employeeData[0];
        const listData = emIds.toString().split(",").filter(id => id); // Hanya ID yang valid

        for (const emId of listData) {
            // Mendapatkan data karyawan yang akan menerima notifikasi
            const [receivers] = await conn.query(
                `SELECT * FROM ${databaseMaster}.employee WHERE em_id = ?`,
                [emId]
            );

            if (receivers.length === 0) {
                console.warn(`Data pegawai dengan em_id ${emId} tidak ditemukan`);
                continue;
            }

            const receiver = receivers[0];
            let deskripsi = `${employee.full_name} `;

            if (url === "terlambat") {
                deskripsi += "absen terlambat";
            } else {
                deskripsi += "absen pulang cepat";
            }

            const queryInsertNotifikasi = `
                INSERT INTO ${databasePeriode}.notifikasi 
                (em_id, title, deskripsi, url, atten_date, jam, status, view, em_id_pengajuan)
                VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), 2, 0, ?)
            `;

            await connection.query(queryInsertNotifikasi, [
                receiver.em_id,
                title,
                deskripsi,
                url,
                emIdPengajuan
            ]);

            this.pushNotifikasiApproval2(
                receiver.token_notif,
                title,
                deskripsi,
                url,
                emIdPengajuan,
                idx
            );
        }

        await conn.commit();
        console.log("Transaksi notifikasi absensi berhasil disimpan!");
        

    } catch (error) {
      if(conn){
        await conn.rollback();
      }
        console.error("Gagal menyimpan notifikasi absensi:", error.message);
    } finally {
      if (conn) await conn.release();
    }
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

  function pushNotifikasiApproval(token, title, message, url, emIdPengajuan, idx, nomorAjuan) {
    if (!token) return;

    const messageData = {
      data: {
        route: url,
        em_id_pengajuan: "",
        idx: idx.toString(),
      },
      notification: {
        title,
        body: message,
      },
      token,
    };

    console.log(messageData);

    FCM.send(messageData, (err, response) => {
      if (err) console.log("error found notif", err);
      else console.log("response here notif", response);
    });
  }

  const listData = emIds.toString().split(",").filter(Boolean);
  console.log(listData);
  const connection = await model.createConnection1(databseMaster);
  let conn;
  try {
    conn = await connection.getConnection();
    await conn.beginTransaction();

        listData.forEach((emId) => {
          const queryEmployee = `SELECT * FROM ${databseMaster}.employee WHERE em_id='${emId}'`;
          const [employees] = conn.query(queryEmployee);
          const employee = employees[0];
            const salutation = employee.em_gender === "PRIA" ? "Bapak" : employee.em_gender === "Wanita" ? "Ibu" : "";

            let deskripsi = `${nameSp} ${namaPegajuan} dengan nomor ${nomorAjuan}`;

            if (url === "terlambat") {
              deskripsi = `Hi ${employee.full_name}, karyawan dengan ${namaPegajuan} akan diberikan surat peringatan Absen Datang terlambat.`;
            } else if (url === "tidak_masuk_kerja") {
              deskripsi = `Hi ${employee.full_name}, karyawan dengan ${namaPegajuan} akan diberikan surat peringatan tidak masuk kerja.`;
            }

            const query = `INSERT INTO ${databasePeriode}.notifikasi (em_id, title, deskripsi, url, atten_date, jam, status, view, em_id_pengajuan)
              VALUES ('${employee.em_id}', '${title}', '${deskripsi}', '${url}', CURDATE(), CURTIME(), 2, 0, '${emIdPengajuan}')`;
            console.log(query);
            const [notif] = conn.query(query);
            pushNotifikasiApproval(notif.token_notif, title, deskripsi, url, emIdPengajuan, idx);
        });


  } catch (e) {
    if (conn){
      await conn.rollback();
    }
    console.error("Error during notifikasi processing:", e);
  } finally{
    if (conn) await conn.release();
  }
},

};
