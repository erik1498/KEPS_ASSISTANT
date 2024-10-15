import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPesananPembelianBarangRepo, deletePesananPembelianBarangByUuidRepo, getAllPesananPembelianBarangRepo, getPesananPembelianBarangByUuidRepo, updatePesananPembelianBarangByUuidRepo } from "./pesananPembelianBarang.repository.js"

export const getAllPesananPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPesananPembelianBarangService", null, req_identity)

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
    
    const pesananPembelianBarangs = await getAllPesananPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pesananPembelianBarangs.entry, pesananPembelianBarangs.count, pesananPembelianBarangs.pageNumber, pesananPembelianBarangs.size)
}

export const getPesananPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPesananPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const pesananPembelianBarang = await getPesananPembelianBarangByUuidRepo(uuid, req_identity)

    if (!pesananPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pesananPembelianBarang
}

export const createPesananPembelianBarangService = async (pesananPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPesananPembelianBarangService`, pesananPembelianBarangData, req_identity)
    pesananPembelianBarangData.enabled = 1

    const pesananPembelianBarang = await createPesananPembelianBarangRepo(pesananPembelianBarangData, req_identity)
    return pesananPembelianBarang
}

export const deletePesananPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePesananPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    await getPesananPembelianBarangByUuidService(uuid, req_identity)
    await deletePesananPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePesananPembelianBarangByUuidService = async (uuid, pesananPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePesananPembelianBarangByUuidService [${uuid}]`, pesananPembelianBarangData, req_identity)
    const beforeData = await getPesananPembelianBarangByUuidService(uuid, req_identity)
    const pesananPembelianBarang = await updatePesananPembelianBarangByUuidRepo(uuid, pesananPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pesananPembelianBarangData
    }, req_identity)

    return pesananPembelianBarang
}