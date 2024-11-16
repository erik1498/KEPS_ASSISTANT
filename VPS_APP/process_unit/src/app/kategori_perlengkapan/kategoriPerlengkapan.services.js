import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkKategoriPerlengkapanSudahDigunakanRepo, createKategoriPerlengkapanRepo, deleteKategoriPerlengkapanByUuidRepo, getAllKategoriPerlengkapanRepo, getKategoriPerlengkapanByUuidRepo, updateKategoriPerlengkapanByUuidRepo } from "./kategoriPerlengkapan.repository.js"

export const getAllKategoriPerlengkapanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriPerlengkapanService", null, req_identity)

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
    
    const kategoriPerlengkapans = await getAllKategoriPerlengkapanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriPerlengkapans.entry, kategoriPerlengkapans.count, kategoriPerlengkapans.pageNumber, kategoriPerlengkapans.size)
}

export const getKategoriPerlengkapanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriPerlengkapanByUuidService [${uuid}]`, null, req_identity)
    const kategoriPerlengkapan = await getKategoriPerlengkapanByUuidRepo(uuid, req_identity)

    if (!kategoriPerlengkapan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kategoriPerlengkapan
}

export const createKategoriPerlengkapanService = async (kategoriPerlengkapanData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriPerlengkapanService`, kategoriPerlengkapanData, req_identity)
    kategoriPerlengkapanData.enabled = 1

    const kategoriPerlengkapan = await createKategoriPerlengkapanRepo(kategoriPerlengkapanData, req_identity)
    return kategoriPerlengkapan
}

export const deleteKategoriPerlengkapanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriPerlengkapanByUuidService [${uuid}]`, null, req_identity)
    await getKategoriPerlengkapanByUuidService(uuid, req_identity)

    await checkKategoriPerlengkapanSudahDigunakanService(uuid, req_identity)

    await deleteKategoriPerlengkapanByUuidRepo(uuid, req_identity)
    return true
}

export const checkKategoriPerlengkapanSudahDigunakanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkKategoriPerlengkapanSudahDigunakanService`, {
        uuid
    }, req_identity)
    const kategoriPerlengkapanGet = await checkKategoriPerlengkapanSudahDigunakanRepo(uuid, req_identity)
    if (kategoriPerlengkapanGet.length > 0 && kategoriPerlengkapanGet[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Tidak Dapat Dieksekusi, Kategori Perlengkapan Sudah Digunakan",
            prop: "error"
        }))
    }
}

export const updateKategoriPerlengkapanByUuidService = async (uuid, kategoriPerlengkapanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriPerlengkapanByUuidService [${uuid}]`, kategoriPerlengkapanData, req_identity)
    const beforeData = await getKategoriPerlengkapanByUuidService(uuid, req_identity)
    const kategoriPerlengkapan = await updateKategoriPerlengkapanByUuidRepo(uuid, kategoriPerlengkapanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriPerlengkapanData
    }, req_identity)

    return kategoriPerlengkapan
}