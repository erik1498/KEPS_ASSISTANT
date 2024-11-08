import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getPelunasanPenjualanBarangByUuidService } from "../pelunasan_penjualan_barang/pelunasanPenjualanBarang.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createRincianPelunasanPenjualanBarangRepo, deleteRincianPelunasanPenjualanBarangByUuidRepo, getAllRincianPelunasanPenjualanBarangRepo, getAllRincianPesananPenjualanBarangByPelunasanPenjualanRepo, getRincianPelunasanPenjualanBarangByUuidRepo, updateRincianPelunasanPenjualanBarangByUuidRepo } from "./rincianPelunasanPenjualanBarang.repository.js"

export const getAllRincianPelunasanPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanBarangService", null, req_identity)

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

    const rincianPelunasanPenjualanBarangs = await getAllRincianPelunasanPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPelunasanPenjualanBarangs.entry, rincianPelunasanPenjualanBarangs.count, rincianPelunasanPenjualanBarangs.pageNumber, rincianPelunasanPenjualanBarangs.size)
}

export const getAllRincianPesananPenjualanBarangByTanggalService = async (tanggal, faktur_penjualan_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanBarangByTanggalService`, { tanggal, faktur_penjualan_barang }, req_identity)
    const rincianPesananPenjualanBarang = await getAllRincianPesananPenjualanBarangByPelunasanPenjualanRepo(null, tanggal, faktur_penjualan_barang, req_identity)
    return rincianPesananPenjualanBarang
}

export const getAllRincianPesananPenjualanBarangByPelunasanPenjualanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanBarangByPelunasanPenjualanService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanBarang = await getAllRincianPesananPenjualanBarangByPelunasanPenjualanRepo(uuid, null, null, req_identity)
    return rincianPesananPenjualanBarang
}

export const getRincianPelunasanPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPelunasanPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPelunasanPenjualanBarang = await getRincianPelunasanPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!rincianPelunasanPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPelunasanPenjualanBarang
}

export const createRincianPelunasanPenjualanBarangService = async (rincianPelunasanPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPelunasanPenjualanBarangService`, rincianPelunasanPenjualanBarangData, req_identity)
    rincianPelunasanPenjualanBarangData.enabled = 1

    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidService(rincianPelunasanPenjualanBarangData.pelunasan_penjualan_barang, req_identity)

    if (pelunasanPenjualanBarang.nomor_pelunasan_penjualan_barang == "EMPTY" || pelunasanPenjualanBarang.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Pelunasan Penjualan Barang Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarang.tanggal, null, null, req_identity)

    const rincianPelunasanPenjualanBarang = await createRincianPelunasanPenjualanBarangRepo(rincianPelunasanPenjualanBarangData, req_identity)
    return rincianPelunasanPenjualanBarang
}

export const deleteRincianPelunasanPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPelunasanPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    
    const beforeData = await getRincianPelunasanPenjualanBarangByUuidService(uuid, req_identity)

    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidService(beforeData.pelunasan_penjualan_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarang.tanggal, null, null, req_identity)

    await deleteRincianPelunasanPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPelunasanPenjualanBarangByUuidService = async (uuid, rincianPelunasanPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPelunasanPenjualanBarangByUuidService [${uuid}]`, rincianPelunasanPenjualanBarangData, req_identity)

    const beforeData = await getRincianPelunasanPenjualanBarangByUuidService(uuid, req_identity)

    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidService(beforeData.pelunasan_penjualan_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarang.tanggal, null, null, req_identity)

    const rincianPelunasanPenjualanBarang = await updateRincianPelunasanPenjualanBarangByUuidRepo(uuid, rincianPelunasanPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPelunasanPenjualanBarangData
    }, req_identity)

    return rincianPelunasanPenjualanBarang
}