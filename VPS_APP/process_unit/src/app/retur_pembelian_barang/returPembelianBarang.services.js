import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPembelianService } from "../faktur_pembelian_barang/fakturPembelianBarang.services.js"
import { createReturPembelianBarangRepo, deleteReturPembelianBarangByUuidRepo, getAllReturPembelianBarangRepo, getCekDendaByReturPembelianUUIDRepo, getReturPembelianBarangByUuidRepo, updateReturPembelianBarangByUuidRepo } from "./returPembelianBarang.repository.js"

export const getAllReturPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllReturPembelianBarangService", null, req_identity)

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

    const returPembelianBarangs = await getAllReturPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(returPembelianBarangs.entry, returPembelianBarangs.count, returPembelianBarangs.pageNumber, returPembelianBarangs.size)
}

export const getCekDendaByReturPembelianUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCekDendaByReturPembelianUUIDService [${uuid}]`, null, req_identity)
    const cekDenda = await getCekDendaByReturPembelianUUIDRepo(uuid, req_identity)
    return 0
}

export const getReturPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getReturPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const returPembelianBarang = await getReturPembelianBarangByUuidRepo(uuid, req_identity)

    if (!returPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return returPembelianBarang
}

export const createReturPembelianBarangService = async (returPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createReturPembelianBarangService`, returPembelianBarangData, req_identity)
    returPembelianBarangData.enabled = 1
    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPembelianService(returPembelianBarangData.faktur_pembelian_barang, returPembelianBarangData.tanggal, returPembelianBarangData.tanggal, false, req_identity)

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

    const returPembelianBarang = await createReturPembelianBarangRepo(returPembelianBarangData, req_identity)
    return returPembelianBarang
}

export const deleteReturPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteReturPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    await getReturPembelianBarangByUuidService(uuid, req_identity)
    await deleteReturPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateReturPembelianBarangByUuidService = async (uuid, returPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateReturPembelianBarangByUuidService [${uuid}]`, returPembelianBarangData, req_identity)
    const beforeData = await getReturPembelianBarangByUuidService(uuid, req_identity)

    await getTanggalTransaksiTerakhirByFakturPembelianService(beforeData.faktur_pembelian_barang, beforeData.tanggal, returPembelianBarangData.tanggal, true, req_identity);

    const returPembelianBarang = await updateReturPembelianBarangByUuidRepo(uuid, returPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        returPembelianBarangData
    }, req_identity)

    return returPembelianBarang
}