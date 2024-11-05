import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_barang/fakturPenjualanBarang.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanService } from "../rincian_pelunasan_penjualan_denda_barang/rincianPelunasanPenjualanDendaBarang.services.js"
import { createPelunasanPenjualanBarangRepo, deletePelunasanPenjualanBarangByUuidRepo, getAllPelunasanPenjualanBarangRepo, getCekDendaByPelunasanPenjualanUUIDRepo, getPelunasanPenjualanBarangByUuidRepo, updatePelunasanPenjualanBarangByUuidRepo } from "./pelunasanPenjualanBarang.repository.js"

export const getAllPelunasanPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPelunasanPenjualanBarangService", null, req_identity)

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

    const pelunasanPenjualanBarangs = await getAllPelunasanPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pelunasanPenjualanBarangs.entry, pelunasanPenjualanBarangs.count, pelunasanPenjualanBarangs.pageNumber, pelunasanPenjualanBarangs.size)
}

export const getCekDendaByPelunasanPenjualanUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCekDendaByPelunasanPenjualanUUIDService [${uuid}]`, null, req_identity)
    const rincianPelunasanPenjualanBarangDenda = await getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanService(uuid, true, req_identity)
    return rincianPelunasanPenjualanBarangDenda[0].denda_status > 0 ? 1 : 0
}

export const getPelunasanPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPelunasanPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const pelunasanPenjualanBarang = await getPelunasanPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!pelunasanPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pelunasanPenjualanBarang
}

export const createPelunasanPenjualanBarangService = async (pelunasanPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPelunasanPenjualanBarangService`, pelunasanPenjualanBarangData, req_identity)
    pelunasanPenjualanBarangData.enabled = 1

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanBarangData.tanggal, null, null, req_identity)

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPenjualanService(pelunasanPenjualanBarangData.faktur_penjualan_barang, pelunasanPenjualanBarangData.tanggal, pelunasanPenjualanBarangData.tanggal, false, req_identity)

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

    const pelunasanPenjualanBarang = await createPelunasanPenjualanBarangRepo(pelunasanPenjualanBarangData, req_identity)
    return pelunasanPenjualanBarang
}

export const deletePelunasanPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePelunasanPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    
    const beforeData = await getPelunasanPenjualanBarangByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deletePelunasanPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePelunasanPenjualanBarangByUuidService = async (uuid, pelunasanPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePelunasanPenjualanBarangByUuidService [${uuid}]`, pelunasanPenjualanBarangData, req_identity)
    const beforeData = await getPelunasanPenjualanBarangByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(beforeData.faktur_penjualan_barang, beforeData.tanggal, pelunasanPenjualanBarangData.tanggal, true, req_identity)

    const pelunasanPenjualanBarang = await updatePelunasanPenjualanBarangByUuidRepo(uuid, pelunasanPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pelunasanPenjualanBarangData
    }, req_identity)

    return pelunasanPenjualanBarang
}