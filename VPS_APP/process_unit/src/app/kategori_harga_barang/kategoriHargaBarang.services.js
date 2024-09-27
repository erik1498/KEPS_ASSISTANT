import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKategoriHargaBarangRepo, deleteKategoriHargaBarangByUuidRepo, getAllKategoriHargaBarangRepo, getKategoriHargaBarangByKodeBarangRepo, getKategoriHargaBarangByUuidRepo, updateKategoriHargaBarangByUuidRepo } from "./kategoriHargaBarang.repository.js"

export const getAllKategoriHargaBarangService = async (daftar_barang, query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaBarangService", null, req_identity)

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
    
    const kategoriHargaBarangs = await getAllKategoriHargaBarangRepo(daftar_barang, pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriHargaBarangs.entry, kategoriHargaBarangs.count, kategoriHargaBarangs.pageNumber, kategoriHargaBarangs.size)
}

export const getKategoriHargaBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriHargaBarangByUuidService [${uuid}]`, null, req_identity)
    const kategoriHargaBarang = await getKategoriHargaBarangByUuidRepo(uuid, req_identity)

    if (!kategoriHargaBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return kategoriHargaBarang
}

export const createKategoriHargaBarangService = async (kategoriHargaBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriHargaBarangService`, kategoriHargaBarangData, req_identity)
    await checkKategoriHargaBarangByKodeBarangService(kategoriHargaBarangData.kode_barang, req_identity)
    kategoriHargaBarangData.enabled = 1

    const kategoriHargaBarang = await createKategoriHargaBarangRepo(kategoriHargaBarangData, req_identity)
    return kategoriHargaBarang
}

export const deleteKategoriHargaBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriHargaBarangByUuidService [${uuid}]`, null, req_identity)
    await getKategoriHargaBarangByUuidService(uuid, req_identity)
    await deleteKategoriHargaBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriHargaBarangByUuidService = async (uuid, kategoriHargaBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriHargaBarangByUuidService [${uuid}]`, kategoriHargaBarangData, req_identity)
    await checkKategoriHargaBarangByKodeBarangService(kategoriHargaBarangData.kode_barang, req_identity)
    const beforeData = await getKategoriHargaBarangByUuidService(uuid, req_identity)
    const kategoriHargaBarang = await updateKategoriHargaBarangByUuidRepo(uuid, kategoriHargaBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriHargaBarangData
    }, req_identity)

    return kategoriHargaBarang
}

export const checkKategoriHargaBarangByKodeBarangService = async (kode_barang, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriHargaBarangByUuidService`, {
        kode_barang
    }, req_identity)
    
    const kategoriHargaBarang = await getKategoriHargaBarangByKodeBarangRepo(kode_barang, req_identity)

    if (kategoriHargaBarang) {
        throw Error(JSON.stringify({
            message: "Kode Barang Sudah Terdaftar",
            field: "error"
        }))
    }
    return
}