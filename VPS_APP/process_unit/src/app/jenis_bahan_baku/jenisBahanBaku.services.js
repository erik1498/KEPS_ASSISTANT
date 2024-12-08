import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkJenisBahanBakuAllowToEditRepo, createJenisBahanBakuRepo, deleteJenisBahanBakuByUuidRepo, getAllJenisBahanBakuRepo, getJenisBahanBakuByUuidRepo, updateJenisBahanBakuByUuidRepo } from "./jenisBahanBaku.repository.js"

export const getAllJenisBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllJenisBahanBakuService", null, req_identity)

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

    const jenisBahanBakus = await getAllJenisBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(jenisBahanBakus.entry, jenisBahanBakus.count, jenisBahanBakus.pageNumber, jenisBahanBakus.size)
}

export const getJenisBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJenisBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const jenisBahanBaku = await getJenisBahanBakuByUuidRepo(uuid, req_identity)

    if (!jenisBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return jenisBahanBaku
}

export const createJenisBahanBakuService = async (jenisBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createJenisBahanBakuService`, jenisBahanBakuData, req_identity)
    jenisBahanBakuData.enabled = 1

    const jenisBahanBaku = await createJenisBahanBakuRepo(jenisBahanBakuData, req_identity)
    return jenisBahanBaku
}

export const deleteJenisBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJenisBahanBakuByUuidService [${uuid}]`, null, req_identity)

    await checkJenisBahanBakuAllowToEditService(uuid, req_identity)
    await getJenisBahanBakuByUuidService(uuid, req_identity)
    await deleteJenisBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateJenisBahanBakuByUuidService = async (uuid, jenisBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJenisBahanBakuByUuidService [${uuid}]`, jenisBahanBakuData, req_identity)
    const beforeData = await getJenisBahanBakuByUuidService(uuid, req_identity)
    const jenisBahanBaku = await updateJenisBahanBakuByUuidRepo(uuid, jenisBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jenisBahanBakuData
    }, req_identity)

    return jenisBahanBaku
}

export const checkJenisBahanBakuAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkJenisBahanBakuAllowToEditService`, {
        uuid
    }, req_identity)

    const daftarBahanBakuUsed = await checkJenisBahanBakuAllowToEditRepo(uuid, req_identity)

    if (daftarBahanBakuUsed.length > 0) {
        throw Error(JSON.stringify({
            message: `Jenis Bahan Baku Sudah Terpakai Pada Bahan Baku ${daftarBahanBakuUsed[0].name}`,
            prop: "error"
        }))
    }
}