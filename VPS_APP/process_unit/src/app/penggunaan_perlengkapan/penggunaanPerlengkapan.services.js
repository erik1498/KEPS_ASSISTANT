import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createPenggunaanPerlengkapanRepo, deletePenggunaanPerlengkapanByUuidRepo, getAllPenggunaanPerlengkapanRepo, getPenggunaanPerlengkapanByUuidRepo, updatePenggunaanPerlengkapanByUuidRepo } from "./penggunaanPerlengkapan.repository.js"

export const getAllPenggunaanPerlengkapanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPenggunaanPerlengkapanService", null, req_identity)

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
    
    const penggunaanPerlengkapans = await getAllPenggunaanPerlengkapanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(penggunaanPerlengkapans.entry, penggunaanPerlengkapans.count, penggunaanPerlengkapans.pageNumber, penggunaanPerlengkapans.size)
}

export const getPenggunaanPerlengkapanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPenggunaanPerlengkapanByUuidService [${uuid}]`, null, req_identity)
    const penggunaanPerlengkapan = await getPenggunaanPerlengkapanByUuidRepo(uuid, req_identity)

    if (!penggunaanPerlengkapan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return penggunaanPerlengkapan
}

export const createPenggunaanPerlengkapanService = async (penggunaanPerlengkapanData, req_identity) => {
    LOGGER(logType.INFO, `Start createPenggunaanPerlengkapanService`, penggunaanPerlengkapanData, req_identity)
    penggunaanPerlengkapanData.enabled = 1

    await getNeracaValidasiByTanggalService(null, penggunaanPerlengkapanData.tanggal, req_identity)

    const penggunaanPerlengkapan = await createPenggunaanPerlengkapanRepo(penggunaanPerlengkapanData, req_identity)
    return penggunaanPerlengkapan
}

export const deletePenggunaanPerlengkapanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePenggunaanPerlengkapanByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getPenggunaanPerlengkapanByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await deletePenggunaanPerlengkapanByUuidRepo(uuid, req_identity)
    return true
}

export const updatePenggunaanPerlengkapanByUuidService = async (uuid, penggunaanPerlengkapanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePenggunaanPerlengkapanByUuidService [${uuid}]`, penggunaanPerlengkapanData, req_identity)
    const beforeData = await getPenggunaanPerlengkapanByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    const penggunaanPerlengkapan = await updatePenggunaanPerlengkapanByUuidRepo(uuid, penggunaanPerlengkapanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        penggunaanPerlengkapanData
    }, req_identity)

    return penggunaanPerlengkapan
}