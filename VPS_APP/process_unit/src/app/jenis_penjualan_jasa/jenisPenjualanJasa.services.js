import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createJenisPenjualanJasaRepo, deleteJenisPenjualanJasaByUuidRepo, getAllJenisPenjualanJasaRepo, getJenisPenjualanJasaByUuidRepo, updateJenisPenjualanJasaByUuidRepo } from "./jenisPenjualanJasa.repository.js"

export const getAllJenisPenjualanJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisPenjualanJasaService", null, req_identity)

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
    
    const jenisPenjualanJasas = await getAllJenisPenjualanJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisPenjualanJasas.entry, jenisPenjualanJasas.count, jenisPenjualanJasas.pageNumber, jenisPenjualanJasas.size)
}

export const getJenisPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    const jenisPenjualanJasa = await getJenisPenjualanJasaByUuidRepo(uuid, req_identity)

    if (!jenisPenjualanJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return jenisPenjualanJasa
}

export const createJenisPenjualanJasaService = async (jenisPenjualanJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisPenjualanJasaService`, jenisPenjualanJasaData, req_identity)
    jenisPenjualanJasaData.enabled = 1

    const jenisPenjualanJasa = await createJenisPenjualanJasaRepo(jenisPenjualanJasaData, req_identity)
    return jenisPenjualanJasa
}

export const deleteJenisPenjualanJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisPenjualanJasaByUuidService [${uuid}]`, null, req_identity)
    await getJenisPenjualanJasaByUuidService(uuid, req_identity)
    await deleteJenisPenjualanJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisPenjualanJasaByUuidService = async (uuid, jenisPenjualanJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisPenjualanJasaByUuidService [${uuid}]`, jenisPenjualanJasaData, req_identity)
    const beforeData = await getJenisPenjualanJasaByUuidService(uuid, req_identity)
    const jenisPenjualanJasa = await updateJenisPenjualanJasaByUuidRepo(uuid, jenisPenjualanJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisPenjualanJasaData
    }, req_identity)

    return jenisPenjualanJasa
}