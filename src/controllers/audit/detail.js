const models = require("../../utils/models");
const utility = require("../../utils/utility");

const ipServer = process.env.API_URL;
module.exports = {




  async detail(req, res) {
    console.log("get employ attt");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;

    var tipeForm=req.query.tipe_form;
    console.log(tipeForm);

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
    var namaTable='';

  if (tipeForm=='Lembur' || tipeForm=='Pengajuan Absen' || tipeForm=='Tugas Luar' || tipeForm=='WFH'|| tipeForm =='Absen Offline'){
    namaTable='emp_labor';
  }else{
    namaTable='emp_leave';
  }

    var fixquery=
    // `SELECT * FROM ${endPeriodeDynamic}.${namaTable} WHERE id='${req.params.id}'`
    `SELECT 
  JSON_OBJECT(
    'approve1', e1.full_name,
    'approve2', e2.full_name,
    'employee', e3.full_name
  ) AS user_names,
  JSON_OBJECT(
    'approve1_id', e1.em_id,
    'approve2_id', e2.em_id,
    'employee_id', e3.em_id
  ) AS user_ids,
  a.*
FROM 
  sisrajj_hrm2504.emp_labor a
LEFT JOIN employee e1 ON a.approve_id = e1.em_id
LEFT JOIN employee e2 ON a.approve2_id = e2.em_id
LEFT JOIN employee e3 ON a.em_id = e3.em_id WHERE id='${req.params.id}`


    const connection = await models.createConnection1(`${database}_hrm`);
    console.log(fixquery);

    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(fixquery);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Data berhasil diambil",
        data: results.length>0?results[0]:[],
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Error:", e.message);
      return res.status(400).send({
        status: false,
        message: e.message,
        data: [],
      });
    } finally {
      if (conn) conn.release();
      // if (connection) connection.end();
    }
  },
};
