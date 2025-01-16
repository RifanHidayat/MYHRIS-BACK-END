const utility=require('./utility')
var ipServer=process.env.API_URL
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
             connectionLimit: 0,
             connectTimeout: 3600000, // 1 jam dalam milidetik
             acquireTimeout: 3600000,  // 1 jam
           waitForConnections: true,
   connectionLimit: 20, // Sesuaikan dengan kapasitas server
   queueLimit: 0, // Tidak membatasi antrean koneksi
          });
          return  connection;
    },
    createConnection1: async function(database){
        const mysql = require("mysql");
       
        const connection = new mysql.createConnection({
            multipleStatements: true,
            host: process.env.API_URL,//myhris.siscom.id (ip)
             user: 'pro',
             password: 'Siscom3519',
             timezone: "+00:00",
             database:`${database}`,
            connectionLimit: 10000000,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
          });
          return  connection;
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
            connectionLimit: 10000000,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
          });
          return  connection;
    },
    sisAdmin: async function(){
        const mysql = require("mysql");
        const connection =new  mysql.createConnection({
        multipleStatements: true,
        host: 'myappdev.siscom.id',
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