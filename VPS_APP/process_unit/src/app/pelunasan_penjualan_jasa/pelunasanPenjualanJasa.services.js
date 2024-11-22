import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_jasa/fakturPenjualanJasa.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanService } from "../rincian_pelunasan_penjualan_denda_jasa/rincianPelunasanPenjualanDendaJasa.services.js"
import { createPelunasanPenjualanJasaRepo, deletePelunasanPenjualanJasaByUuidRepo, getAllPelunasanPenjualanJasaRepo, getPelunasanPenjualanJasaByUuidRepo, updatePelunasanPenjualanJasaByUuidRepo } from "./pelunasanPenjualanJasa.repository.js"

export const getAllPelunasanPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPelunasanPenjualanJasaService", null, req_identity)

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

    const pelunasanPenjualanJasas = await getAllPelunasanPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pelunasanPenjualanJasas.entry, pelunasanPenjualanJasas.count, pelunasanPenjualanJasas.pageNumber, pelunasanPenjualanJasas.size)
}

export const getCekDendaByPelunasanPenjualanUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCekDendaByPelunasanPenjualanUUIDService [${uuid}]`, null, req_identity)
    const rincianPelunasanPenjualanJasaDenda = await getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanService(uuid, true, req_identity)
    return rincianPelunasanPenjualanJasaDenda[0].denda_status > 0 ? 1 : 0
}

export const getPelunasanPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPelunasanPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!pelunasanPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pelunasanPenjualanJasa
}

export const createPelunasanPenjualanJasaService = async (pelunasanPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createPelunasanPenjualanJasaService`, pelunasanPenjualanJasaData, req_identity)
    pelunasanPenjualanJasaData.enabled = 1

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasaData.tanggal, null, null, req_identity)

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPenjualanService(pelunasanPenjualanJasaData.faktur_penjualan_jasa, pelunasanPenjualanJasaData.tanggal, pelunasanPenjualanJasaData.tanggal, false, req_identity)

    if (tanggalValid.table_source) {
        const pelunasanPenjualanAllowAdd = await getJumlahRincianTransaksiOnTableByTanggalService(tanggalValid.table_source, tanggalValid.tanggal_valid, tanggalValid.table_source == "pelunasan_penjualan_jasa", req_identity)

        if (pelunasanPenjualanAllowAdd.length > 0 && pelunasanPenjualanAllowAdd[0].rincian_count == 0) {
            if (pelunasanPenjualanAllowAdd[0][`pelunasan_penjualan_jasa_count`] > 0) {
                const pelunasanPenjualanDendaAllowAdd = await getJumlahRincianTransaksiDendaOnTableByTanggalService("pelunasan_penjualan_jasa", tanggalValid.tanggal_valid, true, req_identity)
                if (pelunasanPenjualanDendaAllowAdd.length > 0 && pelunasanPenjualanDendaAllowAdd[0].rincian_denda_count == 0) {
                    if (pelunasanPenjualanDendaAllowAdd[0][`pelunasan_penjualan_jasa_denda_count`] > 0) {
                        throw Error(JSON.stringify({
                            message: "Perintah Ditolak",
                            prop: "error"
                        }))
                    }
                }

            }
        }
    }

    const pelunasanPenjualanJasa = await createPelunasanPenjualanJasaRepo(pelunasanPenjualanJasaData, req_identity)

    return pelunasanPenjualanJasa
}

export const deletePelunasanPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePelunasanPenjualanJasaByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getPelunasanPenjualanJasaByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deletePelunasanPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updatePelunasanPenjualanJasaByUuidService = async (uuid, pelunasanPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePelunasanPenjualanJasaByUuidService [${uuid}]`, pelunasanPenjualanJasaData, req_identity)
    const beforeData = await getPelunasanPenjualanJasaByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(beforeData.faktur_penjualan_jasa, beforeData.tanggal, pelunasanPenjualanJasaData.tanggal, true, req_identity)

    const pelunasanPenjualanJasa = await updatePelunasanPenjualanJasaByUuidRepo(uuid, pelunasanPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pelunasanPenjualanJasaData
    }, req_identity)

    return pelunasanPenjualanJasa
}