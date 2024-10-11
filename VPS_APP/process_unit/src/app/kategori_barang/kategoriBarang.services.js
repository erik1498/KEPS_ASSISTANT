import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKategoriBarangRepo, deleteKategoriBarangByUuidRepo, getAllKategoriBarangRepo, getKategoriBarangByUuidRepo, updateKategoriBarangByUuidRepo } from "./kategoriBarang.repository.js"

export const getAllKategoriBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriBarangService", null, req_identity)

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
    
    const kategoriBarangs = await getAllKategoriBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriBarangs.entry, kategoriBarangs.count, kategoriBarangs.pageNumber, kategoriBarangs.size)
}

export const getKategoriBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriBarangByUuidService [${uuid}]`, null, req_identity)
    const kategoriBarang = await getKategoriBarangByUuidRepo(uuid, req_identity)

    if (!kategoriBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kategoriBarang
}

export const createKategoriBarangService = async (kategoriBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriBarangService`, kategoriBarangData, req_identity)
    kategoriBarangData.enabled = 1

    const kategoriBarang = await createKategoriBarangRepo(kategoriBarangData, req_identity)
    return kategoriBarang
}

export const deleteKategoriBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriBarangByUuidService [${uuid}]`, null, req_identity)
    await getKategoriBarangByUuidService(uuid, req_identity)
    await deleteKategoriBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriBarangByUuidService = async (uuid, kategoriBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriBarangByUuidService [${uuid}]`, kategoriBarangData, req_identity)
    const beforeData = await getKategoriBarangByUuidService(uuid, req_identity)
    const kategoriBarang = await updateKategoriBarangByUuidRepo(uuid, kategoriBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriBarangData
    }, req_identity)

    return kategoriBarang
}