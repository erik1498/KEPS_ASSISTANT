import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createDaftarJasaRepo, deleteDaftarJasaByUuidRepo, getAllDaftarJasaRepo, getDaftarJasaByUuidRepo, updateDaftarJasaByUuidRepo } from "./daftarJasa.repository.js"

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
    await getDaftarJasaByUuidService(uuid, req_identity)
    await deleteDaftarJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarJasaByUuidService = async (uuid, daftarJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarJasaByUuidService [${uuid}]`, daftarJasaData, req_identity)
    const beforeData = await getDaftarJasaByUuidService(uuid, req_identity)
    const daftarJasa = await updateDaftarJasaByUuidRepo(uuid, daftarJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarJasaData
    }, req_identity)

    return daftarJasa
}