import { _shapeObjectMethodCRUD } from './_config.api';
import { SrvAktivitasDokumen, SrvCabang, SrvCustomer, SrvDaftarAset, SrvDaftarBarang, SrvDaftarGudang, SrvDaftarJasa, SrvDaftarPerlengkapan, SrvDivisi, SrvDokumenKlien, SrvFakturPembelianBarang, SrvFakturPenjualanBarang, SrvFakturPenjualanJasa, SrvGaji, SrvHadiah, SrvHistoryAkun, SrvHitunganPenyusutan, SrvJabatan, SrvJenisBarang, SrvJenisGudang, SrvJenisJasa, SrvJenisPenjualanBarang, SrvJenisPenjualanJasa, SrvJurnalUmum, SrvKategoriAset, SrvKategoriBarang, SrvKategoriGudang, SrvKategoriHargaBarang, SrvKategoriHargaJasa, SrvKategoriJasa, SrvKategoriPerlengkapan, SrvKelompokAset, SrvKerugian, SrvKodeAkun, SrvKonversiBarang, SrvLabaRugi, SrvLainLain, SrvLembur, SrvLogin, SrvMetodePenyusutan, SrvNeraca, SrvNeracaSaldo, SrvPayroll, SrvPegawai, SrvPelunasanPembelianBarang, SrvPelunasanPenjualanBarang, SrvPelunasanPenjualanJasa, SrvPengembalianDendaPembelianBarang, SrvPengembalianDendaPenjualanBarang, SrvPengembalianDendaPenjualanJasa, SrvPersentasePenyusutan, SrvPerubahanModal, SrvPesananPembelianBarang, SrvPesananPenjualanBarang, SrvPesananPenjualanJasa, SrvPiutangKaryawan, SrvPPH2126, SrvReturPembelianBarang, SrvReturPenjualanBarang, SrvReturPenjualanJasa, SrvRincianKonversiBarang, SrvRincianPelunasanPembelianBarang, SrvRincianPelunasanPembelianDendaBarang, SrvRincianPelunasanPenjualanBarang, SrvRincianPelunasanPenjualanDendaBarang, SrvRincianPelunasanPenjualanDendaJasa, SrvRincianPelunasanPenjualanJasa, SrvRincianPengembalianDendaPembelianBarang, SrvRincianPengembalianDendaPenjualanBarang, SrvRincianPengembalianDendaPenjualanJasa, SrvRincianPesananPembelianBarang, SrvRincianPesananPenjualanBarang, SrvRincianPesananPenjualanJasa, SrvRincianReturPembelianBarang, SrvRincianReturPenjualanBarang, SrvRincianReturPenjualanJasa, SrvRincianTransaksiBank, SrvRincianTransaksiKas, SrvRincianTransferBarang, SrvRiwayatAktivitasDokumen, SrvRiwayatPembayaranAktivitasDokumen, SrvSatuanBarang, SrvSatuanJasa, SrvStatusRiwayatAktivitasDokumen, SrvStatusRiwayatAktivitasDokumenKeterangan, SrvStatusRiwayatAktivitasDokumenPegawaiPelaksana, SrvStatusTanggungan, SrvStokAwalBarang, SrvStokAwalJasa, SrvSupplier, SrvSyaratPembayaran, SrvTipePembayaran, SrvTransaksiBank, SrvTransaksiKas, SrvTransferBarang, SrvTunjanganBarang, SrvTunjanganUang } from './_endPoint.api';

export const apiLogin = { ..._shapeObjectMethodCRUD(SrvLogin) };

export const apiTransaksiKasCRUD = { ..._shapeObjectMethodCRUD(SrvTransaksiKas) };

export const apiRincianTransaksiKasCRUD = { ..._shapeObjectMethodCRUD(SrvRincianTransaksiKas) };

export const apiTransaksiBankCRUD = { ..._shapeObjectMethodCRUD(SrvTransaksiBank) };

export const apiRincianTransaksiBankCRUD = { ..._shapeObjectMethodCRUD(SrvRincianTransaksiBank) };

export const apiJurnalUmumCRUD = { ..._shapeObjectMethodCRUD(SrvJurnalUmum) };

export const apiKodeAkunCRUD = { ..._shapeObjectMethodCRUD(SrvKodeAkun) }

