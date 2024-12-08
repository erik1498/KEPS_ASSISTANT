import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkJenisPenjualanBahanBakuAllowToEditRepo, createJenisPenjualanBahanBakuRepo, deleteJenisPenjualanBahanBakuByUuidRepo, getAllJenisPenjualanBahanBakuRepo, getJenisPenjualanBahanBakuByUuidRepo, updateJenisPenjualanBahanBakuByUuidRepo } from "./jenisPenjualanBahanBaku.repository.js"

export const getAllJenisPenjualanBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisPenjualanBahanBakuService", null, req_identity)

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

    const jenisPenjualanBahanBakus = await getAllJenisPenjualanBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisPenjualanBahanBakus.entry, jenisPenjualanBahanBakus.count, jenisPenjualanBahanBakus.pageNumber, jenisPenjualanBahanBakus.size)
}

export const getJenisPenjualanBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisPenjualanBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const jenisPenjualanBahanBaku = await getJenisPenjualanBahanBakuByUuidRepo(uuid, req_identity)

    if (!jenisPenjualanBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return jenisPenjualanBahanBaku
}

export const createJenisPenjualanBahanBakuService = async (jenisPenjualanBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisPenjualanBahanBakuService`, jenisPenjualanBahanBakuData, req_identity)
    jenisPenjualanBahanBakuData.enabled = 1

    const jenisPenjualanBahanBaku = await createJenisPenjualanBahanBakuRepo(jenisPenjualanBahanBakuData, req_identity)
    return jenisPenjualanBahanBaku
}

export const deleteJenisPenjualanBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisPenjualanBahanBakuByUuidService [${uuid}]`, null, req_identity)

    await checkJenisPenjualanBahanBakuAllowToEditService(uuid, req_identity)

    await getJenisPenjualanBahanBakuByUuidService(uuid, req_identity)
    await deleteJenisPenjualanBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisPenjualanBahanBakuByUuidService = async (uuid, jenisPenjualanBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisPenjualanBahanBakuByUuidService [${uuid}]`, jenisPenjualanBahanBakuData, req_identity)
    const beforeData = await getJenisPenjualanBahanBakuByUuidService(uuid, req_identity)
    const jenisPenjualanBahanBaku = await updateJenisPenjualanBahanBakuByUuidRepo(uuid, jenisPenjualanBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisPenjualanBahanBakuData
    }, req_identity)

    return jenisPenjualanBahanBaku
}

export const checkJenisPenjualanBahanBakuAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkJenisPenjualanBahanBakuAllowToEditService`, {
        uuid
    }, req_identity)

    const daftarBahanBakuUsed = await checkJenisPenjualanBahanBakuAllowToEditRepo(uuid, req_identity)

    if (daftarBahanBakuUsed.length > 0) {
        throw Error(JSON.stringify({
            message: `Jenis Penjualan BahanBaku Sudah Terpakai Pada BahanBaku ${daftarBahanBakuUsed[0].name}`,
            prop: "error"
        }))
    }
}