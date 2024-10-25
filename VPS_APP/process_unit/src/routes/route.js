import { getAktivitasDokumenRoute } from "../app/aktivitas_dokumen/aktivitasDokumen.route.js";
import { getCabangRoute } from "../app/cabang/cabang.route.js";
import { getCustomerRoute } from "../app/customer/customer.route.js";
import { getDaftarBarangRoute } from "../app/daftar_barang/daftarBarang.route.js";
import { getDaftarGudangRoute } from "../app/daftar_gudang/daftarGudang.route.js";
import { getDaftarJasaRoute } from "../app/daftar_jasa/daftarJasa.route.js";
import { getDivisiRoute } from "../app/divisi/divisi.route.js";
import { getDokumenKlienRoute } from "../app/dokumen_klien/dokumenKlien.route.js";
import { getHistoryAkunRoute } from "../app/history_akun/historyAkun.route.js";
import { getJabatanRoute } from "../app/jabatan/jabatan.route.js";
import { getJenisBarangRoute } from "../app/jenis_barang/jenisBarang.route.js";
import { getJenisGudangRoute } from "../app/jenis_gudang/jenisGudang.route.js";
import { getJenisJasaRoute } from "../app/jenis_jasa/jenisJasa.route.js";
import { getJenisPenjualanBarangRoute } from "../app/jenis_penjualan_barang/jenisPenjualanBarang.route.js";
import { getJenisPenjualanJasaRoute } from "../app/jenis_penjualan_jasa/jenisPenjualanJasa.route.js";
import { getJurnalUmumRoute } from "../app/jurnal_umum/jurnalUmum.route.js";
import { getKategoriAsetRoute } from "../app/kategori_aset/kategoriAset.route.js";
import { getKategoriBarangRoute } from "../app/kategori_barang/kategoriBarang.route.js";
import { getKategoriGudangRoute } from "../app/kategori_gudang/kategoriGudang.route.js";
import { getKategoriHargaBarangRoute } from "../app/kategori_harga_barang/kategoriHargaBarang.route.js";
import { getKategoriHargaJasaRoute } from "../app/kategori_harga_jasa/kategoriHargaJasa.route.js";
import { getKategoriJasaRoute } from "../app/kategori_jasa/kategoriJasa.route.js";
import { getKategoriPerlengkapanRoute } from "../app/kategori_perlengkapan/kategoriPerlengkapan.route.js";
import { getKelompokAsetRoute } from "../app/kelompok_aset/kelompokAset.route.js";
import { getKodeAkunPerkiraanRoute } from "../app/kode_akun_perkiraan/kodeAkunPerkiraan.route.js";
import { getLabaRugiRoute } from "../app/laba_rugi/labaRugi.route.js";
import { getLoggerRoute } from "../app/logger/logger.route.js";
import { getMetodePenyusutanRoute } from "../app/metode_penyusutan/metodePenyusutan.route.js";
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
import { getStokAwalBarangRoute } from "../app/stok_awal_barang/stokAwalBarang.route.js";
import { getStokAwalJasaRoute } from "../app/stok_awal_jasa/stokAwalJasa.route.js";
import { getSupplierRoute } from "../app/supplier/supplier.route.js";
import { getSyaratPembayaranRoute } from "../app/syarat_pembayaran/syaratPembayaran.route.js";
import { getTipePembayaranRoute } from "../app/tipe_pembayaran/tipePembayaran.route.js";
import { getTransaksiKasRoute } from "../app/transaksi_kas/transaksiKas.route.js";
import { getTransaksiBankRoute } from "../app/transaksi_bank/transaksiBank.route.js";
import { getUserRoute } from "../app/user/user.route.js";
import { getRincianTransaksiKasRoute } from "../app/rincian_transaksi_kas/rincianTransaksiKas.route.js";
import { getRincianTransaksiBankRoute } from "../app/rincian_transaksi_bank/rincianTransaksiBank.route.js";
import { getGajiRoute } from "../app/gaji/gaji.route.js";
import { getLemburRoute } from "../app/lembur/lembur.route.js";
import { getHadiahRoute } from "../app/hadiah/hadiah.route.js";
import { getTunjanganUangRoute } from "../app/tunjangan_uang/tunjanganUang.route.js";
import { getPph2126Route } from "../app/pph2126/pph2126.route.js";
import { getPiutangKaryawanRoute } from "../app/piutang_karyawan/piutangKaryawan.route.js";
import { getLainLainRoute } from "../app/lain_lain/lainLain.route.js";
import { getKerugianRoute } from "../app/kerugian/kerugian.route.js";
import { getPersentasePenyusutanRoute } from "../app/persentase_penyusutan/persentasePenyusutan.route.js";
import { getDaftarAsetRoute } from "../app/daftar_aset/daftarAset.route.js";
import { getDaftarPerlengkapanRoute } from "../app/daftar_perlengkapan/daftarPerlengkapan.route.js";
import { getPesananPenjualanBarangRoute } from "../app/pesanan_penjualan_barang/pesananPenjualanBarang.route.js";
import { getRincianPesananPenjualanBarangRoute } from "../app/rincian_pesanan_penjualan_barang/rincianPesananPenjualanBarang.route.js";
import { getFakturPenjualanBarangRoute } from "../app/faktur_penjualan_barang/fakturPenjualanBarang.route.js";
import { getPelunasanPenjualanBarangRoute } from "../app/pelunasan_penjualan_barang/pelunasanPenjualanBarang.route.js";
import { getReturPenjualanBarangRoute } from "../app/retur_penjualan_barang/returPenjualanBarang.route.js";
import { getRincianPelunasanPenjualanBarangRoute } from "../app/rincian_pelunasan_penjualan_barang/rincianPelunasanPenjualanBarang.route.js";
import { getRincianReturPenjualanBarangRoute } from "../app/rincian_retur_penjualan_barang/rincianReturPenjualanBarang.route.js";
import { getRincianPelunasanPenjualanDendaBarangRoute } from "../app/rincian_pelunasan_penjualan_denda_barang/rincianPelunasanPenjualanDendaBarang.route.js";
import { getPengembalianDendaPenjualanBarangRoute } from "../app/pengembalian_denda_penjualan_barang/pengembalianDendaPenjualanBarang.route.js";
import { getRincianPengembalianDendaPenjualanBarangRoute } from "../app/rincian_pengembalian_denda_penjualan_barang/rincianPengembalianDendaPenjualanBarang.route.js";
import { getPesananPenjualanJasaRoute } from "../app/pesanan_penjualan_jasa/pesananPenjualanJasa.route.js";
import { getRincianPesananPenjualanJasaRoute } from "../app/rincian_pesanan_penjualan_jasa/rincianPesananPenjualanJasa.route.js";
import { getFakturPenjualanJasaRoute } from "../app/faktur_penjualan_jasa/fakturPenjualanJasa.route.js";
import { getPelunasanPenjualanJasaRoute } from "../app/pelunasan_penjualan_jasa/pelunasanPenjualanJasa.route.js";
import { getReturPenjualanJasaRoute } from "../app/retur_penjualan_jasa/returPenjualanJasa.route.js";
import { getRincianPelunasanPenjualanJasaRoute } from "../app/rincian_pelunasan_penjualan_jasa/rincianPelunasanPenjualanJasa.route.js";
import { getRincianReturPenjualanJasaRoute } from "../app/rincian_retur_penjualan_jasa/rincianReturPenjualanJasa.route.js";
import { getRincianPelunasanPenjualanDendaJasaRoute } from "../app/rincian_pelunasan_penjualan_denda_jasa/rincianPelunasanPenjualanDendaJasa.route.js";
import { getPengembalianDendaPenjualanJasaRoute } from "../app/pengembalian_denda_penjualan_jasa/pengembalianDendaPenjualanJasa.route.js";
import { getRincianPengembalianDendaPenjualanJasaRoute } from "../app/rincian_pengembalian_denda_penjualan_jasa/rincianPengembalianDendaPenjualanJasa.route.js";
import { getPesananPembelianBarangRoute } from "../app/pesanan_pembelian_barang/pesananPembelianBarang.route.js";
import { getRincianPesananPembelianBarangRoute } from "../app/rincian_pesanan_pembelian_barang/rincianPesananPembelianBarang.route.js";
import { getFakturPembelianBarangRoute } from "../app/faktur_pembelian_barang/fakturPembelianBarang.route.js";
import { getPelunasanPembelianBarangRoute } from "../app/pelunasan_pembelian_barang/pelunasanPembelianBarang.route.js";
import { getRincianPelunasanPembelianBarangRoute } from "../app/rincian_pelunasan_pembelian_barang/rincianPelunasanPembelianBarang.route.js";
import { getReturPembelianBarangRoute } from "../app/retur_pembelian_barang/returPembelianBarang.route.js";
import { getRincianReturPembelianBarangRoute } from "../app/rincian_retur_pembelian_barang/rincianReturPembelianBarang.route.js";
import { getPengembalianDendaPembelianBarangRoute } from "../app/pengembalian_denda_pembelian_barang/pengembalianDendaPembelianBarang.route.js";
import { getRincianPengembalianDendaPembelianBarangRoute } from "../app/rincian_pengembalian_denda_pembelian_barang/rincianPengembalianDendaPembelianBarang.route.js";
import { getTransferBarangRoute } from "../app/transfer_barang/transferBarang.route.js";
import { getRincianTransferBarangRoute } from "../app/rincian_transfer_barang/rincianTransferBarang.route.js";
import { getKonversiBarangRoute } from "../app/konversi_barang/konversiBarang.route.js";
import { getRincianKonversiBarangRoute } from "../app/rincian_konversi_barang/rincianKonversiBarang.route.js";
import { getPerintahStokOpnameRoute } from "../app/perintah_stok_opname/perintahStokOpname.route.js";

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
        getTransferBarangRoute(),
        getRincianTransferBarangRoute(),
        getKonversiBarangRoute(),
        getRincianKonversiBarangRoute(),
        getSatuanJasaRoute(),
        getKategoriBarangRoute(),
        getKategoriJasaRoute(),
        getJenisBarangRoute(),
        getJenisJasaRoute(),
        getJenisPenjualanBarangRoute(),
        getJenisPenjualanJasaRoute(),
        getPerintahStokOpnameRoute(),
        getJenisGudangRoute(),
        getKategoriGudangRoute(),
        getDaftarGudangRoute(),
        getDaftarBarangRoute(),
        getDaftarJasaRoute(),
        getDaftarAsetRoute(),
        getKategoriAsetRoute(),
        getKelompokAsetRoute(),
        getDaftarPerlengkapanRoute(),
        getKategoriPerlengkapanRoute(),
        getMetodePenyusutanRoute(),
        getPersentasePenyusutanRoute(),
        getKategoriHargaBarangRoute(),
        getKategoriHargaJasaRoute(),
        getStokAwalBarangRoute(),
        getStokAwalJasaRoute(),
        getTransaksiKasRoute(),
        getTransaksiBankRoute(),
        getRincianTransaksiKasRoute(),
        getRincianTransaksiBankRoute(),
        getGajiRoute(),
        getLemburRoute(),
        getHadiahRoute(),
        getTunjanganUangRoute(),
        getPph2126Route(),
        getPiutangKaryawanRoute(),
        getLainLainRoute(),
        getKerugianRoute(),
        getPesananPenjualanBarangRoute(),
        getRincianPesananPenjualanBarangRoute(),
        getFakturPenjualanBarangRoute(),
        getPelunasanPenjualanBarangRoute(),
        getRincianPelunasanPenjualanBarangRoute(),
        getRincianPelunasanPenjualanDendaBarangRoute(),
        getReturPenjualanBarangRoute(),
        getRincianReturPenjualanBarangRoute(),
        getPengembalianDendaPenjualanBarangRoute(),
        getRincianPengembalianDendaPenjualanBarangRoute(),
        getPesananPenjualanJasaRoute(),
        getRincianPesananPenjualanJasaRoute(),
        getFakturPenjualanJasaRoute(),
        getPelunasanPenjualanJasaRoute(),
        getRincianPelunasanPenjualanJasaRoute(),
        getRincianPelunasanPenjualanDendaJasaRoute(),
        getReturPenjualanJasaRoute(),
        getRincianReturPenjualanJasaRoute(),
        getPengembalianDendaPenjualanJasaRoute(),
        getRincianPengembalianDendaPenjualanJasaRoute(),
        getPesananPembelianBarangRoute(),
        getRincianPesananPembelianBarangRoute(),
        getFakturPembelianBarangRoute(),
        getPelunasanPembelianBarangRoute(),
        getRincianPelunasanPembelianBarangRoute(),
        getReturPembelianBarangRoute(),
        getRincianReturPembelianBarangRoute(),
        getPengembalianDendaPembelianBarangRoute(),
        getRincianPengembalianDendaPembelianBarangRoute(),
    )