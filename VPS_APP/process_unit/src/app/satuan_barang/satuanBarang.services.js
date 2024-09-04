import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createSatuanBarangRepo, deleteSatuanBarangByUuidRepo, getAllSatuanBarangRepo, getSatuanBarangByUuidRepo, updateSatuanBarangByUuidRepo } from "./satuanBarang.repository.js"

export const getAllSatuanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllSatuanBarangService", null, req_identity)

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
    
    const satuanBarangs = await getAllSatuanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(satuanBarangs.entry, satuanBarangs.count, satuanBarangs.pageNumber, satuanBarangs.size)
}

export const getSatuanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getSatuanBarangByUuidService [${uuid}]`, null, req_identity)
    const satuanBarang = await getSatuanBarangByUuidRepo(uuid, req_identity)

    if (!satuanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return satuanBarang
}

export const createSatuanBarangService = async (satuanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createSatuanBarangService`, satuanBarangData, req_identity)
    satuanBarangData.enabled = 1

    const satuanBarang = await createSatuanBarangRepo(satuanBarangData, req_identity)
    return satuanBarang
}

export const deleteSatuanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteSatuanBarangByUuidService [${uuid}]`, null, req_identity)
    await getSatuanBarangByUuidService(uuid, req_identity)
    await deleteSatuanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateSatuanBarangByUuidService = async (uuid, satuanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateSatuanBarangByUuidService [${uuid}]`, satuanBarangData, req_identity)
    const beforeData = await getSatuanBarangByUuidService(uuid, req_identity)
    const satuanBarang = await updateSatuanBarangByUuidRepo(uuid, satuanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        satuanBarangData
    }, req_identity)

    return satuanBarang
}