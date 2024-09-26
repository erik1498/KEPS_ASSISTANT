import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPesananPenjualanBarangRepo, deleteRincianPesananPenjualanBarangByUuidRepo, getAllRincianPesananPenjualanBarangRepo, getRincianPesananPenjualanBarangByPesananPenjualanUUIDRepo, getRincianPesananPenjualanBarangByUuidRepo, updateRincianPesananPenjualanBarangByUuidRepo } from "./rincianPesananPenjualanBarang.repository.js"

export const getAllRincianPesananPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanBarangService", null, req_identity)

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
    
    const rincianPesananPenjualanBarangs = await getAllRincianPesananPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPesananPenjualanBarangs.entry, rincianPesananPenjualanBarangs.count, rincianPesananPenjualanBarangs.pageNumber, rincianPesananPenjualanBarangs.size)
}

export const getRincianPesananPenjualanBarangByPesananPenjualanUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPesananPenjualanBarangByPesananPenjualanUUIDService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanBarang = await getRincianPesananPenjualanBarangByPesananPenjualanUUIDRepo(uuid, req_identity)
    return rincianPesananPenjualanBarang
}

export const getRincianPesananPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPesananPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanBarang = await getRincianPesananPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!rincianPesananPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return rincianPesananPenjualanBarang
}

export const createRincianPesananPenjualanBarangService = async (rincianPesananPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPesananPenjualanBarangService`, rincianPesananPenjualanBarangData, req_identity)
    rincianPesananPenjualanBarangData.enabled = 1

    const rincianPesananPenjualanBarang = await createRincianPesananPenjualanBarangRepo(rincianPesananPenjualanBarangData, req_identity)
    return rincianPesananPenjualanBarang
}

export const deleteRincianPesananPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPesananPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPesananPenjualanBarangByUuidService(uuid, req_identity)
    await deleteRincianPesananPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPesananPenjualanBarangByUuidService = async (uuid, rincianPesananPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPesananPenjualanBarangByUuidService [${uuid}]`, rincianPesananPenjualanBarangData, req_identity)
    const beforeData = await getRincianPesananPenjualanBarangByUuidService(uuid, req_identity)
    const rincianPesananPenjualanBarang = await updateRincianPesananPenjualanBarangByUuidRepo(uuid, rincianPesananPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPesananPenjualanBarangData
    }, req_identity)

    return rincianPesananPenjualanBarang
}