import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_jasa/fakturPenjualanJasa.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createReturPenjualanJasaRepo, deleteReturPenjualanJasaByUuidRepo, getAllReturPenjualanJasaRepo, getCekDendaByReturPenjualanUUIDRepo, getReturPenjualanJasaByUuidRepo, updateReturPenjualanJasaByUuidRepo } from "./returPenjualanJasa.repository.js"

export const getAllReturPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllReturPenjualanJasaService", null, req_identity)

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

    const returPenjualanJasas = await getAllReturPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(returPenjualanJasas.entry, returPenjualanJasas.count, returPenjualanJasas.pageNumber, returPenjualanJasas.size)
}

export const getCekDendaByReturPenjualanUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getCekDendaByReturPenjualanUUIDService [${uuid}]`, null, req_identity)
    const cekDenda = await getCekDendaByReturPenjualanUUIDRepo(uuid, req_identity)
    return 0
}

export const getReturPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getReturPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const returPenjualanJasa = await getReturPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!returPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return returPenjualanJasa
}

export const createReturPenjualanJasaService = async (returPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createReturPenjualanJasaService`, returPenjualanJasaData, req_identity)
    returPenjualanJasaData.enabled = 1

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, returPenjualanJasaData.tanggal, null, null, req_identity)

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPenjualanService(returPenjualanJasaData.faktur_penjualan_jasa, returPenjualanJasaData.tanggal, returPenjualanJasaData.tanggal, false, req_identity)

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

    const returPenjualanJasa = await createReturPenjualanJasaRepo(returPenjualanJasaData, req_identity)
    return returPenjualanJasa
}

export const deleteReturPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteReturPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    
    const beforeData = await getReturPenjualanJasaByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deleteReturPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateReturPenjualanJasaByUuidService = async (uuid, returPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateReturPenjualanJasaByUuidService [${uuid}]`, returPenjualanJasaData, req_identity)
    const beforeData = await getReturPenjualanJasaByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(beforeData.faktur_penjualan_jasa, beforeData.tanggal, returPenjualanJasaData.tanggal, true, req_identity);

    const returPenjualanJasa = await updateReturPenjualanJasaByUuidRepo(uuid, returPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        returPenjualanJasaData
    }, req_identity)

    return returPenjualanJasa
}