import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createKodeAkunPerkiraanRepo, deleteKodeAkunPerkiraanByUuidRepo, getAllKodeAkunPerkiraanBankRepo, getAllKodeAkunPerkiraanByCodeListRepo, getAllKodeAkunPerkiraanKasRepo, getAllKodeAkunPerkiraanNoBankRepo, getAllKodeAkunPerkiraanNoKasRepo, getAllKodeAkunPerkiraanRepo, getKodeAkunPerkiraanByCodeRepo, getKodeAkunPerkiraanByTypeRepo, getKodeAkunPerkiraanByUuidRepo, getKodeAkunPerkiraanExceptTypeRepo, updateKodeAkunPerkiraanByUuidRepo } from "./kodeAkunPerkiraan.repository.js"

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

    const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanRepo(pageNumber, size, search)
    return generatePaginationResponse(kodeAkunPerkiraans.entry, kodeAkunPerkiraans.count, kodeAkunPerkiraans.pageNumber, kodeAkunPerkiraans.size)
}

export const getAllKodeAkunPerkiraanByCodeListService = async (data, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKodeAkunPerkiraanByCodeListService", null, req_identity)

    LOGGER(logType.INFO, "Parameter", {
        data
    }, req_identity)

    const kodeAkunPerkiraans = await getAllKodeAkunPerkiraanByCodeListRepo(data.code)
    return kodeAkunPerkiraans
}

export const getAllKodeAkunPerkiraanByTypeService = async (type, req_identity) => {
    LOGGER(logType.INFO, `Start getKodeAkunPerkiraanByTypeService [${type}]`, null, req_identity)
    const kodeAkunPerkiraan = await getKodeAkunPerkiraanByTypeRepo(type)

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const getAllKodeAkunPerkiraanKasService = async (req_identity) => {
    LOGGER(logType.INFO, `Start getAllKodeAkunPerkiraanKasService`, null, req_identity)
    const kodeAkunPerkiraan = await getAllKodeAkunPerkiraanKasRepo()

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const getAllKodeAkunPerkiraanNoKasService = async (req_identity) => {
    LOGGER(logType.INFO, `Start getAllKodeAkunPerkiraanNoKasService`, null, req_identity)
    const kodeAkunPerkiraan = await getAllKodeAkunPerkiraanNoKasRepo()

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const getAllKodeAkunPerkiraanBankService = async (req_identity) => {
    LOGGER(logType.INFO, `Start getAllKodeAkunPerkiraanBankService`, null, req_identity)
    const kodeAkunPerkiraan = await getAllKodeAkunPerkiraanBankRepo()

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const getAllKodeAkunPerkiraanNoBankService = async (req_identity) => {
    LOGGER(logType.INFO, `Start getAllKodeAkunPerkiraanNoBankService`, null, req_identity)
    const kodeAkunPerkiraan = await getAllKodeAkunPerkiraanNoBankRepo()

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const getAllKodeAkunPerkiraanExceptTypeService = async (type, req_identity) => {
    LOGGER(logType.INFO, `Start getKodeAkunPerkiraanExceptTypeService [${type}]`, null, req_identity)
    const kodeAkunPerkiraan = await getKodeAkunPerkiraanExceptTypeRepo(type)

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const getKodeAkunPerkiraanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKodeAkunPerkiraanByUuidService [${uuid}]`, null, req_identity)
    const kodeAkunPerkiraan = await getKodeAkunPerkiraanByUuidRepo(uuid)

    if (!kodeAkunPerkiraan) {
        throw Error("data not found")
    }
    return kodeAkunPerkiraan
}

export const createKodeAkunPerkiraanService = async (kodeAkunPerkiraanData, req_identity) => {
    LOGGER(logType.INFO, `Start createKodeAkunPerkiraanService`, kodeAkunPerkiraanData, req_identity)
    kodeAkunPerkiraanData.enabled = 1

    const kodeAkunPerkiraanWithSameCode = await getKodeAkunPerkiraanByCodeRepo(kodeAkunPerkiraanData.code)

    LOGGER(logType.INFO, "KODE AKUN CODE", kodeAkunPerkiraanWithSameCode, req_identity)

    if (kodeAkunPerkiraanWithSameCode.length > 0 && kodeAkunPerkiraanWithSameCode[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Kode Sudah Terdaftar",
            field: "kodeAkun"
        }))
    }

    const kodeAkunPerkiraan = await createKodeAkunPerkiraanRepo(kodeAkunPerkiraanData)
    return kodeAkunPerkiraan
}

export const deleteKodeAkunPerkiraanByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKodeAkunPerkiraanByUuidService [${uuid}]`, null, req_identity)
    await getKodeAkunPerkiraanByUuidService(uuid, req_identity)
    await deleteKodeAkunPerkiraanByUuidRepo(uuid)
    return true
}

export const updateKodeAkunPerkiraanByUuidService = async (uuid, kodeAkunPerkiraanData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKodeAkunPerkiraanByUuidService [${uuid}]`, kodeAkunPerkiraanData, req_identity)

    const beforeData = await getKodeAkunPerkiraanByUuidService(uuid, req_identity)

    const kodeAkunPerkiraanWithSameCode = await getKodeAkunPerkiraanByCodeRepo(kodeAkunPerkiraanData.code, uuid)

    LOGGER(logType.INFO, "KODE AKUN CODE", kodeAkunPerkiraanWithSameCode, req_identity)

    if (kodeAkunPerkiraanWithSameCode.length > 0 && kodeAkunPerkiraanWithSameCode[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Kode Akun Sudah Terdaftar",
            field: "kodeAkun"
        }))
    }

    const kodeAkunPerkiraan = await updateKodeAkunPerkiraanByUuidRepo(uuid, kodeAkunPerkiraanData)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kodeAkunPerkiraanData
    }, req_identity)

    return kodeAkunPerkiraan
}