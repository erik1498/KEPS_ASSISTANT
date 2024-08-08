import { _shapeObjectMethodCRUD } from './_config.api';
import { SrvAktivitasDokumen, SrvDivisi, SrvDokumenKlien, SrvHistoryAkun, SrvJabatan, SrvJurnalUmum, SrvKodeAkun, SrvLabaRugi, SrvLogin, SrvNeraca, SrvNeracaSaldo, SrvPayroll, SrvPegawai, SrvPerubahanModal, SrvRiwayatAktivitasDokumen, SrvRiwayatPembayaranAktivitasDokumen, SrvStatusRiwayatAktivitasDokumen, SrvStatusRiwayatAktivitasDokumenKeterangan, SrvStatusRiwayatAktivitasDokumenPegawaiPelaksana, SrvStatusTanggungan } from './_endPoint.api';

export const apiLogin = { ..._shapeObjectMethodCRUD(SrvLogin) };

export const apiJurnalUmumCRUD = { ..._shapeObjectMethodCRUD(SrvJurnalUmum) };

export const apiKodeAkunCRUD = { ..._shapeObjectMethodCRUD(SrvKodeAkun) }

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

export const apiAktivitasDokumen = {..._shapeObjectMethodCRUD(SrvAktivitasDokumen)}

export const apiRiwayatPembayaranAktivitasDokumen = {..._shapeObjectMethodCRUD(SrvRiwayatPembayaranAktivitasDokumen)}

export const apiRiwayatAktivitasDokumen = {..._shapeObjectMethodCRUD(SrvRiwayatAktivitasDokumen)}

export const apiStatusRiwayatAktivitasDokumen = {..._shapeObjectMethodCRUD(SrvStatusRiwayatAktivitasDokumen)}

export const apiStatusRiwayatAktivitasDokumenPegawaiPelaksana = {..._shapeObjectMethodCRUD(SrvStatusRiwayatAktivitasDokumenPegawaiPelaksana)}

export const apiStatusRiwayatAktivitasDokumenKeterangan = {..._shapeObjectMethodCRUD(SrvStatusRiwayatAktivitasDokumenKeterangan)}

export const apiDokumenKlien = {..._shapeObjectMethodCRUD(SrvDokumenKlien)}