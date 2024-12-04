import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getPesananPembelianBarangByUuidService, getTanggalTransaksiTerakhirByPesananPembelianService } from "../pesanan_pembelian_barang/pesananPembelianBarang.services.js"
import { createRincianPesananPembelianBarangRepo, deleteRincianPesananPembelianBarangByUuidRepo, getAllRincianPesananPembelianBarangRepo, getRincianPesananPembelianBarangByPesananPembelianUUIDRepo, getRincianPesananPembelianBarangByUuidRepo, updateRincianPesananPembelianBarangByUuidRepo } from "./rincianPesananPembelianBarang.repository.js"

export const getAllRincianPesananPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPembelianBarangService", null, req_identity)

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

    const rincianPesananPembelianBarangs = await getAllRincianPesananPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPesananPembelianBarangs.entry, rincianPesananPembelianBarangs.count, rincianPesananPembelianBarangs.pageNumber, rincianPesananPembelianBarangs.size)
}

export const getRincianPesananPembelianBarangByPesananPembelianUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPesananPembelianBarangByPesananPembelianUUIDService [${uuid}]`, null, req_identity)
    const rincianPesananPembelianBarang = await getRincianPesananPembelianBarangByPesananPembelianUUIDRepo(uuid, req_identity)
    return rincianPesananPembelianBarang
}

export const getRincianPesananPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPesananPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPesananPembelianBarang = await getRincianPesananPembelianBarangByUuidRepo(uuid, req_identity)

    if (!rincianPesananPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPesananPembelianBarang
}

export const createRincianPesananPembelianBarangService = async (rincianPesananPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPesananPembelianBarangService`, rincianPesananPembelianBarangData, req_identity)
    rincianPesananPembelianBarangData.enabled = 1

    const pesananPembelianBarang = await getPesananPembelianBarangByUuidService(rincianPesananPembelianBarangData.pesanan_pembelian_barang, req_identity)

    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPembelianService(pesananPembelianBarang.uuid, pesananPembelianBarang.tanggal_pesanan_pembelian_barang, req_identity);

    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Diedit Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }

    const rincianPesananPembelianBarang = await createRincianPesananPembelianBarangRepo(rincianPesananPembelianBarangData, req_identity)
    return rincianPesananPembelianBarang
}

export const deleteRincianPesananPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPesananPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getRincianPesananPembelianBarangByUuidService(uuid, req_identity)

    const pesananPembelianBarang = await getPesananPembelianBarangByUuidService(beforeData.pesanan_pembelian_barang, req_identity)

    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPembelianService(pesananPembelianBarang.uuid, pesananPembelianBarang.tanggal_pesanan_pembelian_barang, req_identity);

    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Diedit Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }

    await deleteRincianPesananPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPesananPembelianBarangByUuidService = async (uuid, rincianPesananPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPesananPembelianBarangByUuidService [${uuid}]`, rincianPesananPembelianBarangData, req_identity)
    const beforeData = await getRincianPesananPembelianBarangByUuidService(uuid, req_identity)

    const pesananPembelianBarang = await getPesananPembelianBarangByUuidService(beforeData.pesanan_pembelian_barang, req_identity)

    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPembelianService(pesananPembelianBarang.uuid, pesananPembelianBarang.tanggal_pesanan_pembelian_barang, req_identity);

    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Diedit Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }

    const rincianPesananPembelianBarang = await updateRincianPesananPembelianBarangByUuidRepo(uuid, rincianPesananPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPesananPembelianBarangData
    }, req_identity)

    return rincianPesananPembelianBarang
}