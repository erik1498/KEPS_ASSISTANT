import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkStatusTanggunganDipakaiPegawaiRepo, createStatusTanggunganRepo, deleteStatusTanggunganByUuidRepo, getAllStatusTanggunganRepo, getStatusTanggunganByUuidRepo, updateStatusTanggunganByUuidRepo } from "./statusTanggungan.repository.js"

export const getAllStatusTanggunganService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllStatusTanggunganService", null, req_identity)

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
    
    const statusTanggungans = await getAllStatusTanggunganRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(statusTanggungans.entry, statusTanggungans.count, statusTanggungans.pageNumber, statusTanggungans.size)
}

export const getStatusTanggunganByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStatusTanggunganByUuidService [${uuid}]`, null, req_identity)
    const statusTanggungan = await getStatusTanggunganByUuidRepo(uuid, req_identity)

    if (!statusTanggungan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return statusTanggungan
}

export const createStatusTanggunganService = async (statusTanggunganData, req_identity) => {
    LOGGER(logType.INFO, `Start createStatusTanggunganService`, statusTanggunganData, req_identity)
    statusTanggunganData.enabled = 1

    const statusTanggungan = await createStatusTanggunganRepo(statusTanggunganData, req_identity)
    return statusTanggungan
}

export const deleteStatusTanggunganByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteStatusTanggunganByUuidService [${uuid}]`, null, req_identity)
    await getStatusTanggunganByUuidService(uuid, req_identity)
    await checkStatusTanggunganDipakaiPegawaiService(uuid, req_identity)
    await deleteStatusTanggunganByUuidRepo(uuid, req_identity)
    return true
}

export const updateStatusTanggunganByUuidService = async (uuid, statusTanggunganData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateStatusTanggunganByUuidService [${uuid}]`, statusTanggunganData, req_identity)
    const beforeData = await getStatusTanggunganByUuidService(uuid, req_identity)
    await checkStatusTanggunganDipakaiPegawaiService(uuid, req_identity)
    const statusTanggungan = await updateStatusTanggunganByUuidRepo(uuid, statusTanggunganData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        statusTanggunganData
    }, req_identity)

    return statusTanggungan
}

export const checkStatusTanggunganDipakaiPegawaiService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkStatusTanggunganDipakaiPegawaiService`, { uuid }, req_identity)
    const pegawai = await checkStatusTanggunganDipakaiPegawaiRepo(uuid, req_identity)
    if (pegawai.length > 0) {
        throw Error(JSON.stringify({
            message: `Status Tanggungan Sudah Dipakai Oleh Pegawai ${pegawai[0].name} Dengan NIK ${pegawai[0].nik}`,
            field: "error"
        }))
    }
}