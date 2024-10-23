import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKonversiBarangRepo, deleteKonversiBarangByUuidRepo, getAllKonversiBarangRepo, getKonversiBarangByUuidRepo, updateKonversiBarangByUuidRepo } from "./konversiBarang.repository.js"

export const getAllKonversiBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKonversiBarangService", null, req_identity)

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
    
    const konversiBarangs = await getAllKonversiBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(konversiBarangs.entry, konversiBarangs.count, konversiBarangs.pageNumber, konversiBarangs.size)
}

export const getKonversiBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKonversiBarangByUuidService [${uuid}]`, null, req_identity)
    const konversiBarang = await getKonversiBarangByUuidRepo(uuid, req_identity)

    if (!konversiBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return konversiBarang
}

export const createKonversiBarangService = async (konversiBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createKonversiBarangService`, konversiBarangData, req_identity)
    konversiBarangData.enabled = 1

    const konversiBarang = await createKonversiBarangRepo(konversiBarangData, req_identity)
    return konversiBarang
}

export const deleteKonversiBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKonversiBarangByUuidService [${uuid}]`, null, req_identity)
    await getKonversiBarangByUuidService(uuid, req_identity)
    await deleteKonversiBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateKonversiBarangByUuidService = async (uuid, konversiBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKonversiBarangByUuidService [${uuid}]`, konversiBarangData, req_identity)
    const beforeData = await getKonversiBarangByUuidService(uuid, req_identity)
    const konversiBarang = await updateKonversiBarangByUuidRepo(uuid, konversiBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        konversiBarangData
    }, req_identity)

    return konversiBarang
}