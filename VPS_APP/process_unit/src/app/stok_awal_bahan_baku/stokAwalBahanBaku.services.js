import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkStokAwalBahanBakuAllowToEditRepo, createStokAwalBahanBakuRepo, deleteStokAwalBahanBakuByUuidRepo, getAllStokAwalBahanBakuRepo, getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanBahanBakuUUIDRepo, getReportStokAwalBahanBakusRepo, getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidRepo, getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidRepo, getStokAwalBahanBakuByBahanBakuUUIDRepo, getStokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBakuRepo, getStokAwalBahanBakuByUuidRepo, updateStokAwalBahanBakuByUuidRepo } from "./stokAwalBahanBaku.repository.js"

export const getAllStokAwalBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllStokAwalBahanBakuService", null, req_identity)

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

    const stokAwalBahanBakus = await getAllStokAwalBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(stokAwalBahanBakus.entry, stokAwalBahanBakus.count, stokAwalBahanBakus.pageNumber, stokAwalBahanBakus.size)
}

export const getReportStokAwalBahanBakusService = async (bulan, tahun, query, req_identity) => {
    LOGGER(logType.INFO, "Start getReportStokAwalBahanBakusService", {
        bulan,
        tahun
    }, req_identity)

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

    const stokAwalBahanBakus = await getReportStokAwalBahanBakusRepo(pageNumber, size, search, bulan, tahun, req_identity)
    return generatePaginationResponse(stokAwalBahanBakus.entry, stokAwalBahanBakus.count, stokAwalBahanBakus.pageNumber, stokAwalBahanBakus.size)
}

export const getStokAwalBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBahanBakuByUuidService`, {
        uuid
    }, req_identity)
    const daftarGudangBahanBakus = await getStokAwalBahanBakuByUuidRepo(uuid, req_identity)
    return daftarGudangBahanBakus
}

export const getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidService`, {
        uuid
    }, req_identity)
    const riwayatBahanBaku = await getRiwayatTransaksiPenjualanByStokAwalBahanBakuUuidRepo(uuid, req_identity)
    return riwayatBahanBaku
}

export const getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidService`, {
        uuid
    }, req_identity)
    const riwayatBahanBaku = await getRiwayatTransaksiPembelianByStokAwalBahanBakuUuidRepo(uuid, req_identity)
    return riwayatBahanBaku
}

export const getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDService = async (kategori_harga_bahan_baku, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDService`, {
        kategori_harga_bahan_baku
    }, req_identity)
    const daftarGudangBahanBakus = await getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanBahanBakuUUIDRepo(kategori_harga_bahan_baku, null, null, req_identity)
    return daftarGudangBahanBakus
}

export const getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUIDService = async (kategori_harga_bahan_baku, pesanan_penjualan_or_pembelian_bahan_baku, type, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanOrPembelianBahanBakuUUIDService`, {
        kategori_harga_bahan_baku,
        pesanan_penjualan_or_pembelian_bahan_baku,
        type
    }, req_identity)
    const daftarGudangBahanBakus = await getDaftarGudangBahanBakuByKategoriHargaBahanBakuUUIDAndPesananPenjualanBahanBakuUUIDRepo(kategori_harga_bahan_baku, pesanan_penjualan_or_pembelian_bahan_baku, type, req_identity)
    return daftarGudangBahanBakus
}

export const getStokAwalBahanBakuByBahanBakuUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBahanBakuByBahanBakuUUIDService [${uuid}]`, null, req_identity)
    const stokAwalBahanBaku = await getStokAwalBahanBakuByBahanBakuUUIDRepo(uuid, req_identity)

    if (!stokAwalBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return stokAwalBahanBaku
}

export const createStokAwalBahanBakuService = async (stokAwalBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createStokAwalBahanBakuService`, stokAwalBahanBakuData, req_identity)
    stokAwalBahanBakuData.enabled = 1

    const stokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBaku = await getStokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBakuService(stokAwalBahanBakuData.daftar_gudang, stokAwalBahanBakuData.kategori_harga_bahan_baku, req_identity);

    if (stokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBaku.length > 0 && stokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBaku[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Data Sudah Ada",
            prop: "error"
        }))
    }

    const stokAwalBahanBaku = await createStokAwalBahanBakuRepo(stokAwalBahanBakuData, req_identity)
    return stokAwalBahanBaku
}

export const deleteStokAwalBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteStokAwalBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getStokAwalBahanBakuByUuidService(uuid, req_identity)

    await checkStokAwalBahanBakuAllowToEditService(beforeData.uuid, req_identity)

    await deleteStokAwalBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateStokAwalBahanBakuByUuidService = async (uuid, stokAwalBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStokAwalBahanBakuByUuidService [${uuid}]`, stokAwalBahanBakuData, req_identity)
    const beforeData = await getStokAwalBahanBakuByUuidService(uuid, req_identity)

    await checkStokAwalBahanBakuAllowToEditService(beforeData.uuid, req_identity)

    const stokAwalBahanBaku = await updateStokAwalBahanBakuByUuidRepo(uuid, stokAwalBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        stokAwalBahanBakuData
    }, req_identity)

    return stokAwalBahanBaku
}

export const checkStokAwalBahanBakuAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkStokAwalBahanBakuAllowToEditService`, { uuid }, req_identity)

    const daftarBahanBaku = await checkStokAwalBahanBakuAllowToEditRepo(uuid, req_identity)

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
    }
}

export const getStokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBakuService = async (daftar_gudang, kategori_harga_bahan_baku, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBakuService`, {
        daftar_gudang,
        kategori_harga_bahan_baku
    }, req_identity)

    return await getStokAwalBahanBakuByDaftarGudangDanKategoriHargaBahanBakuRepo(daftar_gudang, kategori_harga_bahan_baku, req_identity)
}