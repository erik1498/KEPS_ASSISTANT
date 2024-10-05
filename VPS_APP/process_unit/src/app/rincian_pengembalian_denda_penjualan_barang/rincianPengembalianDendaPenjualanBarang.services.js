import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPengembalianDendaPenjualanBarangRepo, deleteRincianPengembalianDendaPenjualanBarangByUuidRepo, getAllRincianPengembalianDendaPenjualanBarangRepo, getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDRepo, getRincianPengembalianDendaPenjualanBarangByUuidRepo, updateRincianPengembalianDendaPenjualanBarangByUuidRepo } from "./rincianPengembalianDendaPenjualanBarang.repository.js"

export const getAllRincianPengembalianDendaPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPenjualanBarangService", null, req_identity)

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
    
    const rincianPengembalianDendaPenjualanBarangs = await getAllRincianPengembalianDendaPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPengembalianDendaPenjualanBarangs.entry, rincianPengembalianDendaPenjualanBarangs.count, rincianPengembalianDendaPenjualanBarangs.pageNumber, rincianPengembalianDendaPenjualanBarangs.size)
}

export const getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPenjualanBarang = await getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return rincianPengembalianDendaPenjualanBarang
}

export const getRincianPengembalianDendaPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPenjualanBarang = await getRincianPengembalianDendaPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return rincianPengembalianDendaPenjualanBarang
}

export const createRincianPengembalianDendaPenjualanBarangService = async (rincianPengembalianDendaPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPengembalianDendaPenjualanBarangService`, rincianPengembalianDendaPenjualanBarangData, req_identity)
    rincianPengembalianDendaPenjualanBarangData.enabled = 1

    const rincianPengembalianDendaPenjualanBarang = await createRincianPengembalianDendaPenjualanBarangRepo(rincianPengembalianDendaPenjualanBarangData, req_identity)
    return rincianPengembalianDendaPenjualanBarang
}

export const deleteRincianPengembalianDendaPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPengembalianDendaPenjualanBarangByUuidService(uuid, req_identity)
    await deleteRincianPengembalianDendaPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPengembalianDendaPenjualanBarangByUuidService = async (uuid, rincianPengembalianDendaPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, rincianPengembalianDendaPenjualanBarangData, req_identity)
    const beforeData = await getRincianPengembalianDendaPenjualanBarangByUuidService(uuid, req_identity)
    const rincianPengembalianDendaPenjualanBarang = await updateRincianPengembalianDendaPenjualanBarangByUuidRepo(uuid, rincianPengembalianDendaPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPengembalianDendaPenjualanBarangData
    }, req_identity)

    return rincianPengembalianDendaPenjualanBarang
}