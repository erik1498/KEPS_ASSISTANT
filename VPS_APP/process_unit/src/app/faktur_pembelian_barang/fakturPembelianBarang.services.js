import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createFakturPembelianBarangRepo, deleteFakturPembelianBarangByUuidRepo, getAllFakturPembelianBarangRepo, getFakturPembelianBarangByPesananPembelianBarangUUIDRepo, getFakturPembelianBarangByUuidRepo, getFakturReportPembelianBarangsRepo, getJumlahRincianTransaksiDendaOnTableByTanggalRepo, getJumlahRincianTransaksiOnTableByTanggalRepo, getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDRepo, getTanggalTransaksiTerakhirByFakturPembelianRepo, updateFakturPembelianBarangByUuidRepo } from "./fakturPembelianBarang.repository.js"

export const getAllFakturPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllFakturPembelianBarangService", null, req_identity)

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

    const fakturPembelianBarangs = await getAllFakturPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(fakturPembelianBarangs.entry, fakturPembelianBarangs.count, fakturPembelianBarangs.pageNumber, fakturPembelianBarangs.size)
}

export const getFakturReportPembelianBarangsService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getFakturReportPembelianBarangsService", null, req_identity)

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

    const fakturPembelianBarangs = await getFakturReportPembelianBarangsRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(fakturPembelianBarangs.entry, fakturPembelianBarangs.count, fakturPembelianBarangs.pageNumber, fakturPembelianBarangs.size)
}

export const getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDService = async (faktur_pembelian_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDService`, { faktur_pembelian_barang }, req_identity)
    const fakturPembelianBarang = await getRiwayatTransaksiPembelianBarangByFakturPembelianBarangUUIDRepo(faktur_pembelian_barang, req_identity)
    return fakturPembelianBarang
}

export const getTanggalTransaksiTerakhirByFakturPembelianService = async (faktur_pembelian, tanggal_lama, tanggal_baru, editMode, req_identity) => {
    LOGGER(logType.INFO, `Start getTanggalTransaksiTerakhirByFakturPembelianService`, { faktur_pembelian, tanggal_lama, tanggal_baru }, req_identity)

    const tanggalMinimum = await getTanggalTransaksiTerakhirByFakturPembelianRepo(faktur_pembelian, tanggal_lama, tanggal_baru, req_identity)

    if (tanggalMinimum.length > 0) {
        if (tanggalMinimum[0][editMode ? "allowToEdit" : "allowToAdd"] == 0) {
            throw Error(JSON.stringify({
                message: `Tidak Bisa ${editMode ? "Diedit" : "Ditambah"} Karena Tanggal Terakhir Transaksi Adalah ` + formatDate(tanggalMinimum[0].tanggal_valid, true) + ` Pada Transaksi ${tanggalMinimum[0].table_source ? tanggalMinimum[0].table_source
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ") : "Faktur Pembelian Barang"}`,
                prop: "error"
            }))
        } else {
            return {
                tanggal_valid: tanggalMinimum[0].tanggal_valid,
                table_source: tanggalMinimum[0].table_source
            }
        }
    }
    throw Error(JSON.stringify({
        message: "Faktur tidak ditemukan",
        prop: "error"
    }))

}


export const getJumlahRincianTransaksiOnTableByTanggalService = async (table_name, tanggal, check_on_myself, req_identity) => {
    LOGGER(logType.INFO, `Start getJumlahRincianTransaksiOnTableByTanggalService`, { table_name, tanggal }, req_identity)

    const jumlahTransaksi = await getJumlahRincianTransaksiOnTableByTanggalRepo(table_name, tanggal, req_identity);

    if (!check_on_myself) {
        if (jumlahTransaksi.length > 0 && jumlahTransaksi[0].rincian_count == 0) {
            if (jumlahTransaksi[0][`${table_name}_count`] > 0) {
                throw Error(JSON.stringify({
                    message: "Perintah Ditolak",
                    prop: "error"
                }))
            }
        }
    }
    return jumlahTransaksi
}

export const getJumlahRincianTransaksiDendaOnTableByTanggalService = async (table_name, tanggal, check_on_myself, req_identity) => {
    LOGGER(logType.INFO, `Start getJumlahRincianTransaksiDendaOnTableByTanggalService`, { table_name, tanggal }, req_identity)

    const jumlahTransaksi = await getJumlahRincianTransaksiDendaOnTableByTanggalRepo(table_name, tanggal, req_identity);

    if (!check_on_myself) {
        if (jumlahTransaksi.length > 0 && jumlahTransaksi[0].rincian_count == 0) {
            if (jumlahTransaksi[0][`${table_name}_denda_count`] > 0) {
                throw Error(JSON.stringify({
                    message: "Perintah Ditolak",
                    prop: "error"
                }))
            }
        }
    }
    return jumlahTransaksi
}

export const getFakturPembelianBarangByPesananPembelianBarangUUIDService = async (pesanan_pembelian_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPembelianBarangByPesananPembelianBarangUUIDService`, { pesanan_pembelian_barang }, req_identity)
    const fakturPembelianBarang = await getFakturPembelianBarangByPesananPembelianBarangUUIDRepo(pesanan_pembelian_barang, req_identity)
    if (fakturPembelianBarang.length == 0) {
        throw new Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return fakturPembelianBarang[0]
}

export const getFakturPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const fakturPembelianBarang = await getFakturPembelianBarangByUuidRepo(uuid, req_identity)

    if (!fakturPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return fakturPembelianBarang
}

export const createFakturPembelianBarangService = async (fakturPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createFakturPembelianBarangService`, fakturPembelianBarangData, req_identity)
    fakturPembelianBarangData.enabled = 1

    await getNeracaValidasiByTanggalService(null, fakturPembelianBarangData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, fakturPembelianBarangData.tanggal, null, null, req_identity)

    const fakturPembelianBarang = await createFakturPembelianBarangRepo(fakturPembelianBarangData, req_identity)
    return fakturPembelianBarang
}

export const deleteFakturPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteFakturPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getFakturPembelianBarangByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deleteFakturPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateFakturPembelianBarangByUuidService = async (uuid, fakturPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateFakturPembelianBarangByUuidService [${uuid}]`, fakturPembelianBarangData, req_identity)
    const beforeData = await getFakturPembelianBarangByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    const fakturPembelianBarang = await updateFakturPembelianBarangByUuidRepo(uuid, fakturPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        fakturPembelianBarangData
    }, req_identity)

    return fakturPembelianBarang
}