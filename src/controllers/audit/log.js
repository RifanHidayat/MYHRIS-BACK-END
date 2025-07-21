// const models = require("../../utils/models");
// module.exports = {
//   async log(req, res) {
//     console.log("get employ attt");
//     var database = req.query.database;
//     var em_id = req.body.em_id;
//     var idTrx = req.body.id_trx;
//     const getbulan = req.body.bulan;
//     const gettahun = req.body.tahun;
//     const tahun = `${gettahun}`;
//     const convertYear = tahun.substring(2, 4);
//     // const convertBulan = getbulan;
//     var convertBulan;
//     if (getbulan.length == 1) {
//       convertBulan = getbulan <= 9 ? `0${getbulan}` : getbulan;
//     } else {
//       convertBulan = getbulan;
//     }

//     const databaseMaster = `${database}_hrm`;
//     const namaDatabaseDynamic = `${databaseMaster}${convertYear}${convertBulan}`;

//     var fixquery = `SELECT * FROM ${namaDatabaseDynamic}.audit_logs WHERE id_trx='${idTrx}'`;

//     const connection = await models.createConnection1(`${database}_hrm`);
//     console.log(fixquery);

//     let conn;
//     try {
//       conn = await connection.getConnection();
//       await conn.beginTransaction();
//       const [results] = await conn.query(fixquery);
//       await conn.commit();
//       return res.status(200).send({
//         status: true,
//         message: "Data berhasil diambil",
//         data: results,
//       });
//     } catch (e) {
//       if (conn) {
//         await conn.rollback();
//       }
//       console.error("Error:", e);
//       return res.status(400).send({
//         status: false,
//         message: e.message,
//         data: [],
//       });
//     } finally {
//       if (conn) conn.release();
//     }
//   },
// };

const models = require("../../utils/models");

module.exports = {
  async log(req, res) {
    console.log("Mendapatkan log audit...");
    
    // Ambil parameter dari body dan query
    const { id_trx } = req.body;
    const { database } = req.query;

    // 1. Validasi input penting
    if (!database || !id_trx) {
      return res.status(400).send({
        status: false,
        message: "Parameter 'database' (di query) dan 'id_trx' (di body) wajib diisi.",
        data: [],
      });
    }

    // 2. Tentukan nama database utama. Tabel 'audit_logs' ada di sini.
    const mainDatabase = `${database}_hrm`; // Hasilnya: 'net_hrm'
    console.log(`Mencari log di tabel: ${mainDatabase}.audit_logs`);

    // 3. Query yang menargetkan tabel di database utama. Gunakan '?' untuk keamanan.
    const query = `SELECT * FROM ${mainDatabase}.audit_logs WHERE id_trx = ?`;

    let conn;
    try {
      // 4. PERBAIKAN: Gunakan 'createConnection1' yang mengembalikan pool koneksi.
      const connectionPool = await models.createConnection1(mainDatabase); 
      conn = await connectionPool.getConnection();

      // 5. Eksekusi query dengan aman (tanpa perlu transaksi untuk SELECT)
      const [results] = await conn.query(query, [id_trx]);
      
      return res.status(200).send({
        status: true,
        message: "Data log berhasil diambil",
        data: results,
      });
    } catch (e) {
      console.error("Database Error:", e);

      if (e.code === 'ER_NO_SUCH_TABLE') {
          return res.status(404).send({
              status: false,
              message: `Tabel 'audit_logs' tidak ditemukan di database '${mainDatabase}'. Harap periksa struktur database Anda.`,
              data: [],
          });
      }

      return res.status(500).send({
        status: false,
        message: "Terjadi kesalahan pada server: " + e.message,
        data: [],
      });
    } finally {
      // 6. Selalu lepaskan koneksi kembali ke pool
      if (conn) conn.release();
    }
  },
};