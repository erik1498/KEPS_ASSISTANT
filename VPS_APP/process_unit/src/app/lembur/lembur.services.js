import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createLemburRepo, deleteLemburByUuidRepo, getAllLemburRepo, getLemburByPegawaiUuidRepo, getLemburByUuidRepo, updateLemburByUuidRepo } from "./lembur.repository.js"

export const getAllLemburService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllLemburService", null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)

    const lemburs = await getAllLemburRepo(bulan, tahun, req_identity)
    return lemburs
}

export const getLemburByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getLemburByUuidService [${uuid}]`, null, req_identity)
    const lembur = await getLemburByUuidRepo(uuid, req_identity)

    if (!lembur) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return lembur
}

export const getLemburByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getLemburByPegawaiUUIDService [${uuid}]`, {
        periode,
        tahun
    }, req_identity)
    const lembur = await getLemburByPegawaiUuidRepo(uuid, periode, tahun, req_identity)
    return lembur
}

export const createLemburService = async (lemburData, req_identity) => {
    LOGGER(logType.INFO, `Start createLemburService`, lemburData, req_identity)
    lemburData.enabled = 1

    await getNeracaValidasiByTanggalService(lemburData.tanggal, req_identity)

    const lembur = await createLemburRepo(lemburData, req_identity)
    return lembur
}

export const deleteLemburByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteLemburByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getLemburByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    await deleteLemburByUuidRepo(uuid, req_identity)
    return true
}

export const updateLemburByUuidService = async (uuid, lemburData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateLemburByUuidService [${uuid}]`, lemburData, req_identity)
    const beforeData = await getLemburByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    const lembur = await updateLemburByUuidRepo(uuid, lemburData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        lemburData
    }, req_identity)

    return lembur
}