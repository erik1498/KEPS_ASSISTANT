import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createPesananPembelianBarangRepo, deletePesananPembelianBarangByUuidRepo, getAllPesananPembelianBarangRepo, getPesananPembelianBarangByUuidRepo, getTanggalTransaksiTerakhirByPesananPembelianRepo, updatePesananPembelianBarangByUuidRepo } from "./pesananPembelianBarang.repository.js"

export const getAllPesananPembelianBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPesananPembelianBarangService", null, req_identity)

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

    const pesananPembelianBarangs = await getAllPesananPembelianBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pesananPembelianBarangs.entry, pesananPembelianBarangs.count, pesananPembelianBarangs.pageNumber, pesananPembelianBarangs.size)
}

export const getPesananPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPesananPembelianBarangByUuidService [${uuid}]`, null, req_identity)
    const pesananPembelianBarang = await getPesananPembelianBarangByUuidRepo(uuid, req_identity)

    if (!pesananPembelianBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pesananPembelianBarang
}

export const createPesananPembelianBarangService = async (pesananPembelianBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPesananPembelianBarangService`, pesananPembelianBarangData, req_identity)
    pesananPembelianBarangData.enabled = 1

    await getNeracaValidasiByTanggalService(null, pesananPembelianBarangData.tanggal_pesanan_pembelian_barang, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, pesananPembelianBarangData.tanggal_pesanan_pembelian_barang, null, null, req_identity)

    const pesananPembelianBarang = await createPesananPembelianBarangRepo(pesananPembelianBarangData, req_identity)
    return pesananPembelianBarang
}

export const deletePesananPembelianBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePesananPembelianBarangByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getPesananPembelianBarangByUuidService(uuid, req_identity)

    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPembelianService(uuid, beforeData.tanggal_pesanan_pembelian_barang, req_identity);

    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Dihapus Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }

    await deletePesananPembelianBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePesananPembelianBarangByUuidService = async (uuid, pesananPembelianBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePesananPembelianBarangByUuidService [${uuid}]`, pesananPembelianBarangData, req_identity)
    const beforeData = await getPesananPembelianBarangByUuidService(uuid, req_identity)

    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPembelianService(uuid, beforeData.tanggal_pesanan_pembelian_barang, req_identity);

    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Diedit Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }

    const pesananPembelianBarang = await updatePesananPembelianBarangByUuidRepo(uuid, pesananPembelianBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pesananPembelianBarangData
    }, req_identity)

    return pesananPembelianBarang
}


export const getTanggalTransaksiTerakhirByPesananPembelianService = async (pesanan_pembelian, tanggal, req_identity) => {
    LOGGER(logType.INFO, `Start getTanggalTransaksiTerakhirByPesananPembelianService`, { pesanan_pembelian, tanggal }, req_identity)

    const tanggalMinimum = await getTanggalTransaksiTerakhirByPesananPembelianRepo(pesanan_pembelian, req_identity)

    if (tanggalMinimum.length > 0) {
        if (tanggalMinimum[0].tanggal_terakhir_transaksi == tanggal) {
            return {
                allow: true,
                tanggal_minimum: tanggalMinimum[0].tanggal_terakhir_transaksi
            }
        } else {
            return {
                allow: false,
                tanggal_minimum: tanggalMinimum[0].tanggal_terakhir_transaksi
            }
        }
    }
    return {
        allow: false
    };
}