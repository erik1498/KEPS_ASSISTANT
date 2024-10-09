import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { getTransaksiBankByUuidService } from "../transaksi_bank/transaksiBank.services.js"
import { createRincianTransaksiBankRepo, deleteRincianTransaksiBankByUuidRepo, getAllRincianTransaksiBankRepo, getRincianTransaksiBankByTransaksiBankUUIDRepo, getRincianTransaksiBankByUuidRepo, updateRincianTransaksiBankByUuidRepo } from "./rincianTransaksiBank.repository.js"

export const getAllRincianTransaksiBankService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllRincianTransaksiBankService", null, req_identity)

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
    
    const rincianTransaksiBanks = await getAllRincianTransaksiBankRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(rincianTransaksiBanks.entry, rincianTransaksiBanks.count, rincianTransaksiBanks.pageNumber, rincianTransaksiBanks.size)
}

export const getRincianTransaksiBankByTransaksiBankUUIDService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransaksiBankByTransaksiBankUUIDService [${uuid}]`, null, req_identity)
    const rincianTransaksiBank = await getRincianTransaksiBankByTransaksiBankUUIDRepo(uuid, req_identity)
    return rincianTransaksiBank
}

export const getRincianTransaksiBankByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getRincianTransaksiBankByUuidService [${uuid}]`, null, req_identity)
    const rincianTransaksiBank = await getRincianTransaksiBankByUuidRepo(uuid, req_identity)
    return rincianTransaksiBank
}

export const createRincianTransaksiBankService = async (rincianTransaksiBankData, req_identity) => {
    LOGGER(logType.INFO, `Start createRincianTransaksiBankService`, rincianTransaksiBankData, req_identity)
    rincianTransaksiBankData.enabled = 1
    
    await getNeracaValidasiByTanggalService(null, rincianTransaksiBankData.tanggal, req_identity)

    const rincianTransaksiBank = await createRincianTransaksiBankRepo(rincianTransaksiBankData, req_identity)
    return rincianTransaksiBank
}

export const deleteRincianTransaksiBankByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteRincianTransaksiBankByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getRincianTransaksiBankByUuidService(uuid, req_identity)

    const transaksiBank = await getTransaksiBankByUuidService(beforeData.transaksi_bank, req_identity)
    
    await getNeracaValidasiByTanggalService(null, transaksiBank.tanggal, req_identity)

    await deleteRincianTransaksiBankByUuidRepo(uuid, req_identity)
    return true
}

export const updateRincianTransaksiBankByUuidService = async (uuid, rincianTransaksiBankData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateRincianTransaksiBankByUuidService [${uuid}]`, rincianTransaksiBankData, req_identity)

    const transaksiBank = await getTransaksiBankByUuidService(rincianTransaksiBankData.transaksi_bank, req_identity)
    
    await getNeracaValidasiByTanggalService(null, transaksiBank.tanggal, req_identity)
    
    const beforeData = await getRincianTransaksiBankByUuidService(uuid, req_identity)
    const rincianTransaksiBank = await updateRincianTransaksiBankByUuidRepo(uuid, rincianTransaksiBankData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        rincianTransaksiBankData
    }, req_identity)

    return rincianTransaksiBank
}