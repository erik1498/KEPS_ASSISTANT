import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createStatusRiwayatAktivitasDokumenPegawaiPelaksanaRepo, deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo, getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenRepo, getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasRepo, getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo, updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo } from "./statusRiwayatAktivitasDokumenPegawaiPelaksana.repository.js"

export const getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasService = async (tahun, req_id) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasService", { tahun }, req_id)
    return getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasRepo(tahun, req_id)
}
export const getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenService = async (status_riwayat_aktivitas_dokumen, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenService", { status_riwayat_aktivitas_dokumen }, req_id)

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

    const statusRiwayatAktivitasDokumenPegawaiPelaksanas = await getAllStatusRiwayatAktivitasDokumenPegawaiPelaksanasByStatusRiwayatAktivitasDokumenRepo(status_riwayat_aktivitas_dokumen, pageNumber, size, search, req_id)
    return generatePaginationResponse(statusRiwayatAktivitasDokumenPegawaiPelaksanas.entry, statusRiwayatAktivitasDokumenPegawaiPelaksanas.count, statusRiwayatAktivitasDokumenPegawaiPelaksanas.pageNumber, statusRiwayatAktivitasDokumenPegawaiPelaksanas.size)
}

export const getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService [${uuid}]`, null, req_id)
    const statusRiwayatAktivitasDokumenPegawaiPelaksana = await getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo(uuid, req_id)

    if (!statusRiwayatAktivitasDokumenPegawaiPelaksana) {
        throw Error("data not found")
    }
    return statusRiwayatAktivitasDokumenPegawaiPelaksana
}

export const createStatusRiwayatAktivitasDokumenPegawaiPelaksanaService = async (statusRiwayatAktivitasDokumenPegawaiPelaksanaData, req_id) => {
    LOGGER(logType.INFO, `Start createStatusRiwayatAktivitasDokumenPegawaiPelaksanaService`, statusRiwayatAktivitasDokumenPegawaiPelaksanaData, req_id)
    statusRiwayatAktivitasDokumenPegawaiPelaksanaData["enabled"] = 1
    const statusRiwayatAktivitasDokumenPegawaiPelaksana = await createStatusRiwayatAktivitasDokumenPegawaiPelaksanaRepo(statusRiwayatAktivitasDokumenPegawaiPelaksanaData, req_id)
    return statusRiwayatAktivitasDokumenPegawaiPelaksana
}

export const deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService [${uuid}]`, null, req_id)
    await getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService(uuid, req_id)
    await deleteStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo(uuid, req_id)
    return true
}

export const updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService = async (uuid, statusRiwayatAktivitasDokumenPegawaiPelaksanaData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService [${uuid}]`, statusRiwayatAktivitasDokumenPegawaiPelaksanaData, req_id)
    const beforeData = await getStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidService(uuid)
    const statusRiwayatAktivitasDokumenPegawaiPelaksana = await updateStatusRiwayatAktivitasDokumenPegawaiPelaksanaByUuidRepo(uuid, statusRiwayatAktivitasDokumenPegawaiPelaksanaData)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        statusRiwayatAktivitasDokumenPegawaiPelaksanaData
    }, req_id)

    return statusRiwayatAktivitasDokumenPegawaiPelaksana
}