import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createTipePembayaranRepo, deleteTipePembayaranByUuidRepo, getAllTipePembayaranRepo, getTipePembayaranByUuidRepo, updateTipePembayaranByUuidRepo } from "./tipePembayaran.repository.js"

export const getAllTipePembayaranService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTipePembayaranService", null, req_identity)

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
    
    const tipePembayarans = await getAllTipePembayaranRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(tipePembayarans.entry, tipePembayarans.count, tipePembayarans.pageNumber, tipePembayarans.size)
}

export const getTipePembayaranByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTipePembayaranByUuidService [${uuid}]`, null, req_identity)
    const tipePembayaran = await getTipePembayaranByUuidRepo(uuid, req_identity)

    if (!tipePembayaran) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return tipePembayaran
}

export const createTipePembayaranService = async (tipePembayaranData, req_identity) => {
    LOGGER(logType.INFO, `Start createTipePembayaranService`, tipePembayaranData, req_identity)
    tipePembayaranData.enabled = 1

    const tipePembayaran = await createTipePembayaranRepo(tipePembayaranData, req_identity)
    return tipePembayaran
}

export const deleteTipePembayaranByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTipePembayaranByUuidService [${uuid}]`, null, req_identity)
    await getTipePembayaranByUuidService(uuid, req_identity)
    await deleteTipePembayaranByUuidRepo(uuid, req_identity)
    return true
}

export const updateTipePembayaranByUuidService = async (uuid, jabatanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTipePembayaranByUuidService [${uuid}]`, tipePembayaranData, req_identity)
    const beforeData = await getTipePembayaranByUuidService(uuid, req_identity)
    const tipePembayaran = await updateTipePembayaranByUuidRepo(uuid, tipePembayaranData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        tipePembayaranData
    }, req_identity)

    return tipePembayaran
}