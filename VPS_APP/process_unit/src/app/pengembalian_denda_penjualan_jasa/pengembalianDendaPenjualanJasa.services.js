import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getJumlahRincianTransaksiDendaOnTableByTanggalService, getJumlahRincianTransaksiOnTableByTanggalService, getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_jasa/fakturPenjualanJasa.services.js"
import { createPengembalianDendaPenjualanJasaRepo, deletePengembalianDendaPenjualanJasaByUuidRepo, getAllPengembalianDendaPenjualanJasaRepo, getPengembalianDendaPenjualanJasaByUuidRepo, updatePengembalianDendaPenjualanJasaByUuidRepo } from "./pengembalianDendaPenjualanJasa.repository.js"

export const getAllPengembalianDendaPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPengembalianDendaPenjualanJasaService", null, req_identity)

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

    const pengembalianDendaPenjualanJasas = await getAllPengembalianDendaPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pengembalianDendaPenjualanJasas.entry, pengembalianDendaPenjualanJasas.count, pengembalianDendaPenjualanJasas.pageNumber, pengembalianDendaPenjualanJasas.size)
}

export const getPengembalianDendaPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPengembalianDendaPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const pengembalianDendaPenjualanJasa = await getPengembalianDendaPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!pengembalianDendaPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pengembalianDendaPenjualanJasa
}

export const createPengembalianDendaPenjualanJasaService = async (pengembalianDendaPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createPengembalianDendaPenjualanJasaService`, pengembalianDendaPenjualanJasaData, req_identity)
    pengembalianDendaPenjualanJasaData.enabled = 1

    const tanggalValid = await getTanggalTransaksiTerakhirByFakturPenjualanService(pengembalianDendaPenjualanJasaData.faktur_penjualan_jasa, pengembalianDendaPenjualanJasaData.tanggal, pengembalianDendaPenjualanJasaData.tanggal, false, req_identity)

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

    const pengembalianDendaPenjualanJasa = await createPengembalianDendaPenjualanJasaRepo(pengembalianDendaPenjualanJasaData, req_identity)
    return pengembalianDendaPenjualanJasa
}

export const deletePengembalianDendaPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePengembalianDendaPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    await getPengembalianDendaPenjualanJasaByUuidService(uuid, req_identity)
    await deletePengembalianDendaPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updatePengembalianDendaPenjualanJasaByUuidService = async (uuid, pengembalianDendaPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePengembalianDendaPenjualanJasaByUuidService [${uuid}]`, pengembalianDendaPenjualanJasaData, req_identity)
    const beforeData = await getPengembalianDendaPenjualanJasaByUuidService(uuid, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(beforeData.faktur_penjualan_jasa, beforeData.tanggal, pengembalianDendaPenjualanJasaData.tanggal, true, req_identity);

    const pengembalianDendaPenjualanJasa = await updatePengembalianDendaPenjualanJasaByUuidRepo(uuid, pengembalianDendaPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pengembalianDendaPenjualanJasaData
    }, req_identity)

    return pengembalianDendaPenjualanJasa
}