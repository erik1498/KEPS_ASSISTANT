import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkPerintahStokOpnameAktifByTanggalService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createPesananPenjualanBarangRepo, deletePesananPenjualanBarangByUuidRepo, getAllPesananPenjualanBarangRepo, getPesananPenjualanBarangByUuidRepo, getTanggalTransaksiTerakhirByPesananPenjualanRepo, updatePesananPenjualanBarangByUuidRepo } from "./pesananPenjualanBarang.repository.js"

export const getAllPesananPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPesananPenjualanBarangService", null, req_identity)

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
    
    const pesananPenjualanBarangs = await getAllPesananPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pesananPenjualanBarangs.entry, pesananPenjualanBarangs.count, pesananPenjualanBarangs.pageNumber, pesananPenjualanBarangs.size)
}

export const getPesananPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPesananPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const pesananPenjualanBarang = await getPesananPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!pesananPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pesananPenjualanBarang
}

export const createPesananPenjualanBarangService = async (pesananPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPesananPenjualanBarangService`, pesananPenjualanBarangData, req_identity)
    pesananPenjualanBarangData.enabled = 1

    await checkPerintahStokOpnameAktifByTanggalService(pesananPenjualanBarangData.tanggal_pesanan_penjualan_barang, req_identity)

    const pesananPenjualanBarang = await createPesananPenjualanBarangRepo(pesananPenjualanBarangData, req_identity)
    return pesananPenjualanBarang
}

export const deletePesananPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePesananPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    
    const beforeData = await getPesananPenjualanBarangByUuidService(uuid, req_identity)
    
    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPenjualanService(uuid, beforeData.tanggal_pesanan_penjualan_barang, req_identity);
    
    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Dihapus Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }
    
    await deletePesananPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePesananPenjualanBarangByUuidService = async (uuid, pesananPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePesananPenjualanBarangByUuidService [${uuid}]`, pesananPenjualanBarangData, req_identity)
    const beforeData = await getPesananPenjualanBarangByUuidService(uuid, req_identity)

    const allowToEdit = await getTanggalTransaksiTerakhirByPesananPenjualanService(uuid, beforeData.tanggal_pesanan_penjualan_barang, req_identity);
    
    if (!allowToEdit.allow) {
        throw Error(JSON.stringify({
            message: "Tidak Bisa Diedit Karena Tanggal Terakhir Transaksi Adalah " + formatDate(allowToEdit.tanggal_minimum),
            field: "error"
        }))
    }

    const pesananPenjualanBarang = await updatePesananPenjualanBarangByUuidRepo(uuid, pesananPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pesananPenjualanBarangData
    }, req_identity)

    return pesananPenjualanBarang
}


export const getTanggalTransaksiTerakhirByPesananPenjualanService = async (pesanan_penjualan, tanggal, req_identity) => {
    LOGGER(logType.INFO, `Start getTanggalTransaksiTerakhirByPesananPenjualanService`, { pesanan_penjualan, tanggal }, req_identity)

    const tanggalMinimum = await getTanggalTransaksiTerakhirByPesananPenjualanRepo(pesanan_penjualan, req_identity)
    
    if (tanggalMinimum.length > 0) {
        if (tanggalMinimum[0].tanggal_terakhir_transaksi == tanggal) {
            return {
                allow: true,
                tanggal_minimum: tanggalMinimum[0].tanggal_terakhir_transaksi
            }
        }else{
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