import { _shapeObjectMethodCRUD } from './_config.api';
import { SrvAktivitasDokumen, SrvCabang, SrvCustomer, SrvDaftarBarang, SrvDaftarGudang, SrvDaftarJasa, SrvDivisi, SrvDokumenKlien, SrvGaji, SrvHadiah, SrvHistoryAkun, SrvJabatan, SrvJenisBarang, SrvJenisGudang, SrvJenisJasa, SrvJenisPenjualanBarang, SrvJenisPenjualanJasa, SrvJurnalUmum, SrvKategoriAset, SrvKategoriBarang, SrvKategoriGudang, SrvKategoriHargaBarang, SrvKategoriHargaJasa, SrvKategoriJasa, SrvKategoriPerlengkapan, SrvKelompokAset, SrvKerugian, SrvKodeAkun, SrvLabaRugi, SrvLainLain, SrvLembur, SrvLogin, SrvMetodePenyusutan, SrvNeraca, SrvNeracaSaldo, SrvPayroll, SrvPegawai, SrvPerubahanModal, SrvPiutangKaryawan, SrvPPH2126, SrvRincianTransaksiBank, SrvRincianTransaksiKas, SrvRiwayatAktivitasDokumen, SrvRiwayatPembayaranAktivitasDokumen, SrvSatuanBarang, SrvSatuanJasa, SrvStatusRiwayatAktivitasDokumen, SrvStatusRiwayatAktivitasDokumenKeterangan, SrvStatusRiwayatAktivitasDokumenPegawaiPelaksana, SrvStatusTanggungan, SrvStokAwalBarang, SrvStokAwalJasa, SrvSupplier, SrvSyaratPembayaran, SrvTipePembayaran, SrvTransaksiBank, SrvTransaksiKas, SrvTunjanganBarang, SrvTunjanganUang } from './_endPoint.api';

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

export const apiKategoriAsetCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriAset) }

export const apiKelompokAsetCRUD = { ..._shapeObjectMethodCRUD(SrvKelompokAset) }

export const apiKategoriPerlengkapanCRUD = { ..._shapeObjectMethodCRUD(SrvKategoriPerlengkapan) }

export const apiMetodePenyusutanCRUD = { ..._shapeObjectMethodCRUD(SrvMetodePenyusutan) }

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