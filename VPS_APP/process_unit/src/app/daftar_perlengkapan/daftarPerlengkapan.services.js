import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createDaftarPerlengkapanRepo, deleteDaftarPerlengkapanByUuidRepo, getAllDaftarPerlengkapanRepo, getDaftarPerlengkapanByUuidRepo, updateDaftarPerlengkapanByUuidRepo } from "./daftarPerlengkapan.repository.js"

export const getAllDaftarPerlengkapanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarPerlengkapanService", null, req_identity)

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
    
    const daftarPerlengkapans = await getAllDaftarPerlengkapanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(daftarPerlengkapans.entry, daftarPerlengkapans.count, daftarPerlengkapans.pageNumber, daftarPerlengkapans.size)
}

export const getDaftarPerlengkapanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarPerlengkapanByUuidService [${uuid}]`, null, req_identity)
    const daftarPerlengkapan = await getDaftarPerlengkapanByUuidRepo(uuid, req_identity)

    if (!daftarPerlengkapan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return daftarPerlengkapan
}

export const createDaftarPerlengkapanService = async (daftarPerlengkapanData, req_identity) => {
    LOGGER(logType.INFO, `Start createDaftarPerlengkapanService`, daftarPerlengkapanData, req_identity)
    daftarPerlengkapanData.enabled = 1

    const daftarPerlengkapan = await createDaftarPerlengkapanRepo(daftarPerlengkapanData, req_identity)
    return daftarPerlengkapan
}

export const deleteDaftarPerlengkapanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDaftarPerlengkapanByUuidService [${uuid}]`, null, req_identity)
    await getDaftarPerlengkapanByUuidService(uuid, req_identity)
    await deleteDaftarPerlengkapanByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarPerlengkapanByUuidService = async (uuid, daftarPerlengkapanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarPerlengkapanByUuidService [${uuid}]`, daftarPerlengkapanData, req_identity)
    const beforeData = await getDaftarPerlengkapanByUuidService(uuid, req_identity)
    const daftarPerlengkapan = await updateDaftarPerlengkapanByUuidRepo(uuid, daftarPerlengkapanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarPerlengkapanData
    }, req_identity)

    return daftarPerlengkapan
}