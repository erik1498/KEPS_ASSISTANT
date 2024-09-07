import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createStokAwalBarangRepo, deleteStokAwalBarangByUuidRepo, getAllStokAwalBarangRepo, getStokAwalBarangByBarangUUIDRepo, updateStokAwalBarangByUuidRepo } from "./stokAwalBarang.repository.js"

export const getAllStokAwalBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllStokAwalBarangService", null, req_identity)

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
    
    const stokAwalBarangs = await getAllStokAwalBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(stokAwalBarangs.entry, stokAwalBarangs.count, stokAwalBarangs.pageNumber, stokAwalBarangs.size)
}

export const getStokAwalBarangByBarangUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBarangByBarangUUIDService [${uuid}]`, null, req_identity)
    const stokAwalBarang = await getStokAwalBarangByBarangUUIDRepo(uuid, req_identity)

    if (!stokAwalBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return stokAwalBarang
}

export const createStokAwalBarangService = async (stokAwalBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createStokAwalBarangService`, stokAwalBarangData, req_identity)
    stokAwalBarangData.enabled = 1

    const stokAwalBarang = await createStokAwalBarangRepo(stokAwalBarangData, req_identity)
    return stokAwalBarang
}

export const deleteStokAwalBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteStokAwalBarangByUuidService [${uuid}]`, null, req_identity)
    await getStokAwalBarangByUuidService(uuid, req_identity)
    await deleteStokAwalBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateStokAwalBarangByUuidService = async (uuid, stokAwalBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStokAwalBarangByUuidService [${uuid}]`, stokAwalBarangData, req_identity)
    const beforeData = await getStokAwalBarangByUuidService(uuid, req_identity)
    const stokAwalBarang = await updateStokAwalBarangByUuidRepo(uuid, stokAwalBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        stokAwalBarangData
    }, req_identity)

    return stokAwalBarang
}