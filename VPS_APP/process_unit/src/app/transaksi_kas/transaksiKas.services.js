import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { createTransaksiKasRepo, deleteTransaksiKasByUuidRepo, getAllTransaksiKasRepo, getTransaksiKasByUuidRepo, updateTransaksiKasByUuidRepo } from "./transaksiKas.repository.js"

export const getAllTransaksiKasService = async (bulan, tahun, query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTransaksiKasService", null, req_identity)

    bulan = parseFloat(bulan) < 10 ? `0${bulan}` : bulan

    let { search } = query
    search = search ? search : ""

    LOGGER(logType.INFO, "Pagination", {
        bulan,
        tahun,
        search
    }, req_identity)
    
    return await getAllTransaksiKasRepo(bulan, tahun, search, req_identity)
}

export const getTransaksiKasByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTransaksiKasByUuidService [${uuid}]`, null, req_identity)
    const transaksiKas = await getTransaksiKasByUuidRepo(uuid, req_identity)

    if (!transaksiKas) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return transaksiKas
}

export const createTransaksiKasService = async (transaksiKasData, req_identity) => {
    LOGGER(logType.INFO, `Start createTransaksiKasService`, transaksiKasData, req_identity)
    transaksiKasData.enabled = 1

    const transaksiKas = await createTransaksiKasRepo(transaksiKasData, req_identity)
    return transaksiKas
}

export const deleteTransaksiKasByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTransaksiKasByUuidService [${uuid}]`, null, req_identity)
    await getTransaksiKasByUuidService(uuid, req_identity)
    await deleteTransaksiKasByUuidRepo(uuid, req_identity)
    return true
}

export const updateTransaksiKasByUuidService = async (uuid, transaksiKasData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTransaksiKasByUuidService [${uuid}]`, transaksiKasData, req_identity)
    const beforeData = await getTransaksiKasByUuidService(uuid, req_identity)
    const transaksiKas = await updateTransaksiKasByUuidRepo(uuid, transaksiKasData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        transaksiKasData
    }, req_identity)

    return transaksiKas
}