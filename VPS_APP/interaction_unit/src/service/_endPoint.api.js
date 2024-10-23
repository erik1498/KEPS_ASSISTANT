import { objectPathEndPointAPI } from '../config/objectPath.config';

const baseAPIKepsAssistant = import.meta.env.VITE_API_URL;

export const SrvLogin = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/user'
)

export const SrvTransaksiKas = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/transaksi_kas',
);

export const SrvRincianTransaksiKas = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_transaksi_kas',
);

export const SrvTransaksiBank = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/transaksi_bank',
);

export const SrvRincianTransaksiBank = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_transaksi_bank',
);

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

export const SrvTransferBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/transfer_barang'
)

export const SrvRincianTransferBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_transfer_barang'
)

export const SrvKonversiBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/konversi_barang'
)

export const SrvRincianKonversiBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_konversi_barang'
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

export const SrvDaftarJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/daftar_jasa'
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

export const SrvDaftarGudang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/daftar_gudang'
)

export const SrvKategoriGudang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_gudang'
)

export const SrvJenisGudang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/jenis_gudang'
)

export const SrvDaftarAset = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/daftar_aset'
)

export const SrvKategoriAset = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_aset'
)

export const SrvKelompokAset = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kelompok_aset'
)

export const SrvDaftarPerlengkapan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/daftar_perlengkapan'
)

export const SrvKategoriPerlengkapan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_perlengkapan'
)

export const SrvHitunganPenyusutan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/hitungan_penyusutan'
)

export const SrvMetodePenyusutan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/metode_penyusutan'
)

export const SrvPersentasePenyusutan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/persentase_penyusutan'
)

export const SrvKategoriHargaBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_harga_barang'
)

export const SrvStokAwalBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/stok_awal_barang'
)

export const SrvKategoriHargaJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kategori_harga_jasa'
)

export const SrvStokAwalJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/stok_awal_jasa'
)

export const SrvGaji = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/gaji'
)

export const SrvLembur = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/lembur'
)

export const SrvTunjanganUang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/tunjangan_uang'
)

export const SrvTunjanganBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/tunjangan_barang'
)

export const SrvHadiah = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/hadiah'
)

export const SrvPPH2126 = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pph2126'
)

export const SrvLainLain = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/lain_lain'
)

export const SrvKerugian = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/kerugian'
)

export const SrvPiutangKaryawan = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/piutang_karyawan'
)

export const SrvPesananPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pesanan_penjualan_barang'
)

export const SrvRincianPesananPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pesanan_penjualan_barang'
)

export const SrvFakturPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/faktur_penjualan_barang'
)

export const SrvPelunasanPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pelunasan_penjualan_barang'
)

export const SrvReturPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/retur_penjualan_barang'
)

export const SrvPengembalianDendaPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pengembalian_denda_penjualan_barang'
)

export const SrvRincianPelunasanPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pelunasan_penjualan_barang'
)

export const SrvRincianPelunasanPenjualanDendaBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pelunasan_penjualan_denda_barang'
)

export const SrvRincianReturPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_retur_penjualan_barang'
)

export const SrvRincianPengembalianDendaPenjualanBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pengembalian_denda_penjualan_barang'
)

export const SrvPesananPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pesanan_penjualan_jasa'
)

export const SrvRincianPesananPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pesanan_penjualan_jasa'
)

export const SrvFakturPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/faktur_penjualan_jasa'
)

export const SrvPelunasanPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pelunasan_penjualan_jasa'
)

export const SrvReturPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/retur_penjualan_jasa'
)

export const SrvPengembalianDendaPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pengembalian_denda_penjualan_jasa'
)

export const SrvRincianPelunasanPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pelunasan_penjualan_jasa'
)

export const SrvRincianPelunasanPenjualanDendaJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pelunasan_penjualan_denda_jasa'
)

export const SrvRincianReturPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_retur_penjualan_jasa'
)

export const SrvRincianPengembalianDendaPenjualanJasa = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pengembalian_denda_penjualan_jasa'
)

export const SrvPesananPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pesanan_pembelian_barang'
)

export const SrvRincianPesananPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pesanan_pembelian_barang'
)

export const SrvFakturPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/faktur_pembelian_barang'
)

export const SrvPelunasanPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pelunasan_pembelian_barang'
)

export const SrvReturPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/retur_pembelian_barang'
)

export const SrvPengembalianDendaPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/pengembalian_denda_pembelian_barang'
)

export const SrvRincianPelunasanPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pelunasan_pembelian_barang'
)

export const SrvRincianPelunasanPembelianDendaBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pelunasan_pembelian_denda_barang'
)

export const SrvRincianReturPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_retur_pembelian_barang'
)

export const SrvRincianPengembalianDendaPembelianBarang = objectPathEndPointAPI(
  baseAPIKepsAssistant + '/rincian_pengembalian_denda_pembelian_barang'
)
