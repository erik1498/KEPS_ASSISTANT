import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDivisiDipakaiPegawaiRepo, createDivisiRepo, deleteDivisiByUuidRepo, getAllDivisiRepo, getDivisiByUuidRepo, updateDivisiByUuidRepo } from "./divisi.repository.js"

export const getAllDivisiService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDivisiService", null, req_identity)

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

    const divisis = await getAllDivisiRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(divisis.entry, divisis.count, divisis.pageNumber, divisis.size)
}

export const getDivisiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDivisiByUuidService [${uuid}]`, null, req_identity)
    const divisi = await getDivisiByUuidRepo(uuid, req_identity)

    if (!divisi) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return divisi
}

export const createDivisiService = async (divisiData, req_identity) => {
    LOGGER(logType.INFO, `Start createDivisiService`, divisiData, req_identity)
    divisiData.enabled = 1

    const divisi = await createDivisiRepo(divisiData, req_identity)
    return divisi
}

export const deleteDivisiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDivisiByUuidService [${uuid}]`, null, req_identity)
    await getDivisiByUuidService(uuid, req_identity)
    await checkDivisiDipakaiPegawaiService(uuid, req_identity)
    await deleteDivisiByUuidRepo(uuid, req_identity)
    return true
}

export const updateDivisiByUuidService = async (uuid, divisiData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDivisiByUuidService [${uuid}]`, divisiData, req_identity)
    const beforeData = await getDivisiByUuidService(uuid, req_identity)

    await checkDivisiDipakaiPegawaiService(uuid, req_identity)
    const divisi = await updateDivisiByUuidRepo(uuid, divisiData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        divisiData
    }, req_identity)

    return divisi
}

export const checkDivisiDipakaiPegawaiService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkDivisiDipakaiPegawaiService`, { uuid }, req_identity)
    const pegawai = await checkDivisiDipakaiPegawaiRepo(uuid, req_identity)
    if (pegawai.length > 0) {
        throw Error(JSON.stringify({
            message: `Divisi Sudah Dipakai Oleh Pegawai ${pegawai[0].name} Dengan NIK ${pegawai[0].nik}`,
            prop: "error"
        }))
    }
}