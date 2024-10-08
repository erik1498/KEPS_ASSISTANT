import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getJurnalUmumByBuktiTransaski } from "../jurnal_umum/jurnalUmum.services.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createKerugianRepo, deleteKerugianByUuidRepo, getAllKerugianRepo, getKerugianByPegawaiUUIDRepo, getKerugianByUuidRepo, updateKerugianByUuidRepo } from "./kerugian.repository.js"

export const getAllKerugianService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKerugianService", null, req_identity)

    let { bulan, tahun } = query
    LOGGER(logType.INFO, "Pagination", {
        bulan, tahun
    }, req_identity)
    
    return await getAllKerugianRepo(bulan, tahun, req_identity)
}

export const getKerugianByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKerugianByUuidService [${uuid}]`, null, req_identity)
    const kerugian = await getKerugianByUuidRepo(uuid, req_identity)

    if (!kerugian) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return kerugian
}

export const getKerugianByPegawaiUUIDService = async (uuid, periode, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getKerugianByPegawaiUUIDService [${uuid}]`, {
        periode,
        tahun
    }, req_identity)
    const kerugian = await getKerugianByPegawaiUUIDRepo(uuid, periode, tahun, req_identity)

    if (!kerugian) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            field: "error"
        }))
    }
    return kerugian
}

export const createKerugianService = async (kerugianData, req_identity) => {
    LOGGER(logType.INFO, `Start createKerugianService`, kerugianData, req_identity)
    kerugianData.enabled = 1

    await getNeracaValidasiByTanggalService(kerugianData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(kerugianData.bukti_transaksi, "EMPTY", req_identity)

    const kerugian = await createKerugianRepo(kerugianData, req_identity)
    return kerugian
}

export const deleteKerugianByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKerugianByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getPiutangKaryawanByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)
    
    await deleteKerugianByUuidRepo(uuid, req_identity)
    return true
}

export const updateKerugianByUuidService = async (uuid, kerugianData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKerugianByUuidService [${uuid}]`, kerugianData, req_identity)
    const beforeData = await getKerugianByUuidService(uuid, req_identity)

    await getNeracaValidasiByTanggalService(beforeData.tanggal, req_identity)

    await getJurnalUmumByBuktiTransaski(kerugianData.bukti_transaksi, [`"${beforeData.uuid}"`], req_identity)

    const kerugian = await updateKerugianByUuidRepo(uuid, kerugianData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kerugianData
    }, req_identity)

    return kerugian
}