import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPengirimanBarangRepo, deleteRincianPengirimanBarangByUuidRepo, getAllRincianPengirimanBarangRepo, getRincianPengirimanBarangByUuidRepo, updateRincianPengirimanBarangByUuidRepo } from "./rincianPengirimanBarang.repository.js"

export const getAllRincianPengirimanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPengirimanBarangService", null, req_identity)

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
    
    const rincianPengirimanBarangs = await getAllRincianPengirimanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPengirimanBarangs.entry, rincianPengirimanBarangs.count, rincianPengirimanBarangs.pageNumber, rincianPengirimanBarangs.size)
}

export const getRincianPengirimanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengirimanBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPengirimanBarang = await getRincianPengirimanBarangByUuidRepo(uuid, req_identity)

    if (!rincianPengirimanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengirimanBarang
}

export const createRincianPengirimanBarangService = async (rincianPengirimanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPengirimanBarangService`, rincianPengirimanBarangData, req_identity)
    rincianPengirimanBarangData.enabled = 1

    const rincianPengirimanBarang = await createRincianPengirimanBarangRepo(rincianPengirimanBarangData, req_identity)
    return rincianPengirimanBarang
}

export const deleteRincianPengirimanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPengirimanBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPengirimanBarangByUuidService(uuid, req_identity)
    await deleteRincianPengirimanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPengirimanBarangByUuidService = async (uuid, rincianPengirimanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPengirimanBarangByUuidService [${uuid}]`, rincianPengirimanBarangData, req_identity)
    const beforeData = await getRincianPengirimanBarangByUuidService(uuid, req_identity)
    const rincianPengirimanBarang = await updateRincianPengirimanBarangByUuidRepo(uuid, rincianPengirimanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPengirimanBarangData
    }, req_identity)

    return rincianPengirimanBarang
}