export const apiCustomerCRUD = { ..._shapeObjectMethodCRUD(SrvCustomer) }

export const apiSupplierCRUD = { ..._shapeObjectMethodCRUD(SrvSupplier) }

export const apiCabangCRUD = { ..._shapeObjectMethodCRUD(SrvCabang) }

export const apiTipePembayaranCRUD = { ..._shapeObjectMethodCRUD(SrvTipePembayaran) }

export const apiSyaratPembayaranCRUD = { ..._shapeObjectMethodCRUD(SrvSyaratPembayaran) }

export const apiHistoryAkunR = { ..._shapeObjectMethodCRUD(SrvHistoryAkun) }

export const apiNeracaSaldoR = { ..._shapeObjectMethodCRUD(SrvNeracaSaldo) }

export const apiNeracaCRUD = { ..._shapeObjectMethodCRUD(SrvNeraca) }

export const apiLabaRugiR = { ..._shapeObjectMethodCRUD(SrvLabaRugi) }

export const apiStatusTanggunganCRUD = { ..._shapeObjectMethodCRUD(SrvStatusTanggungan) }

export const apiDivisiCRUD = { ..._shapeObjectMethodCRUD(SrvDivisi) }

export const apiJabatanCRUD = { ..._shapeObjectMethodCRUD(SrvJabatan) }

export const apiPegawaiCRUD = { ..._shapeObjectMethodCRUD(SrvPegawai) }

export const apiPayroll = { ..._shapeObjectMethodCRUD(SrvPayroll) }

export const apiPerubahanModal = { ..._shapeObjectMethodCRUD(SrvPerubahanModal) }

export const apiAktivitasDokumen = { ..._shapeObjectMethodCRUD(SrvAktivitasDokumen) }

export const apiRiwayatPembayaranAktivitasDokumen = { ..._shapeObjectMethodCRUD(SrvRiwayatPembayaranAktivitasDokumen) }

export const apiRiwayatAktivitasDokumen = { ..._shapeObjectMethodCRUD(SrvRiwayatAktivitasDokumen) }

export const apiStatusRiwayatAktivitasDokumen = { ..._shapeObjectMethodCRUD(SrvStatusRiwayatAktivitasDokumen) }

export const apiStatusRiwayatAktivitasDokumenPegawaiPelaksana = { ..._shapeObjectMethodCRUD(SrvStatusRiwayatAktivitasDokumenPegawaiPelaksana) }

export const apiStatusRiwayatAktivitasDokumenKeterangan = { ..._shapeObjectMethodCRUD(SrvStatusRiwayatAktivitasDokumenKeterangan) }

export const apiDokumenKlien = { ..._shapeObjectMethodCRUD(SrvDokumenKlien) }

export const apiSatuanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvSatuanBarang) }

export const apiTransferBarangCRUD = { ..._shapeObjectMethodCRUD(SrvTransferBarang) }

export const apiRincianTransferBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianTransferBarang) }

export const apiKonversiBarangCRUD = { ..._shapeObjectMethodCRUD(SrvKonversiBarang) }

export const apiRincianKonversiBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianKonversiBarang) }

export const apiDaftarBarangCRUD = { ..._shapeObjectMethodCRUD(SrvDaftarBarang) }

export const apiKategoriBarangCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriBarang) }

export const apiJenisBarangCRUD = { ..._shapeObjectMethodCRUD(SrvJenisBarang) }

export const apiJenisPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvJenisPenjualanBarang) }

export const apiDaftarJasaCRUD = { ..._shapeObjectMethodCRUD(SrvDaftarJasa) }

export const apiSatuanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvSatuanJasa) }

export const apiKategoriJasaCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriJasa) }

export const apiJenisJasaCRUD = { ..._shapeObjectMethodCRUD(SrvJenisJasa) }

export const apiJenisPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvJenisPenjualanJasa) }

export const apiDaftarGudangCRUD = { ..._shapeObjectMethodCRUD(SrvDaftarGudang) }

export const apiKategoriGudangCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriGudang) }

export const apiJenisGudangCRUD = { ..._shapeObjectMethodCRUD(SrvJenisGudang) }

export const apiDaftarAsetCRUD = { ..._shapeObjectMethodCRUD(SrvDaftarAset) }

export const apiKategoriAsetCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriAset) }

export const apiKelompokAsetCRUD = { ..._shapeObjectMethodCRUD(SrvKelompokAset) }

