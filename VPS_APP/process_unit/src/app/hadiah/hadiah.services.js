import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createHadiahRepo, deleteHadiahByUuidRepo, getAllHadiahRepo, getHadiahByUuidRepo, getHadiahByPegawaiUuidRepo, updateHadiahByUuidRepo } from "./hadiah.repository.js"

export const getAllHadiahService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllHadiahService", null, req_identity)

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

    const hadiahs = await getAllHadiahRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(hadiahs.entry, hadiahs.count, hadiahs.pageNumber, hadiahs.size)
}

export const getHadiahByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getHadiahByUuidService [${uuid}]`, null, req_identity)
    const hadiah = await getHadiahByUuidRepo(uuid, req_identity)

    if (!hadiah) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return hadiah
}

export const getHadiahByPegawaiUUIDService = async (uuid, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getHadiahByPegawaiUUIDService [${uuid}]`, {tahun}, req_identity)
    const hadiah = await getHadiahByPegawaiUuidRepo(uuid, tahun, req_identity)
    return hadiah
}

export const createHadiahService = async (hadiahData, req_identity) => {
    LOGGER(logType.INFO, `Start createHadiahService`, hadiahData, req_identity)
    hadiahData.enabled = 1

    const hadiah = await createHadiahRepo(hadiahData, req_identity)
    return hadiah
}

export const deleteHadiahByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteHadiahByUuidService [${uuid}]`, null, req_identity)
    await getHadiahByUuidService(uuid, req_identity)
    await deleteHadiahByUuidRepo(uuid, req_identity)
    return true
}

export const updateHadiahByUuidService = async (uuid, hadiahData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateHadiahByUuidService [${uuid}]`, hadiahData, req_identity)
    const beforeData = await getHadiahByUuidService(uuid, req_identity)
    const hadiah = await updateHadiahByUuidRepo(uuid, hadiahData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        hadiahData
    }, req_identity)

    return hadiah
}