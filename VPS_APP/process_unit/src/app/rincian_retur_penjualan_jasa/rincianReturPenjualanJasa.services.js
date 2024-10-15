import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianReturPenjualanJasaRepo, deleteRincianReturPenjualanJasaByUuidRepo, getAllRincianPesananPenjualanJasaByReturPenjualanRepo, getAllRincianReturPenjualanJasaRepo, getRincianReturPenjualanJasaByUuidRepo, updateRincianReturPenjualanJasaByUuidRepo } from "./rincianReturPenjualanJasa.repository.js"

export const getAllRincianReturPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianReturPenjualanJasaService", null, req_identity)

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
    
    const rincianReturPenjualanJasas = await getAllRincianReturPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianReturPenjualanJasas.entry, rincianReturPenjualanJasas.count, rincianReturPenjualanJasas.pageNumber, rincianReturPenjualanJasas.size)
}

export const getAllRincianPesananPenjualanJasaByReturPenjualanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanJasaByReturPenjualanService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanJasa = await getAllRincianPesananPenjualanJasaByReturPenjualanRepo(uuid, req_identity)
    return rincianPesananPenjualanJasa
}

export const getRincianReturPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianReturPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const rincianReturPenjualanJasa = await getRincianReturPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!rincianReturPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianReturPenjualanJasa
}

export const createRincianReturPenjualanJasaService = async (rincianReturPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianReturPenjualanJasaService`, rincianReturPenjualanJasaData, req_identity)
    rincianReturPenjualanJasaData.enabled = 1

    const rincianReturPenjualanJasa = await createRincianReturPenjualanJasaRepo(rincianReturPenjualanJasaData, req_identity)
    return rincianReturPenjualanJasa
}

export const deleteRincianReturPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianReturPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    await getRincianReturPenjualanJasaByUuidService(uuid, req_identity)
    await deleteRincianReturPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianReturPenjualanJasaByUuidService = async (uuid, rincianReturPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianReturPenjualanJasaByUuidService [${uuid}]`, rincianReturPenjualanJasaData, req_identity)
    const beforeData = await getRincianReturPenjualanJasaByUuidService(uuid, req_identity)
    const rincianReturPenjualanJasa = await updateRincianReturPenjualanJasaByUuidRepo(uuid, rincianReturPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianReturPenjualanJasaData
    }, req_identity)

    return rincianReturPenjualanJasa
}