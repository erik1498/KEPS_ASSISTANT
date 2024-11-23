import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkJenisJasaAllowToEditRepo, createJenisJasaRepo, deleteJenisJasaByUuidRepo, getAllJenisJasaRepo, getJenisJasaByUuidRepo, updateJenisJasaByUuidRepo } from "./jenisJasa.repository.js"

export const getAllJenisJasaService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisJasaService", null, req_identity)

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

    const jenisJasas = await getAllJenisJasaRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisJasas.entry, jenisJasas.count, jenisJasas.pageNumber, jenisJasas.size)
}

export const getJenisJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisJasaByUuidService [${uuid}]`, null, req_identity)
    const jenisJasa = await getJenisJasaByUuidRepo(uuid, req_identity)

    if (!jenisJasa) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return jenisJasa
}

export const createJenisJasaService = async (jenisJasaData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisJasaService`, jenisJasaData, req_identity)
    jenisJasaData.enabled = 1

    const jenisJasa = await createJenisJasaRepo(jenisJasaData, req_identity)
    return jenisJasa
}

export const deleteJenisJasaByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisJasaByUuidService [${uuid}]`, null, req_identity)

    await checkJenisJasaAllowToEditService(uuid, req_identity)
    await getJenisJasaByUuidService(uuid, req_identity)
    await deleteJenisJasaByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisJasaByUuidService = async (uuid, jenisJasaData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisJasaByUuidService [${uuid}]`, jenisJasaData, req_identity)
    const beforeData = await getJenisJasaByUuidService(uuid, req_identity)
    const jenisJasa = await updateJenisJasaByUuidRepo(uuid, jenisJasaData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisJasaData
    }, req_identity)

    return jenisJasa
}

export const checkJenisJasaAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkJenisJasaAllowToEditService`, {
        uuid
    }, req_identity)

    const daftarJasaUsed = await checkJenisJasaAllowToEditRepo(uuid, req_identity)

    if (daftarJasaUsed.length > 0) {
        throw Error(JSON.stringify({
            message: `Jenis Jasa Sudah Terpakai Pada Jasa ${daftarJasaUsed[0].name}`,
            prop: "error"
        }))
    }
}