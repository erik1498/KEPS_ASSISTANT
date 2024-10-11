import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createDaftarGudangRepo, deleteDaftarGudangByUuidRepo, getAllDaftarGudangRepo, getDaftarGudangByUuidRepo, updateDaftarGudangByUuidRepo } from "./daftarGudang.repository.js"

export const getAllDaftarGudangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarGudangService", null, req_identity)

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
    
    const daftarGudangs = await getAllDaftarGudangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(daftarGudangs.entry, daftarGudangs.count, daftarGudangs.pageNumber, daftarGudangs.size)
}

export const getDaftarGudangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarGudangByUuidService [${uuid}]`, null, req_identity)
    const daftarGudang = await getDaftarGudangByUuidRepo(uuid, req_identity)

    if (!daftarGudang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return daftarGudang
}

export const createDaftarGudangService = async (daftarGudangData, req_identity) => {
    LOGGER(logType.INFO, `Start createDaftarGudangService`, daftarGudangData, req_identity)
    daftarGudangData.enabled = 1

    const daftarGudang = await createDaftarGudangRepo(daftarGudangData, req_identity)
    return daftarGudang
}

export const deleteDaftarGudangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDaftarGudangByUuidService [${uuid}]`, null, req_identity)
    await getDaftarGudangByUuidService(uuid, req_identity)
    await deleteDaftarGudangByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarGudangByUuidService = async (uuid, daftarGudangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarGudangByUuidService [${uuid}]`, daftarGudangData, req_identity)
    const beforeData = await getDaftarGudangByUuidService(uuid, req_identity)
    const daftarGudang = await updateDaftarGudangByUuidRepo(uuid, daftarGudangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarGudangData
    }, req_identity)

    return daftarGudang
}