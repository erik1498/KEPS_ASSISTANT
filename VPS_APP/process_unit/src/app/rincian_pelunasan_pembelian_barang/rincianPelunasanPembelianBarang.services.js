import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPelunasanPembelianBarangRepo, deleteRincianPelunasanPembelianBarangByUuidRepo, getAllRincianPelunasanPembelianBarangRepo, getAllRincianPesananPembelianBarangByPelunasanPembelianRepo, getRincianPelunasanPembelianBarangByUuidRepo, updateRincianPelunasanPembelianBarangByUuidRepo } from "./rincianPelunasanPembelianBarang.repository.js"

export const getAllRincianPelunasanPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPembelianBarangService", null, req_identity)

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

    const rincianPelunasanPembelianBarangs = await getAllRincianPelunasanPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPelunasanPembelianBarangs.entry, rincianPelunasanPembelianBarangs.count, rincianPelunasanPembelianBarangs.pageNumber, rincianPelunasanPembelianBarangs.size)
}

export const getAllRincianPesananPembelianBarangByTanggalService = async (tanggal, faktur_pembelian_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPembelianBarangByTanggalService`, { tanggal, faktur_pembelian_barang }, req_identity)
    const rincianPesananPembelianBarang = await getAllRincianPesananPembelianBarangByPelunasanPembelianRepo(null, tanggal, faktur_pembelian_barang, req_identity)
    return rincianPesananPembelianBarang
}

export const getAllRincianPesananPembelianBarangByPelunasanPembelianService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPembelianBarangByPelunasanPembelianService [${uuid}]`, null, req_identity)
    const rincianPesananPembelianBarang = await getAllRincianPesananPembelianBarangByPelunasanPembelianRepo(uuid, null, null, req_identity)
    return rincianPesananPembelianBarang
}

export const getRincianPelunasanPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPelunasanPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPelunasanPembelianBarang = await getRincianPelunasanPembelianBarangByUuidRepo(uuid, req_identity)

    if (!rincianPelunasanPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPelunasanPembelianBarang
}

export const createRincianPelunasanPembelianBarangService = async (rincianPelunasanPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPelunasanPembelianBarangService`, rincianPelunasanPembelianBarangData, req_identity)
    rincianPelunasanPembelianBarangData.enabled = 1

    const rincianPelunasanPembelianBarang = await createRincianPelunasanPembelianBarangRepo(rincianPelunasanPembelianBarangData, req_identity)
    return rincianPelunasanPembelianBarang
}

export const deleteRincianPelunasanPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPelunasanPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPelunasanPembelianBarangByUuidService(uuid, req_identity)
    await deleteRincianPelunasanPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPelunasanPembelianBarangByUuidService = async (uuid, rincianPelunasanPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPelunasanPembelianBarangByUuidService [${uuid}]`, rincianPelunasanPembelianBarangData, req_identity)
    const beforeData = await getRincianPelunasanPembelianBarangByUuidService(uuid, req_identity)
    const rincianPelunasanPembelianBarang = await updateRincianPelunasanPembelianBarangByUuidRepo(uuid, rincianPelunasanPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPelunasanPembelianBarangData
    }, req_identity)

    return rincianPelunasanPembelianBarang
}