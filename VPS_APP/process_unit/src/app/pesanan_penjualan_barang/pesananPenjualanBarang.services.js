import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPesananPenjualanBarangRepo, deletePesananPenjualanBarangByUuidRepo, getAllPesananPenjualanBarangRepo, getPesananPenjualanBarangByUuidRepo, updatePesananPenjualanBarangByUuidRepo } from "./pesananPenjualanBarang.repository.js"

export const getAllPesananPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPesananPenjualanBarangService", null, req_identity)

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
    
    const pesananPenjualanBarangs = await getAllPesananPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pesananPenjualanBarangs.entry, pesananPenjualanBarangs.count, pesananPenjualanBarangs.pageNumber, pesananPenjualanBarangs.size)
}

export const getPesananPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPesananPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const pesananPenjualanBarang = await getPesananPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!pesananPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return pesananPenjualanBarang
}

export const createPesananPenjualanBarangService = async (pesananPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPesananPenjualanBarangService`, pesananPenjualanBarangData, req_identity)
    pesananPenjualanBarangData.enabled = 1

    const pesananPenjualanBarang = await createPesananPenjualanBarangRepo(pesananPenjualanBarangData, req_identity)
    return pesananPenjualanBarang
}

export const deletePesananPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePesananPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getPesananPenjualanBarangByUuidService(uuid, req_identity)
    await deletePesananPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePesananPenjualanBarangByUuidService = async (uuid, pesananPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePesananPenjualanBarangByUuidService [${uuid}]`, pesananPenjualanBarangData, req_identity)
    const beforeData = await getPesananPenjualanBarangByUuidService(uuid, req_identity)
    const pesananPenjualanBarang = await updatePesananPenjualanBarangByUuidRepo(uuid, pesananPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pesananPenjualanBarangData
    }, req_identity)

    return pesananPenjualanBarang
}