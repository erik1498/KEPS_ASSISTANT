import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getTanggalTransaksiTerakhirByFakturPenjualanService } from "../faktur_penjualan_jasa/fakturPenjualanJasa.services.js"
import { getPelunasanPenjualanJasaByUuidService } from "../pelunasan_penjualan_jasa/pelunasanPenjualanJasa.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createRincianPelunasanPenjualanDendaJasaRepo, deleteRincianPelunasanPenjualanDendaJasaByUuidRepo, getAllRincianPelunasanPenjualanDendaJasaRepo, getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanRepo, getRincianPelunasanPenjualanDendaJasaByUuidRepo, updateRincianPelunasanPenjualanDendaJasaByUuidRepo } from "./rincianPelunasanPenjualanDendaJasa.repository.js"

export const getAllRincianPelunasanPenjualanDendaJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanDendaJasaService", null, req_identity)

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

    const rincianPelunasanPenjualanDendaJasas = await getAllRincianPelunasanPenjualanDendaJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPelunasanPenjualanDendaJasas.entry, rincianPelunasanPenjualanDendaJasas.count, rincianPelunasanPenjualanDendaJasas.pageNumber, rincianPelunasanPenjualanDendaJasas.size)
}

export const getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanService = async (uuid, denda_status, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanService [${uuid}]`, { denda_status }, req_identity)
    const rincianPesananPenjualanJasa = await getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanRepo(uuid, denda_status, req_identity)
    return rincianPesananPenjualanJasa
}

export const getRincianPelunasanPenjualanDendaJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPelunasanPenjualanDendaJasaByUuidService [${uuid}]`, null, req_identity)
    const rincianPelunasanPenjualanDendaJasa = await getRincianPelunasanPenjualanDendaJasaByUuidRepo(uuid, req_identity)

    if (!rincianPelunasanPenjualanDendaJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPelunasanPenjualanDendaJasa
}

export const createRincianPelunasanPenjualanDendaJasaService = async (rincianPelunasanPenjualanDendaJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPelunasanPenjualanDendaJasaService`, rincianPelunasanPenjualanDendaJasaData, req_identity)
    rincianPelunasanPenjualanDendaJasaData.enabled = 1

    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidService(rincianPelunasanPenjualanDendaJasaData.pelunasan_penjualan_jasa, req_identity)

    if (pelunasanPenjualanJasa.nomor_pelunasan_penjualan_jasa == "EMPTY" || pelunasanPenjualanJasa.bukti_transaksi == "EMPTY") {
        throw Error(JSON.stringify({
            message: "Nomor Pelunasan Penjualan Jasa Atau Bukti Transaksi Tidak Boleh Kosong",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasa.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(pelunasanPenjualanJasa.faktur_penjualan_jasa, pelunasanPenjualanJasa.tanggal, pelunasanPenjualanJasa.tanggal, true, req_identity)

    const rincianPelunasanPenjualanDendaJasa = await createRincianPelunasanPenjualanDendaJasaRepo(rincianPelunasanPenjualanDendaJasaData, req_identity)
    return rincianPelunasanPenjualanDendaJasa
}

export const deleteRincianPelunasanPenjualanDendaJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPelunasanPenjualanDendaJasaByUuidService [${uuid}]`, null, req_identity)

    const beforeData =  await getRincianPelunasanPenjualanDendaJasaByUuidService(uuid, req_identity)

    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidService(beforeData.pelunasan_penjualan_jasa, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasa.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(pelunasanPenjualanJasa.faktur_penjualan_jasa, pelunasanPenjualanJasa.tanggal, pelunasanPenjualanJasa.tanggal, true, req_identity)

    await deleteRincianPelunasanPenjualanDendaJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPelunasanPenjualanDendaJasaByUuidService = async (uuid, rincianPelunasanPenjualanDendaJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPelunasanPenjualanDendaJasaByUuidService [${uuid}]`, rincianPelunasanPenjualanDendaJasaData, req_identity)

    const beforeData = await getRincianPelunasanPenjualanDendaJasaByUuidService(uuid, req_identity)

    const pelunasanPenjualanJasa = await getPelunasanPenjualanJasaByUuidService(beforeData.pelunasan_penjualan_jasa, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pelunasanPenjualanJasa.tanggal, null, null, req_identity)

    await getTanggalTransaksiTerakhirByFakturPenjualanService(pelunasanPenjualanJasa.faktur_penjualan_jasa, pelunasanPenjualanJasa.tanggal, pelunasanPenjualanJasa.tanggal, true, req_identity)

    const rincianPelunasanPenjualanDendaJasa = await updateRincianPelunasanPenjualanDendaJasaByUuidRepo(uuid, rincianPelunasanPenjualanDendaJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPelunasanPenjualanDendaJasaData
    }, req_identity)

    return rincianPelunasanPenjualanDendaJasa
}