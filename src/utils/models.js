const utility = require("./utility");
const mysql2 = require("mysql2/promise");
let pools = {};
module.exports = {
  query: function (query, databaseDynamic, callback) {
    const mysql = require("mysql");
    var poolQuery = mysql.createPool({
      multipleStatements: true,
      host: "localhost",
      user: "root",
      password: "Siscom3519",
      database: `${databaseDynamic}`,
      connectionLimit: 10000000,
    });
    poolQuery.query(query, function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        poolQuery.end();
        return callback(results);
      }
    });
  },
  queryBody: function (query, body, databaseDynamic, callback) {
    const mysql = require("mysql");
    var poolQuery = mysql.createPool({
      multipleStatements: true,
      host: "localhost",
      user: "root",
      password: "Siscom3519",
      database: `${databaseDynamic}`,
      connectionLimit: 100000,
    });
    poolQuery.query(query, [body], function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        poolQuery.end();
        return callback(results);
      }
    });
  },

  createConnection: async function (database) {
    console.log("tes");
    const mysql = require("mysql");

    const connection = new mysql.createConnection({
      multipleStatements: true,
      host: process.env.API_URL, //myhris.siscom.id (ip)
      user: "pro",
      password: "Siscom3519",
      timezone: "+00:00",
      database: `${database}_hrm`,
      connectionLimit: 20,
      connectTimeout: 10000,
      acquireTimeout: 30000,
      waitForConnections: true,
      queueLimit: 50,
      idleTimeout: 60000, // Tidak membatasi antrean koneksi
    });
    return connection;
  },
  createConnection1: async function (database) {
    if (!pools[database]) {
      try {
        console.log(`Membuat koneksi ke database ${database}`);
        pools[database] = mysql2.createPool({
          multipleStatements: true,
          host:
            database == "sis_admin"
              ? process.env.MY_DATABASE
              : process.env.API_URL,
          user: "pro",
          password: "Siscom3519",
          timezone: "+00:00",
          database: database,
          connectionLimit: 500,
          queueLimit: 0,
          waitForConnections: true,
          connectTimeout: 10000, // Waktu tunggu koneksi 10 detik
          acquireTimeout: 30000, // Waktu tunggu untuk mendapatkan koneksi 30 detik
          idleTimeout: 60000,
        });
        console.log("Pool koneksi database berhasil dibuat!");
      } catch (error) {
        console.error("Gagal membuat koneksi database:", error.message);
        throw error;
      }
    }
    return pools[database];
  },
  createConnection2: async function (database) {
    const mysql = require("mysql");

    const connection = new mysql.createConnection({
      multipleStatements: true,
      host: process.env.API_URL, //myhris.siscom.id (ip)
      user: "pro",
      password: "Siscom3519",
      timezone: "+00:00",
      database: `${database}_hrm`,
      connectionLimit: 20,
      connectTimeout: 10000,
      acquireTimeout: 30000,
      waitForConnections: true,
      queueLimit: 50,
      idleTimeoutMillis: 6000,
    });
    return connection;
  },
  sisAdmin: async function () {
    const mysql = require("mysql");
    const connection = new mysql.createConnection({
      multipleStatements: true,
      host: process.env.MY_DATABASE,
      user: "pro",
      password: "Siscom3519",
      timezone: "+00:00",
      database: "sis_admin",
      connectionLimit: 10000000,
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      timeout: 60 * 60 * 1000,
    });
    return connection;
  },
};
