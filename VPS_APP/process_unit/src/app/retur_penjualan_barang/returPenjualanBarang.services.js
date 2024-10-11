import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_barang/fakturPenjualanBarang.services.js"
import { createReturPenjualanBarangRepo, deleteReturPenjualanBarangByUuidRepo, getAllReturPenjualanBarangRepo, getCekDendaByReturPenjualanUUIDRepo, getReturPenjualanBarangByUuidRepo, updateReturPenjualanBarangByUuidRepo } from "./returPenjualanBarang.repository.js"

export const getAllReturPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllReturPenjualanBarangService", null, req_identity)

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

    const returPenjualanBarangs = await getAllReturPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(returPenjualanBarangs.entry, returPenjualanBarangs.count, returPenjualanBarangs.pageNumber, returPenjualanBarangs.size)
}

export const getCekDendaByReturPenjualanUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCekDendaByReturPenjualanUUIDService [${uuid}]`, null, req_identity)
    const cekDenda = await getCekDendaByReturPenjualanUUIDRepo(uuid, req_identity)
    return 0
}

export const getReturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getReturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const returPenjualanBarang = await getReturPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!returPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return returPenjualanBarang
}

export const createReturPenjualanBarangService = async (returPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createReturPenjualanBarangService`, returPenjualanBarangData, req_identity)
    returPenjualanBarangData.enabled = 1
    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPenjualanService(returPenjualanBarangData.faktur_penjualan_barang, returPenjualanBarangData.tanggal, returPenjualanBarangData.tanggal, false, req_identity)

    if (tanggalValid.table_source) {
        const pelunasanPenjualanAllowAdd = await getJumlahRincianTransaksiOnTableByTanggalService(tanggalValid.table_source, tanggalValid.tanggal_valid, tanggalValid.table_source == "pelunasan_penjualan_barang", req_identity)
        if (pelunasanPenjualanAllowAdd.length > 0 && pelunasanPenjualanAllowAdd[0].rincian_count == 0) {
            if (pelunasanPenjualanAllowAdd[0][`pelunasan_penjualan_barang_count`] > 0) {
                const pelunasanPenjualanDendaAllowAdd = await getJumlahRincianTransaksiDendaOnTableByTanggalService("pelunasan_penjualan_barang", tanggalValid.tanggal_valid, true, req_identity)
                if (pelunasanPenjualanDendaAllowAdd.length > 0 && pelunasanPenjualanDendaAllowAdd[0].rincian_denda_count == 0) {
                    if (pelunasanPenjualanDendaAllowAdd[0][`pelunasan_penjualan_barang_denda_count`] > 0) {
                        throw Error(JSON.stringify({
                            message: "Perintah Ditolak",
                            prop: "error"
                        }))
                    }
                }
            }
        }
    }

    const returPenjualanBarang = await createReturPenjualanBarangRepo(returPenjualanBarangData, req_identity)
    return returPenjualanBarang
}

export const deleteReturPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteReturPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getReturPenjualanBarangByUuidService(uuid, req_identity)
    await deleteReturPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateReturPenjualanBarangByUuidService = async (uuid, returPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateReturPenjualanBarangByUuidService [${uuid}]`, returPenjualanBarangData, req_identity)
    const beforeData = await getReturPenjualanBarangByUuidService(uuid, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(beforeData.faktur_penjualan_barang, beforeData.tanggal, returPenjualanBarangData.tanggal, true, req_identity);

    const returPenjualanBarang = await updateReturPenjualanBarangByUuidRepo(uuid, returPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        returPenjualanBarangData
    }, req_identity)

    return returPenjualanBarang
}