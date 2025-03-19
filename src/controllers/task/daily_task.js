const models = require("../../utils/models");

function formatDate(dateStr) {
  if (!dateStr || dateStr.trim() === "") return null; // Return null jika kosong

  const parts = dateStr.split(", ")[1]?.split("-");
  if (!parts || parts.length !== 3) return null;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

module.exports = {
  async insertDailyTask(req, res) {
    console.log("-----insert data kalim----------");
    console.log("data absen ", req.body);

    var database = req.query.database;
    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    var listTask = req.body.list_task;
    var attenDate = req.body.atten_date;
    var status = req.body.status;
    var id = req.body.id;

    const tahun = `${array[0]}`;
    console.log("ini tahun", tahun);
    const convertYear = tahun.substring(2, 4);

    const convertBulan = array[1].padStart(2, "0");
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;

    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [cekDaily] = await conn.query(
        `SELECT id FROM daily_task WHERE tgl_buat = '${attenDate}' AND em_id = '${em_id}'`
      );
      console.log("ini cek daily", cekDaily);
      if (cekDaily.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Tugas di tanggal ${attenDate} ini sudah tersedia`,
        });
      } else {
        const queryTask = `
                INSERT INTO daily_task (em_id, tgl_buat, status_pengajuan) 
                VALUES (?, ?, ?)
            `;

        const queryDetail = `
                INSERT INTO daily_task_detail 
                (judul, rincian, tgl_finish, daily_task_id, status, level) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        const [task] = await conn.query(queryTask, [em_id, attenDate, status]);
        const taskId = task.insertId;

        for (const item of listTask) {
          const { task, judul, status, level, tgl_finish } = item;
          var tanggal = formatDate(tgl_finish);

          await conn.query(queryDetail, [
            judul,
            task,
            tanggal,
            taskId,
            status.toString(),
            level,
          ]);
        }
      }
      await conn.commit();

      res.status(200).json({
        success: true,
        message: "Data Berhasil Ditambahkan",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Insert Data Error: ", error);
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan data: " + error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  },

  async updateDailyTask(req, res) {
    console.log("-----insert data kalim----------");
    console.log("data absen ", req.body);

    var database = req.query.database;
    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    var listTask = req.body.list_task;
    var attenDate = req.body.atten_date;
    var id = req.body.id;
    var status = req.body.status;

    const tahun = `${array[0]}`;
    console.log("ini id", id);
    const convertYear = tahun.substring(2, 4);

    const convertBulan = array[1].padStart(2, "0");
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;

    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [cekDaily] = await conn.query(
        `SELECT * FROM daily_task WHERE em_id = '${em_id}' AND id = '${id}'`
      );
      console.log("ini cek daily", cekDaily);
      if (cekDaily.length > 0) {
        const taskId = cekDaily[0].id;
        const queryTask = `
                UPDATE daily_task 
                SET em_id = ?, tgl_buat = ?, status_pengajuan = ?
                WHERE id = ?
            `;
        const queryDetail = `
                INSERT INTO daily_task_detail 
                (judul, rincian, tgl_finish, daily_task_id, status, level) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        await conn.query(queryTask, [em_id, attenDate, status, taskId]);
        console.log(taskId);
        const deleteQuery = `
            DELETE  FROM daily_task_detail 
            WHERE daily_task_id = ?
        `;
        const [dlet] = await conn.query(deleteQuery, [taskId]);

        for (const item of listTask) {
          const { task, judul, status, level, tgl_finish } = item;
          var tanggal = formatDate(tgl_finish);
          console.log("ini status", status);
          console.log("ini tanggal", tanggal);

          var tanggal = formatDate(tgl_finish);

          await conn.query(queryDetail, [
            judul,
            task,
            tanggal,
            taskId,
            status.toString(),
            level,
          ]);
        }
        const taskIds = listTask.map((item) => item.id);
        console.log(taskIds);

        console.log(dlet);
      } else {
        const queryTask = `
                INSERT INTO daily_task (em_id, tgl_buat, status_pengajuan) 
                VALUES (?, ?, ?)
            `;

        const queryDetail = `
                INSERT INTO daily_task_detail 
                (judul, rincian, tgl_finish, daily_task_id, status, level) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        const [task] = await conn.query(queryTask, [em_id, attenDate, status]);
        const taskId = task.insertId;

        for (const item of listTask) {
          const { task, judul, status, level, tgl_finish } = item;
          var tanggal = formatDate(tgl_finish);

          await conn.query(queryDetail, [
            judul,
            task,
            tanggal,
            taskId,
            status.toString(),
            level,
          ]);
        }
      }
      await conn.commit();

      res.status(200).json({
        success: true,
        message: "Data Berhasil Ditambahkan",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Insert Data Error: ", error);
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan data: " + error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  },

  async insertDraft(req, res) {
    var database = req.query.database;
    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    var listTask = req.body.list_task;
    var attenDate = req.body.atten_date;
    var status = req.body.status;
    var tanggalOld = req.body.tanggal_old;

    const tahun = `${array[0]}`;
    console.log("ini tahun", tahun);
    const convertYear = tahun.substring(2, 4);

    const convertBulan = array[1].padStart(2, "0");
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();

      let tanggalFinal = tanggalOld === "" ? attenDate : tanggalOld;
      const [cekDailyLama] = await conn.query(
        `SELECT id FROM daily_task WHERE em_id = ? AND tgl_buat = ?`,
        [em_id, tanggalFinal]
      );

      const [cekDailyBaru] = await conn.query(
        `SELECT id FROM daily_task WHERE em_id = ? AND tgl_buat = ?`,
        [em_id, attenDate]
      );

      const [cekDaily] = await conn.query(
        `SELECT id FROM daily_task WHERE tgl_buat = '${attenDate}' AND em_id = '${em_id}'`
      );
      console.log("ini cek daily", cekDaily);
      if (cekDaily.length > 0) {
        return res.status(400).json({
          status: false,
          message: `Tugas di tanggal ${attenDate} ini sudah tersedia`,
        });
      } else {
        const queryTask = `
                INSERT INTO daily_task (em_id, tgl_buat, status_pengajuan) 
                VALUES (?, ?, ?)
            `;

        const queryDetail = `
                INSERT INTO daily_task_detail 
                (judul, rincian, tgl_finish, daily_task_id, status, level) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        const [task] = await conn.query(queryTask, [em_id, attenDate, status]);
        const taskId = task.insertId;

        for (const item of listTask) {
          const { task, judul, status, level, tgl_finish } = item;
          var tanggal = formatDate(tgl_finish);

          await conn.query(queryDetail, [
            judul,
            task,
            tanggal,
            taskId,
            status.toString(),
            level,
          ]);
        }
      }

      await conn.commit();
      res.status(200).json({
        success: true,
        message: "Data berhasil di masukan",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Insert Data Error: ", error);
      res.status(500).json({
        success: false,
        message: "Gagal memperbarui data: " + error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  },

  async updateDraft(req, res) {
    var database = req.query.database;
    var em_id = req.body.em_id;
    var array = req.body.atten_date.split("-");
    var listTask = req.body.list_task;
    var attenDate = req.body.atten_date;
    var status = req.body.status;
    var id = req.body.id;

    const tahun = `${array[0]}`;
    console.log("ini tahun", tahun);
    const convertYear = tahun.substring(2, 4);

    const convertBulan = array[1].padStart(2, "0");
    const namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;
    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [cekDaily] = await conn.query(
        `SELECT * FROM daily_task WHERE em_id = '${em_id}' AND tgl_buat = '${attenDate}' AND id != ${id}`
      );
      if (cekDaily.length > 0) {
        return res.status(400).json({
          status: false,
          message: `Tugas di tanggal ${attenDate} ini sudah tersedia`,
        });
      } else {
        const taskId = id.toString();
        const queryTask = `
                UPDATE daily_task 
                SET em_id = ?, tgl_buat = ?, status_pengajuan = ?
                WHERE id = ?
            `;
        const queryDetail = `
                INSERT INTO daily_task_detail 
                (judul, rincian, tgl_finish, daily_task_id, status, level) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
        await conn.query(queryTask, [em_id, attenDate, status, taskId]);
        console.log(taskId);
        const deleteQuery = `
            DELETE  FROM daily_task_detail 
            WHERE daily_task_id = ?
        `;
        const [dlet] = await conn.query(deleteQuery, [taskId]);

        for (const item of listTask) {
          const { task, judul, status, level, tgl_finish } = item;
          var tanggal = formatDate(tgl_finish);
          console.log("ini status", status);
          console.log("ini tanggal", tanggal);

          var tanggal = formatDate(tgl_finish);

          await conn.query(queryDetail, [
            judul,
            task,
            tanggal,
            taskId,
            status.toString(),
            level,
          ]);
        }
        const taskIds = listTask.map((item) => item.id);
        console.log(taskIds);

        console.log(dlet);
      }

      await conn.commit();

      res.status(200).json({
        success: true,
        message: "Data Berhasil Ditambahkan",
      });
    } catch (error) {
      await conn.rollback();
      console.error("Insert Data Error: ", error);
      res.status(500).json({
        success: false,
        message: "Gagal menambahkan data: " + error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  },

  async getAllDailyTask(req, res) {
    console.log("-----insert data kalim----------");
    console.log("data absen ", req.body);
    const em_id = req.body.em_id;
    var database = req.query.database;
    const statusFilter = req.body.atasanStatus;
    let ms = Date.now();

    var d = new Date(ms),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    var date = req.query.date;

    // var em_id=req.query.id
    console.log(req.body);
    var bulan = req.body.bulan;
    var tahun = req.body.tahun;

    var startPeriode = req.body.start_periode;
    var endPeriode = req.body.end_periode;

    const convertYear = tahun.substring(2, 4);
    var convertBulan;
    if (bulan.length == 1) {
      convertBulan = bulan <= 9 ? `0${bulan}` : bulan;
    } else {
      convertBulan = bulan;
    }
    var namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

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
    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      namaDatabaseDynamic = startPeriodeDynamic;
    }
    console.log("month endd", monthEnd);
    console.log("month start  ", montStart);

    const databaseMaster = `${database}_hrm`;
    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const date = req.query.date;
      const queryCek = `SELECT tgl_buat FROM daily_task WHERE em_id = ? ORDER BY tgl_buat DESC LIMIT 1`;
      const [cekdata] = await conn.query(queryCek, [em_id]);
      cekdata.length > 0 && cekdata[0].tgl_buat;
      let tglFinal;
      if (cekdata.length > 0 && cekdata[0].tgl_buat) {
        const tglBuat = cekdata[0].tgl_buat.toISOString().split("T")[0];
        const today = new Date();
        const tglBuatDate = new Date(tglBuat);
        if (tglBuatDate > today) {
          tglFinal = tglBuat;
        } else {
          tglFinal = new Date().toISOString().split("T")[0];
        }
      } else {
        tglFinal = new Date().toISOString().split("T")[0];
      }
      const querySysData = `SELECT * FROM ${databaseMaster}.sysdata WHERE KODE='013'`;
      const [sysdata] = await conn.query(querySysData);
      const queryTaskPersetujuan1 = `WITH RECURSIVE DateRange AS (
                SELECT DATE_FORMAT('${startPeriode}' ,'%Y-%m-01') AS DATE
                UNION ALL
                SELECT DATE + INTERVAL 1 DAY
                FROM DateRange
                WHERE DATE + INTERVAL 1 DAY <= LAST_DAY(DATE_FORMAT('${startPeriode}' ,'%Y-%m-01'))
            )
            SELECT
             DateRange.date,
            (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='1' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS lembur ,
            (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='2' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS tugas_luar ,
            (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND date_selected  LIKE CONCAT('%',DateRange.date,'%')  AND ajuan='1' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS cuti ,
            (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='2' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }'  LIMIT 1) AS sakit ,
            (SELECT b.name FROM ${namaDatabaseDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='3' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }'  LIMIT 1) AS izin ,
            (SELECT nomor_ajuan FROM ${namaDatabaseDynamic}.emp_leave WHERE em_id='${em_id}' AND date_selected LIKE '%DateRange.date%' AND ajuan='4' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS dinas_luar ,
      (SELECT COUNT(*) FROM ${namaDatabaseDynamic}.daily_task_detail 
     WHERE daily_task_detail.daily_task_id = daily_task.id 
     AND daily_task_detail.status = '0') AS total_status_0,
    (SELECT COUNT(*) FROM ${namaDatabaseDynamic}.daily_task_detail 
     WHERE daily_task_detail.daily_task_id = daily_task.id 
     AND daily_task_detail.status = '1') AS total_status_1,
     (SELECT COUNT(*) FROM ${namaDatabaseDynamic}.daily_task_detail 
     WHERE daily_task_detail.daily_task_id = daily_task.id ) AS jumlah_task,
            (SELECT  IFNULL(off_date ,0) FROM ${namaDatabaseDynamic}.emp_shift WHERE em_id='${em_id}' AND atten_date LIKE DateRange.date) AS off_date,
            holiday.name  AS hari_libur,daily_task.*
            FROM DateRange 
            LEFT JOIN ${namaDatabaseDynamic}.daily_task ON daily_task.tgl_buat=DateRange.date AND em_id='${em_id}' AND daily_task.status_pengajuan != '${statusFilter}'
            LEFT JOIN ${database}_hrm.holiday_date ON holiday_date.holiday_date=DateRange.date LEFT JOIN ${database}_hrm.holiday ON holiday.id=holiday_date.holiday_id
            WHERE DateRange.date <='${tglFinal}'  AND DateRange.date>='${startPeriode}'
            ORDER BY DateRange.date DESC;`;

      const queryTaskPersetujuan2 = `
    
            WITH RECURSIVE DateRange AS (
              SELECT DATE_FORMAT('${endPeriode} ','%Y-%m-01') AS DATE
              UNION ALL
              SELECT DATE + INTERVAL 1 DAY
              FROM DateRange
              WHERE DATE + INTERVAL 1 DAY <= LAST_DAY(DATE_FORMAT('${endPeriode}' ,'%Y-%m-01'))
          )
          SELECT
           DateRange.date,
          (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_labor LEFT JOIN ${database}_hrm.overtime ON overtime.id=emp_labor.typeId WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='1' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS lembur ,
          (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_labor WHERE em_id='${em_id}' AND atten_date=DateRange.date AND ajuan='2' AND status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS tugas_luar ,
          (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id WHERE em_id='${em_id}' AND date_selected  LIKE CONCAT('%',DateRange.date,'%')  AND ajuan='1' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS cuti ,
          (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='2' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS sakit ,
          (SELECT b.name FROM ${endPeriodeDynamic}.emp_leave JOIN ${database}_hrm.leave_types b ON emp_leave.typeid=b.id  WHERE em_id='${em_id}' AND date_selected LIKE CONCAT('%',DateRange.date,'%') AND ajuan='3' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS izin ,
          (SELECT nomor_ajuan FROM ${endPeriodeDynamic}.emp_leave WHERE em_id='${em_id}' AND date_selected LIKE '%DateRange.date%' AND ajuan='4' AND leave_status='${
        sysdata[0].name == "1" || sysdata[0].name == 1 ? "Approve" : "Approve2"
      }' LIMIT 1) AS dinas_luar ,
      (SELECT COUNT(*) FROM ${namaDatabaseDynamic}.daily_task_detail 
     WHERE daily_task_detail.daily_task_id = daily_task.id 
     AND daily_task_detail.status = '0') AS total_status_0,
    (SELECT COUNT(*) FROM ${namaDatabaseDynamic}.daily_task_detail 
     WHERE daily_task_detail.daily_task_id = daily_task.id 
     AND daily_task_detail.status = '1') AS total_status_1,
     (SELECT COUNT(*) FROM ${namaDatabaseDynamic}.daily_task_detail 
     WHERE daily_task_detail.daily_task_id = daily_task.id) AS jumlah_task,
          (SELECT  IFNULL(off_date ,0) FROM ${endPeriodeDynamic}.emp_shift WHERE em_id='${em_id}' AND atten_date LIKE DateRange.date) AS off_date, 
          holiday.name  AS hari_libur,daily_task.*
          FROM DateRange 
          LEFT JOIN ${endPeriodeDynamic}.daily_task ON daily_task.tgl_buat=DateRange.date AND em_id='${em_id}' AND daily_task.status_pengajuan != '${statusFilter}'
          LEFT JOIN ${database}_hrm.holiday_date ON holiday_date.holiday_date=DateRange.date LEFT JOIN ${database}_hrm.holiday ON holiday.id=holiday_date.holiday_id
          WHERE (DateRange.date <='${tglFinal}' AND DateRange.date<='${endPeriode}')
          ORDER BY DateRange.date DESC;
    
    
            
            `;
      const result = await conn.query(queryTaskPersetujuan1);
      const result2 = await conn.query(queryTaskPersetujuan2);
      console.log(queryTaskPersetujuan1);
      let resultFinal = result2;

      // Pastikan result dan result2 berbentuk array
      if (Array.isArray(result) && Array.isArray(result2)) {
        if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
          // Gabungkan kedua array dengan cara yang benar
          resultFinal = [...result2, ...result];
        }
      }
      console.log(resultFinal);
      await conn.commit();
      console.log("--------Berhsail dapatkan data AllDialyTask");
      return res.status(200).json({ success: true, data: resultFinal });
    } catch (error) {
      if (conn) {
        await conn.rollback();
      }
      console.error("--------gagal dapatkan data AllDialyTask", error);
      return res.status(500).json({ success: false, message: error.message });
    } finally {
      conn.release();
    }
  },

  async employeeMonotoringDaily(req, res) {
    var database = req.query.database;
    console.log("masuk sni");
    var emId = req.headers.em_id;
    const connection = await models.createConnection1(`${database}_hrm`);
    let conn;
    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const [results] = await conn.query(
        `SELECT IFNULL(em_daily_task ,'') as em_daily_task FROM employee WHERE em_id='${emId}' LIMIT 1 `
      );
      console.log(results);
      var emids = results[0].em_daily_task.split(",");
      var emidsConver = "";
      for (var i = 0; i < emids.length; i++) {
        emidsConver = emidsConver + `'${emids[i]}',`;
      }

      emidsConver = emidsConver.slice(0, -1);
      console.log("tes tes", results[0]);
      console.log(results);
      var emids = results[0].em_daily_task.split(",");
      var emidsConver = "";
      for (var i = 0; i < emids.length; i++) {
        emidsConver = emidsConver + `'${emids[i]}',`;
      }

      emidsConver = emidsConver.slice(0, -1);
      console.log("tes tes", results[0]);

      const [employee] =
        await conn.query(`SELECT employee.em_email,employee.full_name,employee.em_id FROM employee WHERE em_id  IN (${emidsConver})
                       UNION ALL SELECT employee.em_email,employee.full_name,employee.em_id FROM employee WHERE em_id='${emId}' `);
      await conn.commit();
      return res.status(200).send({
        status: true,
        message: "Succesfully get data",
        data: employee,
      });
    } catch (e) {
      if (conn) {
        await conn.rollback();
      }
      console.error("error", e);
      return res.status(400).send({
        status: false,
        message: "Gagal ambil data",
        data: [],
      });
    } finally {
      if (conn) await conn.release();
    }
  },

  async getDailyTask(req, res) {
    console.log("-----get daily task----------");
    console.log("Data Absen:", req.body);

    const em_id = req.body.em_id;
    const id = req.query.id || req.body.id; // Ambil id dari query atau body
    const database = req.query.database;

    const startPeriode = req.query.start_periode || "2024-02-03";
    const endPeriode = req.query.end_periode || "2024-02-03";

    const convertYear = startPeriode.substring(2, 4);
    const convertBulan = startPeriode.split("-")[1].padStart(2, "0");
    let namaDatabaseDynamic = `${database}_hrm${convertYear}${convertBulan}`;

    // Kondisi untuk perubahan nama database jika periode berbeda
    const date1 = new Date(startPeriode);
    const date2 = new Date(endPeriode);
    const montStart = date1.getMonth() + 1;
    const monthEnd = date2.getMonth() + 1;

    if (montStart < monthEnd || date1.getFullYear() < date2.getFullYear()) {
      const endPeriodeDynamic = `${database}_hrm${endPeriode.substring(2, 4)}${
        endPeriode.split("-")[1]
      }`;
      namaDatabaseDynamic = endPeriodeDynamic;
    }

    console.log("Nama Database Dinamis:", namaDatabaseDynamic);

    const connection = await models.createConnection1(namaDatabaseDynamic);
    let conn;

    try {
      conn = await connection.getConnection();
      await conn.beginTransaction();
      const query = `
            SELECT * FROM daily_task a 
            JOIN daily_task_detail b 
            ON a.id = b.daily_task_id 
            WHERE a.id = ?
        `;
      console.log(query);
      const [result] = await conn.query(query, [id]);

      await conn.commit();

      return res.status(200).json({
        success: true,
        message: "Succesfully get data",
        data: result,
      });
    } catch (error) {
      if (conn) {
        await conn.rollback();
      }
      console.error("Gagal mendapatkan data AllDailyTask", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    } finally {
      if (conn) conn.release();
    }
  },
};
