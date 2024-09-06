import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKategoriHargaJasaRepo, deleteKategoriHargaJasaByUuidRepo, getAllKategoriHargaJasaRepo, getKategoriHargaJasaByUuidRepo, updateKategoriHargaJasaByUuidRepo } from "./kategoriHargaJasa.repository.js"

export const getAllKategoriHargaJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaJasaService", null, req_identity)

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
    
    const kategoriHargaJasas = await getAllKategoriHargaJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriHargaJasas.entry, kategoriHargaJasas.count, kategoriHargaJasas.pageNumber, kategoriHargaJasas.size)
}

export const getKategoriHargaJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriHargaJasaByUuidService [${uuid}]`, null, req_identity)
    const kategoriHargaJasa = await getKategoriHargaJasaByUuidRepo(uuid, req_identity)

    if (!kategoriHargaJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return kategoriHargaJasa
}

export const createKategoriHargaJasaService = async (kategoriHargaJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriHargaJasaService`, kategoriHargaJasaData, req_identity)
    kategoriHargaJasaData.enabled = 1

    const kategoriHargaJasa = await createKategoriHargaJasaRepo(kategoriHargaJasaData, req_identity)
    return kategoriHargaJasa
}

export const deleteKategoriHargaJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriHargaJasaByUuidService [${uuid}]`, null, req_identity)
    await getKategoriHargaJasaByUuidService(uuid, req_identity)
    await deleteKategoriHargaJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriHargaJasaByUuidService = async (uuid, kategoriHargaJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriHargaJasaByUuidService [${uuid}]`, kategoriHargaJasaData, req_identity)
    const beforeData = await getKategoriHargaJasaByUuidService(uuid, req_identity)
    const kategoriHargaJasa = await updateKategoriHargaJasaByUuidRepo(uuid, kategoriHargaJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriHargaJasaData
    }, req_identity)

    return kategoriHargaJasa
}