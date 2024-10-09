import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { getTransaksiKasByUuidService } from "../transaksi_kas/transaksiKas.services.js"
import { createRincianTransaksiKasRepo, deleteRincianTransaksiKasByUuidRepo, getAllRincianTransaksiKasRepo, getRincianTransaksiKasByTransaksiKasUUIDRepo, getRincianTransaksiKasByUuidRepo, updateRincianTransaksiKasByUuidRepo } from "./rincianTransaksiKas.repository.js"

export const getAllRincianTransaksiKasService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianTransaksiKasService", null, req_identity)

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
    
    const rincianTransaksiKass = await getAllRincianTransaksiKasRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianTransaksiKass.entry, rincianTransaksiKass.count, rincianTransaksiKass.pageNumber, rincianTransaksiKass.size)
}

export const getRincianTransaksiKasByTransaksiKasUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransaksiKasByTransaksiKasUUIDService [${uuid}]`, null, req_identity)
    const rincianTransaksiKas = await getRincianTransaksiKasByTransaksiKasUUIDRepo(uuid, req_identity)
    return rincianTransaksiKas
}

export const getRincianTransaksiKasByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransaksiKasByUuidService [${uuid}]`, null, req_identity)
    const rincianTransaksiKas = await getRincianTransaksiKasByUuidRepo(uuid, req_identity)
    return rincianTransaksiKas
}

export const createRincianTransaksiKasService = async (rincianTransaksiKasData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianTransaksiKasService`, rincianTransaksiKasData, req_identity)
    rincianTransaksiKasData.enabled = 1
    
    await getNeracaValidasiByTanggalService(null, rincianTransaksiKasData.tanggal, req_identity)

    const rincianTransaksiKas = await createRincianTransaksiKasRepo(rincianTransaksiKasData, req_identity)
    return rincianTransaksiKas
}

export const deleteRincianTransaksiKasByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianTransaksiKasByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getRincianTransaksiKasByUuidService(uuid, req_identity)

    const transaksiKas = await getTransaksiKasByUuidService(beforeData.transaksi_kas, req_identity)
    
    await getNeracaValidasiByTanggalService(null, transaksiKas.tanggal, req_identity)

    await deleteRincianTransaksiKasByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianTransaksiKasByUuidService = async (uuid, rincianTransaksiKasData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianTransaksiKasByUuidService [${uuid}]`, rincianTransaksiKasData, req_identity)

    const transaksiKas = await getTransaksiKasByUuidService(rincianTransaksiKasData.transaksi_kas, req_identity)
    
    await getNeracaValidasiByTanggalService(null, transaksiKas.tanggal, req_identity)
    
    const beforeData = await getRincianTransaksiKasByUuidService(uuid, req_identity)
    const rincianTransaksiKas = await updateRincianTransaksiKasByUuidRepo(uuid, rincianTransaksiKasData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianTransaksiKasData
    }, req_identity)

    return rincianTransaksiKas
}