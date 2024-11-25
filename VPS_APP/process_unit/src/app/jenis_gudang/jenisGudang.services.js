import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkJenisGudangSudahDigunakanRepo, createJenisGudangRepo, deleteJenisGudangByUuidRepo, getAllJenisGudangRepo, getJenisGudangByUuidRepo, updateJenisGudangByUuidRepo } from "./jenisGudang.repository.js"

export const getAllJenisGudangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisGudangService", null, req_identity)

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
    
    const jenisGudangs = await getAllJenisGudangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisGudangs.entry, jenisGudangs.count, jenisGudangs.pageNumber, jenisGudangs.size)
}

export const getJenisGudangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisGudangByUuidService [${uuid}]`, null, req_identity)
    const jenisGudang = await getJenisGudangByUuidRepo(uuid, req_identity)

    if (!jenisGudang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return jenisGudang
}

export const createJenisGudangService = async (jenisGudangData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisGudangService`, jenisGudangData, req_identity)
    jenisGudangData.enabled = 1

    const jenisGudang = await createJenisGudangRepo(jenisGudangData, req_identity)
    return jenisGudang
}

export const deleteJenisGudangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisGudangByUuidService [${uuid}]`, null, req_identity)
    await getJenisGudangByUuidService(uuid, req_identity)
    
    await checkJenisGudangSudahDigunakanService(uuid, req_identity)
    
    await deleteJenisGudangByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisGudangByUuidService = async (uuid, jenisGudangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisGudangByUuidService [${uuid}]`, jenisGudangData, req_identity)
    const beforeData = await getJenisGudangByUuidService(uuid, req_identity)
    
    await checkJenisGudangSudahDigunakanService(uuid, req_identity)

    const jenisGudang = await updateJenisGudangByUuidRepo(uuid, jenisGudangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisGudangData
    }, req_identity)

    return jenisGudang
}

export const checkJenisGudangSudahDigunakanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkJenisGudangSudahDigunakanService`, {
        uuid
    }, req_identity)
    const JenisGudangGet = await checkJenisGudangSudahDigunakanRepo(uuid, req_identity)
    if (JenisGudangGet.length > 0 && JenisGudangGet[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Tidak Dapat Dieksekusi, Jenis Gudang Sudah Digunakan",
            prop: "error"
        }))
    }
}