import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createTransferBahanBakuRepo, deleteTransferBahanBakuByUuidRepo, getAllTransferBahanBakuRepo, getTransferBahanBakuByUuidRepo, updateTransferBahanBakuByUuidRepo } from "./transferBahanBaku.repository.js"

export const getAllTransferBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTransferBahanBakuService", null, req_identity)

    let { page, size, search, tahun } = query
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

    const transferBahanBakus = await getAllTransferBahanBakuRepo(pageNumber, size, search, tahun, req_identity)
    return generatePaginationResponse(transferBahanBakus.entry, transferBahanBakus.count, transferBahanBakus.pageNumber, transferBahanBakus.size)
}

export const getTransferBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTransferBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const transferBahanBaku = await getTransferBahanBakuByUuidRepo(uuid, req_identity)

    if (!transferBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return transferBahanBaku
}

export const createTransferBahanBakuService = async (transferBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createTransferBahanBakuService`, transferBahanBakuData, req_identity)
    transferBahanBakuData.enabled = 1

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, transferBahanBakuData.tanggal, null, null, req_identity)

    const transferBahanBaku = await createTransferBahanBakuRepo(transferBahanBakuData, req_identity)
    return transferBahanBaku
}

export const deleteTransferBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTransferBahanBakuByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getTransferBahanBakuByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deleteTransferBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateTransferBahanBakuByUuidService = async (uuid, transferBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTransferBahanBakuByUuidService [${uuid}]`, transferBahanBakuData, req_identity)
    const beforeData = await getTransferBahanBakuByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    const transferBahanBaku = await updateTransferBahanBakuByUuidRepo(uuid, transferBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        transferBahanBakuData
    }, req_identity)

    return transferBahanBaku
}