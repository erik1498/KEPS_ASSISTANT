import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createTunjanganUangRepo, deleteTunjanganUangByUuidRepo, getAllTunjanganUangRepo, getTunjanganUangByPegawaiUuidRepo, getTunjanganUangByUuidRepo, updateTunjanganUangByUuidRepo } from "./tunjanganUang.repository.js"

export const getAllTunjanganUangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTunjanganUangService", null, req_identity)

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

    const tunjanganUangs = await getAllTunjanganUangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(tunjanganUangs.entry, tunjanganUangs.count, tunjanganUangs.pageNumber, tunjanganUangs.size)
}

export const getTunjanganUangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTunjanganUangByUuidService [${uuid}]`, null, req_identity)
    const tunjanganUang = await getTunjanganUangByUuidRepo(uuid, req_identity)

    if (!tunjanganUang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return tunjanganUang
}

export const getTunjanganUangByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getTunjanganUangByPegawaiUUIDService [${uuid}]`, { periode, tahun }, req_identity)
    const tunjanganUang = await getTunjanganUangByPegawaiUuidRepo(uuid, periode, tahun, req_identity)

    if (tunjanganUang.length == 0) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return tunjanganUang[0]
}

export const createTunjanganUangService = async (tunjanganUangData, req_identity) => {
    LOGGER(logType.INFO, `Start createTunjanganUangService`, tunjanganUangData, req_identity)
    tunjanganUangData.enabled = 1

    const tunjanganUang = await createTunjanganUangRepo(tunjanganUangData, req_identity)
    return tunjanganUang
}

export const deleteTunjanganUangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTunjanganUangByUuidService [${uuid}]`, null, req_identity)
    await getTunjanganUangByUuidService(uuid, req_identity)
    await deleteTunjanganUangByUuidRepo(uuid, req_identity)
    return true
}

export const updateTunjanganUangByUuidService = async (uuid, tunjanganUangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTunjanganUangByUuidService [${uuid}]`, tunjanganUangData, req_identity)
    const beforeData = await getTunjanganUangByUuidService(uuid, req_identity)
    const tunjanganUang = await updateTunjanganUangByUuidRepo(uuid, tunjanganUangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        tunjanganUangData
    }, req_identity)

    return tunjanganUang
}