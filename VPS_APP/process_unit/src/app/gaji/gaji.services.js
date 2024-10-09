import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBuktiTransaski } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createGajiRepo, deleteGajiByUuidRepo, getAllGajiRepo, getGajiByPegawaiUuidRepo, getGajiByUuidRepo, getSlipGajiByPegawaiUUIDRepo, updateGajiByUuidRepo } from "./gaji.repository.js"

export const getAllGajiService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllGajiService", null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)

    const gajis = await getAllGajiRepo(bulan, tahun, req_identity)
    return gajis
}

export const getSlipGajiByPegawaiUUIDService = async (uuid, query, req_identity) => {
    LOGGER(logType.INFO, `Start getSlipGajiByPegawaiUUIDService [${uuid}]`, null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        uuid, bulan, tahun
    }, req_identity)

    const gaji = await getSlipGajiByPegawaiUUIDRepo(uuid, bulan, tahun, req_identity)
    return gaji
}

export const getGajiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getGajiByUuidService [${uuid}]`, null, req_identity)
    const gaji = await getGajiByUuidRepo(uuid, req_identity)

    if (!gaji) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return gaji
}


export const getGajiByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getGajiByPegawaiUUIDService [${uuid}]`, { periode, tahun }, req_identity)
    const gaji = await getGajiByPegawaiUuidRepo(uuid, periode, tahun, req_identity)
    return gaji[0]
}

export const createGajiService = async (gajiData, req_identity) => {
    LOGGER(logType.INFO, `Start createGajiService`, gajiData, req_identity)
    gajiData.enabled = 1

    await getNeracaValidasiByTanggalService(null, gajiData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(gajiData.bukti_transaksi, "EMPTY", req_identity)

    const gaji = await createGajiRepo(gajiData, req_identity)
    return gaji
}

export const deleteGajiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteGajiByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getGajiByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await deleteGajiByUuidRepo(uuid, req_identity)
    return true
}

export const updateGajiByUuidService = async (uuid, gajiData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateGajiByUuidService [${uuid}]`, gajiData, req_identity)
    const beforeData = await getGajiByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(gajiData.bukti_transaksi, [`"${uuid}"`], req_identity)

    const gaji = await updateGajiByUuidRepo(uuid, gajiData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        gajiData
    }, req_identity)

    return gaji
}