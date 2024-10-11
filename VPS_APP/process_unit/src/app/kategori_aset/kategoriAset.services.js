import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKategoriAsetRepo, deleteKategoriAsetByUuidRepo, getAllKategoriAsetRepo, getKategoriAsetByUuidRepo, updateKategoriAsetByUuidRepo } from "./kategoriAset.repository.js"

export const getAllKategoriAsetService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriAsetService", null, req_identity)

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
    
    const kategoriAsets = await getAllKategoriAsetRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriAsets.entry, kategoriAsets.count, kategoriAsets.pageNumber, kategoriAsets.size)
}

export const getKategoriAsetByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriAsetByUuidService [${uuid}]`, null, req_identity)
    const kategoriAset = await getKategoriAsetByUuidRepo(uuid, req_identity)

    if (!kategoriAset) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kategoriAset
}

export const createKategoriAsetService = async (kategoriAsetData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriAsetService`, kategoriAsetData, req_identity)
    kategoriAsetData.enabled = 1

    const kategoriAset = await createKategoriAsetRepo(kategoriAsetData, req_identity)
    return kategoriAset
}

export const deleteKategoriAsetByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriAsetByUuidService [${uuid}]`, null, req_identity)
    await getKategoriAsetByUuidService(uuid, req_identity)
    await deleteKategoriAsetByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriAsetByUuidService = async (uuid, kategoriAsetData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriAsetByUuidService [${uuid}]`, kategoriAsetData, req_identity)
    const beforeData = await getKategoriAsetByUuidService(uuid, req_identity)
    const kategoriAset = await updateKategoriAsetByUuidRepo(uuid, kategoriAsetData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriAsetData
    }, req_identity)

    return kategoriAset
}