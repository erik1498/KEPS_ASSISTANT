import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService } from "../perintah_stok_opname/perintahStokOpname.services.js"
import { createKonversiBahanBakuRepo, deleteKonversiBahanBakuByUuidRepo, getAllKonversiBahanBakuRepo, getKonversiBahanBakuByUuidRepo, updateKonversiBahanBakuByUuidRepo } from "./konversiBahanBaku.repository.js"

export const getAllKonversiBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKonversiBahanBakuService", null, req_identity)

    let { page, size, search, tahun } = query
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

    const konversiBahanBakus = await getAllKonversiBahanBakuRepo(pageNumber, size, search, tahun, req_identity)
    return generatePaginationResponse(konversiBahanBakus.entry, konversiBahanBakus.count, konversiBahanBakus.pageNumber, konversiBahanBakus.size)
}

export const getKonversiBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKonversiBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const konversiBahanBaku = await getKonversiBahanBakuByUuidRepo(uuid, req_identity)

    if (!konversiBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return konversiBahanBaku
}

export const createKonversiBahanBakuService = async (konversiBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createKonversiBahanBakuService`, konversiBahanBakuData, req_identity)
    konversiBahanBakuData.enabled = 1

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, konversiBahanBakuData.tanggal, null, null, req_identity)

    const konversiBahanBaku = await createKonversiBahanBakuRepo(konversiBahanBakuData, req_identity)
    return konversiBahanBaku
}

export const deleteKonversiBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKonversiBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const beforeData = await getKonversiBahanBakuByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    await deleteKonversiBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateKonversiBahanBakuByUuidService = async (uuid, konversiBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKonversiBahanBakuByUuidService [${uuid}]`, konversiBahanBakuData, req_identity)

    const beforeData = await getKonversiBahanBakuByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(null, beforeData.tanggal, null, null, req_identity)

    const konversiBahanBaku = await updateKonversiBahanBakuByUuidRepo(uuid, konversiBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        konversiBahanBakuData
    }, req_identity)

    return konversiBahanBaku
}