import { objectPathEndPointAPI } from '../config/objectPath.config';

const baseAPIKepsAssistant = import.meta.env
  .VITE_BASE_API_KEPS_ASSISTANT_MANAGEMENT;

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
