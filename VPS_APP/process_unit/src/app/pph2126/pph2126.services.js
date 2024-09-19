import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPph2126Repo, deletePph2126ByUuidRepo, getAllPph2126Repo, getPph2126ByPegawaiUuidRepo, getPph2126ByUuidRepo, updatePph2126ByUuidRepo } from "./pph2126.repository.js"

export const getAllPph2126Service = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPph2126Service", null, req_identity)

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

    const pph2126s = await getAllPph2126Repo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pph2126s.entry, pph2126s.count, pph2126s.pageNumber, pph2126s.size)
}

export const getPph2126ByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPph2126ByUuidService [${uuid}]`, null, req_identity)
    const pph2126 = await getPph2126ByUuidRepo(uuid, req_identity)

    if (!pph2126) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return pph2126
}

export const getPph2126ByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getPph2126ByPegawaiUUIDService [${uuid}]`, {
        periode,
        tahun
    }, req_identity)
    const pph2126 = await getPph2126ByPegawaiUuidRepo(uuid, periode, tahun, req_identity)

    if (pph2126.length == 0) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return pph2126[0]
}

export const createPph2126Service = async (pph2126Data, req_identity) => {
    LOGGER(logType.INFO, `Start createPph2126Service`, pph2126Data, req_identity)
    pph2126Data.enabled = 1

    const pph2126 = await createPph2126Repo(pph2126Data, req_identity)
    return pph2126
}

export const deletePph2126ByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePph2126ByUuidService [${uuid}]`, null, req_identity)
    await getPph2126ByUuidService(uuid, req_identity)
    await deletePph2126ByUuidRepo(uuid, req_identity)
    return true
}

export const updatePph2126ByUuidService = async (uuid, pph2126Data, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePph2126ByUuidService [${uuid}]`, pph2126Data, req_identity)
    const beforeData = await getPph2126ByUuidService(uuid, req_identity)
    const pph2126 = await updatePph2126ByUuidRepo(uuid, pph2126Data, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pph2126Data
    }, req_identity)

    return pph2126
}