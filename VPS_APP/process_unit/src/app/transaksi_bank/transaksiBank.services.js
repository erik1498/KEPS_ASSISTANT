import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createTransaksiBankRepo, deleteTransaksiBankByUuidRepo, getAllTransaksiBankRepo, getTransaksiBankByUuidRepo, updateTransaksiBankByUuidRepo } from "./transaksiBank.repository.js"

export const getAllTransaksiBankService = async (bulan, tahun, query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTransaksiBankService", null, req_identity)

    bulan = parseFloat(bulan) < 10 ? `0${bulan}` : bulan

    let { search } = query
    search = search ? search : ""

    LOGGER(logType.INFO, "Pagination", {
        bulan,
        tahun,
        search
    }, req_identity)
    
    return await getAllTransaksiBankRepo(bulan, tahun, search, req_identity)
}

export const getTransaksiBankByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTransaksiBankByUuidService [${uuid}]`, null, req_identity)
    const transaksiBank = await getTransaksiBankByUuidRepo(uuid, req_identity)

    if (!transaksiBank) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return transaksiBank
}

export const createTransaksiBankService = async (transaksiBankData, req_identity) => {
    LOGGER(logType.INFO, `Start createTransaksiBankService`, transaksiBankData, req_identity)
    transaksiBankData.enabled = 1

    await getNeracaValidasiByTanggalService(transaksiBankData.tanggal, req_identity)

    const transaksiBank = await createTransaksiBankRepo(transaksiBankData, req_identity)
    return transaksiBank
}

export const deleteTransaksiBankByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTransaksiBankByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getTransaksiBankByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    await deleteTransaksiBankByUuidRepo(uuid, req_identity)
    return true
}

export const updateTransaksiBankByUuidService = async (uuid, transaksiBankData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTransaksiBankByUuidService [${uuid}]`, transaksiBankData, req_identity)
    const beforeData = await getTransaksiBankByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    const transaksiBank = await updateTransaksiBankByUuidRepo(uuid, transaksiBankData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        transaksiBankData
    }, req_identity)

    return transaksiBank
}