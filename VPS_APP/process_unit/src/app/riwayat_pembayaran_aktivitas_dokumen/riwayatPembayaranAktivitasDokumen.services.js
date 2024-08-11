import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRiwayatPembayaranAktivitasDokumenRepo, deleteRiwayatPembayaranAktivitasDokumenByUuidRepo, getAllRiwayatPembayaranAktivitasDokumenRepo, getAllRiwayatPembayaranAktivitasDokumensRepo, getRiwayatPembayaranAktivitasDokumenByUuidRepo, updateRiwayatPembayaranAktivitasDokumenByUuidRepo } from "./riwayatPembayaranAktivitasDokumen.repository.js"

export const getAllRiwayatPembayaranAktivitasDokumensService = async (tahun, req_id) => {
    LOGGER(logType.INFO, "Start getAllRiwayatPembayaranAktivitasDokumensService", { tahun }, req_id)
    return getAllRiwayatPembayaranAktivitasDokumensRepo(tahun, req_id)
}

export const getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumenService = async (aktivitas_dokumen, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllRiwayatPembayaranAktivitasDokumensByAktivitasDokumenService", { aktivitas_dokumen }, req_id)

    let { page, size, search } = query
    page = page ? page : null
    size = size ? size : null
    search = search ? search : ""
    page = page ? page : null
    size = size ? size : null
    if (size == "all") {
        page = null
        size = null
    }
    const pageNumber = (page - 1) * size

    LOGGER(logType.INFO, "Pagination", {
        pageNumber, size, search
    }, req_id)

    const riwayatPembayaranAktivitasDokumens = await getAllRiwayatPembayaranAktivitasDokumenRepo(aktivitas_dokumen, pageNumber, size, search, req_id)
    return generatePaginationResponse(riwayatPembayaranAktivitasDokumens.entry, riwayatPembayaranAktivitasDokumens.count, riwayatPembayaranAktivitasDokumens.pageNumber, riwayatPembayaranAktivitasDokumens.size)
}

export const getRiwayatPembayaranAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getRiwayatPembayaranAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    const riwayatPembayaranAktivitasDokumen = await getRiwayatPembayaranAktivitasDokumenByUuidRepo(uuid)

    if (!riwayatPembayaranAktivitasDokumen) {
        throw Error("data not found")
    }
    return riwayatPembayaranAktivitasDokumen
}

export const createRiwayatPembayaranAktivitasDokumenService = async (riwayatPembayaranAktivitasDokumenData, req_id) => {
    LOGGER(logType.INFO, `Start createRiwayatPembayaranAktivitasDokumenService`, riwayatPembayaranAktivitasDokumenData, req_id)
    riwayatPembayaranAktivitasDokumenData["enabled"] = 1
    const riwayatPembayaranAktivitasDokumen = await createRiwayatPembayaranAktivitasDokumenRepo(riwayatPembayaranAktivitasDokumenData, req_id)
    return riwayatPembayaranAktivitasDokumen
}

export const deleteRiwayatPembayaranAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteRiwayatPembayaranAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    await getRiwayatPembayaranAktivitasDokumenByUuidService(uuid)
    await deleteRiwayatPembayaranAktivitasDokumenByUuidRepo(uuid)
    return true
}

export const updateRiwayatPembayaranAktivitasDokumenByUuidService = async (uuid, riwayatPembayaranAktivitasDokumenData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRiwayatPembayaranAktivitasDokumenByUuidService [${uuid}]`, riwayatPembayaranAktivitasDokumenData, req_id)
    await getRiwayatPembayaranAktivitasDokumenByUuidService(uuid)
    const riwayatPembayaranAktivitasDokumen = await updateRiwayatPembayaranAktivitasDokumenByUuidRepo(uuid, riwayatPembayaranAktivitasDokumenData)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        riwayatPembayaranAktivitasDokumenData
    }, req_id)
    return riwayatPembayaranAktivitasDokumen
}