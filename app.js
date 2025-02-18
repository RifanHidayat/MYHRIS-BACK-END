const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const admin = require("firebase-admin");


const credentials = require("./keyprivate.json");
const WebSocket = require('ws');
const utility = require('./src/utils/utility');
const model= require('./src/utils/models');
admin.initializeApp({
  credential: admin.credential.cert(credentials)
});
const NodeCache = require('node-cache');
require('dotenv').config();
var ipServer=process.env.API_URL

var remoteDirectory = 'public_html/7H202305001'
const SftpClient = require('ssh2-sftp-client');
const configSftp = {
  host: 'imagehris.siscom.id',
  port: 3322, // Default SFTP port is 22
  username: 'siscom',
  password: 'siscom!@#$%'
};
const cron = require('node-cron');
const cron1 = require('node-cron');
const myCache = new NodeCache();

// Fungsi untuk menyimpan data di cache
// function cacheData() {
//     const data = { name: 'Alice', age: 25 };
    
//     // Simpan data dengan TTL 24 jam (24 * 60 * 60 detik)
//     myCache.set('user', data, 86400); // 86400 detik = 24 jam
//     console.log('Data disimpan di cache selama 24 jam.');
// }

function cacheEmployees(employees) {
  // Simpan data karyawan dengan TTL 24 jam (86400 detik)
  myCache.set('employees', employees, 86400); // 86400 detik = 24 jam
  console.log('Data karyawan disimpan di cache selama 24 jam.');
}
function cacheSysdata(sysdata) {
  // Simpan data karyawan dengan TTL 24 jam (86400 detik)
  myCache.set('sysdata', sysdata, 86400); // 86400 detik = 24 jam
  console.log('Data karyawan disimpan di cache selama 24 jam.');
}

const sftp = new SftpClient();
function stopTask() {
  cron.stop();
  console.log('Tugas dihentikan.');
}


// Menjalankan tugas setiap detik
cron.schedule('0 */4 * * *', () => {
  //stopTask();
  fetchData()
    // Tempatkan logika tugas yang ingin dijalankan di sini
});
fetchData();

// Menjalankan tugas setiap detik
cron1.schedule('* * * * * *', () => {

  kirimNotif();

});

