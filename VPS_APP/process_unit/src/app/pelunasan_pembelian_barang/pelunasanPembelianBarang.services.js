import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPembelianService } from "../faktur_pembelian_barang/fakturPembelianBarang.services.js"
import { getAllRincianPesananPembelianDendaBarangByPelunasanPembelianService } from "../rincian_pelunasan_pembelian_denda_barang/rincianPelunasanPembelianDendaBarang.services.js"
import { createPelunasanPembelianBarangRepo, deletePelunasanPembelianBarangByUuidRepo, getAllPelunasanPembelianBarangRepo, getCekDendaByPelunasanPembelianUUIDRepo, getPelunasanPembelianBarangByUuidRepo, updatePelunasanPembelianBarangByUuidRepo } from "./pelunasanPembelianBarang.repository.js"

export const getAllPelunasanPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPelunasanPembelianBarangService", null, req_identity)

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

    const pelunasanPembelianBarangs = await getAllPelunasanPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pelunasanPembelianBarangs.entry, pelunasanPembelianBarangs.count, pelunasanPembelianBarangs.pageNumber, pelunasanPembelianBarangs.size)
}

export const getCekDendaByPelunasanPembelianUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCekDendaByPelunasanPembelianUUIDService [${uuid}]`, null, req_identity)
    const rincianPelunasanPembelianBarangDenda = await getAllRincianPesananPembelianDendaBarangByPelunasanPembelianService(uuid, true, req_identity)
    return rincianPelunasanPembelianBarangDenda[0].denda_status > 0 ? 1 : 0
}

export const getPelunasanPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPelunasanPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const pelunasanPembelianBarang = await getPelunasanPembelianBarangByUuidRepo(uuid, req_identity)

    if (!pelunasanPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pelunasanPembelianBarang
}

export const createPelunasanPembelianBarangService = async (pelunasanPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPelunasanPembelianBarangService`, pelunasanPembelianBarangData, req_identity)
    pelunasanPembelianBarangData.enabled = 1

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPembelianService(pelunasanPembelianBarangData.faktur_pembelian_barang, pelunasanPembelianBarangData.tanggal, pelunasanPembelianBarangData.tanggal, false, req_identity)

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

    const pelunasanPembelianBarang = await createPelunasanPembelianBarangRepo(pelunasanPembelianBarangData, req_identity)
    return pelunasanPembelianBarang
}

export const deletePelunasanPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePelunasanPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    await getPelunasanPembelianBarangByUuidService(uuid, req_identity)
    await deletePelunasanPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePelunasanPembelianBarangByUuidService = async (uuid, pelunasanPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePelunasanPembelianBarangByUuidService [${uuid}]`, pelunasanPembelianBarangData, req_identity)
    const beforeData = await getPelunasanPembelianBarangByUuidService(uuid, req_identity)

    await getTanggalTransaksiTerakhirByFakturPembelianService(beforeData.faktur_pembelian_barang, beforeData.tanggal, pelunasanPembelianBarangData.tanggal, true, req_identity)

    const pelunasanPembelianBarang = await updatePelunasanPembelianBarangByUuidRepo(uuid, pelunasanPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pelunasanPembelianBarangData
    }, req_identity)

    return pelunasanPembelianBarang
}