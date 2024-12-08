import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianKonversiBahanBakuRepo, deleteRincianKonversiBahanBakuByUuidRepo, getAllRincianKonversiBahanBakuRepo, getRincianKonversiBahanBakuByKonversiBahanBakuUuidRepo, getRincianKonversiBahanBakuByUuidRepo, updateRincianKonversiBahanBakuByUuidRepo } from "./rincianKonversiBahanBaku.repository.js"

export const getAllRincianKonversiBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianKonversiBahanBakuService", null, req_identity)

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

    const rincianKonversiBahanBakus = await getAllRincianKonversiBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianKonversiBahanBakus.entry, rincianKonversiBahanBakus.count, rincianKonversiBahanBakus.pageNumber, rincianKonversiBahanBakus.size)
}

export const getRincianKonversiBahanBakuByKonversiBahanBakuUuidService = async (konversi_bahan_baku, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianKonversiBahanBakuByKonversiBahanBakuUuidService`, { konversi_bahan_baku }, req_identity)
    const rincianKonversiBahanBaku = await getRincianKonversiBahanBakuByKonversiBahanBakuUuidRepo(konversi_bahan_baku, req_identity)
    return rincianKonversiBahanBaku
}

export const getRincianKonversiBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianKonversiBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const rincianKonversiBahanBaku = await getRincianKonversiBahanBakuByUuidRepo(uuid, req_identity)

    if (!rincianKonversiBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianKonversiBahanBaku
}

export const createRincianKonversiBahanBakuService = async (rincianKonversiBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianKonversiBahanBakuService`, rincianKonversiBahanBakuData, req_identity)
    rincianKonversiBahanBakuData.enabled = 1

    const rincianKonversiBahanBaku = await createRincianKonversiBahanBakuRepo(rincianKonversiBahanBakuData, req_identity)
    return rincianKonversiBahanBaku
}

export const deleteRincianKonversiBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianKonversiBahanBakuByUuidService [${uuid}]`, null, req_identity)
    await getRincianKonversiBahanBakuByUuidService(uuid, req_identity)
    await deleteRincianKonversiBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianKonversiBahanBakuByUuidService = async (uuid, rincianKonversiBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianKonversiBahanBakuByUuidService [${uuid}]`, rincianKonversiBahanBakuData, req_identity)
    const beforeData = await getRincianKonversiBahanBakuByUuidService(uuid, req_identity)
    const rincianKonversiBahanBaku = await updateRincianKonversiBahanBakuByUuidRepo(uuid, rincianKonversiBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianKonversiBahanBakuData
    }, req_identity)

    return rincianKonversiBahanBaku
}