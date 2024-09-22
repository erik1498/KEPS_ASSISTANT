import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBuktiTransaski } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createTunjanganUangRepo, deleteTunjanganUangByUuidRepo, getAllTunjanganUangRepo, getTunjanganUangByPegawaiUuidRepo, getTunjanganUangByUuidRepo, updateTunjanganUangByUuidRepo } from "./tunjanganUang.repository.js"

export const getAllTunjanganUangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllTunjanganUangService", null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)

    return await getAllTunjanganUangRepo(bulan, tahun, req_identity)
}

export const getTunjanganUangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTunjanganUangByUuidService [${uuid}]`, null, req_identity)
    const tunjanganUang = await getTunjanganUangByUuidRepo(uuid, req_identity)

    if (!tunjanganUang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return tunjanganUang
}

export const getTunjanganUangByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getTunjanganUangByPegawaiUUIDService [${uuid}]`, { periode, tahun }, req_identity)
    const tunjanganUang = await getTunjanganUangByPegawaiUuidRepo(uuid, periode, tahun, req_identity)

    if (tunjanganUang.length == 0) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return tunjanganUang[0]
}

export const createTunjanganUangService = async (tunjanganUangData, req_identity) => {
    LOGGER(logType.INFO, `Start createTunjanganUangService`, tunjanganUangData, req_identity)
    tunjanganUangData.enabled = 1

    await getNeracaValidasiByTanggalService(tunjanganUangData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(tunjanganUangData.bukti_transaksi, "EMPTY", req_identity)

    const tunjanganUang = await createTunjanganUangRepo(tunjanganUangData, req_identity)
    return tunjanganUang
}

export const deleteTunjanganUangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteTunjanganUangByUuidService [${uuid}]`, null, req_identity)

    const beforeData = await getTunjanganUangByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    await deleteTunjanganUangByUuidRepo(uuid, req_identity)
    return true
}

export const updateTunjanganUangByUuidService = async (uuid, tunjanganUangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateTunjanganUangByUuidService [${uuid}]`, tunjanganUangData, req_identity)

    const beforeData = await getTunjanganUangByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(tunjanganUangData.bukti_transaksi, "EMPTY", req_identity)

    const tunjanganUang = await updateTunjanganUangByUuidRepo(uuid, tunjanganUangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        tunjanganUangData
    }, req_identity)

    return tunjanganUang
}