export const apiDaftarPerlengkapanCRUD = { ..._shapeObjectMethodCRUD(SrvDaftarPerlengkapan) }

export const apiKategoriPerlengkapanCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriPerlengkapan) }

export const apiHitunganPenyusutanCRUD = { ..._shapeObjectMethodCRUD(SrvHitunganPenyusutan) }

export const apiMetodePenyusutanCRUD = { ..._shapeObjectMethodCRUD(SrvMetodePenyusutan) }

export const apiPersentasePenyusutanCRUD = { ..._shapeObjectMethodCRUD(SrvPersentasePenyusutan) }

export const apiStokAwalBarangCRUD = { ..._shapeObjectMethodCRUD(SrvStokAwalBarang) }

export const apiKategoriHargaBarangCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriHargaBarang) }

export const apiKategoriHargaJasaCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriHargaJasa) }

export const apiStokAwalJasaCRUD = { ..._shapeObjectMethodCRUD(SrvStokAwalJasa) }

export const apiGajiCRUD = { ..._shapeObjectMethodCRUD(SrvGaji) }

export const apiLemburCRUD = { ..._shapeObjectMethodCRUD(SrvLembur) }

export const apiTunjanganUangCRUD = { ..._shapeObjectMethodCRUD(SrvTunjanganUang) }

export const apiTunjanganBarangCRUD = { ..._shapeObjectMethodCRUD(SrvTunjanganBarang) }

export const apiHadiahCRUD = { ..._shapeObjectMethodCRUD(SrvHadiah) }

export const apiPPH2126CRUD = { ..._shapeObjectMethodCRUD(SrvPPH2126) }

export const apiLainLainCRUD = { ..._shapeObjectMethodCRUD(SrvLainLain) }

export const apiKerugianCRUD = { ..._shapeObjectMethodCRUD(SrvKerugian) }

export const apiPiutangKaryawanCRUD = { ..._shapeObjectMethodCRUD(SrvPiutangKaryawan) }

export const apiPesananPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvPesananPenjualanBarang) }

export const apiRincianPesananPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPesananPenjualanBarang) }

export const apiFakturPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvFakturPenjualanBarang) }

export const apiPelunasanPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvPelunasanPenjualanBarang) }

export const apiRincianPelunasanPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPelunasanPenjualanBarang) }

export const apiRincianPelunasanPenjualanDendaBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPelunasanPenjualanDendaBarang) }

export const apiReturPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvReturPenjualanBarang) }

export const apiRincianReturPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianReturPenjualanBarang) }

export const apiPengembalianDendaPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvPengembalianDendaPenjualanBarang) }

export const apiRincianPengembalianDendaPenjualanBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPengembalianDendaPenjualanBarang) }

export const apiPesananPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvPesananPenjualanJasa) }

export const apiRincianPesananPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPesananPenjualanJasa) }

export const apiFakturPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvFakturPenjualanJasa) }

export const apiPelunasanPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvPelunasanPenjualanJasa) }

export const apiRincianPelunasanPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPelunasanPenjualanJasa) }

export const apiRincianPelunasanPenjualanDendaJasaCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPelunasanPenjualanDendaJasa) }

export const apiReturPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvReturPenjualanJasa) }

export const apiRincianReturPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvRincianReturPenjualanJasa) }

export const apiPengembalianDendaPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvPengembalianDendaPenjualanJasa) }

export const apiRincianPengembalianDendaPenjualanJasaCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPengembalianDendaPenjualanJasa) }

export const apiPesananPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvPesananPembelianBarang) }

export const apiRincianPesananPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPesananPembelianBarang) }

export const apiFakturPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvFakturPembelianBarang) }

export const apiPelunasanPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvPelunasanPembelianBarang) }

export const apiRincianPelunasanPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPelunasanPembelianBarang) }

export const apiRincianPelunasanPembelianDendaBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPelunasanPembelianDendaBarang) }

export const apiReturPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvReturPembelianBarang) }

export const apiRincianReturPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianReturPembelianBarang) }

export const apiPengembalianDendaPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvPengembalianDendaPembelianBarang) }

export const apiRincianPengembalianDendaPembelianBarangCRUD = { ..._shapeObjectMethodCRUD(SrvRincianPengembalianDendaPembelianBarang) }
