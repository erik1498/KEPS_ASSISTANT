import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getPelunasanPenjualanBarangByUuidService } from "../pelunasan_penjualan_barang/pelunasanPenjualanBarang.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createRincianPelunasanPenjualanDendaBarangRepo, deleteRincianPelunasanPenjualanDendaBarangByUuidRepo, getAllRincianPelunasanPenjualanDendaBarangRepo, getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanRepo, getRincianPelunasanPenjualanDendaBarangByUuidRepo, updateRincianPelunasanPenjualanDendaBarangByUuidRepo } from "./rincianPelunasanPenjualanDendaBarang.repository.js"

export const getAllRincianPelunasanPenjualanDendaBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanDendaBarangService", null, req_identity)

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

    const rincianPelunasanPenjualanDendaBarangs = await getAllRincianPelunasanPenjualanDendaBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPelunasanPenjualanDendaBarangs.entry, rincianPelunasanPenjualanDendaBarangs.count, rincianPelunasanPenjualanDendaBarangs.pageNumber, rincianPelunasanPenjualanDendaBarangs.size)
}

export const getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanService = async (uuid, denda_status, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanService [${uuid}]`, { denda_status }, req_identity)
    const rincianPesananPenjualanBarang = await getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanRepo(uuid, denda_status, req_identity)
    return rincianPesananPenjualanBarang
}

export const getRincianPelunasanPenjualanDendaBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPelunasanPenjualanDendaBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPelunasanPenjualanDendaBarang = await getRincianPelunasanPenjualanDendaBarangByUuidRepo(uuid, req_identity)

    if (!rincianPelunasanPenjualanDendaBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPelunasanPenjualanDendaBarang
}

export const createRincianPelunasanPenjualanDendaBarangService = async (rincianPelunasanPenjualanDendaBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPelunasanPenjualanDendaBarangService`, rincianPelunasanPenjualanDendaBarangData, req_identity)
    rincianPelunasanPenjualanDendaBarangData.enabled = 1

    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidService(rincianPelunasanPenjualanDendaBarangData.pelunasan_penjualan_barang, req_identity)

    if (pelunasanPenjualanBarang.nomor_pelunasan_penjualan_barang == "EMPTY" || pelunasanPenjualanBarang.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Pelunasan Penjualan Barang Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarang.tanggal, null, null, req_identity)

    const rincianPelunasanPenjualanDendaBarang = await createRincianPelunasanPenjualanDendaBarangRepo(rincianPelunasanPenjualanDendaBarangData, req_identity)
    return rincianPelunasanPenjualanDendaBarang
}

export const deleteRincianPelunasanPenjualanDendaBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPelunasanPenjualanDendaBarangByUuidService [${uuid}]`, null, req_identity)

    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidService(rincianPelunasanPenjualanDendaBarangData.pelunasan_penjualan_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarang.tanggal, null, null, req_identity)

    const beforeData = await getRincianPelunasanPenjualanDendaBarangByUuidService(uuid, req_identity)

    await deleteRincianPelunasanPenjualanDendaBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPelunasanPenjualanDendaBarangByUuidService = async (uuid, rincianPelunasanPenjualanDendaBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPelunasanPenjualanDendaBarangByUuidService [${uuid}]`, rincianPelunasanPenjualanDendaBarangData, req_identity)

    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidService(rincianPelunasanPenjualanDendaBarangData.pelunasan_penjualan_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarang.tanggal, null, null, req_identity)

    const beforeData = await getRincianPelunasanPenjualanDendaBarangByUuidService(uuid, req_identity)

    const rincianPelunasanPenjualanDendaBarang = await updateRincianPelunasanPenjualanDendaBarangByUuidRepo(uuid, rincianPelunasanPenjualanDendaBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPelunasanPenjualanDendaBarangData
    }, req_identity)

    return rincianPelunasanPenjualanDendaBarang
}