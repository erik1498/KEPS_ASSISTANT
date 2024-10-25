import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPerintahStokOpnameRepo, deletePerintahStokOpnameByUuidRepo, getAllPerintahStokOpnameRepo, getPerintahStokOpnameByUuidRepo, updatePerintahStokOpnameByUuidRepo } from "./perintahStokOpname.repository.js"

export const getAllPerintahStokOpnameService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameService", null, req_identity)

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
    
    const perintahStokOpnames = await getAllPerintahStokOpnameRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(perintahStokOpnames.entry, perintahStokOpnames.count, perintahStokOpnames.pageNumber, perintahStokOpnames.size)
}

export const getPerintahStokOpnameByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPerintahStokOpnameByUuidService [${uuid}]`, null, req_identity)
    const perintahStokOpname = await getPerintahStokOpnameByUuidRepo(uuid, req_identity)

    if (!perintahStokOpname) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return perintahStokOpname
}

export const createPerintahStokOpnameService = async (perintahStokOpnameData, req_identity) => {
    LOGGER(logType.INFO, `Start createPerintahStokOpnameService`, perintahStokOpnameData, req_identity)
    perintahStokOpnameData.enabled = 1

    const perintahStokOpname = await createPerintahStokOpnameRepo(perintahStokOpnameData, req_identity)
    return perintahStokOpname
}

export const deletePerintahStokOpnameByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePerintahStokOpnameByUuidService [${uuid}]`, null, req_identity)
    await getPerintahStokOpnameByUuidService(uuid, req_identity)
    await deletePerintahStokOpnameByUuidRepo(uuid, req_identity)
    return true
}

export const updatePerintahStokOpnameByUuidService = async (uuid, perintahStokOpnameData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePerintahStokOpnameByUuidService [${uuid}]`, perintahStokOpnameData, req_identity)
    const beforeData = await getPerintahStokOpnameByUuidService(uuid, req_identity)
    const perintahStokOpname = await updatePerintahStokOpnameByUuidRepo(uuid, perintahStokOpnameData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        perintahStokOpnameData
    }, req_identity)

    return perintahStokOpname
}