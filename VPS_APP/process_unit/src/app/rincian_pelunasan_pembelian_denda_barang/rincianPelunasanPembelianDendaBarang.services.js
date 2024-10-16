import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createRincianPelunasanPembelianDendaBarangRepo, deleteRincianPelunasanPembelianDendaBarangByUuidRepo, getAllRincianPelunasanPembelianDendaBarangRepo, getAllRincianPesananPembelianDendaBarangByPelunasanPembelianRepo, getRincianPelunasanPembelianDendaBarangByUuidRepo, updateRincianPelunasanPembelianDendaBarangByUuidRepo } from "./rincianPelunasanPembelianDendaBarang.repository.js"

export const getAllRincianPelunasanPembelianDendaBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPembelianDendaBarangService", null, req_identity)

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

    const rincianPelunasanPembelianDendaBarangs = await getAllRincianPelunasanPembelianDendaBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianPelunasanPembelianDendaBarangs.entry, rincianPelunasanPembelianDendaBarangs.count, rincianPelunasanPembelianDendaBarangs.pageNumber, rincianPelunasanPembelianDendaBarangs.size)
}

export const getAllRincianPesananPembelianDendaBarangByPelunasanPembelianService = async (uuid, denda_status, req_identity) => {
    LOGGER(logType.INFO, `Start getAllRincianPesananPembelianDendaBarangByPelunasanPembelianService [${uuid}]`, { denda_status }, req_identity)
    const rincianPesananPembelianBarang = await getAllRincianPesananPembelianDendaBarangByPelunasanPembelianRepo(uuid, denda_status, req_identity)
    return rincianPesananPembelianBarang
}

export const getRincianPelunasanPembelianDendaBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianPelunasanPembelianDendaBarangByUuidService [${uuid}]`, null, req_identity)
    const rincianPelunasanPembelianDendaBarang = await getRincianPelunasanPembelianDendaBarangByUuidRepo(uuid, req_identity)

    if (!rincianPelunasanPembelianDendaBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return rincianPelunasanPembelianDendaBarang
}

export const createRincianPelunasanPembelianDendaBarangService = async (rincianPelunasanPembelianDendaBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianPelunasanPembelianDendaBarangService`, rincianPelunasanPembelianDendaBarangData, req_identity)
    rincianPelunasanPembelianDendaBarangData.enabled = 1

    const rincianPelunasanPembelianDendaBarang = await createRincianPelunasanPembelianDendaBarangRepo(rincianPelunasanPembelianDendaBarangData, req_identity)
    return rincianPelunasanPembelianDendaBarang
}

export const deleteRincianPelunasanPembelianDendaBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianPelunasanPembelianDendaBarangByUuidService [${uuid}]`, null, req_identity)
    await getRincianPelunasanPembelianDendaBarangByUuidService(uuid, req_identity)
    await deleteRincianPelunasanPembelianDendaBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianPelunasanPembelianDendaBarangByUuidService = async (uuid, rincianPelunasanPembelianDendaBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianPelunasanPembelianDendaBarangByUuidService [${uuid}]`, rincianPelunasanPembelianDendaBarangData, req_identity)
    const beforeData = await getRincianPelunasanPembelianDendaBarangByUuidService(uuid, req_identity)
    const rincianPelunasanPembelianDendaBarang = await updateRincianPelunasanPembelianDendaBarangByUuidRepo(uuid, rincianPelunasanPembelianDendaBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianPelunasanPembelianDendaBarangData
    }, req_identity)

    return rincianPelunasanPembelianDendaBarang
}