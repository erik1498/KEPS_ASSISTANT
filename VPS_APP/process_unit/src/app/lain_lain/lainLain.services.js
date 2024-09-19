import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createLainLainRepo, deleteLainLainByUuidRepo, getAllLainLainRepo, getLainLainByPegawaiUUIDRepo, getLainLainByUuidRepo, updateLainLainByUuidRepo } from "./lainLain.repository.js"

export const getAllLainLainService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllLainLainService", null, req_identity)

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

    const lainLains = await getAllLainLainRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(lainLains.entry, lainLains.count, lainLains.pageNumber, lainLains.size)
}

export const getLainLainByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getLainLainByUuidService [${uuid}]`, null, req_identity)
    const lainLain = await getLainLainByUuidRepo(uuid, req_identity)

    if (!lainLain) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
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

    const lainLain = await createLainLainRepo(lainLainData, req_identity)
    return lainLain
}

export const deleteLainLainByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteLainLainByUuidService [${uuid}]`, null, req_identity)
    await getLainLainByUuidService(uuid, req_identity)
    await deleteLainLainByUuidRepo(uuid, req_identity)
    return true
}

export const updateLainLainByUuidService = async (uuid, lainLainData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateLainLainByUuidService [${uuid}]`, lainLainData, req_identity)
    const beforeData = await getLainLainByUuidService(uuid, req_identity)
    const lainLain = await updateLainLainByUuidRepo(uuid, lainLainData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        lainLainData
    }, req_identity)

    return lainLain
}