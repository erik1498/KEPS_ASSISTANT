import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPengembalianDendaPenjualanJasaRepo, deleteRincianPengembalianDendaPenjualanJasaByUuidRepo, getAllRincianPengembalianDendaPenjualanJasaRepo, getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDRepo, getRincianPengembalianDendaPenjualanJasaByUuidRepo, updateRincianPengembalianDendaPenjualanJasaByUuidRepo } from "./rincianPengembalianDendaPenjualanJasa.repository.js"

export const getAllRincianPengembalianDendaPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPenjualanJasaService", null, req_identity)

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
    
    const rincianPengembalianDendaPenjualanJasas = await getAllRincianPengembalianDendaPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPengembalianDendaPenjualanJasas.entry, rincianPengembalianDendaPenjualanJasas.count, rincianPengembalianDendaPenjualanJasas.pageNumber, rincianPengembalianDendaPenjualanJasas.size)
}

export const getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPenjualanJasa = await getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengembalianDendaPenjualanJasa
}

export const getRincianPengembalianDendaPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPenjualanJasa = await getRincianPengembalianDendaPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengembalianDendaPenjualanJasa
}

export const createRincianPengembalianDendaPenjualanJasaService = async (rincianPengembalianDendaPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPengembalianDendaPenjualanJasaService`, rincianPengembalianDendaPenjualanJasaData, req_identity)
    rincianPengembalianDendaPenjualanJasaData.enabled = 1

    const rincianPengembalianDendaPenjualanJasa = await createRincianPengembalianDendaPenjualanJasaRepo(rincianPengembalianDendaPenjualanJasaData, req_identity)
    return rincianPengembalianDendaPenjualanJasa
}

export const deleteRincianPengembalianDendaPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPengembalianDendaPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    await getRincianPengembalianDendaPenjualanJasaByUuidService(uuid, req_identity)
    await deleteRincianPengembalianDendaPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPengembalianDendaPenjualanJasaByUuidService = async (uuid, rincianPengembalianDendaPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPengembalianDendaPenjualanJasaByUuidService [${uuid}]`, rincianPengembalianDendaPenjualanJasaData, req_identity)
    const beforeData = await getRincianPengembalianDendaPenjualanJasaByUuidService(uuid, req_identity)
    const rincianPengembalianDendaPenjualanJasa = await updateRincianPengembalianDendaPenjualanJasaByUuidRepo(uuid, rincianPengembalianDendaPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPengembalianDendaPenjualanJasaData
    }, req_identity)

    return rincianPengembalianDendaPenjualanJasa
}