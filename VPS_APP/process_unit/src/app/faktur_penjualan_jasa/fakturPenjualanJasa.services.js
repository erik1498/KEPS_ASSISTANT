import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createFakturPenjualanJasaRepo, deleteFakturPenjualanJasaByUuidRepo, getAllFakturPenjualanJasaRepo, getFakturPenjualanJasaByPesananPenjualanJasaUUIDRepo, getFakturPenjualanJasaByUuidRepo, getJumlahRincianTransaksiDendaOnTableByTanggalRepo, getJumlahRincianTransaksiOnTableByTanggalRepo, getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDRepo, getTanggalTransaksiTerakhirByFakturPenjualanRepo, updateFakturPenjualanJasaByUuidRepo } from "./fakturPenjualanJasa.repository.js"

export const getAllFakturPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllFakturPenjualanJasaService", null, req_identity)

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

    const fakturPenjualanJasas = await getAllFakturPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(fakturPenjualanJasas.entry, fakturPenjualanJasas.count, fakturPenjualanJasas.pageNumber, fakturPenjualanJasas.size)
}

export const getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDService = async (faktur_penjualan_jasa, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDService`, { faktur_penjualan_jasa }, req_identity)
    const fakturPenjualanJasa = await getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDRepo(faktur_penjualan_jasa, req_identity)
    return fakturPenjualanJasa
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
                    .join(" ") : "Faktur Penjualan Jasa"}`,
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

export const getFakturPenjualanJasaByPesananPenjualanJasaUUIDService = async (pesanan_penjualan_jasa, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPenjualanJasaByPesananPenjualanJasaUUIDService`, { pesanan_penjualan_jasa }, req_identity)
    const fakturPenjualanJasa = await getFakturPenjualanJasaByPesananPenjualanJasaUUIDRepo(pesanan_penjualan_jasa, req_identity)
    if (fakturPenjualanJasa.length == 0) {
        return null
    }
    return fakturPenjualanJasa[0]
}

export const getFakturPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getFakturPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const fakturPenjualanJasa = await getFakturPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!fakturPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return fakturPenjualanJasa
}

export const createFakturPenjualanJasaService = async (fakturPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createFakturPenjualanJasaService`, fakturPenjualanJasaData, req_identity)
    fakturPenjualanJasaData.enabled = 1

    const fakturPenjualanJasaPesananPenjualanJasa = await getFakturPenjualanJasaByPesananPenjualanJasaUUIDService(fakturPenjualanJasaData.pesanan_penjualan_jasa, req_identity)

    if (fakturPenjualanJasaPesananPenjualanJasa != null) {
        throw Error(JSON.stringify({
            message: "Faktur Penjualan Jasa Sudah Terdaftar Sebelumnya",
            prop: "error"
        }))
    }

    await getNeracaValidasiByTanggalService(null, fakturPenjualanJasaData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, fakturPenjualanJasaData.tanggal, null, null, req_identity)

    const fakturPenjualanJasa = await createFakturPenjualanJasaRepo(fakturPenjualanJasaData, req_identity)
    return fakturPenjualanJasa
}

export const deleteFakturPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteFakturPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getFakturPenjualanJasaByUuidService(uuid, req_identity)

    const riwayatTransaksi = await getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDRepo(beforeData.uuid, req_identity)

    if (riwayatTransaksi.length > 0) {
        throw Error(JSON.stringify({
            message: "Batalkan Faktur Ditolak, Sudah Ada Transaksi Pelunasan/Retur",
            prop: "error"
        }))
    }

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deleteFakturPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateFakturPenjualanJasaByUuidService = async (uuid, fakturPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateFakturPenjualanJasaByUuidService [${uuid}]`, fakturPenjualanJasaData, req_identity)
    const beforeData = await getFakturPenjualanJasaByUuidService(uuid, req_identity)

    const riwayatTransaksi = await getRiwayatTransaksiPenjualanJasaByFakturPenjualanJasaUUIDRepo(beforeData.uuid, req_identity)

    if (riwayatTransaksi.length > 0) {
        throw Error(JSON.stringify({
            message: "Edit Faktur Ditolak, Sudah Ada Transaksi Pelunasan/Retur",
            prop: "error"
        }))
    }

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    const fakturPenjualanJasa = await updateFakturPenjualanJasaByUuidRepo(uuid, fakturPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        fakturPenjualanJasaData
    }, req_identity)

    return fakturPenjualanJasa
}