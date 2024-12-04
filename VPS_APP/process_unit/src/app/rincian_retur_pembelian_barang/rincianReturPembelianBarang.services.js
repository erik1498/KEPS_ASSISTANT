import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getTanggalTransaksiTerakhirByFakturPembelianService } from "../faktur_pembelian_barang/fakturPembelianBarang.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { getReturPembelianBarangByUuidService } from "../retur_pembelian_barang/returPembelianBarang.services.js"
import { createRincianReturPembelianBarangRepo, deleteRincianReturPembelianBarangByUuidRepo, getAllRincianPesananPembelianBarangByReturPembelianRepo, getAllRincianReturPembelianBarangRepo, getRincianReturPembelianBarangByUuidRepo, updateRincianReturPembelianBarangByUuidRepo } from "./rincianReturPembelianBarang.repository.js"

export const getAllRincianReturPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianReturPembelianBarangService", null, req_identity)

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

    const rincianReturPembelianBarangs = await getAllRincianReturPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianReturPembelianBarangs.entry, rincianReturPembelianBarangs.count, rincianReturPembelianBarangs.pageNumber, rincianReturPembelianBarangs.size)
}

export const getAllRincianPesananPembelianBarangByReturPembelianService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPembelianBarangByReturPembelianService [${uuid}]`, null, req_identity)
    const rincianPesananPembelianBarang = await getAllRincianPesananPembelianBarangByReturPembelianRepo(uuid, req_identity)
    return rincianPesananPembelianBarang
}

export const getRincianReturPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianReturPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianReturPembelianBarang = await getRincianReturPembelianBarangByUuidRepo(uuid, req_identity)

    if (!rincianReturPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianReturPembelianBarang
}

export const createRincianReturPembelianBarangService = async (rincianReturPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianReturPembelianBarangService`, rincianReturPembelianBarangData, req_identity)
    rincianReturPembelianBarangData.enabled = 1

    const returPembelianBarang = await getReturPembelianBarangByUuidService(rincianReturPembelianBarangData.retur_pembelian_barang, req_identity)

    if (returPembelianBarang.nomor_retur_pembelian_barang == "EMPTY" || returPembelianBarang.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Retur Pembelian Barang Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPembelianBarang.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPembelianService(returPembelianBarang.faktur_pembelian_barang, returPembelianBarang.tanggal, returPembelianBarang.tanggal, true, req_identity)

    const rincianReturPembelianBarang = await createRincianReturPembelianBarangRepo(rincianReturPembelianBarangData, req_identity)
    return rincianReturPembelianBarang
}

export const deleteRincianReturPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianReturPembelianBarangByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getRincianReturPembelianBarangByUuidService(uuid, req_identity)

    const returPembelianBarang = await getReturPembelianBarangByUuidService(beforeData.retur_pembelian_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPembelianBarang.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPembelianService(returPembelianBarang.faktur_pembelian_barang, returPembelianBarang.tanggal, returPembelianBarang.tanggal, true, req_identity)

    await deleteRincianReturPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianReturPembelianBarangByUuidService = async (uuid, rincianReturPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianReturPembelianBarangByUuidService [${uuid}]`, rincianReturPembelianBarangData, req_identity)

    const beforeData = await getRincianReturPembelianBarangByUuidService(uuid, req_identity)

    const returPembelianBarang = await getReturPembelianBarangByUuidService(beforeData.retur_pembelian_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPembelianBarang.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPembelianService(returPembelianBarang.faktur_pembelian_barang, returPembelianBarang.tanggal, returPembelianBarang.tanggal, true, req_identity)

    const rincianReturPembelianBarang = await updateRincianReturPembelianBarangByUuidRepo(uuid, rincianReturPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianReturPembelianBarangData
    }, req_identity)

    return rincianReturPembelianBarang
}