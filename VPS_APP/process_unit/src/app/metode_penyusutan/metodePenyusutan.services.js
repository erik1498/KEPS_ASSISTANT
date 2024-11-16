import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkMetodePenyusutanSudahDigunakanRepo, createMetodePenyusutanRepo, deleteMetodePenyusutanByUuidRepo, getAllMetodePenyusutanRepo, getMetodePenyusutanByUuidRepo, updateMetodePenyusutanByUuidRepo } from "./metodePenyusutan.repository.js"

export const getAllMetodePenyusutanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllMetodePenyusutanService", null, req_identity)

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
    
    const metodePenyusutans = await getAllMetodePenyusutanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(metodePenyusutans.entry, metodePenyusutans.count, metodePenyusutans.pageNumber, metodePenyusutans.size)
}

export const getMetodePenyusutanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getMetodePenyusutanByUuidService [${uuid}]`, null, req_identity)
    const metodePenyusutan = await getMetodePenyusutanByUuidRepo(uuid, req_identity)

    if (!metodePenyusutan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return metodePenyusutan
}

export const createMetodePenyusutanService = async (metodePenyusutanData, req_identity) => {
    LOGGER(logType.INFO, `Start createMetodePenyusutanService`, metodePenyusutanData, req_identity)
    metodePenyusutanData.enabled = 1

    const metodePenyusutan = await createMetodePenyusutanRepo(metodePenyusutanData, req_identity)
    return metodePenyusutan
}

export const deleteMetodePenyusutanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteMetodePenyusutanByUuidService [${uuid}]`, null, req_identity)
    await getMetodePenyusutanByUuidService(uuid, req_identity)

    await checkMetodePenyusutanSudahDigunakanService(uuid, req_identity)
    
    await deleteMetodePenyusutanByUuidRepo(uuid, req_identity)
    return true
}

export const checkMetodePenyusutanSudahDigunakanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkMetodePenyusutanSudahDigunakanService`, {
        uuid
    }, req_identity)
    const metodePenyusutanGet = await checkMetodePenyusutanSudahDigunakanRepo(uuid, req_identity)
    if (metodePenyusutanGet.length > 0 && metodePenyusutanGet[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Tidak Dapat Dieksekusi, Metode Penyusutan Sudah Digunakan",
            prop: "error"
        }))
    }
}

export const updateMetodePenyusutanByUuidService = async (uuid, metodePenyusutanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateMetodePenyusutanByUuidService [${uuid}]`, metodePenyusutanData, req_identity)
    const beforeData = await getMetodePenyusutanByUuidService(uuid, req_identity)
    const metodePenyusutan = await updateMetodePenyusutanByUuidRepo(uuid, metodePenyusutanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        metodePenyusutanData
    }, req_identity)

    return metodePenyusutan
}