import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkKelompokAsetSudahDigunakanRepo, createKelompokAsetRepo, deleteKelompokAsetByUuidRepo, getAllKelompokAsetRepo, getKelompokAsetByUuidRepo, updateKelompokAsetByUuidRepo } from "./kelompokAset.repository.js"

export const getAllKelompokAsetService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKelompokAsetService", null, req_identity)

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
    
    const kelompokAsets = await getAllKelompokAsetRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kelompokAsets.entry, kelompokAsets.count, kelompokAsets.pageNumber, kelompokAsets.size)
}

export const getKelompokAsetByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKelompokAsetByUuidService [${uuid}]`, null, req_identity)
    const kelompokAset = await getKelompokAsetByUuidRepo(uuid, req_identity)

    if (!kelompokAset) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kelompokAset
}

export const createKelompokAsetService = async (kelompokAsetData, req_identity) => {
    LOGGER(logType.INFO, `Start createKelompokAsetService`, kelompokAsetData, req_identity)
    kelompokAsetData.enabled = 1

    const kelompokAset = await createKelompokAsetRepo(kelompokAsetData, req_identity)
    return kelompokAset
}

export const deleteKelompokAsetByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKelompokAsetByUuidService [${uuid}]`, null, req_identity)
    await getKelompokAsetByUuidService(uuid, req_identity)

    await checkKelompokAsetSudahDigunakanService(uuid, req_identity)

    await deleteKelompokAsetByUuidRepo(uuid, req_identity)
    return true
}

export const checkKelompokAsetSudahDigunakanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkKelompokAsetSudahDigunakanService`, {
        uuid
    }, req_identity)
    const kategoriAsetGet = await checkKelompokAsetSudahDigunakanRepo(uuid, req_identity)
    if (kategoriAsetGet.length > 0 && kategoriAsetGet[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Tidak Dapat Dieksekusi, Kategori Aset Sudah Digunakan",
            prop: "error"
        }))
    }
}

export const updateKelompokAsetByUuidService = async (uuid, kelompokAsetData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKelompokAsetByUuidService [${uuid}]`, kelompokAsetData, req_identity)
    const beforeData = await getKelompokAsetByUuidService(uuid, req_identity)
    const kelompokAset = await updateKelompokAsetByUuidRepo(uuid, kelompokAsetData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kelompokAsetData
    }, req_identity)

    return kelompokAset
}