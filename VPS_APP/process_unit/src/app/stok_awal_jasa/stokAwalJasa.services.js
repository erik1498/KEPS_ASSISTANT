import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDaftarJasaAllowToEditService } from "../daftar_jasa/daftarJasa.services.js"
import { checkStokAwalJasaAllowToEditRepo, createStokAwalJasaRepo, deleteStokAwalJasaByUuidRepo, getAllStokAwalJasaRepo, getRiwayatTransaksiPembelianByStokAwalJasaUuidRepo, getRiwayatTransaksiPenjualanByStokAwalJasaUuidRepo, getStokAwalJasaByJasaUUIDRepo, getStokAwalJasaByDaftarCabangDanKategoriHargaJasaRepo, getStokAwalJasaByUuidRepo, updateStokAwalJasaByUuidRepo, getDaftarCabangByKategoriHargaJasaUUIDRepo } from "./stokAwalJasa.repository.js"

export const getAllStokAwalJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllStokAwalJasaService", null, req_identity)

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

    const stokAwalJasas = await getAllStokAwalJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(stokAwalJasas.entry, stokAwalJasas.count, stokAwalJasas.pageNumber, stokAwalJasas.size)
}

export const getStokAwalJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalJasaByUuidService`, {
        uuid
    }, req_identity)
    const daftarCabangJasas = await getStokAwalJasaByUuidRepo(uuid, req_identity)
    return daftarCabangJasas
}

export const getRiwayatTransaksiPenjualanByStokAwalJasaUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPenjualanByStokAwalJasaUuidService`, {
        uuid
    }, req_identity)
    const riwayatJasa = await getRiwayatTransaksiPenjualanByStokAwalJasaUuidRepo(uuid, req_identity)
    return riwayatJasa
}

export const getRiwayatTransaksiPembelianByStokAwalJasaUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRiwayatTransaksiPembelianByStokAwalJasaUuidService`, {
        uuid
    }, req_identity)
    const riwayatJasa = await getRiwayatTransaksiPembelianByStokAwalJasaUuidRepo(uuid, req_identity)
    return riwayatJasa
}

export const getDaftarCabangByKategoriHargaJasaUUIDService = async (kategori_harga_jasa_uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarCabangByKategoriHargaJasaUUIDService`, {
        kategori_harga_jasa_uuid
    }, req_identity)
    const daftarCabangJasas = await getDaftarCabangByKategoriHargaJasaUUIDRepo(kategori_harga_jasa_uuid, req_identity)
    return daftarCabangJasas
}

export const getStokAwalJasaByJasaUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalJasaByJasaUUIDService [${uuid}]`, null, req_identity)
    const stokAwalJasa = await getStokAwalJasaByJasaUUIDRepo(uuid, req_identity)

    if (!stokAwalJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return stokAwalJasa
}

export const createStokAwalJasaService = async (stokAwalJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createStokAwalJasaService`, stokAwalJasaData, req_identity)
    stokAwalJasaData.enabled = 1

    const stokAwalJasaByDaftarCabangDanKategoriHargaJasa = await getStokAwalJasaByDaftarCabangDanKategoriHargaJasaService(stokAwalJasaData.cabang, stokAwalJasaData.kategori_harga_jasa, req_identity);

    if (stokAwalJasaByDaftarCabangDanKategoriHargaJasa.length > 0 && stokAwalJasaByDaftarCabangDanKategoriHargaJasa[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Data Sudah Ada",
            prop: "error"
        }))
    }

    const stokAwalJasa = await createStokAwalJasaRepo(stokAwalJasaData, req_identity)
    return stokAwalJasa
}

export const deleteStokAwalJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteStokAwalJasaByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getStokAwalJasaByUuidService(uuid, req_identity)

    await checkStokAwalJasaAllowToEditService(beforeData.uuid, req_identity)

    await deleteStokAwalJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateStokAwalJasaByUuidService = async (uuid, stokAwalJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStokAwalJasaByUuidService [${uuid}]`, stokAwalJasaData, req_identity)
    const beforeData = await getStokAwalJasaByUuidService(uuid, req_identity)

    await checkStokAwalJasaAllowToEditService(beforeData.uuid, req_identity)

    const stokAwalJasa = await updateStokAwalJasaByUuidRepo(uuid, stokAwalJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        stokAwalJasaData
    }, req_identity)

    return stokAwalJasa
}

export const checkStokAwalJasaAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkStokAwalJasaAllowToEditService`, { uuid }, req_identity)

    const daftarJasa = await checkStokAwalJasaAllowToEditRepo(uuid, req_identity)

    if (daftarJasa.length > 0) {
        if (daftarJasa[0].pesanan_penjualan_jasa) {
            const data = JSON.parse(daftarJasa[0].pesanan_penjualan_jasa)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Jasa Sudah Digunakan Pada Pesanan Penjualan Jasa ${data.nomor_pesanan_penjualan_jasa} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
    }
}

export const getStokAwalJasaByDaftarCabangDanKategoriHargaJasaService = async (cabang, kategori_harga_jasa, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalJasaByDaftarCabangDanKategoriHargaJasaService`, {
        cabang,
        kategori_harga_jasa
    }, req_identity)

    return await getStokAwalJasaByDaftarCabangDanKategoriHargaJasaRepo(cabang, kategori_harga_jasa, req_identity)
}