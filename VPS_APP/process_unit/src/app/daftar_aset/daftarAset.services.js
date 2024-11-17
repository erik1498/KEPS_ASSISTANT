import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { checkAsetSudahValidasiByUuidRepo, createDaftarAsetRepo, deleteDaftarAsetByUuidRepo, getAllDaftarAsetRepo, getDaftarAsetByUuidRepo, getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanRepo, updateDaftarAsetByUuidRepo } from "./daftarAset.repository.js"

export const getAllDaftarAsetService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllDaftarAsetService", null, req_identity)

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

    const daftarAsets = await getAllDaftarAsetRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(daftarAsets.entry, daftarAsets.count, daftarAsets.pageNumber, daftarAsets.size)
}

export const getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanService [${uuid}]`, null, req_identity)
    const daftarAset = await getDaftarAsetByUuidWithKelompokAsetAndPersentasePenyusutanRepo(uuid, req_identity)

    if (!daftarAset) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return daftarAset[0]
}

export const getDaftarAsetByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarAsetByUuidService [${uuid}]`, null, req_identity)
    const daftarAset = await getDaftarAsetByUuidRepo(uuid, req_identity)

    if (!daftarAset) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return daftarAset
}

export const createDaftarAsetService = async (daftarAsetData, req_identity) => {
    LOGGER(logType.INFO, `Start createDaftarAsetService`, daftarAsetData, req_identity)
    daftarAsetData.enabled = 1

    await getNeracaValidasiByTanggalService(null, daftarAsetData.tanggal_beli, req_identity)

    const daftarAset = await createDaftarAsetRepo(daftarAsetData, req_identity)
    return daftarAset
}

export const deleteDaftarAsetByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteDaftarAsetByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getDaftarAsetByUuidService(uuid, req_identity)
    
    await checkAsetSudahValidasiByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal_beli, req_identity)

    await deleteDaftarAsetByUuidRepo(uuid, req_identity)
    return true
}

export const updateDaftarAsetByUuidService = async (uuid, daftarAsetData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateDaftarAsetByUuidService [${uuid}]`, daftarAsetData, req_identity)
    const beforeData = await getDaftarAsetByUuidService(uuid, req_identity)

    await checkAsetSudahValidasiByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal_beli, req_identity)

    const daftarAset = await updateDaftarAsetByUuidRepo(uuid, daftarAsetData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        daftarAsetData
    }, req_identity)

    return daftarAset
}

export const checkAsetSudahValidasiByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkAsetSudahValidasiByUuidService`, {
        uuid
    }, req_identity)
    const validasiStatus = await checkAsetSudahValidasiByUuidRepo(uuid, req_identity)

    if (validasiStatus.length > 0 && validasiStatus[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Tidak Dapat Dieksekusi, Hitungan Penyusutan Aset Sudah Divalidasi",
            prop: "error"
        }))
    }
}