import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createStatusRiwayatAktivitasDokumenKeteranganRepo, deleteStatusRiwayatAktivitasDokumenKeteranganByUuidRepo, getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenRepo, getStatusRiwayatAktivitasDokumenKeteranganByUuidRepo, updateStatusRiwayatAktivitasDokumenKeteranganByUuidRepo } from "./statusRiwayatAktivitasDokumenKeterangan.repository.js"

export const getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenService = async (status_riwayat_aktivitas_dokumen, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenService", { status_riwayat_aktivitas_dokumen }, req_id)

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

    const statusRiwayatAktivitasDokumenKeterangans = await getAllStatusRiwayatAktivitasDokumenKeterangansByStatusRiwayatAktivitasDokumenRepo(status_riwayat_aktivitas_dokumen, pageNumber, size, search, req_id)
    return generatePaginationResponse(statusRiwayatAktivitasDokumenKeterangans.entry, statusRiwayatAktivitasDokumenKeterangans.count, statusRiwayatAktivitasDokumenKeterangans.pageNumber, statusRiwayatAktivitasDokumenKeterangans.size)
}

export const getStatusRiwayatAktivitasDokumenKeteranganByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getStatusRiwayatAktivitasDokumenKeteranganByUuidService [${uuid}]`, null, req_id)
    const statusRiwayatAktivitasDokumenKeterangan = await getStatusRiwayatAktivitasDokumenKeteranganByUuidRepo(uuid, req_id)

    if (!statusRiwayatAktivitasDokumenKeterangan) {
        throw Error("data not found")
    }
    return statusRiwayatAktivitasDokumenKeterangan
}

export const createStatusRiwayatAktivitasDokumenKeteranganService = async (statusRiwayatAktivitasDokumenKeteranganData, req_id) => {
    LOGGER(logType.INFO, `Start createStatusRiwayatAktivitasDokumenKeteranganService`, statusRiwayatAktivitasDokumenKeteranganData, req_id)
    statusRiwayatAktivitasDokumenKeteranganData["enabled"] = 1
    const statusRiwayatAktivitasDokumenKeterangan = await createStatusRiwayatAktivitasDokumenKeteranganRepo(statusRiwayatAktivitasDokumenKeteranganData, req_id)
    return statusRiwayatAktivitasDokumenKeterangan
}

export const deleteStatusRiwayatAktivitasDokumenKeteranganByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteStatusRiwayatAktivitasDokumenKeteranganByUuidService [${uuid}]`, null, req_id)
    await getStatusRiwayatAktivitasDokumenKeteranganByUuidService(uuid, req_id)
    await deleteStatusRiwayatAktivitasDokumenKeteranganByUuidRepo(uuid, req_id)
    return true
}

export const updateStatusRiwayatAktivitasDokumenKeteranganByUuidService = async (uuid, statusRiwayatAktivitasDokumenKeteranganData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStatusRiwayatAktivitasDokumenKeteranganByUuidService [${uuid}]`, statusRiwayatAktivitasDokumenKeteranganData, req_id)
    const beforeData = await getStatusRiwayatAktivitasDokumenKeteranganByUuidService(uuid)
    const statusRiwayatAktivitasDokumenKeterangan = await updateStatusRiwayatAktivitasDokumenKeteranganByUuidRepo(uuid, statusRiwayatAktivitasDokumenKeteranganData)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        statusRiwayatAktivitasDokumenKeteranganData
    }, req_id)

    return statusRiwayatAktivitasDokumenKeterangan
}