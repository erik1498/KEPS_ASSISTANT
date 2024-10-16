import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPengembalianDendaPembelianBarangRepo, deleteRincianPengembalianDendaPembelianBarangByUuidRepo, getAllRincianPengembalianDendaPembelianBarangRepo, getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDRepo, getRincianPengembalianDendaPembelianBarangByUuidRepo, updateRincianPengembalianDendaPembelianBarangByUuidRepo } from "./rincianPengembalianDendaPembelianBarang.repository.js"

export const getAllRincianPengembalianDendaPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPembelianBarangService", null, req_identity)

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
    
    const rincianPengembalianDendaPembelianBarangs = await getAllRincianPengembalianDendaPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPengembalianDendaPembelianBarangs.entry, rincianPengembalianDendaPembelianBarangs.count, rincianPengembalianDendaPembelianBarangs.pageNumber, rincianPengembalianDendaPembelianBarangs.size)
}

export const getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPembelianBarang = await getRincianPengembalianDendaPembelianBarangByFakturPembelianBarangUUIDRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengembalianDendaPembelianBarang
}

export const getRincianPengembalianDendaPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPembelianBarang = await getRincianPengembalianDendaPembelianBarangByUuidRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengembalianDendaPembelianBarang
}

export const createRincianPengembalianDendaPembelianBarangService = async (rincianPengembalianDendaPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPengembalianDendaPembelianBarangService`, rincianPengembalianDendaPembelianBarangData, req_identity)
    rincianPengembalianDendaPembelianBarangData.enabled = 1

    const rincianPengembalianDendaPembelianBarang = await createRincianPengembalianDendaPembelianBarangRepo(rincianPengembalianDendaPembelianBarangData, req_identity)
    return rincianPengembalianDendaPembelianBarang
}

export const deleteRincianPengembalianDendaPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPengembalianDendaPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPengembalianDendaPembelianBarangByUuidService(uuid, req_identity)
    await deleteRincianPengembalianDendaPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPengembalianDendaPembelianBarangByUuidService = async (uuid, rincianPengembalianDendaPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPengembalianDendaPembelianBarangByUuidService [${uuid}]`, rincianPengembalianDendaPembelianBarangData, req_identity)
    const beforeData = await getRincianPengembalianDendaPembelianBarangByUuidService(uuid, req_identity)
    const rincianPengembalianDendaPembelianBarang = await updateRincianPengembalianDendaPembelianBarangByUuidRepo(uuid, rincianPengembalianDendaPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPengembalianDendaPembelianBarangData
    }, req_identity)

    return rincianPengembalianDendaPembelianBarang
}