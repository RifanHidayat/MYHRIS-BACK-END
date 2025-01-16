const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);
const sha1 = require('sha1');
const e = require("express");
const axios = require('axios');
const utility=require('./../utils/utility')
// const faceApiService = require('./faceapiService');

var request = require('request');

const model = require('../utils/models');


pool.on("error", (err) => {
  console.error(err);
});
require('dotenv').config();

var ipServer=process.env.API_URL

module.exports = {



    async bpjsKesehatan(req, res) {
      
          var database=req.query.database
          var em_id = req.body.em_id;
          var tahun = req.body.tahun; 

          
          var month=req.body.bulan
          const configDynamic = {
            multipleStatements: true,
            host: ipServer,//my${database}.siscom.id (ip local)
            user: 'pro',
            password: 'Siscom3519',
            database: `${database}_hrm`,
            connectionLimit: 10000000,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
          };
          const mysql = require('mysql2/promise');
          const poolDynamic = mysql.createPool(configDynamic);
      
          const connection = await poolDynamic.getConnection();
         
            
          const [results] = await connection.query(` SELECT * FROM emp_salary${tahun} WHERE initial IN ('A93','D51') AND em_id='${em_id}'  ORDER BY initial`);
          var tk=0;
          var pt=0;

          var data=[];
          console.log(req.body)
      
          for (const el of results) {
            try {
                  //value PT
                  if (el['fiscal'+month]=="0" ||el['fiscal'+month]=="" || el['fiscal'+month]==null || el['fiscal'+month]>0 ){
                    pt=0
                  }else{
                   var output01= await decryptData(el['fiscal'+month], el['keycode'+month],database)
                    if (el['initial']=="A93"){
                        pt=output01
                    }else if (el['initial']=="D51"){
                        tk=output01
        
                    }
                  }

            } catch (error) {
              console.error(`Error processing: ${item}`);
            }
          }

          var datum={
            pt:pt,
            pt_percent:4,
            tk:tk,
            tk_percent:1,
            premit:parseFloat(pt)+parseFloat(tk),
            premi_percent:5
        
    

        }
        data.push(datum)
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: data,
      
          });
      
      
      
      
      
         async function decryptData(nilai, keycode,dbname)  {
          console.log("masuk sini")
          
          try {
               // Basic Authentication credentials
               const username = 'aplikasioperasionalsiscom';
               const password = 'siscom@ptshaninformasi#2022@';
               const auth = Buffer.from(`${username}:${password}`).toString('base64');
               const headers = {
                 'Authorization': `Basic ${auth}`,
               };
      
               // Set up the request options
               const options = {
                 method: 'GET',
                 headers: headers,
               };
               var k=`https://myhris.siscom.id/custom/${database}/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`
            const response = await axios.get(k,{headers}); // Replace with your actual API endpoint
         
         console.log("data k ",k)
         
            // res.json(response.data);
          console.log(response.data.status)
          if (response.data.status==true){
            console
            return response.data.data;
      
          }else{
            return "0"
          }
          
          } catch (error) {
            console.log(error )
            return "1 "
          }
      
      
      
        
           
          }
        },



        async bpjsKesehatanUpload(req, res) {
      
          var database=req.query.database
          var em_id = req.body.em_id;
          var tahun = req.body.tahun; 

          var type='bpjs_kesehatan'

          
          var month=req.body.bulan
          const configDynamic = {
            multipleStatements: true,
            host: ipServer,//my${database}.siscom.id (ip local)
            user: 'pro',
            password: 'Siscom3519',
            database: `${database}_hrm`,
            connectionLimit: 10000000,
            connectTimeout: 60 * 60 * 1000,
            acquireTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
          };
          const mysql = require('mysql2/promise');
          const poolDynamic = mysql.createPool(configDynamic);
      
          const connection = await poolDynamic.getConnection();
         
            
        var data = await connection.query(` SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND type='${type}' AND em_id='${em_id}'`);

        console.log(` SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND type='${type}'`)
   
      
         

       
          res.send({
            status: true,
            message: "Berhasil ambil data!",
            data: data[0],
      
          });
      
      
      
      
      
  
        },
        
    async bpjsKesehatan(req, res) {
      
      var database=req.query.database
      var em_id = req.body.em_id;
      var tahun = req.body.tahun; 

      
      var month=req.body.bulan
      const configDynamic = {
        multipleStatements: true,
        host: ipServer,//my${database}.siscom.id (ip local)
        user: 'pro',
        password: 'Siscom3519',
        database: `${database}_hrm`,
        connectionLimit: 10000000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
      };
      const mysql = require('mysql2/promise');
      const poolDynamic = mysql.createPool(configDynamic);
  
      const connection = await poolDynamic.getConnection();
     
        
      const [results] = await connection.query(` SELECT * FROM emp_salary${tahun} WHERE initial IN ('A93','D51') AND em_id='${em_id}'  ORDER BY initial`);
      var tk=0;
      var pt=0;

      var data=[];
      console.log(req.body)
  
      for (const el of results) {
        try {
              //value PT
              if (el['fiscal'+month]=="0" ||el['fiscal'+month]=="" || el['fiscal'+month]==null || el['fiscal'+month]>0 ){
                pt=0
              }else{
               var output01= await decryptData(el['fiscal'+month], el['keycode'+month],database)
                if (el['initial']=="A93"){
                    pt=output01
                }else if (el['initial']=="D51"){
                    tk=output01
    
                }
              }

        } catch (error) {
          console.error(`Error processing: ${item}`);
        }
      }

      var datum={
        pt:pt,
        pt_percent:4,
        tk:tk,
        tk_percent:1,
        premit:parseFloat(pt)+parseFloat(tk),
        premi_percent:5
    


    }
    data.push(datum)
      res.send({
        status: true,
        message: "Berhasil ambil data!",
        data: data,
  
      });
  

     async function decryptData(nilai, keycode,dbname)  {
      console.log("masuk sini")
      
      try {
           // Basic Authentication credentials
           const username = 'aplikasioperasionalsiscom';
           const password = 'siscom@ptshaninformasi#2022@';
           const auth = Buffer.from(`${username}:${password}`).toString('base64');
           const headers = {
             'Authorization': `Basic ${auth}`,
           };
  
           // Set up the request options
           const options = {
             method: 'GET',
             headers: headers,
           };
           var k=`https://myhris.siscom.id/custom/${database}/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`
        const response = await axios.get(k,{headers}); // Replace with your actual API endpoint
     
     console.log("data k ",k)
     
        // res.json(response.data);
      console.log(response.data.status)
      if (response.data.status==true){
        console
        return response.data.data;
  
      }else{
        return "0"
      }
      
      } catch (error) {
        console.log(error )
        return "1 "
      }
  
  
  
    
       
      }
    },



        async bpjsKetanagakerjaan(req, res) {
      
            var database=req.query.database
            var month=req.body.bulan
            const configDynamic = {
              multipleStatements: true,
              host:ipServer,//my${database}.siscom.id (ip local)
              user: 'pro',
              password: 'Siscom3519',
              database: `${database}_hrm`,
              connectionLimit: 10000000,
              connectTimeout: 60 * 60 * 1000,
              acquireTimeout: 60 * 60 * 1000,
              timeout: 60 * 60 * 1000,
            };
            const mysql = require('mysql2/promise');
            const poolDynamic = mysql.createPool(configDynamic);
        
            const connection = await poolDynamic.getConnection();
            var em_id = req.body.em_id;
            var tahun = req.body.tahun; 
              
            const [results] = await connection.query(`SELECT * FROM emp_salary${tahun} WHERE initial IN ('A93','D51') AND em_id='${em_id}'  ORDER BY initial`);
            var jkkPt=0;
            var jkmPt=0;
            var jkPtkPercent=0.24;
            var jkmPtPercent=0.30;
            var jhtPt=0;
            var jhtTk=0
            var jhtPtPercent=3.7;
            var jhtTkPercent=2;
            var jppPtPercent=2;
            var jppTKPercent=1;
            var jpPt=0;
            var jpTk=0;
  
            var data=[];
        
            for (const el of results) {
              try {
                    //value PT
                    if (el['fiscal'+month]=="0" ||el['fiscal'+month]=="" || el['fiscal'+month]==null || el['fiscal'+month]>0 ){
                      pt=0
                    }else{
                     var output01= await decryptData(el['fiscal'+month], el['keycode'+month],database)
                      if (el['initial']=="A91"){
                          jkkPt=output01
                    
                    
                        }else if (el['initial']=="A92"){
                          jkmPt=output01
          
                    
                        }else if (el['initial']=="D53"){
                        jhtPt=output01
        
                    
                    }else if (el['initial']=="C04"){
                        jhtTk=output01
        
                    
                    }else if (el['initial']=="D52"){
                        jpPt=output01
        
                    
                    }else if (el['initial']=="C05"){
                        jpTk=output01
        
                    }


                    }
  
              } catch (error) {
                console.error(`Error processing: ${item}`);
              }
            }
  

           
  
            var datum={
              jkk_tk:jkkPt,
              jkm_tk:jkmPt,
              jkk_tk_percent:jkPtkPercent,
              jkm_tk_percent:jkmPtPercent,
              jht_pt_percent:jhtPtPercent,
              jht_tk:jhtTk,
              jht_pt:jhtPt,

              jht_tk_percent:jhtTkPercent,
              jpp_pt_percent:jppPtPercent,
              jpp_tk_percent:jppTKPercent,
              jpp_pt:jpPt,
              jpp_tk:jpTk,
          }
          data.push(datum)
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: data,
        
            });
        
        
        
        
        
           async function decryptData(nilai, keycode,dbname)  {
            console.log("masuk sini")
            
            try {
                 // Basic Authentication credentials
                 const username = 'aplikasioperasionalsiscom';
                 const password = 'siscom@ptshaninformasi#2022@';
                 const auth = Buffer.from(`${username}:${password}`).toString('base64');
                 const headers = {
                   'Authorization': `Basic ${auth}`,
                 };
        
                 // Set up the request options
                 const options = {
                   method: 'GET',
                   headers: headers,
                 };
              const response = await axios.get(`https://myhris.siscom.id/custom/${dbname}/api/decrypt?keycode=${keycode}&nilai=${nilai}&aplikasioperasionalsiscomkey=siscom@ptshaninformasi%232022@`,{headers}); // Replace with your actual API endpoint
             // res.json(response.data);
            console.log(response.data.status)
            if (response.data.status==true){
              console
              return response.data.data;
        
            }else{
              return "0"
            }
            
            } catch (error) {
              console.log(error )
              return "1 "
            }
        
        
        
          
             
            }
          },

          async bpjsKetagakerjaanUpload(req, res) {
      
            var database=req.query.database
            var em_id = req.body.em_id;
            var tahun = req.body.tahun; 
  
            var type='bpjs_ketenagakerjaan'
  
            
            var month=req.body.bulan
            const configDynamic = {
              multipleStatements: true,
              host: ipServer,//my${database}.siscom.id (ip local)
              user: 'pro',
              password: 'Siscom3519',
              database: `${database}_hrm`,
              connectionLimit: 10000000,
              connectTimeout: 60 * 60 * 1000,
              acquireTimeout: 60 * 60 * 1000,
              timeout: 60 * 60 * 1000,
            };
            const mysql = require('mysql2/promise');
            const poolDynamic = mysql.createPool(configDynamic);
        
            const connection = await poolDynamic.getConnection();
           
              
          var data = await connection.query(`SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND em_id='${em_id}' AND type='${type}'`);
     
          
            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: data[0],
        
            });
    
          },


          
          async pph21(req, res) {
      
            var database=req.query.database
            var em_id = req.body.em_id;
            var tahun = req.body.tahun; 
  
            var type='pph21'
            var month=req.body.bulan
            const configDynamic = {
              multipleStatements: true,
              host: ipServer,//my${database}.siscom.id (ip local)
              user: 'pro',
              password: 'Siscom3519',
              database: `${database}_hrm`,
              connectionLimit: 10000000,
              connectTimeout: 60 * 60 * 1000,
              acquireTimeout: 60 * 60 * 1000,
              timeout: 60 * 60 * 1000,
            };
            const mysql = require('mysql2/promise');
            const poolDynamic = mysql.createPool(configDynamic);
        
            const connection = await poolDynamic.getConnection();
        
          var data = await connection.query(`SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND type='${type}' AND em_id='${em_id}'`);

          console.log(`SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND type='${type}'`)
     
         

            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: data[0],
        
            });
    
          },

          async splitGajiNew(req, res) {

            console.log("slip gaji")
      
            var database=req.query.database
            var em_id = req.body.em_id;
            var tahun = req.body.tahun; 
  
            var type='slip_gaji'
            var month=req.body.bulan
            const configDynamic = {
              multipleStatements: true,
              host: ipServer,//my${database}.siscom.id (ip local)
              user: 'pro',
              password: 'Siscom3519',
              database: `${database}_hrm`,
              connectionLimit: 10000000,
              connectTimeout: 60 * 60 * 1000,
              acquireTimeout: 60 * 60 * 1000,
              timeout: 60 * 60 * 1000,
            };
            const mysql = require('mysql2/promise');
            const poolDynamic = mysql.createPool(configDynamic);
        
            const connection = await poolDynamic.getConnection();
        
            var data = await connection.query(`SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND type='${type}' AND em_id='${em_id}'`);
            console.log(`SELECT * FROM employee_file WHERE file_title LIKE '%${tahun}%' AND type='${type}' AND em_id='${em_id}'`)
            
            
            console.log(data[0]);
         

            res.send({
              status: true,
              message: "Berhasil ambil data!",
              data: data[0],
        
            });
    
          },
        
        

}






