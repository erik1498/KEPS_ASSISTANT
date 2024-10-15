import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPesananPenjualanJasaRepo, deleteRincianPesananPenjualanJasaByUuidRepo, getAllRincianPesananPenjualanJasaRepo, getRincianPesananPenjualanJasaByPesananPenjualanUUIDRepo, getRincianPesananPenjualanJasaByUuidRepo, updateRincianPesananPenjualanJasaByUuidRepo } from "./rincianPesananPenjualanJasa.repository.js"

export const getAllRincianPesananPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanJasaService", null, req_identity)

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
    
    const rincianPesananPenjualanJasas = await getAllRincianPesananPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPesananPenjualanJasas.entry, rincianPesananPenjualanJasas.count, rincianPesananPenjualanJasas.pageNumber, rincianPesananPenjualanJasas.size)
}

export const getRincianPesananPenjualanJasaByPesananPenjualanUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPesananPenjualanJasaByPesananPenjualanUUIDService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanJasa = await getRincianPesananPenjualanJasaByPesananPenjualanUUIDRepo(uuid, req_identity)
    return rincianPesananPenjualanJasa
}

export const getRincianPesananPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPesananPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanJasa = await getRincianPesananPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!rincianPesananPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPesananPenjualanJasa
}

export const createRincianPesananPenjualanJasaService = async (rincianPesananPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPesananPenjualanJasaService`, rincianPesananPenjualanJasaData, req_identity)
    rincianPesananPenjualanJasaData.enabled = 1

    const rincianPesananPenjualanJasa = await createRincianPesananPenjualanJasaRepo(rincianPesananPenjualanJasaData, req_identity)
    return rincianPesananPenjualanJasa
}

export const deleteRincianPesananPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPesananPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    await getRincianPesananPenjualanJasaByUuidService(uuid, req_identity)
    await deleteRincianPesananPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPesananPenjualanJasaByUuidService = async (uuid, rincianPesananPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPesananPenjualanJasaByUuidService [${uuid}]`, rincianPesananPenjualanJasaData, req_identity)
    const beforeData = await getRincianPesananPenjualanJasaByUuidService(uuid, req_identity)
    const rincianPesananPenjualanJasa = await updateRincianPesananPenjualanJasaByUuidRepo(uuid, rincianPesananPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPesananPenjualanJasaData
    }, req_identity)

    return rincianPesananPenjualanJasa
}