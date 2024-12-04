import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_barang/fakturPenjualanBarang.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { getReturPenjualanBarangByUuidService } from "../retur_penjualan_barang/returPenjualanBarang.services.js"
import { createRincianReturPenjualanBarangRepo, deleteRincianReturPenjualanBarangByUuidRepo, getAllRincianPesananPenjualanBarangByReturPenjualanRepo, getAllRincianReturPenjualanBarangRepo, getRincianReturPenjualanBarangByUuidRepo, updateRincianReturPenjualanBarangByUuidRepo } from "./rincianReturPenjualanBarang.repository.js"

export const getAllRincianReturPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianReturPenjualanBarangService", null, req_identity)

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
    
    const rincianReturPenjualanBarangs = await getAllRincianReturPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianReturPenjualanBarangs.entry, rincianReturPenjualanBarangs.count, rincianReturPenjualanBarangs.pageNumber, rincianReturPenjualanBarangs.size)
}

export const getAllRincianPesananPenjualanBarangByReturPenjualanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanBarangByReturPenjualanService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanBarang = await getAllRincianPesananPenjualanBarangByReturPenjualanRepo(uuid, req_identity)
    return rincianPesananPenjualanBarang
}

export const getRincianReturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianReturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianReturPenjualanBarang = await getRincianReturPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!rincianReturPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianReturPenjualanBarang
}

export const createRincianReturPenjualanBarangService = async (rincianReturPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianReturPenjualanBarangService`, rincianReturPenjualanBarangData, req_identity)
    rincianReturPenjualanBarangData.enabled = 1

    const returPenjualanBarang = await getReturPenjualanBarangByUuidService(rincianReturPenjualanBarangData.retur_penjualan_barang, req_identity)

    if (returPenjualanBarang.nomor_retur_penjualan_barang == "EMPTY" || returPenjualanBarang.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Retur Penjualan Barang Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPenjualanBarang.tanggal, null, null, req_identity)
    
    await getTanggalTransaksiTerakhirByFakturPenjualanService(returPenjualanBarang.faktur_penjualan_barang, returPenjualanBarang.tanggal, returPenjualanBarang.tanggal, true, req_identity)

    const rincianReturPenjualanBarang = await createRincianReturPenjualanBarangRepo(rincianReturPenjualanBarangData, req_identity)
    return rincianReturPenjualanBarang
}

export const deleteRincianReturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianReturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getRincianReturPenjualanBarangByUuidService(uuid, req_identity)

    const returPenjualanBarang = await getReturPenjualanBarangByUuidService(beforeData.retur_penjualan_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPenjualanBarang.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(returPenjualanBarang.faktur_penjualan_barang, returPenjualanBarang.tanggal, returPenjualanBarang.tanggal, true, req_identity)

    await deleteRincianReturPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianReturPenjualanBarangByUuidService = async (uuid, rincianReturPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianReturPenjualanBarangByUuidService [${uuid}]`, rincianReturPenjualanBarangData, req_identity)

    const beforeData = await getRincianReturPenjualanBarangByUuidService(uuid, req_identity)

    const returPenjualanBarang = await getReturPenjualanBarangByUuidService(beforeData.retur_penjualan_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPenjualanBarang.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(returPenjualanBarang.faktur_penjualan_barang, returPenjualanBarang.tanggal, returPenjualanBarang.tanggal, true, req_identity)

    const rincianReturPenjualanBarang = await updateRincianReturPenjualanBarangByUuidRepo(uuid, rincianReturPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianReturPenjualanBarangData
    }, req_identity)

    return rincianReturPenjualanBarang
}