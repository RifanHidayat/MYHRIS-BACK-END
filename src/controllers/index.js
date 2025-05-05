const operasional = require('./controller-operasional');
const login = require('./login');
const dashboard = require('./dashboard/dashboard');
const absensi = require('./absensi/absensi');
const payroll = require('./payroll');
const izin = require('./izin/izin');
const claim = require('./claim');
const klaim = require('./klaim');
const tracking = require('./tracking/tracking');
const wfh = require('./absensi/wfh');
const loan = require('./loan');
const chatting = require('./chatting/chatting');
const lembur = require('./lembur/lembur');
const cuti = require('./cuti/cuti');
const tugasLuar = require('./tugasLuar/tugas_luar');
const pengadaanKerusakan = require('./pengaduan');
const peraturanPerusahaan = require('./persuratan/peraturan_perusahaan');
const employee= require('./employee');
const suratPeringatan= require('./persuratan/surat_peringatan');
const teguranLisan= require('./persuratan/teguran_lisan');
const notice= require('./pengumuman/notice');
const pinjamanAsset= require('./peminjaman_asset');
const cabang= require('./cabang/cabang');
const info = require('./settings/info');
const placeCoordinate = require('./placeCordinate/placeCoordinate');
const placeCoordinatePengaju = require('./placeCordinate/placeCoordinatePengaju');
const requestAbsen = require('./absensi/request_absen/requestAbsen');
const notifikasi  = require('./notifikasi/push_notifikasi');
const dailyTask = require('./task/daily_task');
//audit
const auditShow = require('./audit/show');
const auditDetail = require('./audit/detail');
const auditApproval = require('./audit/approval');
const auditFilter = require('./audit/filter');
const auditLog = require('./audit/log');
//apresiasi
const showAppresiasi = require('./apresiasi/showAppresiasi');
const showUserApresiasi = require('./apresiasi/apresiasiUser');


module.exports ={
	operasional,
	login,
	dashboard,
	absensi,
	payroll,
	izin,
	notifikasi,
	claim,
	tracking,
	wfh,loan
	,chatting,lembur,cuti,tugasLuar,klaim,pengadaanKerusakan,employee,peraturanPerusahaan
	,suratPeringatan 
	,pinjamanAsset,cabang,
	teguranLisan,
	notice,
	info,
	placeCoordinate,
	placeCoordinatePengaju,
	requestAbsen,
	dailyTask,
	auditShow,
	auditApproval,
	auditDetail,
	auditFilter,
	auditLog,
	showAppresiasi,
	showUserApresiasi,
};