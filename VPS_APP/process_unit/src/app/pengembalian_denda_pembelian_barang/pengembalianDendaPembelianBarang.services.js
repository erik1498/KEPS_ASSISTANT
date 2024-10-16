import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPembelianService } from "../faktur_pembelian_barang/fakturPembelianBarang.services.js"
import { createPengembalianDendaPembelianBarangRepo, deletePengembalianDendaPembelianBarangByUuidRepo, getAllPengembalianDendaPembelianBarangRepo, getPengembalianDendaPembelianBarangByUuidRepo, updatePengembalianDendaPembelianBarangByUuidRepo } from "./pengembalianDendaPembelianBarang.repository.js"

export const getAllPengembalianDendaPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPengembalianDendaPembelianBarangService", null, req_identity)

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

    const pengembalianDendaPembelianBarangs = await getAllPengembalianDendaPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pengembalianDendaPembelianBarangs.entry, pengembalianDendaPembelianBarangs.count, pengembalianDendaPembelianBarangs.pageNumber, pengembalianDendaPembelianBarangs.size)
}

export const getPengembalianDendaPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPengembalianDendaPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const pengembalianDendaPembelianBarang = await getPengembalianDendaPembelianBarangByUuidRepo(uuid, req_identity)

    if (!pengembalianDendaPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pengembalianDendaPembelianBarang
}

export const createPengembalianDendaPembelianBarangService = async (pengembalianDendaPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPengembalianDendaPembelianBarangService`, pengembalianDendaPembelianBarangData, req_identity)
    pengembalianDendaPembelianBarangData.enabled = 1

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPembelianService(pengembalianDendaPembelianBarangData.faktur_pembelian_barang, pengembalianDendaPembelianBarangData.tanggal, pengembalianDendaPembelianBarangData.tanggal, false, req_identity)

    if (tanggalValid.table_source) {
        const pelunasanPembelianAllowAdd = await getJumlahRincianTransaksiOnTableByTanggalService(tanggalValid.table_source, tanggalValid.tanggal_valid, tanggalValid.table_source == "pelunasan_pembelian_barang", req_identity)
        if (pelunasanPembelianAllowAdd.length > 0 && pelunasanPembelianAllowAdd[0].rincian_count == 0) {
            if (pelunasanPembelianAllowAdd[0][`pelunasan_pembelian_barang_count`] > 0) {
                const pelunasanPembelianDendaAllowAdd = await getJumlahRincianTransaksiDendaOnTableByTanggalService("pelunasan_pembelian_barang", tanggalValid.tanggal_valid, true, req_identity)
                if (pelunasanPembelianDendaAllowAdd.length > 0 && pelunasanPembelianDendaAllowAdd[0].rincian_denda_count == 0) {
                    if (pelunasanPembelianDendaAllowAdd[0][`pelunasan_pembelian_barang_denda_count`] > 0) {
                        throw Error(JSON.stringify({
                            message: "Perintah Ditolak",
                            prop: "error"
                        }))
                    }
                }
            }
        }
    }

    const pengembalianDendaPembelianBarang = await createPengembalianDendaPembelianBarangRepo(pengembalianDendaPembelianBarangData, req_identity)
    return pengembalianDendaPembelianBarang
}

export const deletePengembalianDendaPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePengembalianDendaPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    await getPengembalianDendaPembelianBarangByUuidService(uuid, req_identity)
    await deletePengembalianDendaPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePengembalianDendaPembelianBarangByUuidService = async (uuid, pengembalianDendaPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePengembalianDendaPembelianBarangByUuidService [${uuid}]`, pengembalianDendaPembelianBarangData, req_identity)
    const beforeData = await getPengembalianDendaPembelianBarangByUuidService(uuid, req_identity)

    await getTanggalTransaksiTerakhirByFakturPembelianService(beforeData.faktur_pembelian_barang, beforeData.tanggal, pengembalianDendaPembelianBarangData.tanggal, true, req_identity);

    const pengembalianDendaPembelianBarang = await updatePengembalianDendaPembelianBarangByUuidRepo(uuid, pengembalianDendaPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pengembalianDendaPembelianBarangData
    }, req_identity)

    return pengembalianDendaPembelianBarang
}