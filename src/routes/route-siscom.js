const router = require("express").Router();
const { operasional,login, dashboard ,absensi,payroll,izin,notifikasi,
    claim,
    tracking,
    wfh,
    loan,
    chatting,lembur,cuti,tugasLuar, klaim,pengadaanKerusakan, peraturanPerusahaan,employee,suratPeringatan,pinjamanAsset,cabang} = require("../controllers");
const { isAuth } = require("../controllers/login");

const auth = require('../middleware/auth');
router.post("/hapus_foto_user", login.deleteFoto);
router.get("/employee", operasional.allData);
router.get("/absensi", operasional.allData);
router.get("/banner_dashboard", operasional.allData);
router.get("/getMenu", operasional.getMenuDashboard);
router.get("/notice", operasional.notice);
router.post("/notice-polling", operasional.detailNoticePolling);
router.post("/notice-polling-save", operasional.savePolling);
router.get("/notice-polling-employee", operasional.detailNoticePollingEmployee);
router.get("/leave_types", operasional.allData);

router.get("/places_coordinate",absensi.PalceCoordinate);
router.post("/attendance",absensi.historyAttendance);
// router.post("/attendance-offiline",absensi.kirimAbsensiOffline);
router.get("/places_coordinate_pengajuan",absensi.PalceCoordinatePengajuan);
router.get("/faq", operasional.allData);
router.get("/all_department", operasional.allData);
router.get("/sysdata", operasional.allData);
router.get("/cost", operasional.allData);
router.get("/overtime", operasional.overtime);
router.get("/menu_dashboard", operasional.showMenuDashboard);
router.get("/menu_dashboard_utama", operasional.showMenuDashboardUtama);
router.get("/banner_from_finance", operasional.banner_from_finance);
router.get("/setting_shift", operasional.setting_shift);




router.post('/validasiLogin', operasional.validasiLogin);
router.post('/refresh_employee',auth.isAuth, operasional.refresh_employee);
router.post('/validasiGantiPassword', operasional.validasiGantiPassword);
router.post('/new-password',operasional.newPasswordBaru);
router.post('/load_aktifitas',auth.isAuth, operasional.load_aktifitas);
router.post('/pencarian_aktifitas', operasional.pencarian_aktifitas);
router.post('/load_approve_info',auth.isAuth, operasional.load_approve_info);
router.post('/load_approve_info_multi', operasional.load_approve_info_multi);
router.post('/load_approve_history',auth.isAuth, operasional.load_approve_history);
router.post('/load_approve_history_multi',auth.isAuth, operasional.load_approve_history_multi);
router.post('/spesifik_approval', operasional.spesifik_approval);
router.post('/list_approve_payroll', operasional.listApprovalPayroll);
router.post('/spesifik_approval_multi', operasional.spesifik_approval_multi);
router.post('/load_notifikasi',auth.isAuth, operasional.load_notifikasi);

router.post('/load_laporan_absensi',auth.isAuth, operasional.load_laporan_absensi);
router.post('/load_laporan_absensi_filter_lokasi', auth.isAuth,operasional.load_laporan_absensi_filter_lokasi);
router.post('/load_laporan_absensi_tanggal', operasional.load_laporan_absensi_tanggal);
router.post('/load_laporan_absensi_harian', operasional.load_laporan_absensi_harian);
router.post('/load_laporan_absensi_harian_telat', operasional.load_laporan_absensi_harian_telat);

router.post('/load_laporan_belum_absen', operasional.load_laporan_belum_absen);
router.post('/load_laporan_pengajuan', operasional.load_laporan_pengajuan);
router.post('/load_detail_laporan_pengajuan', operasional.load_detail_laporan_pengajuan);
router.post('/load_laporan_pengajuan_harian', operasional.load_laporan_pengajuan_harian);

