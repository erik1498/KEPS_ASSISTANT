import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createSatuanJasaRepo, deleteSatuanJasaByUuidRepo, getAllSatuanJasaRepo, getSatuanJasaByUuidRepo, updateSatuanJasaByUuidRepo } from "./satuanJasa.repository.js"

export const getAllSatuanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllSatuanJasaService", null, req_identity)

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
    
    const satuanJasas = await getAllSatuanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(satuanJasas.entry, satuanJasas.count, satuanJasas.pageNumber, satuanJasas.size)
}

export const getSatuanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getSatuanJasaByUuidService [${uuid}]`, null, req_identity)
    const satuanJasa = await getSatuanJasaByUuidRepo(uuid, req_identity)

    if (!satuanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return satuanJasa
}

export const createSatuanJasaService = async (satuanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createSatuanJasaService`, satuanJasaData, req_identity)
    satuanJasaData.enabled = 1

    const satuanJasa = await createSatuanJasaRepo(satuanJasaData, req_identity)
    return satuanJasa
}

export const deleteSatuanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteSatuanJasaByUuidService [${uuid}]`, null, req_identity)
    await getSatuanJasaByUuidService(uuid, req_identity)
    await deleteSatuanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateSatuanJasaByUuidService = async (uuid, satuanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateSatuanJasaByUuidService [${uuid}]`, satuanJasaData, req_identity)
    const beforeData = await getSatuanJasaByUuidService(uuid, req_identity)
    const satuanJasa = await updateSatuanJasaByUuidRepo(uuid, satuanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        satuanJasaData
    }, req_identity)

    return satuanJasa
}