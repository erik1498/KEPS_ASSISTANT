import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getBulanText } from "../../utils/mathUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKodeAkunPerkiraanRepo, deleteKodeAkunPerkiraanByUuidRepo, getAllKodeAkunPerkiraanRepo, getAllKodeAkunPerkiraansAsetPerlengkapanRepo, getAllKodeAkunPerkiraansPayrollRepo, getAllKodeAkunPerkiraanWhereInRepo, getKodeAkunPerkiraanByCodeRepo, getKodeAkunPerkiraanByUuidRepo, getKodeAkunPerkiraanByUuidSudahDigunakanRepo, updateKodeAkunPerkiraanByUuidRepo } from "./kodeAkunPerkiraan.repository.js"

export const getAllKodeAkunPerkiraanService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanService", null, req_identity)

    let { page, size, search } = query
    page = page ? page : null
    size = size ? size : null
    if (size == "all") {
        page = null
        size = null
    }

    search = search ? search.trim() : ""
    const pageNumber = (page - 1) * size

    LOGGER(logType.INFO, "Pagination", {
        pageNumber, size, search
    }, req_identity)

    const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kodeAkunPerkiraans.entry, kodeAkunPerkiraans.count, kodeAkunPerkiraans.pageNumber, kodeAkunPerkiraans.size)
}

export const getAllKodeAkunPerkiraansAsetPerlengkapanService = async (req_identity) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansAsetPerlengkapanService", req_identity)
    return await getAllKodeAkunPerkiraansAsetPerlengkapanRepo(req_identity)
}

export const getAllKodeAkunPerkiraansPayrollService = async (req_identity) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraansPayrollService", req_identity)
    return await getAllKodeAkunPerkiraansPayrollRepo(req_identity)
}

export const getAllKodeAkunPerkiraanWhereInService = async (whereIN, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanWhereInService", { whereIN }, req_identity)

    return await getAllKodeAkunPerkiraanWhereInRepo(whereIN, req_identity)
}

export const getKodeAkunPerkiraanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKodeAkunPerkiraanByUuidService [${uuid}]`, null, req_identity)
    const kodeAkunPerkiraan = await getKodeAkunPerkiraanByUuidRepo(uuid, req_identity)

    if (!kodeAkunPerkiraan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kodeAkunPerkiraan
}

export const createKodeAkunPerkiraanService = async (kodeAkunPerkiraanData, req_identity) => {
    LOGGER(logType.INFO, `Start createKodeAkunPerkiraanService`, kodeAkunPerkiraanData, req_identity)
    kodeAkunPerkiraanData.enabled = 1
    kodeAkunPerkiraanData.update_permission = 1

    const kodeAkunPerkiraanWithSameCode = await getKodeAkunPerkiraanByCodeRepo(kodeAkunPerkiraanData.code, null, req_identity)

    LOGGER(logType.INFO, "KODE AKUN CODE", kodeAkunPerkiraanWithSameCode, req_identity)

    if (kodeAkunPerkiraanWithSameCode.length > 0 && kodeAkunPerkiraanWithSameCode[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Kode Sudah Terdaftar",
            prop: "kodeAkun"
        }))
    }

    const kodeAkunPerkiraan = await createKodeAkunPerkiraanRepo(kodeAkunPerkiraanData, req_identity)
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByUuidSudahDigunakanService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKodeAkunPerkiraanByUuidSudahDigunakanService [${uuid}]`, null, req_identity)
    const kodeAkunPerkiraan = await getKodeAkunPerkiraanByUuidSudahDigunakanRepo(uuid, req_identity)

    LOGGER(logType.INFO, `getKodeAkunPerkiraanByUuidSudahDigunakanRepo [${uuid}]`, kodeAkunPerkiraan, req_identity)
    if (!kodeAkunPerkiraan) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kodeAkunPerkiraan
}

export const deleteKodeAkunPerkiraanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKodeAkunPerkiraanByUuidService [${uuid}]`, null, req_identity)

    const kodeAkunSudahDigunakan = await getKodeAkunPerkiraanByUuidSudahDigunakanService(uuid, req_identity);

    if (kodeAkunSudahDigunakan.length > 0) {
        throw Error(JSON.stringify({
            message: `Kode Akun Sudah Digunakan pada ${kodeAkunSudahDigunakan[0].tanggal} ${getBulanText(parseInt(kodeAkunSudahDigunakan[0].bulan) - 1)} ${kodeAkunSudahDigunakan[0].tahun} dengan bukti transaksi ${kodeAkunSudahDigunakan[0].bukti_transaksi}`,
            prop: "kodeAkun"
        }))
    }

    const beforeData = await getKodeAkunPerkiraanByUuidService(uuid, req_identity)

    if (!beforeData.update_permission) {
        throw Error(JSON.stringify({
            message: "Kode Akun Tidak Diijinkan Dieksekusi",
            prop: "kodeAkun"
        }))
    }

    await deleteKodeAkunPerkiraanByUuidRepo(uuid, req_identity)

    return true
}

export const updateKodeAkunPerkiraanByUuidService = async (uuid, kodeAkunPerkiraanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKodeAkunPerkiraanByUuidService [${uuid}]`, kodeAkunPerkiraanData, req_identity)

    const kodeAkunSudahDigunakan = await getKodeAkunPerkiraanByUuidSudahDigunakanService(uuid, req_identity);

    if (kodeAkunSudahDigunakan.length > 0) {
        throw Error(JSON.stringify({
            message: `Kode Akun Sudah Digunakan pada ${kodeAkunSudahDigunakan[0].tanggal} ${getBulanText(parseInt(kodeAkunSudahDigunakan[0].bulan) - 1)} ${kodeAkunSudahDigunakan[0].tahun} dengan bukti transaksi ${kodeAkunSudahDigunakan[0].bukti_transaksi}`,
            prop: "kodeAkun"
        }))
    }

    const beforeData = await getKodeAkunPerkiraanByUuidService(uuid, req_identity)

    if (!beforeData.update_permission) {
        throw Error(JSON.stringify({
            message: "Kode Akun Tidak Diijinkan Dieksekusi",
            prop: "kodeAkun"
        }))
    }

    const kodeAkunPerkiraanWithSameCode = await getKodeAkunPerkiraanByCodeRepo(kodeAkunPerkiraanData.code, uuid, req_identity)

    LOGGER(logType.INFO, "KODE AKUN CODE", kodeAkunPerkiraanWithSameCode, req_identity)

    if (kodeAkunPerkiraanWithSameCode.length > 0 && kodeAkunPerkiraanWithSameCode[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Kode Akun Sudah Terdaftar",
            prop: "kodeAkun"
        }))
    }

    const kodeAkunPerkiraan = await updateKodeAkunPerkiraanByUuidRepo(uuid, kodeAkunPerkiraanData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kodeAkunPerkiraanData
    }, req_identity)

    return kodeAkunPerkiraan
}