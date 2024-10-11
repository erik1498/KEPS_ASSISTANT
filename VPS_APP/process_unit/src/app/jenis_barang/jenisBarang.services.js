import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createJenisBarangRepo, deleteJenisBarangByUuidRepo, getAllJenisBarangRepo, getJenisBarangByUuidRepo, updateJenisBarangByUuidRepo } from "./jenisBarang.repository.js"

export const getAllJenisBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisBarangService", null, req_identity)

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
    
    const jenisBarangs = await getAllJenisBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisBarangs.entry, jenisBarangs.count, jenisBarangs.pageNumber, jenisBarangs.size)
}

export const getJenisBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisBarangByUuidService [${uuid}]`, null, req_identity)
    const jenisBarang = await getJenisBarangByUuidRepo(uuid, req_identity)

    if (!jenisBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return jenisBarang
}

export const createJenisBarangService = async (jenisBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisBarangService`, jenisBarangData, req_identity)
    jenisBarangData.enabled = 1

    const jenisBarang = await createJenisBarangRepo(jenisBarangData, req_identity)
    return jenisBarang
}

export const deleteJenisBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisBarangByUuidService [${uuid}]`, null, req_identity)
    await getJenisBarangByUuidService(uuid, req_identity)
    await deleteJenisBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisBarangByUuidService = async (uuid, jenisBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisBarangByUuidService [${uuid}]`, jenisBarangData, req_identity)
    const beforeData = await getJenisBarangByUuidService(uuid, req_identity)
    const jenisBarang = await updateJenisBarangByUuidRepo(uuid, jenisBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisBarangData
    }, req_identity)

    return jenisBarang
}