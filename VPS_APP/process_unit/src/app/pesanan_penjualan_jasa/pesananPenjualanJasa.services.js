import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPesananPenjualanJasaRepo, deletePesananPenjualanJasaByUuidRepo, getAllPesananPenjualanJasaRepo, getPesananPenjualanJasaByUuidRepo, updatePesananPenjualanJasaByUuidRepo } from "./pesananPenjualanJasa.repository.js"

export const getAllPesananPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPesananPenjualanJasaService", null, req_identity)

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
    
    const pesananPenjualanJasas = await getAllPesananPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pesananPenjualanJasas.entry, pesananPenjualanJasas.count, pesananPenjualanJasas.pageNumber, pesananPenjualanJasas.size)
}

export const getPesananPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPesananPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const pesananPenjualanJasa = await getPesananPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!pesananPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pesananPenjualanJasa
}

export const createPesananPenjualanJasaService = async (pesananPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createPesananPenjualanJasaService`, pesananPenjualanJasaData, req_identity)
    pesananPenjualanJasaData.enabled = 1

    const pesananPenjualanJasa = await createPesananPenjualanJasaRepo(pesananPenjualanJasaData, req_identity)
    return pesananPenjualanJasa
}

export const deletePesananPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePesananPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    await getPesananPenjualanJasaByUuidService(uuid, req_identity)
    await deletePesananPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updatePesananPenjualanJasaByUuidService = async (uuid, pesananPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePesananPenjualanJasaByUuidService [${uuid}]`, pesananPenjualanJasaData, req_identity)
    const beforeData = await getPesananPenjualanJasaByUuidService(uuid, req_identity)
    const pesananPenjualanJasa = await updatePesananPenjualanJasaByUuidRepo(uuid, pesananPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pesananPenjualanJasaData
    }, req_identity)

    return pesananPenjualanJasa
}