import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkKategoriJasaAllowToEditRepo, createKategoriJasaRepo, deleteKategoriJasaByUuidRepo, getAllKategoriJasaRepo, getKategoriJasaByUuidRepo, updateKategoriJasaByUuidRepo } from "./kategoriJasa.repository.js"

export const getAllKategoriJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriJasaService", null, req_identity)

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

    const kategoriJasas = await getAllKategoriJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriJasas.entry, kategoriJasas.count, kategoriJasas.pageNumber, kategoriJasas.size)
}

export const getKategoriJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriJasaByUuidService [${uuid}]`, null, req_identity)
    const kategoriJasa = await getKategoriJasaByUuidRepo(uuid, req_identity)

    if (!kategoriJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kategoriJasa
}

export const createKategoriJasaService = async (kategoriJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriJasaService`, kategoriJasaData, req_identity)
    kategoriJasaData.enabled = 1

    const kategoriJasa = await createKategoriJasaRepo(kategoriJasaData, req_identity)
    return kategoriJasa
}

export const deleteKategoriJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriJasaByUuidService [${uuid}]`, null, req_identity)

    await checkKategoriJasaAllowToEditService(uuid, req_identity)
    
    await getKategoriJasaByUuidService(uuid, req_identity)
    await deleteKategoriJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriJasaByUuidService = async (uuid, kategoriJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriJasaByUuidService [${uuid}]`, kategoriJasaData, req_identity)
    const beforeData = await getKategoriJasaByUuidService(uuid, req_identity)
    const kategoriJasa = await updateKategoriJasaByUuidRepo(uuid, kategoriJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriJasaData
    }, req_identity)

    return kategoriJasa
}

export const checkKategoriJasaAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkKategoriJasaAllowToEditService`, {
        uuid
    }, req_identity)

    const daftarJasaUsed = await checkKategoriJasaAllowToEditRepo(uuid, req_identity)

    if (daftarJasaUsed.length > 0) {
        throw Error(JSON.stringify({
            message: `Kategori Jasa Sudah Terpakai Pada Jasa ${daftarJasaUsed[0].name}`,
            prop: "error"
        }))
    }
}