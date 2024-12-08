import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDaftarBahanBakuAllowToEditRepo, createDaftarBahanBakuRepo, deleteDaftarBahanBakuByUuidRepo, getAllDaftarBahanBakuRepo, getAllDaftarBahanBakusAktifByDaftarGudangRepo, getAllDaftarBahanBakuUntukTransaksiRepo, getDaftarBahanBakuByUuidRepo, updateDaftarBahanBakuByUuidRepo } from "./daftarBahanBaku.repository.js"

export const getAllDaftarBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarBahanBakuService", null, req_identity)

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

    const daftarBahanBakus = await getAllDaftarBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(daftarBahanBakus.entry, daftarBahanBakus.count, daftarBahanBakus.pageNumber, daftarBahanBakus.size)
}

export const getAllDaftarBahanBakusAktifByDaftarGudangService = async (daftar_gudang, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarBahanBakusAktifByDaftarGudangService", {
        daftar_gudang
    }, req_identity)
    const daftarBahanBakus = await getAllDaftarBahanBakusAktifByDaftarGudangRepo(daftar_gudang, req_identity)
    return daftarBahanBakus
}

export const getAllDaftarBahanBakuUntukTransaksiService = async (req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarBahanBakuUntukTransaksiService", null, req_identity)
    const daftarBahanBakus = await getAllDaftarBahanBakuUntukTransaksiRepo(req_identity)
    return daftarBahanBakus
}

export const getDaftarBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const daftarBahanBaku = await getDaftarBahanBakuByUuidRepo(uuid, req_identity)

    if (!daftarBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return daftarBahanBaku
}

export const createDaftarBahanBakuService = async (daftarBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createDaftarBahanBakuService`, daftarBahanBakuData, req_identity)
    daftarBahanBakuData.enabled = 1
    daftarBahanBakuData.status = 1

    const daftarBahanBaku = await createDaftarBahanBakuRepo(daftarBahanBakuData, req_identity)
    return daftarBahanBaku
}

export const deleteDaftarBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDaftarBahanBakuByUuidService [${uuid}]`, null, req_identity)

    await checkDaftarBahanBakuAllowToEditService(false, uuid, req_identity)

    await getDaftarBahanBakuByUuidService(uuid, req_identity)
    await deleteDaftarBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarBahanBakuByUuidService = async (uuid, daftarBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarBahanBakuByUuidService [${uuid}]`, daftarBahanBakuData, req_identity)

    await checkDaftarBahanBakuAllowToEditService(false, uuid, req_identity)

    const beforeData = await getDaftarBahanBakuByUuidService(uuid, req_identity)

    const daftarBahanBaku = await updateDaftarBahanBakuByUuidRepo(uuid, daftarBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarBahanBakuData
    }, req_identity)

    return daftarBahanBaku
}

export const checkDaftarBahanBakuAllowToEditService = async (by_kategori_harga_bahan_baku, uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkDaftarBahanBakuAllowToEditService`, {
        by_kategori_harga_bahan_baku,
        uuid
    }, req_identity)
    const daftarBahanBaku = await checkDaftarBahanBakuAllowToEditRepo(by_kategori_harga_bahan_baku, uuid, req_identity)

    if (daftarBahanBaku.length > 0) {

        if (daftarBahanBaku[0].pesanan_penjualan_bahan_baku) {
            const data = JSON.parse(daftarBahanBaku[0].pesanan_penjualan_bahan_baku)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Bahan Baku Sudah Digunakan Pada Pesanan Penjualan Bahan Baku ${data.nomor_pesanan_penjualan_bahan_baku} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarBahanBaku[0].pesanan_pembelian_bahan_baku) {
            const data = JSON.parse(daftarBahanBaku[0].pesanan_pembelian_bahan_baku)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Bahan Baku Sudah Digunakan Pada Pesanan Pembelian Bahan Baku ${data.nomor_pesanan_pembelian_bahan_baku} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarBahanBaku[0].transfer_bahan_baku) {
            const data = JSON.parse(daftarBahanBaku[0].transfer_bahan_baku)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Bahan Baku Sudah Digunakan Pada Transfer Bahan Baku ${data.kode_transfer_bahan_baku} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarBahanBaku[0].konversi_bahan_baku) {
            const data = JSON.parse(daftarBahanBaku[0].konversi_bahan_baku)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Bahan Baku Sudah Digunakan Pada Konversi Bahan Baku ${data.kode_konversi_bahan_baku} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }

        if (by_kategori_harga_bahan_baku) {
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Kategori Harga Bahan Baku Sudah Terpakai Di Stok Awal Bahan Baku`,
                prop: "error"
            }))
        }
    }

    return
}