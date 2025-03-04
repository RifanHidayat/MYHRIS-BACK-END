const utility=require('./utility');
const mysql2 = require('mysql2/promise');

module.exports = {
    query: function (query, databaseDynamic, callback) {
        const mysql = require("mysql");
        var poolQuery = mysql.createPool({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: 'Siscom3519',
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
            host: 'localhost',
            user: 'root',
            password: 'Siscom3519',
            database: `${databaseDynamic}`,
            connectionLimit: 10000000,
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

    createConnection: async function(database){
        console.log("tes")
        const mysql = require("mysql");
      
        const connection = new mysql.createConnection({
            multipleStatements: true,
            host: process.env.API_URL,//myhris.siscom.id (ip)
             user: 'pro',
             password: 'Siscom3519',
             timezone: "+00:00",
             database:`${database}_hrm`,
             connectionLimit: 20,
             connectTimeout: 10000, // 1 jam dalam milidetik
             acquireTimeout: 30000,  // 1 jam
           waitForConnections: true,
   queueLimit: 50, // Tidak membatasi antrean koneksi
          });
          return  connection;
    },
    createConnection1: async function(database) {
        try {
            console.log("Membuat koneksi ke database...");
            const pool = mysql2.createPool({
                multipleStatements: true,
                host: process.env.API_URL, 
                user: 'pro',
                password: 'Siscom3519',
                timezone: "+00:00",
                database: database,
                connectionLimit: 20, // Maksimum koneksi dalam pool
                queueLimit: 50, // Batas antrean koneksi
                connectTimeout: 10000, // Timeout koneksi baru (10 detik)
                acquireTimeout: 30000,  // Timeout saat mendapatkan koneksi dari pool (30 detik)
                waitForConnections: true, // Menunggu antrean jika koneksi penuh
            });
    
            // Menguji koneksi dengan Promise
            const connection = await pool.getConnection();
            console.log("Koneksi database berhasil!");
            connection.release(); // Lepaskan koneksi kembali ke pool
    
            return pool;
        } catch (error) {
            console.error("Gagal membuat koneksi database:", error.message);
            throw error;
        }
    },
    createConnection2: async function(database){
        const mysql = require("mysql");
       
        const connection = new mysql.createConnection({
            multipleStatements: true,
            host: process.env.API_URL,//myhris.siscom.id (ip)
             user: 'pro',
             password: 'Siscom3519',
             timezone: "+00:00",
             database:`${database}_hrm`,
             connectionLimit: 20,
             connectTimeout: 10000, 
             acquireTimeout: 30000,
             waitForConnections: true,
           queueLimit: 50
          });
          return  connection;
    },
    sisAdmin: async function(){
        const mysql = require("mysql");
        const connection =new  mysql.createConnection({
        multipleStatements: true,
        host: process.env.MY_DATABASE,
        user: 'pro',
        password: 'Siscom3519',
        timezone: "+00:00",
        database: 'sis_admin',
        connectionLimit: 10000000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
          });
          return  connection;
    }

    
}