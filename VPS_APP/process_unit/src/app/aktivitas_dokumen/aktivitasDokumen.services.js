import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createAktivitasDokumenRepo, deleteAktivitasDokumenByUuidRepo, getAllAktivitasDokumenRepo, getAktivitasDokumenByUuidRepo, updateAktivitasDokumenByUuidRepo, getCountAktivitasDokumenRepo } from "./aktivitasDokumen.repository.js"

export const getAllAktivitasDokumenService = async (tahun, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllAktivitasDokumenService", null, req_id)

    let { page, size, search } = query
    page = page ? page : null
    size = size ? size : null
    if (size == "all") {
        page = null
        size = null
    }

    search = search ? search.trim() : ""
    const pageNumber = (page - 1) * size

    const aktivitasDokumens = await getAllAktivitasDokumenRepo(tahun, pageNumber, size, search, req_id)
    return generatePaginationResponse(aktivitasDokumens.entry, aktivitasDokumens.count, aktivitasDokumens.pageNumber, aktivitasDokumens.size)
}

export const getAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    const aktivitasDokumen = await getAktivitasDokumenByUuidRepo(uuid, req_id)

    if (!aktivitasDokumen) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return aktivitasDokumen
}

export const createAktivitasDokumenService = async (aktivitasDokumenData, req_id) => {
    LOGGER(logType.INFO, `Start createAktivitasDokumenService`, aktivitasDokumenData, req_id)

    const jumlahAktivitasDokumen = await getCountAktivitasDokumenRepo(aktivitasDokumenData.tahun, req_id)
    
    aktivitasDokumenData["no_surat"] = `${jumlahAktivitasDokumen[0].count + 1}/${aktivitasDokumenData.tahun}`
    aktivitasDokumenData["enabled"] = 1

    const aktivitasDokumen = await createAktivitasDokumenRepo(aktivitasDokumenData, req_id)
    return aktivitasDokumen
}

export const deleteAktivitasDokumenByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteAktivitasDokumenByUuidService [${uuid}]`, null, req_id)
    await getAktivitasDokumenByUuidService(uuid, req_id)
    await deleteAktivitasDokumenByUuidRepo(uuid, req_id)
    return true
}

export const updateAktivitasDokumenByUuidService = async (uuid, aktivitasDokumenData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateAktivitasDokumenByUuidService [${uuid}]`, aktivitasDokumenData, req_id)
    const beforeData = await getAktivitasDokumenByUuidService(uuid, req_id)
    const aktivitasDokumen = await updateAktivitasDokumenByUuidRepo(uuid, aktivitasDokumenData, req_id)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        aktivitasDokumenData
    }, req_id)

    return aktivitasDokumen
}