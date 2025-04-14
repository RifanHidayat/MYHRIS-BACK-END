const models = require("../../utils/models");
const utility = require("../../utils/utility");

const ipServer = process.env.API_URL;
module.exports = {




  async show(req, res) {
    console.log("body", req.body);
    var database = req.query.database;
    var emId = req.body.em_id;
    const getbulan = req.body.bulan;
    const gettahun = req.body.tahun;
    var date = req.body.date;
    var limit=req.body.limit;
    var offset=req.body.offset;
    var allData=req.body.all_data;

    var  status=req.body.status;
    var statusAudit=req.body.status_audit;
    var tipeForm=req.body.tipe_form
    var branchId=req.body.branch_id;
    // var emId=req.query.em_id;

    const tahun = `${gettahun}`;
    const convertYear = tahun.substring(2, 4);
    // const convertBulan = getbulan;
    var convertBulan;
    if (getbulan.length == 1) {
      convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
    } else {
      convertBulan = getbulan;
    }

    // const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    var startPeriode =
      req.query.start_periode == undefined
        ? "2024-02-03"
        : req.query.start_periode;
    var endPeriode =
      req.query.end_periode == undefined ? "2024-02-03" : req.query.end_periode;
    var array1 = startPeriode.split("-");
    var array2 = endPeriode.split("-");

    const startPeriodeDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const endPeriodeDynamic = `${database}_hrm${convertYear}${
      convertBulan
    }`;

    let date1 = new Date(startPeriode);
    let date2 = new Date(endPeriode);

    let queryFilterStatus = ``;
    console.log("status audit", statusAudit);
    if (statusAudit === 'Draft'){
      queryFilterStatus = `AND status_audit =''`;
    }else {
      queryFilterStatus = `AND status_audit LIKE '%${statusAudit}%'`;
    }
    let queryAllData = ``;
    if (allData == false){
      queryAllData = `LIMIT ${limit} OFFSET ${offset}`;
    } else {
      queryAllData = ``;
    }
    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;
    var query = `SELECT  
        JSON_OBJECT(
            'full_name', e1.full_name,
            'em_id', e1.em_id
        ) AS approve1,
      
        JSON_OBJECT(
            'full_name', e2.full_name,
            'em_id', e2.em_id
        ) AS approve2,
      
        JSON_OBJECT(
            'full_name', e3.full_name,
            'em_id', e3.em_id
        ) AS users,
    emp_labor.id, 
    employee.em_id,
    employee.branch_id, 
    nomor_ajuan AS nomor, 
    employee.full_name,
    designation.name AS jabatan,
    emp_labor.status, 
    emp_labor.atten_date AS atten_date, 
    emp_labor.uraian AS keterangan,
    emp_labor.audit_tipe_surat AS konsekuensi,
    emp_labor.audit_surat_name AS penerima_konsekuensi,
    CASE  
       WHEN emp_labor.nomor_ajuan LIKE '%LB%'THEN 'Lembur'
       WHEN emp_labor.nomor_ajuan LIKE '%TL%'THEN 'Tugas Luar'
       WHEN emp_labor.nomor_ajuan LIKE '%RQ%'THEN 'Pengajuan Absen'
       WHEN emp_labor.nomor_ajuan LIKE '%RO%'THEN 'Absen Offline'
       
       ELSE NULL
      END AS tipe_pengajuan,audit_name as nama_audit,audit_status as status_audit
      
    FROM ${startPeriodeDynamic}.emp_labor 
    JOIN ${database}_hrm.employee ON employee.em_id=emp_labor.em_id 
    LEFT JOIN ${database}_hrm.employee e1 ON emp_labor.approve_id = e1.em_id
    LEFT JOIN ${database}_hrm.employee e2 ON emp_labor.approve2_id = e2.em_id
    LEFT JOIN ${database}_hrm.employee e3 ON emp_labor.em_id = e3.em_id
    LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id
    
    UNION ALL
    SELECT 
    JSON_OBJECT(
            'full_name', e1.full_name,
            'em_id', e1.em_id
        ) AS approve1,
      
        JSON_OBJECT(
            'full_name', e2.full_name,
            'em_id', e2.em_id
        ) AS approve2,
      
        JSON_OBJECT(
            'full_name', e3.full_name,
            'em_id', e3.em_id
        ) AS users,
    emp_leave.id, 
    employee.em_id, 
    employee.branch_id,
    nomor_ajuan AS nomor, 
    employee.full_name,
    designation.name AS jabatan, 
    emp_leave.leave_status, 
    emp_leave.atten_date AS atten_date, 
    emp_leave.reason AS keterangan,
    emp_leave.audit_tipe_surat AS konsekuensi,
    emp_leave.audit_surat_name AS penerima_konsekuensi,

      CASE  
       WHEN emp_leave.nomor_ajuan LIKE '%IZ%'THEN 'Izin'
       WHEN emp_leave.nomor_ajuan LIKE '%CT%'THEN 'Cuti'
       WHEN emp_leave.nomor_ajuan LIKE '%SD%'THEN 'Sakit'
       WHEN emp_leave.nomor_ajuan LIKE '%DL%'THEN 'Dinas Luar'
       ELSE NULL
      END AS tipe_pengajuan,audit_name as nama_audit,audit_status as status_audit
     FROM ${startPeriodeDynamic}.emp_leave  
     JOIN ${database}_hrm.employee ON employee.em_id=emp_leave.em_id 
     LEFT JOIN ${database}_hrm.employee e1 ON emp_leave.apply_id = e1.em_id
    LEFT JOIN ${database}_hrm.employee e2 ON emp_leave.apply2_id = e2.em_id
    LEFT JOIN ${database}_hrm.employee e3 ON emp_leave.em_id = e3.em_id
     LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id

    `;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      query = ` nomor_ajuan AS nomor, SELECT employee.em_id, employee.branch_id, employee.full_name,designation.name AS jabatan, 
      nomor_ajuan ,emp_labor.status as stat, 
      CASE  
         WHEN emp_labor.nomor_ajuan LIKE '%LB%'THEN 'Lembur'
         WHEN emp_labor.nomor_ajuan LIKE '%TL%'THEN 'Tugas Luar'
         WHEN emp_labor.nomor_ajuan LIKE '%RQ%'THEN 'Pengajuan Absen'
         WHEN emp_labor.nomor_ajuan LIKE '%RO%'THEN 'Absen Offline'
         
         ELSE NULL
        END AS tipe_pengajuan,audit_status as status_audit
        
      FROM ${startPeriodeDynamic}.emp_labor JOIN ${database}_hrm.employee ON employee.em_id=emp_labor.em_id LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id WHERE status_transaksi=1
      
      UNION ALL
      SELECT nomor_ajuan AS nomor,  employee.em_id,   employee.branch_id, employee.full_name,designation.name AS jabatan, 'FULLDAY' AS 
      tipe_form ,emp_leave.leave_status as stat,
        CASE  
         WHEN emp_leave.nomor_ajuan LIKE '%IZ%'THEN 'Izin'
         WHEN emp_leave.nomor_ajuan LIKE '%CT%'THEN 'Cuti'
         WHEN emp_leave.nomor_ajuan LIKE '%SD%'THEN 'Sakit'
         WHEN emp_leave.nomor_ajuan LIKE '%DL%'THEN 'Dinas Luar'
         ELSE NULL
        END AS tipe_pengajuan,audit_name as nama_audit,audit_status as status_audit
       FROM ${endPeriodeDynamic}.emp_leave  JOIN ${database}_hrm.employee ON employee.em_id=emp_leave.em_id LEFT JOIN ${database}_hrm.designation ON designation.id=employee.des_id WHERE status_transaksi=1
         `;
    }

    var fixquery=`SELECT * FROM  (${query}) AS TBL 
    WHERE em_id LIKE '%${emId}%' AND branch_id LIKE '%${branchId}%' 
    AND status LIKE '%${status}%' 
    ${queryFilterStatus} 
    AND tipe_pengajuan LIKE '%${tipeForm}%'
    ${queryAllData}`


    console.log(`data ${fixquery}`)

    // var query= `SELECT  emp_labor.*,m.place AS lokasi_masuk,k.place AS lokasi_keluar FROM emp_labor LEFT JOIN ${database}_hrm.places_coordinate m ON m.id=emp_labor.place_in LEFT JOIN  ${database}_hrm.places_coordinate k ON k.id=emp_labor.place_out   WHERE ajuan='3' AND em_id='${em_id}' AND status_transaksi=1 ORDER BY id DESC`

    const connection = await models.createConnection1(startPeriodeDynamic);
    console.log(req.query);
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
        message:  e.message,
        data: [],
      });
    } finally {
      if (conn) conn.release();
    }
  },
};
