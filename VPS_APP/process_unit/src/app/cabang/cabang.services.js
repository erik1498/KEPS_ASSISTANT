import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createCabangRepo, deleteCabangByUuidRepo, getAllCabangRepo, getCabangByUuidRepo, updateCabangByUuidRepo } from "./cabang.repository.js"

export const getAllCabangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllCabangService", null, req_identity)

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

    const cabangs = await getAllCabangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(cabangs.entry, cabangs.count, cabangs.pageNumber, cabangs.size)
}

export const getCabangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCabangByUuidService [${uuid}]`, null, req_identity)
    const cabang = await getCabangByUuidRepo(uuid, req_identity)

    if (!cabang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return cabang
}

export const createCabangService = async (cabangData, req_identity) => {
    LOGGER(logType.INFO, `Start createCabangService`, cabangData, req_identity)
    cabangData.enabled = 1

    const cabang = await createCabangRepo(cabangData, req_identity)
    return cabang
}

export const deleteCabangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteCabangByUuidService [${uuid}]`, null, req_identity)
    await getCabangByUuidService(uuid, req_identity)
    await deleteCabangByUuidRepo(uuid, req_identity)
    return true
}

export const updateCabangByUuidService = async (uuid, cabangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateCabangByUuidService [${uuid}]`, cabangData, req_identity)
    const beforeData = await getCabangByUuidService(uuid, req_identity)
    const cabang = await updateCabangByUuidRepo(uuid, cabangData, req_identity)
    
    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        cabangData
    }, req_identity)

    return cabang
}