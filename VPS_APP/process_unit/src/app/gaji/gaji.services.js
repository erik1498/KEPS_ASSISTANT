import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createGajiRepo, deleteGajiByUuidRepo, getAllGajiRepo, getGajiByPegawaiUuidRepo, getGajiByUuidRepo, updateGajiByUuidRepo } from "./gaji.repository.js"

export const getAllGajiService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllGajiService", null, req_identity)

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

    const gajis = await getAllGajiRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(gajis.entry, gajis.count, gajis.pageNumber, gajis.size)
}

export const getGajiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getGajiByUuidService [${uuid}]`, null, req_identity)
    const gaji = await getGajiByUuidRepo(uuid, req_identity)

    if (!gaji) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return gaji
}


export const getGajiByPegawaiUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getGajiByPegawaiUUIDService [${uuid}]`, null, req_identity)
    const gaji = await getGajiByPegawaiUuidRepo(uuid, req_identity)

    if (!gaji) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return gaji
}

export const createGajiService = async (gajiData, req_identity) => {
    LOGGER(logType.INFO, `Start createGajiService`, gajiData, req_identity)
    gajiData.enabled = 1

    const gaji = await createGajiRepo(gajiData, req_identity)
    return gaji
}

export const deleteGajiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteGajiByUuidService [${uuid}]`, null, req_identity)
    await getGajiByUuidService(uuid, req_identity)
    await deleteGajiByUuidRepo(uuid, req_identity)
    return true
}

export const updateGajiByUuidService = async (uuid, gajiData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateGajiByUuidService [${uuid}]`, gajiData, req_identity)
    const beforeData = await getGajiByUuidService(uuid, req_identity)
    const gaji = await updateGajiByUuidRepo(uuid, gajiData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        gajiData
    }, req_identity)

    return gaji
}