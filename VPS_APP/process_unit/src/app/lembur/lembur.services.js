import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createLemburRepo, deleteLemburByUuidRepo, getAllLemburRepo, getLemburByPegawaiUuidRepo, getLemburByUuidRepo, updateLemburByUuidRepo } from "./lembur.repository.js"

export const getAllLemburService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllLemburService", null, req_identity)

    let { page, size, search } = query
    page = page ? page : null
    size = size ? size : null
    if (size == "all") {
        page = null
        size = null
    }
    search = search ? search : ""
    const pageNumber = (page - 1) * size

    LOGGER(logType.INFO, "Pagination", {
        pageNumber, size, search
    }, req_identity)

    const lemburs = await getAllLemburRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(lemburs.entry, lemburs.count, lemburs.pageNumber, lemburs.size)
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

    const lembur = await createLemburRepo(lemburData, req_identity)
    return lembur
}

export const deleteLemburByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteLemburByUuidService [${uuid}]`, null, req_identity)
    await getLemburByUuidService(uuid, req_identity)
    await deleteLemburByUuidRepo(uuid, req_identity)
    return true
}

export const updateLemburByUuidService = async (uuid, lemburData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateLemburByUuidService [${uuid}]`, lemburData, req_identity)
    const beforeData = await getLemburByUuidService(uuid, req_identity)
    const lembur = await updateLemburByUuidRepo(uuid, lemburData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        lemburData
    }, req_identity)

    return lembur
}