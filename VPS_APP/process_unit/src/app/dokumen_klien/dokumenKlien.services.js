import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createDokumenKlienRepo, deleteDokumenKlienByUuidRepo, getAllDokumenKlienByAktivitasDokumenRepo, getDokumenKlienByUuidRepo, updateDokumenKlienByUuidRepo } from "./dokumenKlien.repository.js"

export const getAllDokumenKlienByAktivitasDokumenService = async (aktivitas_dokumen, query, req_id) => {
    LOGGER(logType.INFO, "Start getAllDokumenKlienByAktivitasDokumenService", { aktivitas_dokumen }, req_id)

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

    const dokumenKliens = await getAllDokumenKlienByAktivitasDokumenRepo(aktivitas_dokumen, pageNumber, size, search, req_id)
    return generatePaginationResponse(dokumenKliens.entry, dokumenKliens.count, dokumenKliens.pageNumber, dokumenKliens.size)
}

export const getDokumenKlienByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getDokumenKlienByUuidService [${uuid}]`, null, req_id)
    const dokumenKlien = await getDokumenKlienByUuidRepo(uuid, req_id)

    if (!dokumenKlien) {
        throw Error("data not found")
    }
    return dokumenKlien
}

export const createDokumenKlienService = async (dokumenKlienData, req_id) => {
    LOGGER(logType.INFO, `Start createDokumenKlienService`, dokumenKlienData, req_id)
    dokumenKlienData["enabled"] = 1
    const dokumenKlien = await createDokumenKlienRepo(dokumenKlienData, req_id)
    return dokumenKlien
}

export const deleteDokumenKlienByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteDokumenKlienByUuidService [${uuid}]`, null, req_id)
    await getDokumenKlienByUuidService(uuid, req_id)
    await deleteDokumenKlienByUuidRepo(uuid, req_id)
    return true
}

export const updateDokumenKlienByUuidService = async (uuid, dokumenKlienData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDokumenKlienByUuidService [${uuid}]`, dokumenKlienData, req_id)
    const beforeData = await getDokumenKlienByUuidService(uuid, req_id)
    const dokumenKlien = await updateDokumenKlienByUuidRepo(uuid, dokumenKlienData, req_id)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        dokumenKlienData
    }, req_id)

    return dokumenKlien
}