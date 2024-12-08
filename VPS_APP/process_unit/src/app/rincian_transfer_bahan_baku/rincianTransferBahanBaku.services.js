import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianTransferBahanBakuRepo, deleteRincianTransferBahanBakuByUuidRepo, getAllRincianTransferBahanBakuRepo, getRincianTransferBahanBakuByTransferBahanBakuUuidRepo, getRincianTransferBahanBakuByUuidRepo, updateRincianTransferBahanBakuByUuidRepo } from "./rincianTransferBahanBaku.repository.js"

export const getAllRincianTransferBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianTransferBahanBakuService", null, req_identity)

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

    const rincianTransferBahanBakus = await getAllRincianTransferBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianTransferBahanBakus.entry, rincianTransferBahanBakus.count, rincianTransferBahanBakus.pageNumber, rincianTransferBahanBakus.size)
}

export const getRincianTransferBahanBakuByTransferBahanBakuUuidService = async (transfer_bahan_baku, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransferBahanBakuByTransferBahanBakuUuidService`, { transfer_bahan_baku }, req_identity)
    const rincianTransferBahanBaku = await getRincianTransferBahanBakuByTransferBahanBakuUuidRepo(transfer_bahan_baku, req_identity)
    return rincianTransferBahanBaku
}

export const getRincianTransferBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransferBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const rincianTransferBahanBaku = await getRincianTransferBahanBakuByUuidRepo(uuid, req_identity)

    if (!rincianTransferBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianTransferBahanBaku
}

export const createRincianTransferBahanBakuService = async (rincianTransferBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianTransferBahanBakuService`, rincianTransferBahanBakuData, req_identity)
    rincianTransferBahanBakuData.enabled = 1

    const rincianTransferBahanBaku = await createRincianTransferBahanBakuRepo(rincianTransferBahanBakuData, req_identity)
    return rincianTransferBahanBaku
}

export const deleteRincianTransferBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianTransferBahanBakuByUuidService [${uuid}]`, null, req_identity)
    await getRincianTransferBahanBakuByUuidService(uuid, req_identity)
    await deleteRincianTransferBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianTransferBahanBakuByUuidService = async (uuid, rincianTransferBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianTransferBahanBakuByUuidService [${uuid}]`, rincianTransferBahanBakuData, req_identity)
    const beforeData = await getRincianTransferBahanBakuByUuidService(uuid, req_identity)
    const rincianTransferBahanBaku = await updateRincianTransferBahanBakuByUuidRepo(uuid, rincianTransferBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianTransferBahanBakuData
    }, req_identity)

    return rincianTransferBahanBaku
}