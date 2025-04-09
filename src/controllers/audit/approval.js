const models = require("../../utils/models");
const utility = require("../../utils/utility");

const ipServer = process.env.API_URL;
module.exports = {
  async approval(req, res) {
    var database = req.query.database;
    var databaseMaster = `${database}_hrm`;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;
    var emId = req.headers.em_id;
    var dateNow = utility.dateNow2();
    var fullName = req.body.full_name;
    var tipeForm = req.body.tipe_form;
    var status = req.body.status;
    var id = req.params.id;
    var konsekuensi = req.body.konsekuensi;
    var listKonsekuensi = req.body.list_konsekuensi;
    var alasanReject = req.body.alasan;

    // const tahun = `${gettahun}`;
    // const convertYear = tahun.substring(2, 4);
    // // const convertBulan = getbulan;
    // var convertBulan;
    // if (getbulan.length == 1) {
    //   convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    // } else {
    //   convertBulan = getbulan;
    // }

    // const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${array1[0].substring(2, 4)}${
      array1[1]
    }`;
    const endPeriodeDynamic = `${database}_hrm${array2[0].substring(2, 4)}${
      array2[1]
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    var namaTable = "";
    var fixquery = ``;
    var fixQueryEmployee = ``;
    console.log(req.body);
    if (
      tipeForm == "Lembur" ||
      tipeForm == "Pengajuan Absen" ||
      tipeForm == "Tugas Luar" ||
      tipeForm == "WFH"
    ) {
      namaTable = "emp_labor";
      fixQueryEmployee = `SELECT a.em_id, a.audit_surat_id, a.audit_tipe_surat, b.full_name FROM ${endPeriodeDynamic}.emp_labor a INNER JOIN ${databaseMaster}.employee b ON a.em_id = b.em_id WHERE a.id='${id}'`;
      if (status == "") {
        fixquery = `UPDATE ${endPeriodeDynamic}.emp_labor SET audit_status='Approve',audit_date='${dateNow}',status='Approve2', approve2_status='Approve' WHERE id='${id}' `;
      } else {
        fixquery = `UPDATE ${endPeriodeDynamic}.emp_labor SET audit_id='${emId}',audit_status='Rejected',audit_date='${dateNow}',audit_name='${fullName}' ,status='Rejected', approve2_status='Rejected', audit_tipe_surat='${konsekuensi}' WHERE id='${id}' `;
      }
    } else {
      namaTable = "emp_leave";
      fixQueryEmployee = `SELECT a.em_id,a.audit_surat_id, a.audit_tipe_surat, b.full_name FROM ${endPeriodeDynamic}.emp_leave  INNER JOIN ${databaseMaster}.employee b ON a.em_id = b.em_id WHERE id='${id}'`;
      if (status == "") {
        fixquery = `UPDATE ${endPeriodeDynamic}.emp_leave SET audit_status='Approve',audit_date='${dateNow}',leave_status='Approve', apply2_status='Approve' WHERE  id='${id}'`;
      } else {
        fixquery = `UPDATE ${endPeriodeDynamic}.emp_leave SET audit_id='${emId}',audit_status='Rejected',audit_date='${dateNow}' ,audit_name='${fullName}'  ,leave_status='Rejected', apply2_status='Rejected', audit_tipe_surat='${konsekuensi}' WHERE  id='${id}'`;
      }
    }

    const connection = await models.createConnection1(`${database}_hrm`);

    let conn;
    console.log(fixquery);
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(fixquery);
      const [getData] = await conn.query(fixQueryEmployee);
      console.log(getData);
      const emIdUser = getData[0].em_id;
      const fullNameUser = getData[0].full_name;
      const idSuratAudit = getData[0].audit_surat_id;
      const tipeSuratAudit = getData[0].audit_tipe_surat;
      console.log(emIdUser);
      if (status == "") {
        let surat = ``;
        if (tipeSuratAudit == 'teguran_lisan') {
          surat = 'teguran_lisan';
          const queryHapus = `DELETE FROM ${databaseMaster}.${surat} WHERE id='${idSuratAudit}'`;
          await conn.query(queryHapus);
        } else if (tipeSuratAudit == 'surat_peringatan'){
          surat = 'employee_letter';
          const queryHapus = `DELETE FROM ${databaseMaster}.${surat} WHERE id='${idSuratAudit}'`;
          await conn.query(queryHapus);
        } else{

        }
        
        
      } else {
        console.log("--------Surat Teguran || Surat Peringatan-----------");
        if (konsekuensi === "teguran_lisan") {
          const queryTeguranLisan = `SELECT * FROM teguran_lisan WHERE MONTH(tgl_surat) = MONTH(CURRENT_DATE) AND YEAR(tgl_surat) = YEAR(CURRENT_DATE) ORDER BY id DESC LIMIT 1`;
          const [teguranLisan] = await conn.query(queryTeguranLisan);

          var nomorLb = `LI20${array1[0].substring(2, 4)}${array1[1]}`;
          var nomorStr = "";
          if (teguranLisan.length > 0) {
            const lastNomor = teguranLisan[0]["nomor"]; // Ambil nomor dari data terakhir
            console.log(lastNomor);

            const sequenceStartIndex = 8;
            const sequenceEndIndex = 13;
            const lastSequence =
              parseInt(
                lastNomor.substring(sequenceStartIndex, sequenceEndIndex)
              ) + 1;

            nomorStr = String(lastSequence).padStart(4, "0");

            nomorLb = nomorLb + nomorStr;
          } else {
            var nomor = 1;
            nomorStr = String(nomor).padStart(4, "0");
            nomorLb = nomorLb + nomorStr;
          }
          console.log(nomorLb);
          console.log(nomorStr);
          console.log(`ini id yang ngasih teguran ${emId}`);

          const queryInsert = `INSERT INTO teguran_lisan (
                                                    nomor,
                                                    hal,
                                                    tgl_surat,
                                                    em_id,
                                                    letter_id,
                                                    eff_date,
                                                    pelanggaran,
                                                    status,
                                                    diterbitkan_oleh) VALUE(
                                                    '${nomorLb}',
                                                    'Teguran Lisan',
                                                    '${utility.dateNow2()}',
                                                    '${emIdUser}',
                                                    '9',
                                                    '${utility.dateNow2()}',
                                                    '${alasanReject}',
                                                    'Pending',
                                                    '${emId}')`;
          const [insertTeguran] = await conn.query(queryInsert);

          var queryInsertTeguranLisanId = `UPDATE ${endPeriodeDynamic}.${namaTable} SET audit_surat_id=${insertTeguran.insertId} WHERE id='${id}'`;
          await conn.query(queryInsertTeguranLisanId);
          console.log("ini listkonsekuensi", listKonsekuensi);
          const konsekuensiArray = listKonsekuensi.map((k) => k.konsekuensi);
          console.log(konsekuensiArray);
          console.log(insertTeguran);

          for (var i = 0; i < konsekuensiArray.length; i++) {
            var data = konsekuensiArray[i].trim();
            const queryDetail = `INSERT INTO teguran_lisan_detail (teguran_lisan_id,name) VALUE('${insertTeguran.insertId}','${data}')`;
            conn.query(queryDetail);
            console.log(queryDetail);
          }
          const [notifTl] = await conn.query(
            `SELECT * FROM sysdata WHERE kode=045`
          );

          utility.insertNotifikasiGlobal(
            notifTl[0]["name"],
            "Teguran Lisan",
            "Teguran Lisan",
            emIdUser,
            insertTeguran.insertId,
            nomorLb,
            fullNameUser,
            endPeriodeDynamic,
            databaseMaster,
            `Teguran Lisan Telah di terbitkan Kepada ${fullNameUser}, dengan nomor ${nomorLb}`
          );
        } else if (konsekuensi === "surat_peringatan") {
          const queryCekSuratPeringatan = `SELECT * FROM employee_letter WHERE exp_date>=CURDATE() AND status='Approve' AND em_id='${emId}' ORDER BY id DESC`;
          const [suratPeringatan] = await conn.query(queryCekSuratPeringatan);

          var letterId = "";

          if (suratPeringatan.length > 0) {
            var letterIdTemp = suratPeringatan[0]["letter_id"];
            if (letterIdTemp == "2" || letterIdTemp == 2) {
              letterId = "3";
            }
            if (letterIdTemp == "3" || letterIdTemp == 3) {
              letterId = "4";
            }
          } else {
            letterId = "2";
          }
          const queryCekNomor = `SELECT * FROM employee_letter WHERE MONTH(tgl_surat) = MONTH(CURRENT_DATE) AND YEAR(tgl_surat) = YEAR(CURRENT_DATE) ORDER BY id DESC LIMIT 1`;
          const [teguranLisan] = await conn.query(queryCekNomor);

          var nomorLb = `SP20${array1[0].substring(2, 4)}${array1[1]}`;
          var nomorStr = "";
          if (teguranLisan.length > 0) {
            var text = teguranLisan[0]["nomor"];
            var nomor = parseInt(text.substring(8, 13)) + 1;
            nomorStr = String(nomor).padStart(4, "0");
            nomorLb = nomorLb + nomorStr;
          } else {
            var nomor = 1;
            nomorStr = String(nomor).padStart(4, "0");
            nomorLb = nomorLb + nomorStr;
          }
          console.log(nomorLb);
          console.log(letterId);
          console.log(nomorStr);
          console.log(utility.mounthNow());

          const queryInsert = `INSERT INTO employee_letter (
                                                      nomor,
                                                      tgl_surat,
                                                      em_id,
                                                      letter_id,
                                                      eff_date,
                                                      alasan,
                                                      status,
                                                      diterbitkan_oleh) 
                                                      VALUE(
                                                      '${nomorLb}',
                                                      '${utility.dateNow2()}',
                                                      '${emIdUser}',
                                                      '${letterId}',
                                                      '${utility.dateNow2()}',
                                                      '${alasanReject}',
                                                      'Pending',
                                                      '${emId}')`;
          const [insertSuratPeringatan] = await conn.query(queryInsert);

          var queryInsertTeguranLisanId = `UPDATE ${endPeriodeDynamic}.${namaTable} SET audit_surat_id=${insertSuratPeringatan.insertId} WHERE id = '${id}'`;
          console.log(queryInsertTeguranLisanId);
          await conn.query(queryInsertTeguranLisanId);
          console.log("ini listkonsekuensi", listKonsekuensi);
          const konsekuensiArray = listKonsekuensi.map((k) => k.konsekuensi);
          for (var i = 0; i < konsekuensiArray.length; i++) {
            var data = konsekuensiArray[i].trim();
            console.log(data);
            await conn.query(
              `INSERT INTO employee_letter_reason (employee_letter_id,name) VALUE('${insertSuratPeringatan.insertId}','${data}')`
            );
          }
          const [notifTl] = await conn.query(
            `SELECT * FROM sysdata WHERE kode=026`
          );

          console.log(notifTl);

          utility.insertNotifikasiGlobal(
            notifTl[0]["name"],
            "Surat Peringatan",
            "Surat Peringatan",
            emIdUser,
            insertSuratPeringatan.insertId,
            nomorLb,
            fullNameUser,
            endPeriodeDynamic,
            databaseMaster,
            `Surat Peringatan Telah di terbitkan Kepada ${fullNameUser}, dengan nomor ${nomorLb}`
          );
        } else {
          console.log("tidak ada konsekensi alias", konsekuensi);
        }
      }

      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Berhasil update data",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error:", e);
      return res.status(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    } finally {
      if (conn) conn.release();
    }
  },
};
