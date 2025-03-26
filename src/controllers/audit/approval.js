const models = require("../../../utils/models");
const utility = require("../../utils/utility");

const ipServer = process.env.API_URL;
module.exports = {
  async approval(req, res) {
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;
    var emId=req.headers.em_id;
    var dateNow=utility.dateNow2();
    var fullName=req.query.full_name;
    var tipeForm=req.query.tipe_form;
    var status=req.body.status;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

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

var namaTable='';
var fixquery=``
  if (tipeForm=='Lembur' || tipeForm=='Pengajuan Absen' || tipeForm=='Tugas Luar' || tipeForm=='WFH'){
    namaTable='emp_labor';
    if (status==''){
        fixquery=`UPDATE ${namaDatabaseDynamic}.emp_labor SET audit_id='',audit_status='',audit_date='' ,status='Approve2', approve2_status='Approve' WHERE id='${id}' `
    }else{
        fixquery=`UPDATE ${namaDatabaseDynamic}.emp_labor SET audit_id='${emId}',audit_status='Rejected',audit_date='${dateNow}' ,status='Rejected', approve2_status='Rejected' WHERE id='${id}' `

    }
   
  }else{
    namaTable='emp_leave';

    if (status==''){
        fixquery=`UPDATE ${namaDatabaseDynamic}.emp_leave SET audit_id='',audit_status='',audit_date='' ,leave_status='Approve', apply2_status='Approve' id='${id}'`
    }else{
        fixquery=`UPDATE ${namaDatabaseDynamic}.emp_leave SET audit_id='${emId}',audit_status='Rejected',audit_date='${dateNow}' ,leave_status='Rejected', apply2_status='Rejected' id='${id}'`

    }
    
  }
 

   
    


    const connection = await models.createConnection1(`${database}_hrm`);

    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(fixquery);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Data berhasil diambil",
        data: results,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error:", e.message);
      return res.status(400).send({
        status: false,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) conn.release();
      // if (connection) connection.end();
    }
  },
};
