import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkKategoriBahanBakuAllowToEditRepo, createKategoriBahanBakuRepo, deleteKategoriBahanBakuByUuidRepo, getAllKategoriBahanBakuRepo, getKategoriBahanBakuByUuidRepo, updateKategoriBahanBakuByUuidRepo } from "./kategoriBahanBaku.repository.js"

export const getAllKategoriBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriBahanBakuService", null, req_identity)

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

    const kategoriBahanBakus = await getAllKategoriBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriBahanBakus.entry, kategoriBahanBakus.count, kategoriBahanBakus.pageNumber, kategoriBahanBakus.size)
}

export const getKategoriBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const kategoriBahanBaku = await getKategoriBahanBakuByUuidRepo(uuid, req_identity)

    if (!kategoriBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kategoriBahanBaku
}

export const createKategoriBahanBakuService = async (kategoriBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriBahanBakuService`, kategoriBahanBakuData, req_identity)
    kategoriBahanBakuData.enabled = 1

    const kategoriBahanBaku = await createKategoriBahanBakuRepo(kategoriBahanBakuData, req_identity)
    return kategoriBahanBaku
}

export const deleteKategoriBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriBahanBakuByUuidService [${uuid}]`, null, req_identity)

    await checkKategoriBahanBakuAllowToEditService(uuid, req_identity)
    
    await getKategoriBahanBakuByUuidService(uuid, req_identity)
    await deleteKategoriBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriBahanBakuByUuidService = async (uuid, kategoriBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriBahanBakuByUuidService [${uuid}]`, kategoriBahanBakuData, req_identity)
    const beforeData = await getKategoriBahanBakuByUuidService(uuid, req_identity)
    const kategoriBahanBaku = await updateKategoriBahanBakuByUuidRepo(uuid, kategoriBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriBahanBakuData
    }, req_identity)

    return kategoriBahanBaku
}

export const checkKategoriBahanBakuAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkKategoriBahanBakuAllowToEditService`, {
        uuid
    }, req_identity)

    const daftarBahanBakuUsed = await checkKategoriBahanBakuAllowToEditRepo(uuid, req_identity)

    if (daftarBahanBakuUsed.length > 0) {
        throw Error(JSON.stringify({
            message: `Kategori Bahan Baku Sudah Terpakai Pada Bahan Baku ${daftarBahanBakuUsed[0].name}`,
            prop: "error"
        }))
    }
}