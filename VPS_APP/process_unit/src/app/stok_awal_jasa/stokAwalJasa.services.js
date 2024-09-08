import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createStokAwalJasaRepo, deleteStokAwalJasaByUuidRepo, getAllStokAwalJasaRepo, getStokAwalJasaByJasaUUIDRepo, getStokAwalJasaByDaftarGudangDanKategoriHargaJasaRepo, updateStokAwalJasaByUuidRepo } from "./stokAwalJasa.repository.js"

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

export const getStokAwalJasaByJasaUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalJasaByJasaUUIDService [${uuid}]`, null, req_identity)
    const stokAwalJasa = await getStokAwalJasaByJasaUUIDRepo(uuid, req_identity)

    if (!stokAwalJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return stokAwalJasa
}

export const createStokAwalJasaService = async (stokAwalJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createStokAwalJasaService`, stokAwalJasaData, req_identity)
    stokAwalJasaData.enabled = 1

    const stokAwalJasaByDaftarGudangDanKategoriHargaJasa = await getStokAwalJasaByDaftarGudangDanKategoriHargaJasaService(stokAwalJasaData.daftar_gudang, stokAwalJasaData.kategori_harga_jasa, req_identity);

    if (stokAwalJasaByDaftarGudangDanKategoriHargaJasa.length > 0 && stokAwalJasaByDaftarGudangDanKategoriHargaJasa[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Data Sudah Ada",
            field: "error"
        }))
    }

    const stokAwalJasa = await createStokAwalJasaRepo(stokAwalJasaData, req_identity)
    return stokAwalJasa
}

export const deleteStokAwalJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteStokAwalJasaByUuidService [${uuid}]`, null, req_identity)
    await getStokAwalJasaByUuidService(uuid, req_identity)
    await deleteStokAwalJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateStokAwalJasaByUuidService = async (uuid, stokAwalJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStokAwalJasaByUuidService [${uuid}]`, stokAwalJasaData, req_identity)
    const beforeData = await getStokAwalJasaByUuidService(uuid, req_identity)
    const stokAwalJasa = await updateStokAwalJasaByUuidRepo(uuid, stokAwalJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        stokAwalJasaData
    }, req_identity)

    return stokAwalJasa
}

export const getStokAwalJasaByDaftarGudangDanKategoriHargaJasaService = async (daftar_gudang, kategori_harga_jasa, req_identity) => {
    LOGGER(logType.INFO, `Start getStokAwalJasaByDaftarGudangDanKategoriHargaJasaService`, {
        daftar_gudang,
        kategori_harga_jasa
    }, req_identity)

    return await getStokAwalJasaByDaftarGudangDanKategoriHargaJasaRepo(daftar_gudang, kategori_harga_jasa, req_identity)
}