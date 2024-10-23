import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianTransferBarangRepo, deleteRincianTransferBarangByUuidRepo, getAllRincianTransferBarangRepo, getRincianTransferBarangByTransferBarangUuidRepo, getRincianTransferBarangByUuidRepo, updateRincianTransferBarangByUuidRepo } from "./rincianTransferBarang.repository.js"

export const getAllRincianTransferBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianTransferBarangService", null, req_identity)

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

    const rincianTransferBarangs = await getAllRincianTransferBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianTransferBarangs.entry, rincianTransferBarangs.count, rincianTransferBarangs.pageNumber, rincianTransferBarangs.size)
}

export const getRincianTransferBarangByTransferBarangUuidService = async (transfer_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransferBarangByTransferBarangUuidService`, { transfer_barang }, req_identity)
    const rincianTransferBarang = await getRincianTransferBarangByTransferBarangUuidRepo(transfer_barang, req_identity)
    return rincianTransferBarang
}

export const getRincianTransferBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransferBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianTransferBarang = await getRincianTransferBarangByUuidRepo(uuid, req_identity)

    if (!rincianTransferBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianTransferBarang
}

export const createRincianTransferBarangService = async (rincianTransferBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianTransferBarangService`, rincianTransferBarangData, req_identity)
    rincianTransferBarangData.enabled = 1

    const rincianTransferBarang = await createRincianTransferBarangRepo(rincianTransferBarangData, req_identity)
    return rincianTransferBarang
}

export const deleteRincianTransferBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianTransferBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianTransferBarangByUuidService(uuid, req_identity)
    await deleteRincianTransferBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianTransferBarangByUuidService = async (uuid, rincianTransferBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianTransferBarangByUuidService [${uuid}]`, rincianTransferBarangData, req_identity)
    const beforeData = await getRincianTransferBarangByUuidService(uuid, req_identity)
    const rincianTransferBarang = await updateRincianTransferBarangByUuidRepo(uuid, rincianTransferBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianTransferBarangData
    }, req_identity)

    return rincianTransferBarang
}