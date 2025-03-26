const models = require("../../utils/models");
const utility = require("../../utils/utility");

const ipServer = process.env.API_URL;
module.exports = {




  async show(req, res) {
    console.log("get employ attt");
    var database = req.query.database;
    var em_id = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;
    var limit=req.query.limit;
    var offset=req.query.offset;

    var  status=req.query.status;
    var statusAudit=req.query.status_audit;
    var tipeForm=req.query.tipe_form
    var branchId=req.query.branch_id;
    var emId=req.query.em_id;

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
    var query = `  SELECT  employee.full_name,designation.name AS jabatan, 
    'FULLDAY' AS tipe_form ,nomor_ajuan ,emp_labor.status,
    CASE  
       WHEN emp_labor.nomor_ajuan LIKE '%LB%'THEN 'Lembur'
       WHEN emp_labor.nomor_ajuan LIKE '%TL%'THEN 'Tugas Luar'
       WHEN emp_labor.nomor_ajuan LIKE '%RQ%'THEN 'Pengajuan Absen'
       WHEN emp_labor.nomor_ajuan LIKE '%RO%'THEN 'Absen Offline'
       
       ELSE NULL
      END AS tipe_pengajuan
      
    FROM ${startPeriodeDynamic}.emp_labor JOIN ${database}_hrm.employee ON employee.em_id=emp_labor.em_id LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id
    
    UNION ALL
    SELECT nomor_ajuan AS nomor, employee.full_name,designation.name AS jabatan, 'FULLDAY' AS 
    tipe_form ,nomor_ajuan AS nomor,emp_leave.leave_status,
      CASE  
       WHEN emp_leave.nomor_ajuan LIKE '%IZ%'THEN 'Izin'
       WHEN emp_leave.nomor_ajuan LIKE '%CT%'THEN 'Cuti'
       WHEN emp_leave.nomor_ajuan LIKE '%SD%'THEN 'Sakit'
       WHEN emp_leave.nomor_ajuan LIKE '%DL%'THEN 'Dinas Luar'
       ELSE NULL
      END AS tipe_pengajuan
     FROM ${startPeriodeDynamic}.emp_leave  JOIN ${database}_hrm.employee ON employee.em_id=emp_leave.em_id 
     LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id

    `;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query = `SELECT employee.em_id, employee.branch_id, nomor_ajuan AS nomor, employee.full_name,designation.name AS jabatan, 
      'FULLDAY' AS tipe_form ,nomor_ajuan ,emp_labor.status as stat,
      CASE  
         WHEN emp_labor.nomor_ajuan LIKE '%LB%'THEN 'Lembur'
         WHEN emp_labor.nomor_ajuan LIKE '%TL%'THEN 'Tugas Luar'
         WHEN emp_labor.nomor_ajuan LIKE '%RQ%'THEN 'Pengajuan Absen'
         WHEN emp_labor.nomor_ajuan LIKE '%RO%'THEN 'Absen Offline'
         
         ELSE NULL
        END AS tipe_pengajuan,audit_status as status_audit
        
      FROM ${startPeriodeDynamic}.emp_labor JOIN ${database}_hrm.employee ON employee.em_id=emp_labor.em_id LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id
      
      UNION ALL
      SELECT employee.em_id,   employee.branch_id, nomor_ajuan AS nomor, employee.full_name,designation.name AS jabatan, 'FULLDAY' AS 
      tipe_form ,nomor_ajuan AS nomor,emp_leave.leave_status as stat,
        CASE  
         WHEN emp_leave.nomor_ajuan LIKE '%IZ%'THEN 'Izin'
         WHEN emp_leave.nomor_ajuan LIKE '%CT%'THEN 'Cuti'
         WHEN emp_leave.nomor_ajuan LIKE '%SD%'THEN 'Sakit'
         WHEN emp_leave.nomor_ajuan LIKE '%DL%'THEN 'Dinas Luar'
         ELSE NULL
        END AS tipe_pengajuan,audit_name as nama_audit,audit_status as status_audit
       FROM ${endPeriodeDynamic}.emp_leave  JOIN ${database}_hrm.employee ON employee.em_id=emp_leave.em_id LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id
         `;
    }

    var fixquery=`SELECT * FROM  (${query}) AS TBL 
    WHERE em_id LIKE '%${emId}%' AND branch_id LIKE '%${branchId}%' 
    
    AND status LIKE '%${status}%' 
    AND status_audit LIKE '%${statusAudit}%' 
    AND status_pengajuan LIKE '%${tipeForm}%'
    
    LIMIT ${limit} OFFSET ${offset}`

    // var query= `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`

    const connection = await models.createConnection1(startPeriodeDynamic);

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