router.post("/insert_absen_approve_pengajuan", operasional.insert_absen_approve_pengajuan);
router.post("/notifikasi_reportTo", operasional.notifikasi_reportTo);
router.post('/load_history_kontrol', operasional.load_history_kontrol);
router.post('/cari_informasi_employee', operasional.cari_informasi_employee);
router.post('/informasi_wa_atasan', operasional.informasi_wa_atasan);
router.post('/informasi_employee_ultah', operasional.informasi_employee_ultah);
router.post('/info_aktifitas_employee', operasional.info_aktifitas_employee);
router.post('/info_sisa_kontrak', operasional.info_sisa_kontrak);
// router.post('/push_notification', operasional.push_notification);

router.post("/emp_leave_lastrow", operasional.emp_leave_lastrow);
router.post("/emp_labor_lastrow", operasional.emp_labor_lastrow);
router.post("/emp_klaim_lastrow", operasional.emp_klaim_lastrow);
router.post("/emp_request_lastrow", operasional.emp_request_lastrow);


router.post('/attendance-break',auth.isAuth, operasional.kirimAbsenIstiraha);
router.post('/kirimAbsen',auth.isAuth, operasional.runTransaction);
router.post('/kirimPengajuanTMK', auth.isAuth,operasional.kirimTidakMasukKerja);

router.post('/lembur',auth.isAuth,lembur.store);
router.post('/atas-perintah',auth.isAuth,lembur.atasPerintah);
router.post('/berhubungan-dengan', lembur.berhubunganDengan);
router.post('/lembur/detail',auth.isAuth,lembur.detailTask);
router.post('/tugas-luar',auth.isAuth,tugasLuar.store);
router.post('/klaim',auth.isAuth,klaim.store);

router.post('/edit-lembur',auth.isAuth,lembur.updateLembur);

router.post('/insert-emp_labor',auth.isAuth,operasional.insertData);
router.post('/insert-emp_leave',auth.isAuth, operasional.insertData);
router.post('/cuti',auth.isAuth,cuti.store );
router.get('/history-cuti',auth.isAuth,cuti.historyCuti );
router.post('/cuti/type',auth.isAuth,izin.tipeIzin );
router.post('/cuti-tipe',auth.isAuth,cuti.tipeCuti );
router.post('/insert-emp_claim', auth.isAuth,operasional.insertData);
router.post('/insert-notifikasi',auth.isAuth, notifikasi.insertNotifikasi);
router.post('/insert-candidate',auth.isAuth, operasional.insert_kandidat_baru);
router.post('/insert-employee_request', auth.isAuth,operasional.insert_permintaan_kandidat);
router.post('/insert_emp_control_employee', auth.isAuth,operasional.insert_emp_control_employee);
router.post('/employee-divisi',auth.isAuth, operasional.empoyeeDivisi);

router.post('/slip_gaji',auth.isAuth, operasional.slip_gaji);
//router.post('/pph21',auth.isAuth, operasional.pph21);



router.post('/whereOnce-employee',auth.isAuth, operasional.whereOnce);
router.post('/employee-delegasi',auth.isAuth, operasional.empoyeeDelegasi);
router.post('/whereOnce-attendance', operasional.whereOnceAttendate);
router.post('/whereOnce-assign_leave', operasional.whereOnce);
router.post('/whereOnce-leave_types', operasional.whereOnce);
router.post('/whereOnce-settings', operasional.whereOnce);
router.post('/whereOnce-employee_history', operasional.whereOnce);
router.post('/whereOnce-candidate', operasional.whereOnce);


router.post('/history-attendance',auth.isAuth, operasional.historyData);
router.post('/history-emp_labor',auth.isAuth, operasional.historyData);
router.post('/history-emp_claim',auth.isAuth, operasional.historyData);
router.post('/history-emp_leave',auth.isAuth, operasional.historyAjuanTidakMasukKerja);
router.post('/history-permintaan_kandidat',auth.isAuth, operasional.historyPermintaanKandidat);
router.post('/emp_leave_load_izin',auth.isAuth, operasional.emp_leave_load_izin);

router.post('/emp_leave_load_izin_kategori',auth.isAuth,operasional.empIzinCategori);
router.post('/emp_leave_load_dinasluar', auth.isAuth,operasional.emp_leave_load_dinasluar);

