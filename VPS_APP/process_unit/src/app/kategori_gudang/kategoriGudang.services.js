import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKategoriGudangRepo, deleteKategoriGudangByUuidRepo, getAllKategoriGudangRepo, getKategoriGudangByUuidRepo, updateKategoriGudangByUuidRepo } from "./kategoriGudang.repository.js"

export const getAllKategoriGudangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriGudangService", null, req_identity)

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
    
    const kategoriGudangs = await getAllKategoriGudangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriGudangs.entry, kategoriGudangs.count, kategoriGudangs.pageNumber, kategoriGudangs.size)
}

export const getKategoriGudangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriGudangByUuidService [${uuid}]`, null, req_identity)
    const kategoriGudang = await getKategoriGudangByUuidRepo(uuid, req_identity)

    if (!kategoriGudang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return kategoriGudang
}

export const createKategoriGudangService = async (kategoriGudangData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriGudangService`, kategoriGudangData, req_identity)
    kategoriGudangData.enabled = 1

    const kategoriGudang = await createKategoriGudangRepo(kategoriGudangData, req_identity)
    return kategoriGudang
}

export const deleteKategoriGudangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriGudangByUuidService [${uuid}]`, null, req_identity)
    await getKategoriGudangByUuidService(uuid, req_identity)
    await deleteKategoriGudangByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriGudangByUuidService = async (uuid, kategoriGudangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriGudangByUuidService [${uuid}]`, kategoriGudangData, req_identity)
    const beforeData = await getKategoriGudangByUuidService(uuid, req_identity)
    const kategoriGudang = await updateKategoriGudangByUuidRepo(uuid, kategoriGudangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriGudangData
    }, req_identity)

    return kategoriGudang
}