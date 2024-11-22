import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getPelunasanPenjualanJasaByUuidService } from "../pelunasan_penjualan_jasa/pelunasanPenjualanJasa.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createRincianPelunasanPenjualanJasaRepo, deleteRincianPelunasanPenjualanJasaByUuidRepo, getAllRincianPelunasanPenjualanJasaRepo, getAllRincianPesananPenjualanJasaByPelunasanPenjualanRepo, getRincianPelunasanPenjualanJasaByUuidRepo, updateRincianPelunasanPenjualanJasaByUuidRepo } from "./rincianPelunasanPenjualanJasa.repository.js"

export const getAllRincianPelunasanPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanJasaService", null, req_identity)

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

    const rincianPelunasanPenjualanJasas = await getAllRincianPelunasanPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPelunasanPenjualanJasas.entry, rincianPelunasanPenjualanJasas.count, rincianPelunasanPenjualanJasas.pageNumber, rincianPelunasanPenjualanJasas.size)
}

export const getAllRincianPesananPenjualanJasaByTanggalService = async (tanggal, faktur_penjualan_jasa, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanJasaByTanggalService`, { tanggal, faktur_penjualan_jasa }, req_identity)
    const rincianPesananPenjualanJasa = await getAllRincianPesananPenjualanJasaByPelunasanPenjualanRepo(null, tanggal, faktur_penjualan_jasa, req_identity)
    return rincianPesananPenjualanJasa
}

export const getAllRincianPesananPenjualanJasaByPelunasanPenjualanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanJasaByPelunasanPenjualanService [${uuid}]`, null, req_identity)
    const rincianPesananPenjualanJasa = await getAllRincianPesananPenjualanJasaByPelunasanPenjualanRepo(uuid, null, null, req_identity)
    return rincianPesananPenjualanJasa
}

export const getRincianPelunasanPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPelunasanPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const rincianPelunasanPenjualanJasa = await getRincianPelunasanPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!rincianPelunasanPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPelunasanPenjualanJasa
}

export const createRincianPelunasanPenjualanJasaService = async (rincianPelunasanPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPelunasanPenjualanJasaService`, rincianPelunasanPenjualanJasaData, req_identity)
    rincianPelunasanPenjualanJasaData.enabled = 1

    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidService(rincianPelunasanPenjualanJasaData.pelunasan_penjualan_jasa, req_identity)

    if (pelunasanPenjualanJasa.nomor_pelunasan_penjualan_jasa == "EMPTY" || pelunasanPenjualanJasa.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Pelunasan Penjualan Jasa Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasa.tanggal, null, null, req_identity)

    const rincianPelunasanPenjualanJasa = await createRincianPelunasanPenjualanJasaRepo(rincianPelunasanPenjualanJasaData, req_identity)
    return rincianPelunasanPenjualanJasa
}

export const deleteRincianPelunasanPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPelunasanPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    
    const beforeData = await getRincianPelunasanPenjualanJasaByUuidService(uuid, req_identity)

    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidService(beforeData.pelunasan_penjualan_jasa, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasa.tanggal, null, null, req_identity)

    await deleteRincianPelunasanPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPelunasanPenjualanJasaByUuidService = async (uuid, rincianPelunasanPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPelunasanPenjualanJasaByUuidService [${uuid}]`, rincianPelunasanPenjualanJasaData, req_identity)

    const beforeData = await getRincianPelunasanPenjualanJasaByUuidService(uuid, req_identity)

    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidService(beforeData.pelunasan_penjualan_jasa, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasa.tanggal, null, null, req_identity)

    const rincianPelunasanPenjualanJasa = await updateRincianPelunasanPenjualanJasaByUuidRepo(uuid, rincianPelunasanPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPelunasanPenjualanJasaData
    }, req_identity)

    return rincianPelunasanPenjualanJasa
}