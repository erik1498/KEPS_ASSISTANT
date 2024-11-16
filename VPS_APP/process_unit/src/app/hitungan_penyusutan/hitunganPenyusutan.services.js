import { GARIS_LURUS, hitungPenyusutanGarisLurus, hitungPenyusutanSaldoMenurun, SALDO_MENURUN } from "../../utils/hitunganPenyusutanUtil.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanService } from "../daftar_aset/daftarAset.services.js"
import { createHitunganPenyusutanRepo, deleteHitunganPenyusutanByUuidRepo, getHitunganPenyusutanByUuidRepo } from "./hitunganPenyusutan.repository.js"

export const getHitunganPenyusutanByUuidService = async (uuid, validasi_hitungan_penyusutan, req_identity) => {
    LOGGER(logType.INFO, "Start getHitunganPenyusutanByUuidService", { uuid }, req_identity)
    const asetData = await getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanService(uuid, req_identity)

    const resultDaftarAsetOnDatabase = await getHitunganPenyusutanByUuidRepo(uuid, req_identity)

    if (resultDaftarAsetOnDatabase.length > 0) {
        return resultDaftarAsetOnDatabase
    }

    const result = asetData.metode_penyusutan_name == GARIS_LURUS ? hitungPenyusutanGarisLurus(asetData) : hitungPenyusutanSaldoMenurun(asetData)

    if (validasi_hitungan_penyusutan) {
        result.map(async (x, i) => {
            if (asetData.metode_penyusutan_name == GARIS_LURUS) {
                await createHitunganPenyusutanRepo({
                    daftar_aset: uuid,
                    transaksi: i,
                    tahun_perolehan: x.tahun_perolehan,
                    bulan: parseInt(x.bulan),
                    tahun: parseInt(x.tahun),
                    masa_awal: x.masa_awal != null ? x.masa_awal : -1,
                    masa_akhir: x.masa_akhir != null ? x.masa_akhir : -1,
                    harga_beli: x.harga_beli != null ? x.harga_beli : -1,
                    nilai_buku: x.nilai_buku != null ? x.nilai_buku : -1,
                    nilai_penyusutan: x.nilai_penyusutan != null ? x.nilai_penyusutan : -1,
                    persentase: x.persentase != null ? x.persentase : -1,
                    metode_penyusutan: GARIS_LURUS,
                    akumulasi_penyusutan_awal_tahun: -1,
                    persentase_penyusutan: -1,
                    nilai_buku_awal_tahun: -1,
                    nilai_buku_akhir_tahun: -1,
                    enabled: 1
                }, req_identity)
            }
            if (asetData.metode_penyusutan_name == SALDO_MENURUN) {
                await createHitunganPenyusutanRepo({
                    daftar_aset: uuid,
                    transaksi: i,
                    tahun_perolehan: x.tahun_perolehan,
                    bulan: parseInt(x.bulan),
                    tahun: parseInt(x.tahun),
                    masa_awal: -1,
                    masa_akhir: -1,
                    harga_beli: x.harga_beli != null ? x.harga_beli : -1,
                    nilai_buku: -1,
                    nilai_penyusutan: x.nilai_penyusutan != null ? x.nilai_penyusutan : -1,
                    persentase: -1,
                    metode_penyusutan: SALDO_MENURUN,
                    akumulasi_penyusutan_awal_tahun: x.akumulasi_penyusutan_awal_tahun != null ? x.akumulasi_penyusutan_awal_tahun : -1,
                    persentase_penyusutan: x.persentase_penyusutan != null ? x.persentase_penyusutan : -1,
                    nilai_buku_awal_tahun: x.nilai_buku_awal_tahun != null ? x.nilai_buku_awal_tahun : -1,
                    nilai_buku_akhir_tahun: x.nilai_buku_akhir_tahun != null ? x.nilai_buku_akhir_tahun : -1,
                    enabled: 1
                }, req_identity)
            }
        })
    }

    return result
}

export const deleteHitunganPenyusutanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteHitunganPenyusutanByUuidService [${uuid}]`, null, req_identity)
    await deleteHitunganPenyusutanByUuidRepo(uuid, req_identity)
    return true
}