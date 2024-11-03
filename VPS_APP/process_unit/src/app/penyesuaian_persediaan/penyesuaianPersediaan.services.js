import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { getPerintahStokOpnameByUuidService, perintahStokOpnemeAllowToEdit } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createPenyesuaianPersediaanRepo, deletePenyesuaianPersediaanByUuidRepo, getAllPenyesuaianPersediaanRepo, getPenyesuaianPersediaanByPerintahStokOpnameRepo, getPenyesuaianPersediaanByUuidRepo, updatePenyesuaianPersediaanByUuidRepo } from "./penyesuaianPersediaan.repository.js"

export const getAllPenyesuaianPersediaanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPenyesuaianPersediaanService", null, req_identity)

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
    
    const penyesuaianPersediaans = await getAllPenyesuaianPersediaanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(penyesuaianPersediaans.entry, penyesuaianPersediaans.count, penyesuaianPersediaans.pageNumber, penyesuaianPersediaans.size)
}

export const getPenyesuaianPersediaanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPenyesuaianPersediaanByUuidService [${uuid}]`, null, req_identity)
    const penyesuaianPersediaan = await getPenyesuaianPersediaanByUuidRepo(uuid, req_identity)

    if (!penyesuaianPersediaan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return penyesuaianPersediaan
}

export const getPenyesuaianPersediaanByPerintahStokOpnameService = async (perintah_stok_opname, req_identity) => {
    LOGGER(logType.INFO, `Start getPenyesuaianPersediaanByPerintahStokOpnameService [${perintah_stok_opname}]`, null, req_identity)
    const penyesuaianPersediaan = await getPenyesuaianPersediaanByPerintahStokOpnameRepo(perintah_stok_opname, req_identity)
    return penyesuaianPersediaan
}

export const createPenyesuaianPersediaanService = async (penyesuaianPersediaanData, req_identity) => {
    LOGGER(logType.INFO, `Start createPenyesuaianPersediaanService`, penyesuaianPersediaanData, req_identity)
    penyesuaianPersediaanData.enabled = 1

    await perintahStokOpnemeAllowToEdit(penyesuaianPersediaanData.perintah_stok_opname, req_identity)

    await getNeracaValidasiByTanggalService(null, penyesuaianPersediaanData.tanggal, req_identity)

    const penyesuaianPersediaan = await createPenyesuaianPersediaanRepo(penyesuaianPersediaanData, req_identity)
    return penyesuaianPersediaan
}

export const deletePenyesuaianPersediaanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePenyesuaianPersediaanByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getPerintahStokOpnameByUuidService(uuid, req_identity)

    await perintahStokOpnemeAllowToEdit(beforeData.perintah_stok_opname, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await deletePenyesuaianPersediaanByUuidRepo(uuid, req_identity)
    return true
}

export const updatePenyesuaianPersediaanByUuidService = async (uuid, penyesuaianPersediaanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePenyesuaianPersediaanByUuidService [${uuid}]`, penyesuaianPersediaanData, req_identity)
    const beforeData = await getPenyesuaianPersediaanByUuidService(uuid, req_identity)

    await perintahStokOpnemeAllowToEdit(beforeData.perintah_stok_opname, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    const penyesuaianPersediaan = await updatePenyesuaianPersediaanByUuidRepo(uuid, penyesuaianPersediaanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        penyesuaianPersediaanData
    }, req_identity)

    return penyesuaianPersediaan
}