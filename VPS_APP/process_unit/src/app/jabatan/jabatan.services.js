import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createJabatanRepo, deleteJabatanByUuidRepo, getAllJabatanRepo, getJabatanByUuidRepo, updateJabatanByUuidRepo } from "./jabatan.repository.js"

export const getAllJabatanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJabatanService", null, req_identity)

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
    
    const jabatans = await getAllJabatanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jabatans.entry, jabatans.count, jabatans.pageNumber, jabatans.size)
}

export const getJabatanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJabatanByUuidService [${uuid}]`, null, req_identity)
    const jabatan = await getJabatanByUuidRepo(uuid, req_identity)

    if (!jabatan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return jabatan
}

export const createJabatanService = async (jabatanData, req_identity) => {
    LOGGER(logType.INFO, `Start createJabatanService`, jabatanData, req_identity)
    jabatanData.enabled = 1

    const jabatan = await createJabatanRepo(jabatanData, req_identity)
    return jabatan
}

export const deleteJabatanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJabatanByUuidService [${uuid}]`, null, req_identity)
    await getJabatanByUuidService(uuid, req_identity)
    await deleteJabatanByUuidRepo(uuid, req_identity)
    return true
}

export const updateJabatanByUuidService = async (uuid, jabatanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJabatanByUuidService [${uuid}]`, jabatanData, req_identity)
    const beforeData = await getJabatanByUuidService(uuid, req_identity)
    const jabatan = await updateJabatanByUuidRepo(uuid, jabatanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jabatanData
    }, req_identity)

    return jabatan
}