import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBuktiTransaski } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createLainLainRepo, deleteLainLainByUuidRepo, getAllLainLainRepo, getLainLainByPegawaiUUIDRepo, getLainLainByUuidRepo, updateLainLainByUuidRepo } from "./lainLain.repository.js"

export const getAllLainLainService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllLainLainService", null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)

    const lainLains = await getAllLainLainRepo(bulan, tahun, req_identity)
    return lainLains
}

export const getLainLainByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getLainLainByUuidService [${uuid}]`, null, req_identity)
    const lainLain = await getLainLainByUuidRepo(uuid, req_identity)
    return lainLain
}

export const getLainLainByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getLainLainByPegawaiUUIDService [${uuid}]`, {
        periode,
        tahun
    }, req_identity)
    const lainLain = await getLainLainByPegawaiUUIDRepo(uuid, periode, tahun, req_identity)

    return lainLain
}

export const createLainLainService = async (lainLainData, req_identity) => {
    LOGGER(logType.INFO, `Start createLainLainService`, lainLainData, req_identity)
    lainLainData.enabled = 1

    await getNeracaValidasiByTanggalService(null, lainLainData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(lainLainData.bukti_transaksi, "EMPTY", req_identity)

    const lainLain = await createLainLainRepo(lainLainData, req_identity)
    return lainLain
}

export const deleteLainLainByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteLainLainByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getLainLainByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)
    
    await deleteLainLainByUuidRepo(uuid, req_identity)
    return true
}

export const updateLainLainByUuidService = async (uuid, lainLainData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateLainLainByUuidService [${uuid}]`, lainLainData, req_identity)
    const beforeData = await getLainLainByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(lainLainData.bukti_transaksi,  [`"${beforeData.uuid}"`], req_identity)
    
    const lainLain = await updateLainLainByUuidRepo(uuid, lainLainData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        lainLainData
    }, req_identity)

    return lainLain
}