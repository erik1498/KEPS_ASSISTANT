import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRiwayatAktivitasDokumenRepo, deleteRiwayatAktivitasDokumenByUuidRepo, getAllRiwayatAktivitasDokumenRepo, getRiwayatAktivitasDokumenByUuidRepo, updateRiwayatAktivitasDokumenByUuidRepo } from "./riwayatAktivitasDokumen.repository.js"

export const getAllRiwayatAktivitasDokumensByAktivitasDokumenService = async (aktivitas_dokumen, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllRiwayatAktivitasDokumenService", { aktivitas_dokumen }, req_id)

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

    const riwayatAktivitasDokumens = await getAllRiwayatAktivitasDokumenRepo(aktivitas_dokumen, pageNumber, size, search, req_id)
    return generatePaginationResponse(riwayatAktivitasDokumens.entry, riwayatAktivitasDokumens.count, riwayatAktivitasDokumens.pageNumber, riwayatAktivitasDokumens.size)
}

export const getRiwayatAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getRiwayatAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    const riwayatAktivitasDokumen = await getRiwayatAktivitasDokumenByUuidRepo(uuid, req_id)

    if (!riwayatAktivitasDokumen) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return riwayatAktivitasDokumen
}

export const createRiwayatAktivitasDokumenService = async (riwayatAktivitasDokumenData, req_id) => {
    LOGGER(logType.INFO, `Start createRiwayatAktivitasDokumenService`, riwayatAktivitasDokumenData, req_id)

    riwayatAktivitasDokumenData["enabled"] = 1
    const riwayatAktivitasDokumen = await createRiwayatAktivitasDokumenRepo(riwayatAktivitasDokumenData, req_id)
    return riwayatAktivitasDokumen
}

export const deleteRiwayatAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteRiwayatAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    await getRiwayatAktivitasDokumenByUuidService(uuid, req_id)
    await deleteRiwayatAktivitasDokumenByUuidRepo(uuid, req_id)
    return true
}

export const updateRiwayatAktivitasDokumenByUuidService = async (uuid, riwayatAktivitasDokumenData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRiwayatAktivitasDokumenByUuidService [${uuid}]`, riwayatAktivitasDokumenData, req_id)
    const beforeData = await getRiwayatAktivitasDokumenByUuidService(uuid)
    const riwayatAktivitasDokumen = await updateRiwayatAktivitasDokumenByUuidRepo(uuid, riwayatAktivitasDokumenData)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        riwayatAktivitasDokumenData
    }, req_id)

    return riwayatAktivitasDokumen
}