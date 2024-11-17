import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkPersentasePenyusutanSudahDigunakanAsetDanDiValidasiRepo, createPersentasePenyusutanRepo, deletePersentasePenyusutanByUuidRepo, getAllPersentasePenyusutanRepo, getPersentasePenyusutanByUuidRepo, updatePersentasePenyusutanByUuidRepo } from "./persentasePenyusutan.repository.js"

export const getAllPersentasePenyusutanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPersentasePenyusutanService", null, req_identity)

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
    
    const persentasePenyusutans = await getAllPersentasePenyusutanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(persentasePenyusutans.entry, persentasePenyusutans.count, persentasePenyusutans.pageNumber, persentasePenyusutans.size)
}

export const getPersentasePenyusutanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPersentasePenyusutanByUuidService [${uuid}]`, null, req_identity)
    const persentasePenyusutan = await getPersentasePenyusutanByUuidRepo(uuid, req_identity)

    if (!persentasePenyusutan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return persentasePenyusutan
}

export const createPersentasePenyusutanService = async (persentasePenyusutanData, req_identity) => {
    LOGGER(logType.INFO, `Start createPersentasePenyusutanService`, persentasePenyusutanData, req_identity)
    persentasePenyusutanData.enabled = 1

    const persentasePenyusutan = await createPersentasePenyusutanRepo(persentasePenyusutanData, req_identity)
    return persentasePenyusutan
}

export const deletePersentasePenyusutanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePersentasePenyusutanByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getPersentasePenyusutanByUuidService(uuid, req_identity)

    await checkPersentasePenyusutanSudahDigunakanAsetDanDiValidasiService(beforeData.metode_penyusutan, beforeData.kelompok_aset, req_identity)

    await deletePersentasePenyusutanByUuidRepo(uuid, req_identity)
    return true
}

export const updatePersentasePenyusutanByUuidService = async (uuid, persentasePenyusutanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePersentasePenyusutanByUuidService [${uuid}]`, persentasePenyusutanData, req_identity)
    const beforeData = await getPersentasePenyusutanByUuidService(uuid, req_identity)

    await checkPersentasePenyusutanSudahDigunakanAsetDanDiValidasiService(beforeData.metode_penyusutan, beforeData.kelompok_aset, req_identity)

    const persentasePenyusutan = await updatePersentasePenyusutanByUuidRepo(uuid, persentasePenyusutanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        persentasePenyusutanData
    }, req_identity)

    return persentasePenyusutan
}

export const checkPersentasePenyusutanSudahDigunakanAsetDanDiValidasiService = async (metode_penyusutan, kelompok_aset, req_identity) => {
    LOGGER(logType.INFO, `Start checkPersentasePenyusutanSudahDigunakanAsetDanDiValidasiService`, {
        metode_penyusutan,
        kelompok_aset
    }, req_identity)

    const validasiStatus = await checkPersentasePenyusutanSudahDigunakanAsetDanDiValidasiRepo(metode_penyusutan, kelompok_aset, req_identity)

    console.log("VALIDASI STATUS", validasiStatus)

    if (validasiStatus.length > 0 && validasiStatus[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Tidak Dapat Dieksekusi, Persentase Penyusutan Sudah Digunakan Untuk Hitungan Penyusutan",
            prop: "error"
        }))
    }
}