import { getAktivitasDokumenRoute } from "../app/aktivitas_dokumen/aktivitasDokumen.route.js";
import { getCabangRoute } from "../app/cabang/cabang.route.js";
import { getCustomerRoute } from "../app/customer/customer.route.js";
import { getDivisiRoute } from "../app/divisi/divisi.route.js";
import { getDokumenKlienRoute } from "../app/dokumen_klien/dokumenKlien.route.js";
import { getHistoryAkunRoute } from "../app/history_akun/historyAkun.route.js";
import { getJabatanRoute } from "../app/jabatan/jabatan.route.js";
import { getJenisBarangRoute } from "../app/jenis_barang/jenisBarang.route.js";
import { getJenisJasaRoute } from "../app/jenis_jasa/jenisJasa.route.js";
import { getJenisPenjualanBarangRoute } from "../app/jenis_penjualan_barang/jenisPenjualanBarang.route.js";
import { getJenisPenjualanJasaRoute } from "../app/jenis_penjualan_jasa/jenisPenjualanJasa.route.js";
import { getJurnalUmumRoute } from "../app/jurnal_umum/jurnalUmum.route.js";
import { getKategoriBarangRoute } from "../app/kategori_barang/kategoriBarang.route.js";
import { getKategoriJasaRoute } from "../app/kategori_jasa/kategoriJasa.route.js";
import { getKodeAkunPerkiraanRoute } from "../app/kode_akun_perkiraan/kodeAkunPerkiraan.route.js";
import { getLabaRugiRoute } from "../app/laba_rugi/labaRugi.route.js";
import { getLoggerRoute } from "../app/logger/logger.route.js";
import { getNeracaRoute } from "../app/neraca/neraca.route.js";
import { getNeracaSaldoRoute } from "../app/neraca_saldo/neracaSaldo.route.js";
import { getPegawaiRoute } from "../app/pegawai/pegawai.route.js";
import { getPerubahanModalRoute } from "../app/perubahan_modal/perubahanModal.route.js";
import { getRiwayatAktivitasDokumenRoute } from "../app/riwayat_aktivitas_dokumen/riwayatAktivitasDokumen.route.js";
import { getRiwayatPembayaranAktivitasDokumenRoute } from "../app/riwayat_pembayaran_aktivitas_dokumen/riwayatPembayaranAktivitasDokumen.route.js";
import { getSatuanBarangRoute } from "../app/satuan_barang/satuanBarang.route.js";
import { getSatuanJasaRoute } from "../app/satuan_jasa/satuanJasa.route.js";
import { getStatusRiwayatAktivitasDokumenRoute } from "../app/status_riwayat_aktivitas_dokumen/statusRiwayatAktivitasDokumen.route.js";
import { getStatusRiwayatAktivitasDokumenKeteranganRoute } from "../app/status_riwayat_aktivitas_dokumen_keterangan/statusRiwayatAktivitasDokumenKeterangan.route.js";
import { getStatusRiwayatAktivitasDokumenPegawaiPelaksanaRoute } from "../app/status_riwayat_aktivitas_dokumen_pegawai_pelaksana/statusRiwayatAktivitasDokumenPegawaiPelaksana.route.js";
import { getStatusTanggunganRoute } from "../app/status_tanggungan/statusTanggungan.route.js";
import { getSupplierRoute } from "../app/supplier/supplier.route.js";
import { getSyaratPembayaranRoute } from "../app/syarat_pembayaran/syaratPembayaran.route.js";
import { getTipePembayaranRoute } from "../app/tipe_pembayaran/tipePembayaran.route.js";
import { getUserRoute } from "../app/user/user.route.js";

export const routerList = new Array()
    .concat(
        getKodeAkunPerkiraanRoute(),
        getCustomerRoute(),
        getSupplierRoute(),
        getCabangRoute(),
        getDivisiRoute(),
        getJabatanRoute(),
        getStatusTanggunganRoute(),
        getSyaratPembayaranRoute(),
        getTipePembayaranRoute(),
        getPegawaiRoute(),
        getJurnalUmumRoute(),
        getHistoryAkunRoute(),
        getNeracaSaldoRoute(),
        getLabaRugiRoute(),
        getNeracaRoute(),
        getPerubahanModalRoute(),
        getUserRoute(),
        getLoggerRoute(),
        getAktivitasDokumenRoute(),
        getRiwayatPembayaranAktivitasDokumenRoute(),
        getRiwayatAktivitasDokumenRoute(),
        getStatusRiwayatAktivitasDokumenRoute(),
        getStatusRiwayatAktivitasDokumenPegawaiPelaksanaRoute(),
        getStatusRiwayatAktivitasDokumenKeteranganRoute(),
        getDokumenKlienRoute(),
        getSatuanBarangRoute(),
        getSatuanJasaRoute(),
        getKategoriBarangRoute(),
        getKategoriJasaRoute(),
        getJenisBarangRoute(),
        getJenisJasaRoute(),
        getJenisPenjualanBarangRoute(),
        getJenisPenjualanJasaRoute()
    )