import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getPengembalianDendaPenjualanBarangByUuidService } from "../pengembalian_denda_penjualan_barang/pengembalianDendaPenjualanBarang.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createRincianPengembalianDendaPenjualanBarangRepo, deleteRincianPengembalianDendaPenjualanBarangByUuidRepo, getAllRincianPengembalianDendaPenjualanBarangRepo, getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDRepo, getRincianPengembalianDendaPenjualanBarangByUuidRepo, updateRincianPengembalianDendaPenjualanBarangByUuidRepo } from "./rincianPengembalianDendaPenjualanBarang.repository.js"

export const getAllRincianPengembalianDendaPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPenjualanBarangService", null, req_identity)

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
    
    const rincianPengembalianDendaPenjualanBarangs = await getAllRincianPengembalianDendaPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPengembalianDendaPenjualanBarangs.entry, rincianPengembalianDendaPenjualanBarangs.count, rincianPengembalianDendaPenjualanBarangs.pageNumber, rincianPengembalianDendaPenjualanBarangs.size)
}

export const getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPenjualanBarang = await getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengembalianDendaPenjualanBarang
}

export const getRincianPengembalianDendaPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPengembalianDendaPenjualanBarang = await getRincianPengembalianDendaPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!rincianPengembalianDendaPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPengembalianDendaPenjualanBarang
}

export const createRincianPengembalianDendaPenjualanBarangService = async (rincianPengembalianDendaPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPengembalianDendaPenjualanBarangService`, rincianPengembalianDendaPenjualanBarangData, req_identity)
    rincianPengembalianDendaPenjualanBarangData.enabled = 1

    const pengembalianDendaPenjualanBarang = await getPengembalianDendaPenjualanBarangByUuidService(rincianPengembalianDendaPenjualanBarangData.pengembalian_denda_penjualan_barang, req_identity)

    if (pengembalianDendaPenjualanBarang.nomor_pengembalian_denda_penjualan_barang == "EMPTY" || pengembalianDendaPenjualanBarang.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Pengembalian Denda Penjualan Barang Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pengembalianDendaPenjualanBarang.tanggal, null, null, req_identity)

    console.log("RINCIAN PENGEMBALIAN DENDA", rincianPengembalianDendaPenjualanBarangData)

    const rincianPengembalianDendaPenjualanBarang = await createRincianPengembalianDendaPenjualanBarangRepo(rincianPengembalianDendaPenjualanBarangData, req_identity)
    return rincianPengembalianDendaPenjualanBarang
}

export const deleteRincianPengembalianDendaPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPengembalianDendaPenjualanBarangByUuidService(uuid, req_identity)
    await deleteRincianPengembalianDendaPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPengembalianDendaPenjualanBarangByUuidService = async (uuid, rincianPengembalianDendaPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, rincianPengembalianDendaPenjualanBarangData, req_identity)
    const beforeData = await getRincianPengembalianDendaPenjualanBarangByUuidService(uuid, req_identity)
    const rincianPengembalianDendaPenjualanBarang = await updateRincianPengembalianDendaPenjualanBarangByUuidRepo(uuid, rincianPengembalianDendaPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPengembalianDendaPenjualanBarangData
    }, req_identity)

    return rincianPengembalianDendaPenjualanBarang
}