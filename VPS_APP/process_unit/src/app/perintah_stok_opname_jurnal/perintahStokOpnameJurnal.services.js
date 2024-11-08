import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPerintahStokOpnameJurnalRepo, deletePerintahStokOpnameJurnalByUuidRepo, getAllPerintahStokOpnameJurnalRepo, getPerintahStokOpnameJurnalByUuidRepo, updatePerintahStokOpnameJurnalByUuidRepo } from "./perintahStokOpnameJurnal.repository.js"

export const getAllPerintahStokOpnameJurnalService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameJurnalService", null, req_identity)

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
    
    const perintahStokOpnameJurnals = await getAllPerintahStokOpnameJurnalRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(perintahStokOpnameJurnals.entry, perintahStokOpnameJurnals.count, perintahStokOpnameJurnals.pageNumber, perintahStokOpnameJurnals.size)
}

export const getPerintahStokOpnameJurnalByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPerintahStokOpnameJurnalByUuidService [${uuid}]`, null, req_identity)
    const perintahStokOpnameJurnal = await getPerintahStokOpnameJurnalByUuidRepo(uuid, req_identity)

    if (!perintahStokOpnameJurnal) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return perintahStokOpnameJurnal
}

export const createPerintahStokOpnameJurnalService = async (perintahStokOpnameJurnalData, req_identity) => {
    LOGGER(logType.INFO, `Start createPerintahStokOpnameJurnalService`, perintahStokOpnameJurnalData, req_identity)
    perintahStokOpnameJurnalData.enabled = 1

    const perintahStokOpnameJurnal = await createPerintahStokOpnameJurnalRepo(perintahStokOpnameJurnalData, req_identity)
    return perintahStokOpnameJurnal
}

export const deletePerintahStokOpnameJurnalByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePerintahStokOpnameJurnalByUuidService [${uuid}]`, null, req_identity)
    await getPerintahStokOpnameJurnalByUuidService(uuid, req_identity)
    await deletePerintahStokOpnameJurnalByUuidRepo(uuid, req_identity)
    return true
}

export const updatePerintahStokOpnameJurnalByUuidService = async (uuid, perintahStokOpnameJurnalData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePerintahStokOpnameJurnalByUuidService [${uuid}]`, perintahStokOpnameJurnalData, req_identity)
    const beforeData = await getPerintahStokOpnameJurnalByUuidService(uuid, req_identity)
    const perintahStokOpnameJurnal = await updatePerintahStokOpnameJurnalByUuidRepo(uuid, perintahStokOpnameJurnalData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        perintahStokOpnameJurnalData
    }, req_identity)

    return perintahStokOpnameJurnal
}