const operasional = require('./controller-operasional');
const login = require('./login');
const dashboard = require('./dashboard');
const absensi = require('./absensi/absensi');
const payroll = require('./payroll');
const izin = require('./izin/izin');
const notifikasi = require('./push_notifikasi');
const claim = require('./claim');
const klaim = require('./klaim');
const tracking = require('./tracking');
const wfh = require('./absensi/wfh');
const loan = require('./loan');
const chatting = require('./chatting/chatting');
const lembur = require('./lembur/lembur');
const cuti = require('./cuti/cuti');
const tugasLuar = require('./tugas_luar');
const pengadaanKerusakan = require('./pengaduan');
const peraturanPerusahaan = require('./persuratan/peraturan_perusahaan');
const employee= require('./employee');
const suratPeringatan= require('./persuratan/surat_peringatan');
const teguranLisan= require('./persuratan/teguran_lisan');
const notice= require('./notice');
const pinjamanAsset= require('./peminjaman_asset');
const cabang= require('./cabang');
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
	notice
};