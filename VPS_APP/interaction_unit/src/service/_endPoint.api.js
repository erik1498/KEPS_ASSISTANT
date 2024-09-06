import { objectPathEndPointAPI } from '../config/objectPath.config';

const baseAPIKepsAssistant = import.meta.env.VITE_API_URL;

export const SrvLogin = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/user'
)

export const SrvJurnalUmum = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jurnal_umum',
);

export const SrvHistoryAkun = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/history_akun'
)

export const SrvNeracaSaldo = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/neraca_saldo'
)

export const SrvPerubahanModal = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/perubahan_modal'
)

export const SrvNeraca = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/neraca'
)

export const SrvLabaRugi = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/laba_rugi'
)

export const SrvKodeAkun = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kode_akun_perkiraan'
)

export const SrvCustomer = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/customer'
)

export const SrvSupplier = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/supplier'
)

export const SrvCabang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/cabang'
)

export const SrvTipePembayaran = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/tipe_pembayaran'
)

export const SrvSyaratPembayaran = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/syarat_pembayaran'
)

export const SrvStatusTanggungan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/status_tanggungan'
)

export const SrvDivisi = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/divisi'
)

export const SrvJabatan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jabatan'
)

export const SrvPegawai = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pegawai'
)

export const SrvPayroll = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/payroll'
)

export const SrvAktivitasDokumen = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/aktivitas_dokumen'
)

export const SrvRiwayatPembayaranAktivitasDokumen = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/riwayat_pembayaran_aktivitas_dokumen'
)

export const SrvRiwayatAktivitasDokumen = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/riwayat_aktivitas_dokumen'
)

export const SrvStatusRiwayatAktivitasDokumen = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/status_riwayat_aktivitas_dokumen'
)

export const SrvStatusRiwayatAktivitasDokumenPegawaiPelaksana = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/status_riwayat_aktivitas_dokumen_pegawai_pelaksana'
)

export const SrvStatusRiwayatAktivitasDokumenKeterangan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/status_riwayat_aktivitas_dokumen_keterangan'

)

export const SrvDokumenKlien = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/dokumen_klien'
)

export const SrvDaftarBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/daftar_barang'
)

export const SrvSatuanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/satuan_barang'
)

export const SrvKategoriBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_barang'
)

export const SrvJenisBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jenis_barang'
)

export const SrvJenisPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jenis_penjualan_barang'
)

export const SrvSatuanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/satuan_jasa'
)

export const SrvKategoriJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_jasa'
)

export const SrvJenisJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jenis_jasa'
)

export const SrvJenisPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jenis_penjualan_jasa'
)

export const SrvKategoriGudang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_gudang'
)

export const SrvJenisGudang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jenis_gudang'
)

export const SrvKategoriAset = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_aset'
)

export const SrvKelompokAset = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kelompok_aset'
)

export const SrvKategoriPerlengkapan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_perlengkapan'
)

export const SrvMetodePenyusutan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/metode_penyusutan'
)

export const SrvKategoriHargaBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_harga_barang'
)

export const SrvKategoriHargaJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_harga_jasa'
)