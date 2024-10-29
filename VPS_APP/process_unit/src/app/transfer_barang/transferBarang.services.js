import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getStatusPerintahStokOpnameAktifByTanggalService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createTransferBarangRepo, deleteTransferBarangByUuidRepo, getAllTransferBarangRepo, getTransferBarangByUuidRepo, updateTransferBarangByUuidRepo } from "./transferBarang.repository.js"

export const getAllTransferBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTransferBarangService", null, req_identity)

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
    
    const transferBarangs = await getAllTransferBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(transferBarangs.entry, transferBarangs.count, transferBarangs.pageNumber, transferBarangs.size)
}

export const getTransferBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTransferBarangByUuidService [${uuid}]`, null, req_identity)
    const transferBarang = await getTransferBarangByUuidRepo(uuid, req_identity)

    if (!transferBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return transferBarang
}

export const createTransferBarangService = async (transferBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createTransferBarangService`, transferBarangData, req_identity)
    transferBarangData.enabled = 1

    await getStatusPerintahStokOpnameAktifByTanggalService(transferBarangData.tanggal, null, req_identity)

    const transferBarang = await createTransferBarangRepo(transferBarangData, req_identity)
    return transferBarang
}

export const deleteTransferBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTransferBarangByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getTransferBarangByUuidService(uuid, req_identity)

    await getStatusPerintahStokOpnameAktifByTanggalService(beforeData.tanggal, null, req_identity)

    await deleteTransferBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateTransferBarangByUuidService = async (uuid, transferBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTransferBarangByUuidService [${uuid}]`, transferBarangData, req_identity)
    const beforeData = await getTransferBarangByUuidService(uuid, req_identity)

    await getStatusPerintahStokOpnameAktifByTanggalService(beforeData.tanggal, null, req_identity)

    const transferBarang = await updateTransferBarangByUuidRepo(uuid, transferBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        transferBarangData
    }, req_identity)

    return transferBarang
}