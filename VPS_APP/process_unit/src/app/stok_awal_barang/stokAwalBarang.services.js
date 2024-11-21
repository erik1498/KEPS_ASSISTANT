import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDaftarBarangAllowToEditService } from "../daftar_barang/daftarBarang.services.js"
import { checkStokAwalBarangAllowToEditRepo, createStokAwalBarangRepo, deleteStokAwalBarangByUuidRepo, getAllStokAwalBarangRepo, getDaftarGudangBarangByKategoriHargaBarangUUIDRepo, getRiwayatTransaksiPembelianByStokAwalBarangUuidRepo, getRiwayatTransaksiPenjualanByStokAwalBarangUuidRepo, getStokAwalBarangByBarangUUIDRepo, getStokAwalBarangByDaftarGudangDanKategoriHargaBarangRepo, getStokAwalBarangByUuidRepo, updateStokAwalBarangByUuidRepo } from "./stokAwalBarang.repository.js"

export const getAllStokAwalBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllStokAwalBarangService", null, req_identity)

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

    const stokAwalBarangs = await getAllStokAwalBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(stokAwalBarangs.entry, stokAwalBarangs.count, stokAwalBarangs.pageNumber, stokAwalBarangs.size)
}

export const getStokAwalBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBarangByUuidService`, {
        uuid
    }, req_identity)
    const daftarGudangBarangs = await getStokAwalBarangByUuidRepo(uuid, req_identity)
    return daftarGudangBarangs
}

export const getRiwayatTransaksiPenjualanByStokAwalBarangUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPenjualanByStokAwalBarangUuidService`, {
        uuid
    }, req_identity)
    const riwayatBarang = await getRiwayatTransaksiPenjualanByStokAwalBarangUuidRepo(uuid, req_identity)
    return riwayatBarang
}

export const getRiwayatTransaksiPembelianByStokAwalBarangUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPembelianByStokAwalBarangUuidService`, {
        uuid
    }, req_identity)
    const riwayatBarang = await getRiwayatTransaksiPembelianByStokAwalBarangUuidRepo(uuid, req_identity)
    return riwayatBarang
}

export const getDaftarGudangBarangByKategoriHargaBarangUUIDService = async (kategori_harga_barang_uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarGudangBarangByKategoriHargaBarangUUIDService`, {
        kategori_harga_barang_uuid
    }, req_identity)
    const daftarGudangBarangs = await getDaftarGudangBarangByKategoriHargaBarangUUIDRepo(kategori_harga_barang_uuid, req_identity)
    return daftarGudangBarangs
}

export const getStokAwalBarangByBarangUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBarangByBarangUUIDService [${uuid}]`, null, req_identity)
    const stokAwalBarang = await getStokAwalBarangByBarangUUIDRepo(uuid, req_identity)

    if (!stokAwalBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return stokAwalBarang
}

export const createStokAwalBarangService = async (stokAwalBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createStokAwalBarangService`, stokAwalBarangData, req_identity)
    stokAwalBarangData.enabled = 1

    const stokAwalBarangByDaftarGudangDanKategoriHargaBarang = await getStokAwalBarangByDaftarGudangDanKategoriHargaBarangService(stokAwalBarangData.daftar_gudang, stokAwalBarangData.kategori_harga_barang, req_identity);

    if (stokAwalBarangByDaftarGudangDanKategoriHargaBarang.length > 0 && stokAwalBarangByDaftarGudangDanKategoriHargaBarang[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Data Sudah Ada",
            prop: "error"
        }))
    }

    const stokAwalBarang = await createStokAwalBarangRepo(stokAwalBarangData, req_identity)
    return stokAwalBarang
}

export const deleteStokAwalBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteStokAwalBarangByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getStokAwalBarangByUuidService(uuid, req_identity)

    await checkStokAwalBarangAllowToEditService(beforeData.uuid, req_identity)

    await deleteStokAwalBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateStokAwalBarangByUuidService = async (uuid, stokAwalBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStokAwalBarangByUuidService [${uuid}]`, stokAwalBarangData, req_identity)
    const beforeData = await getStokAwalBarangByUuidService(uuid, req_identity)

    await checkStokAwalBarangAllowToEditService(beforeData.uuid, req_identity)

    const stokAwalBarang = await updateStokAwalBarangByUuidRepo(uuid, stokAwalBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        stokAwalBarangData
    }, req_identity)

    return stokAwalBarang
}

export const checkStokAwalBarangAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkStokAwalBarangAllowToEditService`, { uuid }, req_identity)

    const daftarBarang = await checkStokAwalBarangAllowToEditRepo(uuid, req_identity)

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
    }
}

export const getStokAwalBarangByDaftarGudangDanKategoriHargaBarangService = async (daftar_gudang, kategori_harga_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBarangByDaftarGudangDanKategoriHargaBarangService`, {
        daftar_gudang,
        kategori_harga_barang
    }, req_identity)

    return await getStokAwalBarangByDaftarGudangDanKategoriHargaBarangRepo(daftar_gudang, kategori_harga_barang, req_identity)
}