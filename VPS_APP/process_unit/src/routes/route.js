import { getAktivitasDokumenRoute } from "../app/aktivitas_dokumen/aktivitasDokumen.route.js";
import { getDokumenKlienRoute } from "../app/dokumen_klien/dokumenKlien.route.js";
import { getHistoryAkunRoute } from "../app/history_akun/historyAkun.route.js";
import { getJurnalUmumRoute } from "../app/jurnal_umum/jurnalUmum.route.js";
import { getKodeAkunPerkiraanRoute } from "../app/kode_akun_perkiraan/kodeAkunPerkiraan.route.js";
import { getLabaRugiRoute } from "../app/laba_rugi/labaRugi.route.js";
import { getLoggerRoute } from "../app/logger/logger.route.js";
import { getNeracaRoute } from "../app/neraca/neraca.route.js";
import { getNeracaSaldoRoute } from "../app/neraca_saldo/neracaSaldo.route.js";
import { getPerubahanModalRoute } from "../app/perubahan_modal/perubahanModal.route.js";
import { getRiwayatAktivitasDokumenRoute } from "../app/riwayat_aktivitas_dokumen/riwayatAktivitasDokumen.route.js";
import { getRiwayatPembayaranAktivitasDokumenRoute } from "../app/riwayat_pembayaran_aktivitas_dokumen/riwayatPembayaranAktivitasDokumen.route.js";
import { getStatusRiwayatAktivitasDokumenRoute } from "../app/status_riwayat_aktivitas_dokumen/statusRiwayatAktivitasDokumen.route.js";
import { getStatusRiwayatAktivitasDokumenKeteranganRoute } from "../app/status_riwayat_aktivitas_dokumen_keterangan/statusRiwayatAktivitasDokumenKeterangan.route.js";
import { getStatusRiwayatAktivitasDokumenPegawaiPelaksanaRoute } from "../app/status_riwayat_aktivitas_dokumen_pegawai_pelaksana/statusRiwayatAktivitasDokumenPegawaiPelaksana.route.js";
import { getUserRoute } from "../app/user/user.route.js";

export const routerList = new Array()
    .concat(
        getKodeAkunPerkiraanRoute(),
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
        getDokumenKlienRoute()
    )