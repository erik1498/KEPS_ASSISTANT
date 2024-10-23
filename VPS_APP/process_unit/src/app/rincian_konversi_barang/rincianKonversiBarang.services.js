import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianKonversiBarangRepo, deleteRincianKonversiBarangByUuidRepo, getAllRincianKonversiBarangRepo, getRincianKonversiBarangByKonversiBarangUuidRepo, getRincianKonversiBarangByUuidRepo, updateRincianKonversiBarangByUuidRepo } from "./rincianKonversiBarang.repository.js"

export const getAllRincianKonversiBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianKonversiBarangService", null, req_identity)

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

    const rincianKonversiBarangs = await getAllRincianKonversiBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianKonversiBarangs.entry, rincianKonversiBarangs.count, rincianKonversiBarangs.pageNumber, rincianKonversiBarangs.size)
}

export const getRincianKonversiBarangByKonversiBarangUuidService = async (konversi_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianKonversiBarangByKonversiBarangUuidService`, { konversi_barang }, req_identity)
    const rincianKonversiBarang = await getRincianKonversiBarangByKonversiBarangUuidRepo(konversi_barang, req_identity)
    return rincianKonversiBarang
}

export const getRincianKonversiBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianKonversiBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianKonversiBarang = await getRincianKonversiBarangByUuidRepo(uuid, req_identity)

    if (!rincianKonversiBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianKonversiBarang
}

export const createRincianKonversiBarangService = async (rincianKonversiBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianKonversiBarangService`, rincianKonversiBarangData, req_identity)
    rincianKonversiBarangData.enabled = 1

    const rincianKonversiBarang = await createRincianKonversiBarangRepo(rincianKonversiBarangData, req_identity)
    return rincianKonversiBarang
}

export const deleteRincianKonversiBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianKonversiBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianKonversiBarangByUuidService(uuid, req_identity)
    await deleteRincianKonversiBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianKonversiBarangByUuidService = async (uuid, rincianKonversiBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianKonversiBarangByUuidService [${uuid}]`, rincianKonversiBarangData, req_identity)
    const beforeData = await getRincianKonversiBarangByUuidService(uuid, req_identity)
    const rincianKonversiBarang = await updateRincianKonversiBarangByUuidRepo(uuid, rincianKonversiBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianKonversiBarangData
    }, req_identity)

    return rincianKonversiBarang
}