import { ASET_LAIN_LAIN_TYPE, ASET_LANCAR_TYPE, ASET_TETAP_TYPE, BEBAN_LAIN_LAIN_TYPE, BEBAN_OPERASIONAL_DAN_ADMINISTRASI_TYPE, HARGA_POKOK_PENJUALAN_TYPE } from "./labaRugiConstant.js";

export const AKUN_DEBET_PLUS = [
    ASET_TETAP_TYPE, ASET_LANCAR_TYPE, ASET_LAIN_LAIN_TYPE, BEBAN_LAIN_LAIN_TYPE, BEBAN_OPERASIONAL_DAN_ADMINISTRASI_TYPE, HARGA_POKOK_PENJUALAN_TYPE
]

// export const PENDAPATAN_MINUS_KODE_AKUN = [];

// export const HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN = [];

export const BEBAN_OPERASIONAL_MINUS_KODE_AKUN = [];

// export const PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN = [];

export const BEBAN_LAINNYA_MINUS_KODE_AKUN = []

export const ASSET_MINUS_KODE_AKUN = []

export const UTANG_MINUS_KODE_AKUN = []

export const ASET_LANCAR_MINUS_KODE_AKUN = []
export const ASET_TETAP_MINUS_KODE_AKUN = []
export const ASET_LAIN_LAIN_MINUS_KODE_AKUN = []
export const KEWAJIBAN_LANCAR_MINUS_KODE_AKUN = []
export const KEWAJIBAN_JANGKA_PANJANG_MINUS_KODE_AKUN = []
export const KEWAJIBAN_LAIN_LAIN_MINUS_KODE_AKUN = []
export const KEWAJIBAN_EKUITAS_MINUS_KODE_AKUN = []
export const EKUITAS_MINUS_KODE_AKUN = ["003.010", "003.011"]
export const PENDAPATAN_MINUS_KODE_AKUN = []
export const BEBAN_OPERASIONAL_DAN_ADMINISTRASI_MINUS_KODE_AKUN = []
export const PENDAPATAN_LAIN_LAIN_MINUS_KODE_AKUN = []
export const HARGA_POKOK_PENJUALAN_MINUS_KODE_AKUN = []
export const BEBAN_LAIN_LAIN_MINUS_KODE_AKUN = []
export const BEBAN_BUNGA_DAN_PAJAK_MINUS_KODE_AKUN = []
export const HARGA_POKOK_PRODUKSI_MINUS_KODE_AKUN = []


// TRUNCATE TABLE db_keps_assistant_alor.aktivitas_dokumen_tab;
// TRUNCATE TABLE db_keps_assistant_alor.daftar_aset_tab;
// TRUNCATE TABLE db_keps_assistant_alor.daftar_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.daftar_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.daftar_perlengkapan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.dokumen_klien_tab;
// TRUNCATE TABLE db_keps_assistant_alor.faktur_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.faktur_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.faktur_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.gaji_tab;
// TRUNCATE TABLE db_keps_assistant_alor.hadiah_tab;
// TRUNCATE TABLE db_keps_assistant_alor.hasil_stok_opname_tab;
// TRUNCATE TABLE db_keps_assistant_alor.hitungan_penyusutan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.jurnal_umum_tab;
// TRUNCATE TABLE db_keps_assistant_alor.kategori_harga_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.kategori_harga_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.kerugian_tab;
// TRUNCATE TABLE db_keps_assistant_alor.konversi_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.lain_lain_tab;
// TRUNCATE TABLE db_keps_assistant_alor.lembur_tab;
// TRUNCATE TABLE db_keps_assistant_alor.logger_tab;
// TRUNCATE TABLE db_keps_assistant_alor.metode_penyusutan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.neraca_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pelunasan_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pelunasan_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pelunasan_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pengembalian_denda_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pengembalian_denda_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pengembalian_denda_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.penyesuaian_persediaan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.perintah_stok_opname_jurnal_tab;
// TRUNCATE TABLE db_keps_assistant_alor.perintah_stok_opname_tab;
// TRUNCATE TABLE db_keps_assistant_alor.persentase_penyusutan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pesanan_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pesanan_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pesanan_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.piutang_karyawan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.pph2126_tab;
// TRUNCATE TABLE db_keps_assistant_alor.retur_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.retur_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.retur_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_konversi_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pelunasan_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pelunasan_pembelian_denda_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pelunasan_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pelunasan_penjualan_denda_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pelunasan_penjualan_denda_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pelunasan_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pengembalian_denda_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pengembalian_denda_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pengembalian_denda_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pesanan_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pesanan_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_pesanan_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_retur_pembelian_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_retur_penjualan_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_retur_penjualan_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_transaksi_bank_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_transaksi_kas_tab;
// TRUNCATE TABLE db_keps_assistant_alor.rincian_transfer_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.riwayat_aktivitas_dokumen_tab;
// TRUNCATE TABLE db_keps_assistant_alor.riwayat_pembayaran_aktivitas_dokumen_tab;
// TRUNCATE TABLE db_keps_assistant_alor.status_riwayat_aktivitas_dokumen_keterangan_tab;
// TRUNCATE TABLE db_keps_assistant_alor.status_riwayat_aktivitas_dokumen_pegawai_pelaksana_tab;
// TRUNCATE TABLE db_keps_assistant_alor.status_riwayat_aktivitas_dokumen_tab;
// TRUNCATE TABLE db_keps_assistant_alor.stok_awal_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.stok_awal_jasa_tab;
// TRUNCATE TABLE db_keps_assistant_alor.transaksi_bank_tab;
// TRUNCATE TABLE db_keps_assistant_alor.transaksi_kas_tab;
// TRUNCATE TABLE db_keps_assistant_alor.transfer_barang_tab;
// TRUNCATE TABLE db_keps_assistant_alor.tunjangan_uang_tab;
