import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_barang/fakturPenjualanBarang.services.js"
import { createPengembalianDendaPenjualanBarangRepo, deletePengembalianDendaPenjualanBarangByUuidRepo, getAllPengembalianDendaPenjualanBarangRepo, getPengembalianDendaPenjualanBarangByUuidRepo, updatePengembalianDendaPenjualanBarangByUuidRepo } from "./pengembalianDendaPenjualanBarang.repository.js"

export const getAllPengembalianDendaPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPengembalianDendaPenjualanBarangService", null, req_identity)

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

    const pengembalianDendaPenjualanBarangs = await getAllPengembalianDendaPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pengembalianDendaPenjualanBarangs.entry, pengembalianDendaPenjualanBarangs.count, pengembalianDendaPenjualanBarangs.pageNumber, pengembalianDendaPenjualanBarangs.size)
}

export const getPengembalianDendaPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPengembalianDendaPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const pengembalianDendaPenjualanBarang = await getPengembalianDendaPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!pengembalianDendaPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return pengembalianDendaPenjualanBarang
}

export const createPengembalianDendaPenjualanBarangService = async (pengembalianDendaPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPengembalianDendaPenjualanBarangService`, pengembalianDendaPenjualanBarangData, req_identity)
    pengembalianDendaPenjualanBarangData.enabled = 1

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPenjualanService(pengembalianDendaPenjualanBarangData.faktur_penjualan_barang, pengembalianDendaPenjualanBarangData.tanggal, pengembalianDendaPenjualanBarangData.tanggal, false, req_identity)

    if (tanggalValid.table_source) {
        const pelunasanPenjualanAllowAdd = await getJumlahRincianTransaksiOnTableByTanggalService(tanggalValid.table_source, tanggalValid.tanggal_valid, tanggalValid.table_source == "pelunasan_penjualan_barang", req_identity)
        if (pelunasanPenjualanAllowAdd.length > 0 && pelunasanPenjualanAllowAdd[0].rincian_count == 0) {
            if (pelunasanPenjualanAllowAdd[0][`pelunasan_penjualan_barang_count`] > 0) {
                const pelunasanPenjualanDendaAllowAdd = await getJumlahRincianTransaksiDendaOnTableByTanggalService("pelunasan_penjualan_barang", tanggalValid.tanggal_valid, true, req_identity)
                if (pelunasanPenjualanDendaAllowAdd.length > 0 && pelunasanPenjualanDendaAllowAdd[0].rincian_denda_count == 0) {
                    if (pelunasanPenjualanDendaAllowAdd[0][`pelunasan_penjualan_barang_denda_count`] > 0) {
                        throw Error(JSON.stringify({
                            message: "Perintah Ditolak",
                            field: "error"
                        }))
                    }
                }
            }
        }
    }

    const pengembalianDendaPenjualanBarang = await createPengembalianDendaPenjualanBarangRepo(pengembalianDendaPenjualanBarangData, req_identity)
    return pengembalianDendaPenjualanBarang
}

export const deletePengembalianDendaPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePengembalianDendaPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    await getPengembalianDendaPenjualanBarangByUuidService(uuid, req_identity)
    await deletePengembalianDendaPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePengembalianDendaPenjualanBarangByUuidService = async (uuid, pengembalianDendaPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePengembalianDendaPenjualanBarangByUuidService [${uuid}]`, pengembalianDendaPenjualanBarangData, req_identity)
    const beforeData = await getPengembalianDendaPenjualanBarangByUuidService(uuid, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(beforeData.faktur_penjualan_barang, beforeData.tanggal, returPenjualanBarangData.tanggal, true, req_identity);

    const pengembalianDendaPenjualanBarang = await updatePengembalianDendaPenjualanBarangByUuidRepo(uuid, pengembalianDendaPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pengembalianDendaPenjualanBarangData
    }, req_identity)

    return pengembalianDendaPenjualanBarang
}