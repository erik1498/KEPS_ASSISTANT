import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createSyaratPembayaranRepo, deleteSyaratPembayaranByUuidRepo, getAllSyaratPembayaranRepo, getSyaratPembayaranByUuidRepo, updateSyaratPembayaranByUuidRepo } from "./syaratPembayaran.repository.js"

export const getAllSyaratPembayaranService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllSyaratPembayaranService", null, req_identity)

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
    
    const syaratPembayarans = await getAllSyaratPembayaranRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(syaratPembayarans.entry, syaratPembayarans.count, syaratPembayarans.pageNumber, syaratPembayarans.size)
}

export const getSyaratPembayaranByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getSyaratPembayaranByUuidService [${uuid}]`, null, req_identity)
    const syaratPembayaran = await getSyaratPembayaranByUuidRepo(uuid, req_identity)

    if (!syaratPembayaran) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return syaratPembayaran
}

export const createSyaratPembayaranService = async (syaratPembayaranData, req_identity) => {
    LOGGER(logType.INFO, `Start createSyaratPembayaranService`, syaratPembayaranData, req_identity)
    syaratPembayaranData.enabled = 1

    const syaratPembayaran = await createSyaratPembayaranRepo(syaratPembayaranData, req_identity)
    return syaratPembayaran
}

export const deleteSyaratPembayaranByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteSyaratPembayaranByUuidService [${uuid}]`, null, req_identity)
    await getSyaratPembayaranByUuidService(uuid, req_identity)
    await deleteSyaratPembayaranByUuidRepo(uuid, req_identity)
    return true
}

export const updateSyaratPembayaranByUuidService = async (uuid, jabatanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateSyaratPembayaranByUuidService [${uuid}]`, syaratPembayaranData, req_identity)
    const beforeData = await getSyaratPembayaranByUuidService(uuid, req_identity)
    const syaratPembayaran = await updateSyaratPembayaranByUuidRepo(uuid, syaratPembayaranData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        syaratPembayaranData
    }, req_identity)

    return syaratPembayaran
}