import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBuktiTransaski } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createHadiahRepo, deleteHadiahByUuidRepo, getAllHadiahRepo, getHadiahByUuidRepo, getHadiahByPegawaiUuidRepo, updateHadiahByUuidRepo } from "./hadiah.repository.js"

export const getAllHadiahService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllHadiahService", null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)

    return await getAllHadiahRepo(bulan, tahun, req_identity)
}

export const getHadiahByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getHadiahByUuidService [${uuid}]`, null, req_identity)
    const hadiah = await getHadiahByUuidRepo(uuid, req_identity)

    if (!hadiah) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return hadiah
}

export const getHadiahByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getHadiahByPegawaiUUIDService [${uuid}]`, { periode, tahun }, req_identity)
    const hadiah = await getHadiahByPegawaiUuidRepo(uuid, periode, tahun, req_identity)
    return hadiah
}

export const createHadiahService = async (hadiahData, req_identity) => {
    LOGGER(logType.INFO, `Start createHadiahService`, hadiahData, req_identity)
    hadiahData.enabled = 1

    await getNeracaValidasiByTanggalService(null, hadiahData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(hadiahData.bukti_transaksi, "EMPTY", req_identity)

    const hadiah = await createHadiahRepo(hadiahData, req_identity)
    return hadiah
}

export const deleteHadiahByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteHadiahByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getHadiahByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await deleteHadiahByUuidRepo(uuid, req_identity)
    return true
}

export const updateHadiahByUuidService = async (uuid, hadiahData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateHadiahByUuidService [${uuid}]`, hadiahData, req_identity)
    const beforeData = await getHadiahByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(hadiahData.bukti_transaksi, [`"${beforeData.uuid}"`], req_identity)

    const hadiah = await updateHadiahByUuidRepo(uuid, hadiahData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        hadiahData
    }, req_identity)

    return hadiah
}