router.post('/edit-emp_labor', operasional.editData);
router.post('/edit-employee', operasional.editData);
router.post('/edit-emp_leave', operasional.editData);


router.post('/edit-emp_labor-approval-task', operasional.approvalTransaksiNew);
router.post('/edit-emp_labor-approval', operasional.approvalTransaksi);
router.post('/edit-emp_leave-approval', operasional.approvalTransaksi);
router.post('/edit-emp_claim', operasional.approvalTransaksi);

router.post('/edit-notifikasi', operasional.editData);
router.post('/edit_face', operasional.edit_face);
router.post("/get_face", operasional.get_face_mx);
router.post('/edit_foto_user', auth.isAuth,operasional.edit_foto_user);
router.post('/potong_cuti', operasional.potong_cuti);

router.post('/edit_last_login', operasional.edit_last_login);
router.post('/edit_last_login_clear',auth.isAuth, operasional.edit_last_login_id_mobile);
router.post('/edit_last_login_id_mobile', operasional.edit_last_login_id_mobile);
router.post('/edit_status_kandidat',auth.isAuth, operasional.edit_status_kandidat);
router.post('/edit_statusAkhir_kandidat', operasional.edit_statusAkhir_kandidat);
router.post('/tolak_kandidat', operasional.tolak_kandidat);


router.post('/validasi-payroll', operasional.cekApprovalPayroll);
router.post('/validasi-payroll-check', operasional.checkSlipGajiValidation);
router.post('/approve_emp_mobile_payroll', operasional.approvePayroll);


router.post('/delete-emp_leave', operasional.deleteData);
router.post('/delete-emp_labor', operasional.deleteData);
router.post('/delete-emp_claim', operasional.deleteData);



//controller login
router.get('/login/check-database', login.database);
router.get('/mobile-version', login.updateVersion);
router.get('/mobile-version-last', login.updateVersionLast);
router.post('/login', login.loginUser);
router.get('/login/cek-no-hp', login.cekNoHp);
router.post('/edit_last_login',login.editLastLogin);
router.post("/view_last_absen_user", operasional.view_last_absen_user);
router.post("/view_last_absen_user2", absensi.viewLastAbsen);
//router.get("/view_last_absen_user3",absensi.PalceCoordinate);
//controller dashboard
router.get('/dashboard/menu', dashboard.menu);
router.get('/login/send-email', dashboard.kirimEmail);
router.post('/validate-login-session', login.isAuth);




router.post('/employee-attendance', operasional.employeeAttendance);
router.post('/save-employee-attendance', operasional.saveEmployeeAttendance);
router.post('/get-employee-attendance', operasional.getEmployeeAttendance);
router.post('/delete-employee-attendance', operasional.UpdateEmployeeAttendance);
router.post('/approval-employee-attendance', operasional.ApprovalAbsensi);
router.post('/load_cuti_melahirkan', operasional.loadCutiMelahirkan);

// router.post('/emp-claim-saldo', claim.claimSaldo);
// router.post('/bpjs-kesehatan',payroll.bpjsKesehatan);
// router.post('/bpjs-ketanagakerjaan', payroll.bpjsKetanagakerjaan);
router.post('/bpjs-kesehatan',payroll.bpjsKesehatanUpload);
router.post('/bpjs-ketanagakerjaan', payroll.bpjsKetagakerjaanUpload);
router.post('/slip-gaji', payroll.splitGajiNew);
router.post('/pph21', payroll.pph21);



//new root
router.post('/izin', auth.isAuth,izin.store);
router.post('/push_notification_approval', notifikasi.notifikasi);
router.post('/work-schedule', dashboard.workSchedule);

router.get('/history-izin', auth.isAuth,izin.historyIzin);



