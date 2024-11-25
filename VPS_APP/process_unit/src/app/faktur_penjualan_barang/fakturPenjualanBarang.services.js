import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createFakturPenjualanBarangRepo, deleteFakturPenjualanBarangByUuidRepo, getAllFakturPenjualanBarangRepo, getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo, getFakturPenjualanBarangByUuidRepo, getJumlahRincianTransaksiDendaOnTableByTanggalRepo, getJumlahRincianTransaksiOnTableByTanggalRepo, getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUIDRepo, getTanggalTransaksiTerakhirByFakturPenjualanRepo, updateFakturPenjualanBarangByUuidRepo } from "./fakturPenjualanBarang.repository.js"

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

export const getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUIDService = async (faktur_penjualan_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUIDService`, { faktur_penjualan_barang }, req_identity)
    const fakturPenjualanBarang = await getRiwayatTransaksiPenjualanBarangByFakturPenjualanBarangUUIDRepo(faktur_penjualan_barang, req_identity)
    return fakturPenjualanBarang
}

export const getTanggalTransaksiTerakhirByFakturPenjualanService = async (faktur_penjualan, tanggal_lama, tanggal_baru, editMode, req_identity) => {
    LOGGER(logType.INFO, `Start getTanggalTransaksiTerakhirByFakturPenjualanService`, { faktur_penjualan, tanggal_lama, tanggal_baru }, req_identity)

    const tanggalMinimum = await getTanggalTransaksiTerakhirByFakturPenjualanRepo(faktur_penjualan, tanggal_lama, tanggal_baru, req_identity)

    if (tanggalMinimum.length > 0) {
        if (tanggalMinimum[0][editMode ? "allowToEdit" : "allowToAdd"] == 0) {
            throw Error(JSON.stringify({
                message: `Tidak Bisa ${editMode ? "Diedit" : "Ditambah"} Karena Tanggal Terakhir Transaksi Adalah ` + formatDate(tanggalMinimum[0].tanggal_valid, true) + ` Pada Transaksi ${tanggalMinimum[0].table_source ? tanggalMinimum[0].table_source
                    .split("_")
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ") : "Faktur Penjualan Barang"}`,
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

export const getFakturPenjualanBarangByPesananPenjualanBarangUUIDService = async (pesanan_penjualan_barang_uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPenjualanBarangByPesananPenjualanBarangUUIDService`, { pesanan_penjualan_barang_uuid }, req_identity)
    const fakturPenjualanBarang = await getFakturPenjualanBarangByPesananPenjualanBarangUUIDRepo(pesanan_penjualan_barang_uuid, req_identity)
    if (fakturPenjualanBarang.length == 0) {
        return null
    }
    return fakturPenjualanBarang[0]
}

export const getFakturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const fakturPenjualanBarang = await getFakturPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!fakturPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return fakturPenjualanBarang
}

export const createFakturPenjualanBarangService = async (fakturPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createFakturPenjualanBarangService`, fakturPenjualanBarangData, req_identity)
    fakturPenjualanBarangData.enabled = 1

    await getNeracaValidasiByTanggalService(null, fakturPenjualanBarangData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, fakturPenjualanBarangData.tanggal, null, null, req_identity)

    const fakturPenjualanBarang = await createFakturPenjualanBarangRepo(fakturPenjualanBarangData, req_identity)
    return fakturPenjualanBarang
}

export const deleteFakturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteFakturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getFakturPenjualanBarangByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deleteFakturPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateFakturPenjualanBarangByUuidService = async (uuid, fakturPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateFakturPenjualanBarangByUuidService [${uuid}]`, fakturPenjualanBarangData, req_identity)
    const beforeData = await getFakturPenjualanBarangByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    const fakturPenjualanBarang = await updateFakturPenjualanBarangByUuidRepo(uuid, fakturPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        fakturPenjualanBarangData
    }, req_identity)

    return fakturPenjualanBarang
}