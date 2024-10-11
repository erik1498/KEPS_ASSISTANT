import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createStatusRiwayatAktivitasDokumenRepo, deleteStatusRiwayatAktivitasDokumenByUuidRepo, getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenRepo, getStatusRiwayatAktivitasDokumenByUuidRepo, updateStatusRiwayatAktivitasDokumenByUuidRepo } from "./statusRiwayatAktivitasDokumen.repository.js"

export const getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenService = async (riwayat_aktivitas_dokumen, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenService", null, req_id)

    let {page, size, search} = query
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
    
    const statusRiwayatAktivitasDokumens = await getAllStatusRiwayatAktivitasDokumensByRiwayatAktivitasDokumenRepo(riwayat_aktivitas_dokumen, pageNumber, size, search, req_id)
    return generatePaginationResponse(statusRiwayatAktivitasDokumens.entry, statusRiwayatAktivitasDokumens.count, statusRiwayatAktivitasDokumens.pageNumber, statusRiwayatAktivitasDokumens.size)
}

export const getStatusRiwayatAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getStatusRiwayatAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    const statusRiwayatAktivitasDokumen = await getStatusRiwayatAktivitasDokumenByUuidRepo(uuid, req_id)

    if (!statusRiwayatAktivitasDokumen) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return statusRiwayatAktivitasDokumen
}

export const createStatusRiwayatAktivitasDokumenService = async (statusRiwayatAktivitasDokumenData, req_id) => {
    LOGGER(logType.INFO, `Start createStatusRiwayatAktivitasDokumenService`, statusRiwayatAktivitasDokumenData, req_id)

    statusRiwayatAktivitasDokumenData["enabled"] = 1
    const statusRiwayatAktivitasDokumen = await createStatusRiwayatAktivitasDokumenRepo(statusRiwayatAktivitasDokumenData, req_id)
    return statusRiwayatAktivitasDokumen
}

export const deleteStatusRiwayatAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteStatusRiwayatAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    await getStatusRiwayatAktivitasDokumenByUuidService(uuid, req_id)
    await deleteStatusRiwayatAktivitasDokumenByUuidRepo(uuid, req_id)
    return true
}

export const updateStatusRiwayatAktivitasDokumenByUuidService = async (uuid, statusRiwayatAktivitasDokumenData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStatusRiwayatAktivitasDokumenByUuidService [${uuid}]`, statusRiwayatAktivitasDokumenData, req_id)
    const beforeData = await getStatusRiwayatAktivitasDokumenByUuidService(uuid)
    const statusRiwayatAktivitasDokumen = await updateStatusRiwayatAktivitasDokumenByUuidRepo(uuid, statusRiwayatAktivitasDokumenData, req_id)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        statusRiwayatAktivitasDokumenData
    }, req_id)

    return statusRiwayatAktivitasDokumen
}