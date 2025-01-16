const config = require("../../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");


var request = require('request');

const model = require('../../utils/models');
const utility = require('../../utils/utility');
var remoteDirectory = 'public_html/7H202305001'
pool.on("error", (err) => {
  console.error(err);
});

const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();
module.exports = { 

}

