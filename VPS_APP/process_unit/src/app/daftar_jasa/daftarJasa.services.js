import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDaftarJasaAllowToEditRepo, createDaftarJasaRepo, deleteDaftarJasaByUuidRepo, getAllDaftarJasaRepo, getAllDaftarJasasAktifByDaftarGudangRepo, getAllDaftarJasaUntukTransaksiRepo, getDaftarJasaByUuidRepo, updateDaftarJasaByUuidRepo } from "./daftarJasa.repository.js"

export const getAllDaftarJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarJasaService", null, req_identity)

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

    const daftarJasas = await getAllDaftarJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(daftarJasas.entry, daftarJasas.count, daftarJasas.pageNumber, daftarJasas.size)
}

export const getAllDaftarJasasAktifByDaftarGudangService = async (daftar_gudang, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarJasasAktifByDaftarGudangService", {
        daftar_gudang
    }, req_identity)
    const daftarJasas = await getAllDaftarJasasAktifByDaftarGudangRepo(daftar_gudang, req_identity)
    return daftarJasas
}

export const getAllDaftarJasaUntukTransaksiService = async (req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarJasaUntukTransaksiService", null, req_identity)
    const daftarJasas = await getAllDaftarJasaUntukTransaksiRepo(req_identity)
    return daftarJasas
}

export const getDaftarJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarJasaByUuidService [${uuid}]`, null, req_identity)
    const daftarJasa = await getDaftarJasaByUuidRepo(uuid, req_identity)

    if (!daftarJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return daftarJasa
}

export const createDaftarJasaService = async (daftarJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createDaftarJasaService`, daftarJasaData, req_identity)
    daftarJasaData.enabled = 1
    daftarJasaData.status = 1

    const daftarJasa = await createDaftarJasaRepo(daftarJasaData, req_identity)
    return daftarJasa
}

export const deleteDaftarJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDaftarJasaByUuidService [${uuid}]`, null, req_identity)

    await checkDaftarJasaAllowToEditService(false, uuid, req_identity)

    await getDaftarJasaByUuidService(uuid, req_identity)
    await deleteDaftarJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarJasaByUuidService = async (uuid, daftarJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarJasaByUuidService [${uuid}]`, daftarJasaData, req_identity)

    await checkDaftarJasaAllowToEditService(false, uuid, req_identity)

    const beforeData = await getDaftarJasaByUuidService(uuid, req_identity)

    const daftarJasa = await updateDaftarJasaByUuidRepo(uuid, daftarJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarJasaData
    }, req_identity)

    return daftarJasa
}

export const checkDaftarJasaAllowToEditService = async (by_kategori_harga_jasa, uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkDaftarJasaAllowToEditService`, {
        by_kategori_harga_jasa,
        uuid
    }, req_identity)
    const daftarJasa = await checkDaftarJasaAllowToEditRepo(by_kategori_harga_jasa, uuid, req_identity)

    if (daftarJasa.length > 0) {

        if (daftarJasa[0].pesanan_penjualan_jasa) {
            const data = JSON.parse(daftarJasa[0].pesanan_penjualan_jasa)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Jasa Sudah Digunakan Pada Pesanan Penjualan Jasa ${data.nomor_pesanan_penjualan_jasa} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarJasa[0].pesanan_pembelian_jasa) {
            const data = JSON.parse(daftarJasa[0].pesanan_pembelian_jasa)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Jasa Sudah Digunakan Pada Pesanan Pembelian Jasa ${data.nomor_pesanan_pembelian_jasa} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarJasa[0].transfer_jasa) {
            const data = JSON.parse(daftarJasa[0].transfer_jasa)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Jasa Sudah Digunakan Pada Transfer Jasa ${data.kode_transfer_jasa} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }
        if (daftarJasa[0].konversi_jasa) {
            const data = JSON.parse(daftarJasa[0].konversi_jasa)
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Jasa Sudah Digunakan Pada Konversi Jasa ${data.kode_konversi_jasa} Pada Tanggal ${formatDate(data.tanggal)}`,
                prop: "error"
            }))
        }

        if (by_kategori_harga_jasa) {
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Kategori Harga Jasa Sudah Terpakai Di Stok Awal Jasa`,
                prop: "error"
            }))
        }
    }

    return
}