import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDaftarBarangAllowToEditRepo, createDaftarBarangRepo, deleteDaftarBarangByUuidRepo, getAllDaftarBarangRepo, getAllDaftarBarangsAktifByDaftarGudangRepo, getAllDaftarBarangUntukTransaksiRepo, getDaftarBarangByUuidRepo, updateDaftarBarangByUuidRepo } from "./daftarBarang.repository.js"

export const getAllDaftarBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarBarangService", null, req_identity)

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

    const daftarBarangs = await getAllDaftarBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(daftarBarangs.entry, daftarBarangs.count, daftarBarangs.pageNumber, daftarBarangs.size)
}

export const getAllDaftarBarangsAktifByDaftarGudangService = async (daftar_gudang, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarBarangsAktifByDaftarGudangService", {
        daftar_gudang
    }, req_identity)
    const daftarBarangs = await getAllDaftarBarangsAktifByDaftarGudangRepo(daftar_gudang, req_identity)
    return daftarBarangs
}

export const getAllDaftarBarangUntukTransaksiService = async (req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarBarangUntukTransaksiService", null, req_identity)
    const daftarBarangs = await getAllDaftarBarangUntukTransaksiRepo(req_identity)
    return daftarBarangs
}

export const getDaftarBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarBarangByUuidService [${uuid}]`, null, req_identity)
    const daftarBarang = await getDaftarBarangByUuidRepo(uuid, req_identity)

    if (!daftarBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return daftarBarang
}

export const createDaftarBarangService = async (daftarBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createDaftarBarangService`, daftarBarangData, req_identity)
    daftarBarangData.enabled = 1
    daftarBarangData.status = 1

    const daftarBarang = await createDaftarBarangRepo(daftarBarangData, req_identity)
    return daftarBarang
}

export const deleteDaftarBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDaftarBarangByUuidService [${uuid}]`, null, req_identity)

    await checkDaftarBarangAllowToEditService(false, uuid, req_identity)

    await getDaftarBarangByUuidService(uuid, req_identity)
    await deleteDaftarBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarBarangByUuidService = async (uuid, daftarBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarBarangByUuidService [${uuid}]`, daftarBarangData, req_identity)

    await checkDaftarBarangAllowToEditService(false, uuid, req_identity)

    const beforeData = await getDaftarBarangByUuidService(uuid, req_identity)

    const daftarBarang = await updateDaftarBarangByUuidRepo(uuid, daftarBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarBarangData
    }, req_identity)

    return daftarBarang
}

export const checkDaftarBarangAllowToEditService = async (by_kategori_harga_barang, uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkDaftarBarangAllowToEditService`, {
        by_kategori_harga_barang,
        uuid
    }, req_identity)
    const daftarBarang = await checkDaftarBarangAllowToEditRepo(by_kategori_harga_barang, uuid, req_identity)

    if (daftarBarang.length > 0) {

        if (daftarBarang[0].pesanan_penjualan_barang) {
            const data = JSON.parse(daftarBarang[0].pesanan_penjualan_barang)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Barang Sudah Digunakan Pada Pesanan Penjualan Barang ${data.nomor_pesanan_penjualan_barang} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarBarang[0].pesanan_pembelian_barang) {
            const data = JSON.parse(daftarBarang[0].pesanan_pembelian_barang)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Barang Sudah Digunakan Pada Pesanan Pembelian Barang ${data.nomor_pesanan_pembelian_barang} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarBarang[0].transfer_barang) {
            const data = JSON.parse(daftarBarang[0].transfer_barang)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Barang Sudah Digunakan Pada Transfer Barang ${data.kode_transfer_barang} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarBarang[0].konversi_barang) {
            const data = JSON.parse(daftarBarang[0].konversi_barang)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Barang Sudah Digunakan Pada Konversi Barang ${data.kode_konversi_barang} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }

        if (by_kategori_harga_barang) {
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Kategori Harga Barang Sudah Terpakai Di Stok Awal Barang`,
                prop: "error"
            }))
        }
    }

    return
}