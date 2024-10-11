import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBuktiTransaski } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createPiutangKaryawanRepo, deletePiutangKaryawanByUuidRepo, getAllPiutangKaryawanRepo, getPiutangKaryawanByPegawaiUUIDRepo, getPiutangKaryawanByUuidRepo, getTotalPiutangKaryawanRepo, updatePiutangKaryawanByUuidRepo } from "./piutangKaryawan.repository.js"

export const getAllPiutangKaryawanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPiutangKaryawanService", null, req_identity)

    let { bulan, tahun } = query

    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)

    return await getAllPiutangKaryawanRepo(bulan, tahun, req_identity)
}

export const getTotalPiutangKaryawanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getTotalPiutangKaryawanService [${uuid}]`, null, req_identity)
    const piutangKaryawan = await getTotalPiutangKaryawanRepo(uuid, req_identity)
    return piutangKaryawan[0]
}

export const getPiutangKaryawanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPiutangKaryawanByUuidService [${uuid}]`, null, req_identity)
    const piutangKaryawan = await getPiutangKaryawanByUuidRepo(uuid, req_identity)

    if (!piutangKaryawan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return piutangKaryawan
}

export const getPiutangKaryawanByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getPiutangKaryawanByPegawaiUUIDService [${uuid}]`, {
        periode,
        tahun
    }, req_identity)
    const piutangKaryawan = await getPiutangKaryawanByPegawaiUUIDRepo(uuid, periode, tahun, req_identity)

    if (!piutangKaryawan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return piutangKaryawan
}

export const createPiutangKaryawanService = async (piutangKaryawanData, req_identity) => {
    LOGGER(logType.INFO, `Start createPiutangKaryawanService`, piutangKaryawanData, req_identity)
    piutangKaryawanData.enabled = 1

    await getNeracaValidasiByTanggalService(null, piutangKaryawanData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(piutangKaryawanData.bukti_transaksi, "EMPTY", req_identity)

    const piutangKaryawan = await createPiutangKaryawanRepo(piutangKaryawanData, req_identity)
    return piutangKaryawan
}

export const deletePiutangKaryawanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePiutangKaryawanByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getPiutangKaryawanByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)
    
    await deletePiutangKaryawanByUuidRepo(uuid, req_identity)
    return true
}

export const updatePiutangKaryawanByUuidService = async (uuid, piutangKaryawanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePiutangKaryawanByUuidService [${uuid}]`, piutangKaryawanData, req_identity)
    const beforeData = await getPiutangKaryawanByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(null, beforeData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(piutangKaryawanData.bukti_transaksi, [`"${beforeData.uuid}"`], req_identity)

    const piutangKaryawan = await updatePiutangKaryawanByUuidRepo(uuid, piutangKaryawanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        piutangKaryawanData
    }, req_identity)

    return piutangKaryawan
}