async function kirimNotif(){
  const cachedData = myCache.get('employees');
  const connection = await model.createConnection1('sisrajj');
  if (cachedData) {

        const cachedDataSysdata = myCache.get('sysdata');
        if (cachedData) {
         
          var dateNow=utility.dateNow2();
          //logict disini
          var masuk=cachedDataSysdata[0].name.split(',')
          var keluaar=cachedDataSysdata[1].name.split(',')
          var istirahatmasuk=cachedDataSysdata[2].name.split(',')
          var istirahatKeluar=cachedDataSysdata[3].name.split(',')
          var lembur=cachedDataSysdata[4].name.split(',')

    


          
          var startMasuk=-Math.abs(masuk[0]);
          var intervalmasuk=masuk[0];
          var limitMasauk=masuk[0]

          var startKeluar=keluaar[0];
          var intervalKeluar=keluaar[0];
          var limitKeluar=keluaar[0]

          

          var startIstirahatMasuk=-Math.abs(istirahatmasuk[0]);
          var intervalIstirahatMasuk=istirahatmasuk[0];
          var limitIstirahatMasuk=istirahatmasuk[0]

          var startIstirahatKeluar= istirahatKeluar[0]
          var intervalIstirahatKeluar=istirahatKeluar[0];
          var limitIstirahatKeluar=istirahatKeluar[0]


          var startLembur= -Math.abs(lembur[0])
          var intervalLembur=lembur[0];
          var limitLembur=lembur[0]

         
        
    
          for (let  data of cachedData) {
            // jadi plus
            var waktuKeluar=data.time_out
            var waktuIstirahatkeluar=data.break_out

            //jadi minus
            var waktuMasuk= data.time_in;
            var waktuIstirahatMasuk=data.break_in;
            var waktuLembur=data.time_overtime

            const jamMasuk = new Date(`${dateNow}T${waktuMasuk}`); //jam masuk
            const jamKeluar = new Date(`${dateNow}T${waktuKeluar}`); //jam Keluar
            const jamlembur= new Date(`${dateNow}T${waktuLembur}`); //jam Keluar
           
            const jamIstirahatMasuk = new Date(`${dateNow}T${waktuIstirahatMasuk}`); //jam Keluar
            const jamIstirahatKeluar = new Date(`${dateNow}T${waktuIstirahatkeluar}`); //jam Keluar
                 
        //console.log(waktuIstirahatMasuk)
            
            jamMasuk.setMinutes(jamMasuk.getMinutes() + parseInt(startMasuk));
            jamlembur.setMinutes(jamlembur.getMinutes() + parseInt(startLembur));
            jamKeluar.setMinutes(jamKeluar.getMinutes() + parseInt(startKeluar));
            jamIstirahatMasuk.setMinutes(jamIstirahatMasuk.getMinutes() + parseInt(startIstirahatMasuk));
            jamIstirahatKeluar.setMinutes(jamIstirahatKeluar.getMinutes() + parseInt(startIstirahatKeluar));

         
          console.log(jamMasuk.getMinutes(),jamMasuk.getHours());
   
        
            const jamSekarang = new Date(); // jam pulang 
       
            //notifi jam masuk,jam keluar,jam istirahat masuk dan jam istirahat keluar
            if (
              (jamMasuk.getMinutes()==jamSekarang.getMinutes() && jamMasuk.getHours()==jamSekarang.getHours())
               || (jamKeluar.getMinutes()==jamSekarang.getMinutes() && jamKeluar.getHours()==jamSekarang.getHours()) 
               || (jamIstirahatKeluar.getMinutes()==jamSekarang.getMinutes() && jamIstirahatKeluar.getHours()==jamSekarang.getHours()) 
                ||(jamIstirahatMasuk.getMinutes()==jamSekarang.getMinutes() && jamIstirahatMasuk.getHours()==jamSekarang.getHours() && data.status=='absensi') 

              ){
           
                var array=dateNow.split('-')
                var tahun=array[0].toString().substring(2,4)
                var bulan=array[1].toString()
                var namaDatabaseDynamic=`sisrajj_hrm${tahun}${bulan}`

        
              const connection = await model.createConnection2('sisrajj');
            connection.connect((err) => {
              if (err) {
                console.error('Error connecting to the database:', err);
                return;
              }
              connection.beginTransaction((err) => {
                if (err) {
                  console.error('Error beginning transaction:', err);
                  connection.end();
                  return;
                }

                  connection.query(`SELECT * FROM ${namaDatabaseDynamic}.attendance WHERE em_id='${data.em_id}' AND atten_date='${dateNow}' ORDER BY id DESC`, (err, results) => {
                              if (err) {
                                console.error('Error executing SELECT statement:', err);
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: 'gagal ambil data',
                                    data: []

                                  });
                                });
                                return;
                              }

                              connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_leave WHERE date_selected LIKE '%${dateNow}%' AND (ajuan='1' OR ajuan='2' OR ajuan='3')`, (err, sakit) => {
                                if (err) {
                                  console.error('Error executing SELECT statement:', err);
                                  connection.rollback(() => {
                                    connection.end();
                                    return res.status(400).send({
                                      status: true,
                                      message: 'gagal ambil data',
                                      data: []
  
                                    });
                                  });
                                  return;
                                }

                                if (sakit>0){
                                  return res.status(400).send({
                                    status: true,
                                    message: 'gagal ambil data',
                                    data: []

                                  });
                                }
  
 
                    


                             // notifikasi untuk jam masuk
                             if(jamMasuk.getMinutes()==jamSekarang.getMinutes() && jamMasuk.getHours()==jamSekarang.getHours()){
                              if (results.length>=0){
                                console.log('data status ',data.full_name,data.notif_absen_masuk)
                                //munculin notif
                                var messageAbsenMasuk=`Reminder absen masuk`
                               utility.pushNotifikasiApproval(data.token,"Absen Masuk",messageAbsenMasuk,'info absen','',"")
                               console.log('tes',data.full_name)
                              if (data.notif_absen_masuk.includes('true')){
                    
                              }else{
                    
                                if (data.token_notif==null || data.token_notif.toString()==''){
                                }else{
                                  console.log(messageAbsenMasuk)
                                  console.log(data.full_name,data.token_notif)
                                  var messageAbsenMasuk=`Reminder absen masuk`
                                  data.notif_absen_masuk='true';
                                  utility.pushNotifikasiApproval(data.token_notif,"Absen Masuk",messageAbsenMasuk,'info absen','',"")
                                }
                                
                             }
                               
                    
                             
                              }
                            }
                    
                    
                            
                            
                            // notifikasi untuk jam keluar
                            if(jamKeluar.getMinutes()==jamSekarang.getMinutes() && jamKeluar.getHours()==jamSekarang.getHours()){
                              if (results.length>0  ){
                    
                                if (results[0].signout_time=='' ||results[0].signout_time=='00:00:00' || results[0].signout_time==null ){
                                //munculin notif
                                if (data.notif_absen_keluar.includes('true')){

                                }else{
                                  if (data.token_notif==null || data.token_notif.toString()==''){
                                    
                                
                                
                                  }else{
                                    var messageAbsenKeluar=`Reminder absen pulang`
                                    data.notif_absen_keluar='true';
                                    utility.pushNotifikasiApproval(data.token_notif,"Absen Pulang",messageAbsenKeluar,'info absen','',"")
                                    
                                  }

                            

                                }
                                
                                
                                }
                              }else if (results.length==0  ){
                    
                                //munculin notif
                                if (data.notif_absen_keluar.includes('true')){

                                }else{
                                  if (data.token_notif==null || data.token_notif.toString()==''){
                                    
                                
                                
                                  }else{
                                    var messageAbsenKeluar=`Reminder absen pulang`
                                    data.notif_absen_keluar='true';
                                    utility.pushNotifikasiApproval(data.token_notif,"Absen Pulang",messageAbsenKeluar,'info absen','',"")
                                    
                                  }

                            

                                }
                                
                                
                                
                              }


                              
                            }
                    
                    
                           
                    
                    
                    
                             // notifikasi untuk istirahat keluar
                            if (data.tipe_absen=='3' || data.tipe_absen==3){


                              
                              if(jamIstirahatKeluar.getMinutes()==jamSekarang.getMinutes() && jamIstirahatKeluar.getHours()==jamSekarang.getHours()){
                         
                                
                                if (results.length==1){
                                  if (results[0].breakout_time=='' ||results[0].breakout_time=='00:00:00' || results[0].breakout_time==null ){
                                    //munculin notif
                                    if (data.notif_istirahat_keluar.includes('true')){

                                    }else{

                                      if (data.token_notif==null || data.token_notif.toString()==''){

                                      }else{
                                        var messsage=`Reminder Mulai Istirahat`
                                        data.notif_istirahat_keluar='true';
                                        utility.pushNotifikasiApproval(data.token_notif,"Absen Mulai Istirahat",messsage,'info absen','',"")

                                      }
                                    
                                    
                                    }
                                
                                
                                  
                    
                                  }
                                
                                }else 
                                if (results.length==0){
                              
                                    //munculin notif
                                    if (data.notif_istirahat_keluar.includes('true')){

                                    }else{

                                      if (data.token_notif==null || data.token_notif.toString()==''){

                                      }else{
                                     //   var messsage=`Psst! Saatnya me-time! Jangan lupa absen untuk istirahat, ya! ☕️`
                                        var messsage=`Reminder Mulai Istirahat`
                                        data.notif_istirahat_keluar='true';
                                        utility.pushNotifikasiApproval(data.token_notif,"Absen Mulai Istirahat",messsage,'info absen','',"")

                                      }
                                    
                                    
                                    }
                                
                                
                                  
                    
                                  
                                
                                }
                              
                              
                              }
                    
                             
                    
                              // notifikasi untuk istirahat masuk
                              if(jamIstirahatMasuk.getMinutes()==jamSekarang.getMinutes() && jamIstirahatMasuk.getHours()==jamSekarang.getHours()){

                                console.log(jamIstirahatMasuk.getMinutes(),jamSekarang.getMinutes())
                                console.log(jamIstirahatMasuk.getHours(),jamSekarang.getHours())
                                console.log(results.length)
                                if (results.length==1){
                                    //munculin notif
                                    if (results[0].breakin_time=='' ||results[0].breakin_time=='00:00:00' || results[0].breakin_time==null ){
                                      //munculin notif

                                      if (data.notif_istirahat_masuk.includes('true')){
                                        
                                      }else{
                                        if (data.token_notif==null || data.token_notif.toString()==''){

                                        }else{
                                          // var messageAbsenMasuk=`Waktunya kembali fokus! Jangan lupa absen istirahat masuk! ☀️`
                                        //  var messageAbsenMasuk=`Waktunya kembali fokus! Jangan lupa absen istirahat masuk! ☀️`
                                          var messageAbsenMasuk=`Reminder Selesai istirahat`
                                          data.notif_istirahat_masuk='true';
                                          utility.pushNotifikasiApproval(data.token_notif,"Selesai istirahat",messageAbsenMasuk,'info absen','',"")
                                          
                                        }

                                       
                            
                                      }
                                   
                      
                                    }
                                } else  if (results.length==0){
                                  //munculin notif
                                  // if (results[0].breakout_time=='' ||results[0].breakout_time=='00:00:00' || results[0].breakout_time==null ){
                                  //   //munculin notif

                                    if (data.notif_istirahat_masuk.includes('true')){
                                      
                                    }else{
                                      if (data.token_notif==null || data.token_notif.toString()==''){

                                      }else{
                                        var messageAbsenMasuk=`Reminder Selesai istirahat`
                                        data.notif_istirahat_masuk='true';
                                        utility.pushNotifikasiApproval(data.token_notif,"Selesai istirahat",messageAbsenMasuk,'info absen','',"")
                                        
                                      }

                                     
                          
                                    }
                                 
                    //
                             //     }
                              }
                              }
                              
                            }
                            console.log(data)         
      cacheEmployees(cachedData)
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
                  data: []

                });
              });
              return;
            } 

            connection.end();
            console.log('Transaction completed successfully!');
            // return res.status(200).send({
            //   status: true,
            //   message: "Kombinasi email & password Anda Salah",
            //   data: results

            // });

          });
        });

      });
    });
  });
              

            }




            //notif lembur

            if (
              (jamlembur.getMinutes()==jamSekarang.getMinutes() && jamlembur.getHours()==jamSekarang.getHours() && data.status=='lembur') 

              ){
                console.log("lembur");
           
                var array=dateNow.split('-')
                var tahun=array[0].toString().substring(2,4)
                var bulan=array[1].toString()
                var namaDatabaseDynamic=`sisrajj_hrm${tahun}${bulan}`

        
              const connection = await model.createConnection2('sisraajj');
            connection.connect((err) => {
              if (err) {
                console.error('Error connecting to the database:', err);
                return;
              }
              connection.beginTransaction((err) => {
                if (err) {
                  console.error('Error beginning transaction:', err);
                  connection.end();
                  return;
                }

                  connection.query(`SELECT * FROM ${namaDatabaseDynamic}.emp_labor WHERE em_id='${data.em_id}' AND atten_date='${dateNow}' AND ajuan='1' ORDER BY id DESC`, (err, results) => {
                              if (err) {
                                console.error('Error executing SELECT statement:', err);
                                connection.rollback(() => {
                                  connection.end();
                                  return res.status(400).send({
                                    status: true,
                                    message: 'gagal ambil data',
                                    data: []

                                  });
                                });
                                return;
                              }

                              
 
                    


                             // notifikasi untuk jam masuk
                             if(jamlembur.getMinutes()==jamSekarang.getMinutes() && jamlembur.getHours()==jamSekarang.getHours()){
                              if (results.length==0){
                              
                                //munculin notif
                                var messageAbsenMasuk=`Reminder lembur`
                               // utility.pushNotifikasiApproval(data.token,"Absen Masuk",messageAbsenMasuk,'info absen','',"")
                               console.log('tes',data.full_name)
                              if (data.notif_lembur.includes('true')){
                    
                              }else{
                    
                                if (data.token_notif==null || data.token_notif.toString()==''){
                                }else{
                                  
                                  var messageAbsenMasuk=`Reminder Lembur`
                                  data.notif_lembur='true';
                                  utility.pushNotifikasiApproval(data.token_notif,"Lembur",messageAbsenMasuk,'info absen','',"")
                                } 
                                
                             }
                               
                    
                             
                              }
                            }
                    
                    
                            
                            
                
                    
                    
                           
                    
                    
          
                                
      cacheEmployees(cachedData)
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
                  data: []

                });
              });
              return;
            } 

            connection.end();
            console.log('Transaction completed successfully!');
            // return res.status(200).send({
            //   status: true,
            //   message: "Kombinasi email & password Anda Salah",
            //   data: results

            // });

        
        });

      });
    });
  });
              

            }






            

          }
         
        

      } else {
          console.log('Data tidak ditemukan di cache.');
      }
     
 

} else {
      console.log('Data tidak ditemukan di cache.');
  }
  
}


async function fetchData() {
  try {
    var dateNow=utility.dateNow2();
    var date2=utility.dateNow2().split('-');
    var tahun=date2[0].substring(2,4)
    var bulan=date2[1];
    var namaDatabase=`sisrajj_hrm${tahun}${bulan}`
    const connection = await model.createConnection('sisrajj');

    var employeeAll=''
    var emIds='';
    var query=`
    SELECT 'absensi' as status, '' as notif_absen_masuk,'' as notif_absen_keluar,'' as notif_istirahat_keluar,'' as notif_istirahat_masuk, employee.em_id,employee.tipe_absen, employee.full_name ,employee.token_notif,work_schedule.time_in,work_schedule.time_out,work_schedule.break_in,work_schedule.break_out FROM ${namaDatabase}.emp_shift 
    JOIN sisrajj_hrm.work_schedule ON emp_shift.work_id=work_schedule.id LEFT JOIN sisrajj_hrm.employee ON employee.em_id=emp_shift.em_id WHERE atten_date='${dateNow}'
    `
    console.log(query)
    var querySysdata=`
    SELECT name FROM sysdata WHERE kode IN ('S04','S05','S06','S07','S17')
    `
  console.log(query)

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return;
      }
      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error beginning transaction:', err);
          connection.end();
          return;
        }

        connection.query(query, (err, results) => {
          if (err) {
            console.error('Error executing SELECT statement:', err);
            connection.rollback(() => {
              connection.end();
              return res.status(400).send({
                status: true,
                message: 'gagal ambil data',
                data: []

              });
            });
            return;
          }
          connection.query(`SELECT em_ids FROM places_coordinate JOIN overtime ON places_coordinate.place  LIKE CONCAT('%',overtime.lokasi,'%')  `, (err, lokasi) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'gagal ambil data',
                  data: []
  
                });
              });
              return;
            }

            console.log(lokasi)
            if (lokasi.length>0){

              for (var i=0;i<lokasi.length;i++){

                if (lokasi[i].em_ids==''){

                  employeeAll='all'
                }else{
                  var listEmids=lokasi[i].em_ids.split(',');
                  listEmids.forEach((emid) => {
                    if (emIds==''){
                      emIds=`${emIds}'${emid}',`
                    }else{
                      emIds=`${emIds}'${emid}',`
                    }
                    
                  });
                  emIds = emIds.slice(0, -1);
                  console.log(emIds)

                } 

              }

            }else{
              employeeAll='all'
            }

            var queryEmployee=`SELECT '' as notif_lembur ,'lembur' AS status, '' AS notif_absen_masuk,'' AS notif_absen_keluar,'' AS notif_istirahat_keluar,'' AS notif_istirahat_masuk, 
            employee.em_id,employee.tipe_absen, 
            employee.full_name ,employee.token_notif,'' AS time_in,'' AS time_out,'' AS break_in,'' AS break_out ,sysdata.name AS time_overtime 
            FROM employee LEFT JOIN sysdata ON sysdata.kode='042' WHERE  em_id IN (${emIds}) `

            console.log(employeeAll)

            if (employeeAll=='all'){
              queryEmployee=`  SELECT  '' as notif_lembur, 'lembur' AS status, '' AS notif_absen_masuk,'' AS notif_absen_keluar,'' AS notif_istirahat_keluar,'' AS notif_istirahat_masuk, 
              employee.em_id,employee.tipe_absen, 
              employee.full_name ,employee.token_notif,'' AS time_in,'' AS time_out,'' AS break_in,'' AS break_out ,sysdata.name AS time_overtime 
              FROM employee LEFT JOIN sysdata ON sysdata.kode='042' WHERE token_notif!=''`
            }

            connection.query(queryEmployee, (err, employee) => {
              if (err) {
                console.error('Error executing SELECT statement:', err);
                connection.rollback(() => {
                  connection.end();
                  // return res.status(400).send({
                  //   status: true,
                  //   message: 'gagal ambil data',
                  //   data: []
    
                  // });
                });
                return;
              }
           

     
          employee.forEach(function(item, index) {
            results.push(item)
          });
          console.log(results
            
             )
          cacheEmployees(results)
          
          connection.query(querySysdata, (err, sysdata) => {
            if (err) {
              console.error('Error executing SELECT statement:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: 'gagal ambil data',
                  data: []
  
                });
              });
              return;
            }
            cacheSysdata(sysdata)

          
        
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => {
                connection.end();
                return res.status(400).send({
                  status: true,
                  message: "Kombinasi email & password Anda Salah",
                  data: []

                });
              });
              return;
            } 
            connection.end();
            console.log('Transaction completed successfully!');
           
          });
          });
        });

      });
    });

  });

});


  } catch (error) {
      console.error("Terjadi kesalahan:", error);
  }
}



app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
// for parsing multipart/form-data
app.use(fileUpload());
// untuk akses file static
app.use(express.static("public"));

app.use(                
  basicAuth({
    authorizer: (username, password) => {
      const userMatches = basicAuth.safeCompare(username, "aplikasioperasionalsiscom");
      const passwordMatches = basicAuth.safeCompare(password, "siscom@ptshaninformasi#2022@");
      return userMatches & passwordMatches;
    },
  })          
);


const appRouteSiscom = require("./src/routes/route-siscom");
const { chatting } = require("./src/controllers");
app.use("/", appRouteSiscom);

// upload file 
app.post('/upload_form_tidakMasukKerja', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/public/file_tidak_masuk_kerja/' + sampleFile.name;

  const remoteFilePath = `${remoteDirectory}/${database}/file_tidak_masuk_kerja/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(sampleFile.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil ",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image  ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();

  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  // res.send({
  //   status: true,
  //   message: "Berhasil",
  // });
  // });
});





// upload file 
app.post('/upload_form_tidakMasukKerja', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/public/file_tidak_masuk_kerja/' + sampleFile.name;

  const remoteFilePath = `${remoteDirectory}/${database}/file_tidak_masuk_kerja/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(sampleFile.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();

  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  // res.send({
  //   status: true,
  //   message: "Berhasil",
  // });
  // });
});





// upload file 
app.post('/upload_form_pengajuan_absensi', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/public/file_tidak_masuk_kerja/' + sampleFile.name;

  const remoteFilePath = `${remoteDirectory}/${database}/foto_absen/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(sampleFile.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();






  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  // res.send({
  //   status: true,
  //   message: "Berhasil",
  // });
  // });
});







app.post('/upload_form_cuti', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/public/file_cuti/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send({
  //     status: true,
  //     message: "Berhasil",
  //   });
  // });

  const remoteFilePath = `${remoteDirectory}/${database}/file_cuti/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(sampleFile.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();
});








app.post('/upload_form_klaim', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file


  sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/public/file_klaim/' + sampleFile.name;

  // // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send({
  //     status: true,
  //     message: "Berhasil",
  //   });
  // });
  const remoteFilePath = `${remoteDirectory}/${database}/file_klaim/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(sampleFile.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();
});









app.post('/upload_file_permintaan_kandidat', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/public/file_permintaan_kandidat/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send({
  //     status: true,
  //     message: "Berhasil",
  //   });
  // });

  const remoteFilePath = `${remoteDirectory}/${database}/file_permintaan_kandidat/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(sampleFile.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();

});











app.post('/upload_file_kandidat', function (req, res) {
  let sampleFile;
  let uploadPath;
  var database = req.query.database;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/public/file_kandidat/' + sampleFile.name;



  // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function (err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send({
  //     status: true,
  //     message: "Berhasil",
  //   });
  // });

  const remoteFilePath = `${remoteDirectory}/${database}/file_kandidat/${sampleFile.name}`;
  sftp.connect(configSftp)
    .then(() => {
      // SFTP connection successful
      return sftp.put(file.data, remoteFilePath);
    })
    .then(() => {
      res.send({
        status: true,
        message: "Berhasil",
      });
      sftp.end(); // Disconnect after the upload is complete
    })
    .catch(err => {
      console.log(`gagal upload image ${err}`)
      return res.status(500).send(err);
      // Disconnect if an error occurs
    });
  sftp.end();

});

// push notification
app.post('/push_notification', function (req, res) {
  console.log("push notification")

  var token = `${req.body.token_notif}`;
  var title = `${req.body.title}`;
  var message = req.body.message;
  utility.notifikasi(token,title,message)


  // var message = {
  //   data: {
  //     route: 'Pesan',
  //   },
  //   notification: {
  //     title: `${title}`,
  //     body: `${message}`,
  //   },
  //   token: token
  // };

  // FCM.send(message, function (err, response) {
  //   if (err) {
  //     console.log('error found notif', err);
  //   } else {
  //     console.log('response here notif', response);
  //     res.send({
  //       status: true,
  //       message: "Berhasil kirim notif !",
  //     });
  //   }
  // })
});

// push notification
app.post('/push-notification', function (req, res) {

  var token = `${req.body.token_notif}`;
  var title = `${req.body.title}`;
  var message = req.body.message;
  console.log("toke notif ",token)

  utility.notifikasiWeb(token,title,message,req,res)
  // var message = {
  //   data: {
  //     route: 'Pesan',
  //   },
  //   notification: {
  //     title: `${title}`,
  //     body: `${message}`,
  //   },
  //   token: token
  // };

  // FCM.send(message, function (err, response) {
  //   if (err) {
  //     console.log('error found notif', err);
  //   } else {
  //     console.log('response here notif', response);
  //     res.send({
  //       status: true,
  //       message: "Berhasil kirim notif !",
  //     });
  //   }
  // })
});




app.listen(2627, () => {
  console.log("Server Berjalan di Port : 2627");
});





//const server = http.createServer(app);

//server 2
// const socketIo = require('socket.io');
// const app2 = express();
// const http = require('http'); const server = http.createServer(app);
// const io = socketIo(server);
// const model = require('./src/utils/models');
// const utility = require("./src/utils/utility");

//  io.on('connection', async (socket) => {
//   console.log('A user connected');

//   socket.on('disconnect', () => {
//       console.log('User disconnected');
//   });

//   connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to the database:', err);
//       return;
//     }  
//     connection.beginTransaction((err) => {
//       if (err) {
//         console.error('Error beginning transaction:', err);
//         connection.end();
//         return;
//       }
//       var queryUpdate=`SELECT * FROM ${socket.handshake.query.database}_hrm.emp_chat`

//           connection.query( queryUpdate, (err, results) => {
//             if (err) {
//               console.error('Error executing SELECT statement:', err);
//               connection.rollback(() => {
//                 connection.end();
//                 return res.status(400).send({
//                   status: false,
//                   message: 'gagal ambil data',
//                   data:[]
                
//                 });
//               });
//               return;
//             }
            
//             connection.commit((err) => {
//               if (err) {
//                 console.error('Error committing transaction:', err);
//                 connection.rollback(() => {
//                   connection.end();
//                   return res.status(400).send({
//                     status: true,
//                       message: "Berhasil delete pengajuan WFH",
//                      data:[]
                  
//                   });
//                 });
//                 return;
//               }
//               connection.end();
//               console.log('Transaction completed successfully!');
//               socket.emit('initialMessages', results.reverse());
//               return res.status(200).send({
//                 status: true,
//                 message: "Berhasil delete pengajuan WFH",
//                 data:records
              
//               });

          
          
//           });
//         });
//       });
//     });
  

//   socket.on('chat message', (msg) => {
//       console.log('Message: ' + msg);
//       io.emit('chat message', msg);
//   });
// });

// io.on('connection', (socket) => {
// socket.on('disconnect', () => {
//   console.log('User disconnected');
//   });
// socket.on('chat message', (msg) => {
//     console.log('Message: ' + msg);
//      io.emit('chat message', msg);
//   });
// });


// server.listen(2626, () => {
//  // console.log('Server is running on http://localhost:3000');
// });


 
// const wss = new WebSocket.Server({ port: 8080 });
// const clients = new Map();  

// function connect(){
//   wss.on('connection', (ws) => {
//     console.log('Client connected!');
  
//     // Handle incoming messages from client
//     ws.on('message', (message) =>{
      
  
//       const parsedMessage = JSON.parse(message);
  
//       console.log('message ',parsedMessage)
//       setTimeout(connect, 5000);
//       switch (parsedMessage.type) { 
        
  
//           case 'upateStatus':
//             console.log('update status dibaca')
//             var database=`${parsedMessage.database}_hrm`
//             var emId=parsedMessage.em_id
//             var emIdPengirim=parsedMessage.em_id_pengirim
//             var emIdPenerima=parsedMessage.em_id_penerima
//               setInterval(() => {
//                 const configDynamic = {
//                   multipleStatements: true,
//                   host: ipServer,//my${database}.siscom.id (ip local)
//                   user: 'pro',
//                   password: 'Siscom3519',
//                   database: database,
//                   timezone: "+00:00",
//                   connectionLimit: 1000,
//                   connectTimeout: 60 * 60 * 1000,
//                   acquireTimeout: 60 * 60 * 1000,
//                   timeout: 60 * 60 * 1000,
//                 };
//                 const mysql = require("mysql");
//                 const poolDynamic = mysql.createPool(configDynamic);
            
  
//                 var update=`UPDATE ${database}_hrm.emp_chat SET dibaca=1  WHERE (em_id_penerima = '${emIdPengirim}' AND em_id_pengirim = '${emIdPenerima}')`
  
//                 poolDynamic.getConnection(function (err, connection) {
            
//                   if (err) console.log(err);
//                   connection.query(
//                     update,
//                     function (error, results) {
//                       connection.release();
//                       if (error != null) console.log(error)
  
                     
//                       ws.send(JSON.stringify({type:'count',data:results}));
//                     }
//                   );
            
//                 });
               
//               }, 1000);
//               break;
//            case 'setData':
//             console.log('masuk sini');
//               clients.set(parsedMessage.em_id_pengirim, ws);
//               clients.set(parsedMessage.em_id_pengirim, { ws: ws, em_id_penerima: parsedMessage.em_id_penerima });
//               break;
  
//           case 'deleteData':
//             const recipientDataDelete = clients.get(parsedMessage.em_id_penerima);
//             if (recipientDataDelete && recipientDataDelete.em_id_penerima === parsedMessage.em_id_pengirim) {
//                 console.log(true);
//                 recipientDataDelete.ws.send(JSON.stringify({
//                     type: 'deleteData',
//                     em_id_pengirim: parsedMessage.em_id_pengirim,
//                     em_id_pengirim: parsedMessage.em_id_penerima,
//                     id: parsedMessage.id,
                    
  
//                 }));
  
  
  
//             } else {
//                 ws.send(JSON.stringify({ type: 'error', message: 'Recipient not found or not in the same chat.' }));
//             }
  
//                 break;
  
//           case 'message':
//            console.log('message')
//               var database='demohr_hrm';
            
//               const recipientData = clients.get(parsedMessage.em_id_penerima);
//               if (recipientData && recipientData.em_id_penerima === parsedMessage.em_id_pengirim) {
//                   console.log(true);
//                   recipientData.ws.send(JSON.stringify({
//                       type: 'message',
//                       em_id_pengirim: parsedMessage.em_id_pengirim,
//                       em_id_pengirim: parsedMessage.em_id_penerima,
//                       pesan: parsedMessage.pesan,
//                       dibaca: parsedMessage.dibaca  ,
//                       tanggal:parsedMessage.tanggal,
//                       waktu:parsedMessage.waktu,
//                       lampiran:parsedMessage.lampiran,
//                       status:parsedMessage.status,
//                       tipe_lampiran:parsedMessage.tipe_lampiran,
//                       id:parsedMessage.id,
  
  
  
//                   }));
  
  
  
//               } else {
//                   ws.send(JSON.stringify({ type: 'error', message: 'Recipient not found or not in the same chat.' }));
//               }
              
             
//               break;
//           case 'count':
  
//             var database=`${parsedMessage.database}_hrm`
//             var emId=parsedMessage.em_id
//               setInterval(() => {
  
                
//                 const configDynamic = {
//                   multipleStatements: true,
//                   host: ipServer,//my${database}.siscom.id (ip local)
//                   user: 'pro',
//                   password: 'Siscom3519',
//                   database: database,
//                   timezone: "+00:00",
//                   connectionLimit: 1000,
//                   connectTimeout: 60 * 60 * 1000,
//                   acquireTimeout: 60 * 60 * 1000,
//                   timeout: 60 * 60 * 1000,
//                 };
//                 const mysql = require("mysql");
//                 const poolDynamic = mysql.createPool(configDynamic);
            
//                 poolDynamic.getConnection(function (err, connection) {
            
//                   if (err) console.log(err);
//                   connection.query(
//                     `SELECT COUNT(*) AS total  FROM  ${database}.emp_chat WHERE dibaca='0' AND em_id_penerima='${emId}'`,
//                     function (error, results) {
//                       connection.release();
//                       if (error != null) console.log(error)
  
                     
//                       ws.send(JSON.stringify({type:'count',data:results}));
//                     }
//                   );
            
//                 });
               
//               }, 1000);
            
//              break;
//              case 'fetchHistory':
            
            
//                setInterval(() => {
//                 console.log("te");
  
//                 var database=`${parsedMessage.database}_hrm`
//                 var emId=parsedMessage.em_id
//                 var search=parsedMessage.search
//                  const configDynamic = {
//                    multipleStatements: true,
//                    host: ipServer,//my${database}.siscom.id (ip local)
//                    user: 'pro',
//                    password: 'Siscom3519',
//                    database: database,
//                    timezone: "+00:00",
//                    connectionLimit: 1000,
//                    connectTimeout: 60 * 60 * 1000,
//                    acquireTimeout: 60 * 60 * 1000,
//                    timeout: 60 * 60 * 1000,
//                  };
//                  const mysql = require("mysql");
//                  const poolDynamic = mysql.createPool(configDynamic);
  
             
  
//                  var selectData='';
//                  if (search=='' || search==undefined || search==null){
  
//                   selectData=`SELECT 
//                   employee.job_title as job_title,
//                   (SELECT COUNT(*) FROM emp_chat AS e  WHERE e.em_id_penerima='${emId}' AND e.dibaca=0 AND em_id=e.em_id_pengirim) AS jumlah,
//                   employee.full_name,employee.em_id,MAX(emp_chat.id ) AS pesan_id,
//                   (SELECT e.pesan FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS pesan,
//                   (SELECT e.tipe_lampiran FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS tipe_lampiran,
//                   (SELECT e.lampiran FROM emp_chat AS e WHERE e.id=MAX(emp_chat.id)) AS lampiran,
//                   MAX(emp_chat.tanggal) AS tanggal,
//                   MAX(emp_chat.waktu) AS waktu FROM emp_chat  JOIN employee ON (em_id=em_id_pengirim OR em_id=em_id_penerima) WHERE (em_id_pengirim='${emId}' OR em_id_penerima='${emId}') AND employee.em_id!='${emId}'   GROUP BY employee.full_name ORDER BY emp_chat.tanggal, emp_chat.waktu DESC;
//                   `
//                   //  selectData=`  SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_pengirim=employee.em_id AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira,MAX(em_id_penerima) AS em_id_penerima,MAX(em_id_pengirim) AS em_id_pengirim FROM  emp_chat JOIN employee ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' GROUP BY employee.em_id`
                 
  
//                  }else{
//                    selectData=` SELECT (SELECT COUNT(*) FROM emp_chat WHERE em_id_penerima=employee.em_id AND dibaca='0') AS jumlah, employee.job_title, employee.full_name,employee.em_id,MAX(emp_chat.pesan) AS pesan,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira,MAX(tanggal) AS tanggal,MAX(waktu) AS waktu,MAX(dibaca) AS dibaca,MAX(tipe_lampiran) AS tipe_lampira,MAX(em_id_penerima) AS em_id_penerima,MAX(em_id_pengirim) AS em_id_pengirim FROM  employee LEFT JOIN emp_chat ON employee.em_id=emp_chat.em_id_penerima WHERE em_id!='${emId}' AND (employee.full_name LIKE '%${search}%' || employee.job_title LIKE '%${search}%' || employee.em_id LIKE '%${search}%') GROUP BY employee.em_id `
  
  
//                  }
             
//                  poolDynamic.getConnection(function (err, connection) {
             
//                    if (err) console.log(err);
//                    connection.query(
//                      selectData,
//                      function (error, results) {
//                        connection.release();
//                        if (error != null) console.log(error)
   
                      
//                        ws.send(JSON.stringify({type:'fetchHistory',data:results}));
//                      }
//                    );
             
//                  });
                
//                }, 1000);
             
//               break;
//           case 'broadcast':
//               // Kirim pesan ke semua klien
//               clients.forEach((client) => {
//                   client.send(JSON.stringify({ type: 'message', from: parsedMessage.em_id_pengirim, message: parsedMessage.message }));
//               });
//               break;
  
//           default:
//               ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
//               break;
//       }
//     });
  
//     // Handle client disconnection
//     ws.on('close', () => {
//       console.log('Client disconnected.');
//       //Hapus sender dan koneksi dari map
//       for (let [em_id_pengirim, client] of clients.entries()) {
//         if (client === ws) {
//           clients.delete(em_id_pengirim);
//           break;
//         }
//       }
//      restartWebSocketServer()

//     });
//   });
// }

// function restartWebSocketServer() {
//   // setTimeout(() => {
//   //     console.log('Restarting WebSocket server...');
//   //     connect(); // Restart server setelah jeda waktu
//   // }, 5000); // 5 detik jeda sebelum restart
// }
//  connect();

// Server express listening on port 8080