router.post('/employee-tracking-insert',tracking.store);
router.post('/employee-tracking-detail', auth.isAuth,tracking.employeeControllDetail);
router.post('/employee-tracking-history', auth.isAuth,tracking.groupDate);
router.post('/employee-tracking', auth.isAuth,tracking.employee);
router.post('/employee-tracking-update', auth.isAuth,tracking.updateTracking);
router.post('/employee-tracking-clear', auth.isAuth,tracking.clearTrackinng);




router.post('/wfh', auth.isAuth,wfh.store)
router.post('/wfh-approval', wfh.approveWfh);
router.post('/wfh-delete', wfh.destroy);

router.post('/employee-loan-insert', loan.store);

router.post('/employee-loan-history', loan.index);
router.post('/employee-loan-approval', loan.approval);
router.post('/employee-loan-update', loan.update);
router.post('/employee-loan-delete', loan.destroy);
router.post('/employee-loan-detail', loan.detailCicilan);

router.post('/chatting',chatting.store);
router.get('/chatting/history',chatting.history);
router.post('/chatting/update-status',chatting.updateStatus);

router.get('/chatting/employee-history',chatting.historyChat);
router.get('/chatting/employee',chatting.employee);
router.get('/chatting/employee-history/count',chatting.countChat);
router.post('/chatting/delete',chatting.deleteMessage);



//pengaduan kerusakan
router.post('/pengaduan-kerusakan',pengadaanKerusakan.store);
router.patch('/pengaduan-kerusakan/:id',pengadaanKerusakan.update);
router.get('/pengaduan-kerusakan',pengadaanKerusakan.show);
router.get('/pengaduan-kerusakan/:id/detail',pengadaanKerusakan.detail);
router.delete('/pengaduan-kerusakan/:id',pengadaanKerusakan.delete);


//Peraturan Perusahaan
router.post('/peraturan-perusahaan',peraturanPerusahaan.saveDataCheck);
router.get('/peraturan-perusahaan',peraturanPerusahaan.show);
router.get('/peraturan-perusahaan-last',peraturanPerusahaan.lastShow);
router.get('/peraturan-perusahaan-check',peraturanPerusahaan.checkData);
router.post('/peraturan-perusahaan-check-employee',peraturanPerusahaan.checkDataByEmployee);



//Peraturan Perusahaan
router.get('/employee-monitoring',employee.employeeMonitoring);
router.get("/attendance-terlambat",absensi.absenDatangTerlambat);
router.get("/attendance-terlambat-pulangcepat",absensi.absenPulangCepatDanTerlambat);
router.get("/attendance-pulang-cepat",absensi.absenPulangCepat)

router.get("/surat_peringatan",suratPeringatan.suratPeringatan);
router.post("/surat_peringatan/approval",suratPeringatan.approvalSp);
router.get("/surat_peringatan/:id/alasan",suratPeringatan.detailAlasan);

//pinjaman asset
router.get('/pinjaman/assets',pinjamanAsset.assets);
router.get('/pinjaman/',pinjamanAsset.show);
router.post('/pinjaman/',pinjamanAsset.store);
// router.post('/pinjaman/:id',pinjamanAsset.update);
router.patch('/pinjaman/:id',pinjamanAsset.update);
router.delete('/pinjaman/:id',pinjamanAsset.delete);
router.get('/pinjaman/',pinjamanAsset.store);
router.get('/pinjaman/detail/:id',pinjamanAsset.detail);
router.get('/pinjaman/checked',pinjamanAsset.checked);


router.get('/surat-perjanjian',operasional.surtKontrak);
router.get('/surat-perjanjian/:id',operasional.suratKontrakPdf);
router.get('/cabang',cabang.cabang);
// router.get('/surat-perjanjian/detail/pdf',operasional.suratKontrakPdf);
// router.get("/attendance-terlambat",absensi.absenDatangTerlambat);
// router.get("/attendance-terlambat-pulangcepat",absensi.absenPulangCepatDanTerlambat);
// router.get("/attendance-pulang-cepat",absensi.absenPulangCepat)
// router.get("/surat_peringatan",suratPeringatan.suratPeringatan);
// router.post("/surat_peringatan/approval",suratPeringatan.approvalSp);




module.exports = router;
