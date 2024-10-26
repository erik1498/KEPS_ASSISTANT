import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createHasilStokOpnameRepo, deleteHasilStokOpnameByUuidRepo, getAllHasilStokOpnameRepo, getHasilStokOpnameByUuidRepo, updateHasilStokOpnameByUuidRepo } from "./hasilStokOpname.repository.js"

export const getAllHasilStokOpnameService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllHasilStokOpnameService", null, req_identity)

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
    
    const hasilStokOpnames = await getAllHasilStokOpnameRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(hasilStokOpnames.entry, hasilStokOpnames.count, hasilStokOpnames.pageNumber, hasilStokOpnames.size)
}

export const getHasilStokOpnameByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getHasilStokOpnameByUuidService [${uuid}]`, null, req_identity)
    const hasilStokOpname = await getHasilStokOpnameByUuidRepo(uuid, req_identity)

    if (!hasilStokOpname) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return hasilStokOpname
}

export const createHasilStokOpnameService = async (hasilStokOpnameData, req_identity) => {
    LOGGER(logType.INFO, `Start createHasilStokOpnameService`, hasilStokOpnameData, req_identity)
    hasilStokOpnameData.enabled = 1

    const hasilStokOpname = await createHasilStokOpnameRepo(hasilStokOpnameData, req_identity)
    return hasilStokOpname
}

export const deleteHasilStokOpnameByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteHasilStokOpnameByUuidService [${uuid}]`, null, req_identity)
    await getHasilStokOpnameByUuidService(uuid, req_identity)
    await deleteHasilStokOpnameByUuidRepo(uuid, req_identity)
    return true
}

export const updateHasilStokOpnameByUuidService = async (uuid, hasilStokOpnameData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateHasilStokOpnameByUuidService [${uuid}]`, hasilStokOpnameData, req_identity)
    const beforeData = await getHasilStokOpnameByUuidService(uuid, req_identity)
    const hasilStokOpname = await updateHasilStokOpnameByUuidRepo(uuid, hasilStokOpnameData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        hasilStokOpnameData
    }, req_identity)

    return hasilStokOpname
}