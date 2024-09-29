import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createFakturPenjualanBarangRepo, deleteFakturPenjualanBarangByUuidRepo, getAllFakturPenjualanBarangRepo, getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo, getFakturPenjualanBarangByUuidRepo, updateFakturPenjualanBarangByUuidRepo } from "./fakturPenjualanBarang.repository.js"

export const getAllFakturPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllFakturPenjualanBarangService", null, req_identity)

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

    const fakturPenjualanBarangs = await getAllFakturPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(fakturPenjualanBarangs.entry, fakturPenjualanBarangs.count, fakturPenjualanBarangs.pageNumber, fakturPenjualanBarangs.size)
}

export const getFakturPenjualanBarangByPesananPenjualanBarangUUIDService = async (pesanan_penjualan_barang_uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPenjualanBarangByPesananPenjualanBarangUUIDService`, { pesanan_penjualan_barang_uuid }, req_identity)
    const fakturPenjualanBarang = await getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo(pesanan_penjualan_barang_uuid, req_identity)
    if (fakturPenjualanBarang.length == 0) {
        throw new Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return fakturPenjualanBarang[0]
}

export const getFakturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const fakturPenjualanBarang = await getFakturPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!fakturPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return fakturPenjualanBarang
}

export const createFakturPenjualanBarangService = async (fakturPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createFakturPenjualanBarangService`, fakturPenjualanBarangData, req_identity)
    fakturPenjualanBarangData.enabled = 1

    const fakturPenjualanBarang = await createFakturPenjualanBarangRepo(fakturPenjualanBarangData, req_identity)
    return fakturPenjualanBarang
}

export const deleteFakturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteFakturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getFakturPenjualanBarangByUuidService(uuid, req_identity)
    await deleteFakturPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateFakturPenjualanBarangByUuidService = async (uuid, fakturPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateFakturPenjualanBarangByUuidService [${uuid}]`, fakturPenjualanBarangData, req_identity)
    const beforeData = await getFakturPenjualanBarangByUuidService(uuid, req_identity)
    const fakturPenjualanBarang = await updateFakturPenjualanBarangByUuidRepo(uuid, fakturPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        fakturPenjualanBarangData
    }, req_identity)

    return fakturPenjualanBarang
}