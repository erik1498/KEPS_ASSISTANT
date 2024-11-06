import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkJenisPenjualanBarangAllowToEditRepo, createJenisPenjualanBarangRepo, deleteJenisPenjualanBarangByUuidRepo, getAllJenisPenjualanBarangRepo, getJenisPenjualanBarangByUuidRepo, updateJenisPenjualanBarangByUuidRepo } from "./jenisPenjualanBarang.repository.js"

export const getAllJenisPenjualanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisPenjualanBarangService", null, req_identity)

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

    const jenisPenjualanBarangs = await getAllJenisPenjualanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisPenjualanBarangs.entry, jenisPenjualanBarangs.count, jenisPenjualanBarangs.pageNumber, jenisPenjualanBarangs.size)
}

export const getJenisPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisPenjualanBarangByUuidService [${uuid}]`, null, req_identity)
    const jenisPenjualanBarang = await getJenisPenjualanBarangByUuidRepo(uuid, req_identity)

    if (!jenisPenjualanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return jenisPenjualanBarang
}

export const createJenisPenjualanBarangService = async (jenisPenjualanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisPenjualanBarangService`, jenisPenjualanBarangData, req_identity)
    jenisPenjualanBarangData.enabled = 1

    const jenisPenjualanBarang = await createJenisPenjualanBarangRepo(jenisPenjualanBarangData, req_identity)
    return jenisPenjualanBarang
}

export const deleteJenisPenjualanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisPenjualanBarangByUuidService [${uuid}]`, null, req_identity)

    await checkJenisPenjualanBarangAllowToEditService(uuid, req_identity)

    await getJenisPenjualanBarangByUuidService(uuid, req_identity)
    await deleteJenisPenjualanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisPenjualanBarangByUuidService = async (uuid, jenisPenjualanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisPenjualanBarangByUuidService [${uuid}]`, jenisPenjualanBarangData, req_identity)
    const beforeData = await getJenisPenjualanBarangByUuidService(uuid, req_identity)
    const jenisPenjualanBarang = await updateJenisPenjualanBarangByUuidRepo(uuid, jenisPenjualanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisPenjualanBarangData
    }, req_identity)

    return jenisPenjualanBarang
}

export const checkJenisPenjualanBarangAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkJenisPenjualanBarangAllowToEditService`, {
        uuid
    }, req_identity)

    const daftarBarangUsed = await checkJenisPenjualanBarangAllowToEditRepo(uuid, req_identity)

    if (daftarBarangUsed.length > 0) {
        throw Error(JSON.stringify({
            message: `Jenis Penjualan Barang Sudah Terpakai Pada Barang ${daftarBarangUsed[0].name}`,
            prop: "error"
        }))
    }
}