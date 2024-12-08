import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkSatuanBahanBakuAllowToEditRepo, createSatuanBahanBakuRepo, deleteSatuanBahanBakuByUuidRepo, getAllSatuanBahanBakuRepo, getSatuanBahanBakuByUuidRepo, updateSatuanBahanBakuByUuidRepo } from "./satuanBahanBaku.repository.js"

export const getAllSatuanBahanBakuService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllSatuanBahanBakuService", null, req_identity)

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

    const satuanBahanBakus = await getAllSatuanBahanBakuRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(satuanBahanBakus.entry, satuanBahanBakus.count, satuanBahanBakus.pageNumber, satuanBahanBakus.size)
}

export const getSatuanBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getSatuanBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const satuanBahanBaku = await getSatuanBahanBakuByUuidRepo(uuid, req_identity)

    if (!satuanBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return satuanBahanBaku
}

export const createSatuanBahanBakuService = async (satuanBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createSatuanBahanBakuService`, satuanBahanBakuData, req_identity)
    satuanBahanBakuData.enabled = 1

    const satuanBahanBaku = await createSatuanBahanBakuRepo(satuanBahanBakuData, req_identity)
    return satuanBahanBaku
}

export const deleteSatuanBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteSatuanBahanBakuByUuidService [${uuid}]`, null, req_identity)
    await getSatuanBahanBakuByUuidService(uuid, req_identity)

    await checkSatuanBahanBakuAllowToEditService(uuid, req_identity)

    await deleteSatuanBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateSatuanBahanBakuByUuidService = async (uuid, satuanBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateSatuanBahanBakuByUuidService [${uuid}]`, satuanBahanBakuData, req_identity)
    const beforeData = await getSatuanBahanBakuByUuidService(uuid, req_identity)

    await checkSatuanBahanBakuAllowToEditService(uuid, req_identity)

    const satuanBahanBaku = await updateSatuanBahanBakuByUuidRepo(uuid, satuanBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        satuanBahanBakuData
    }, req_identity)

    return satuanBahanBaku
}

export const checkSatuanBahanBakuAllowToEditService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkSatuanBahanBakuAllowToEditService`, {
        uuid
    }, req_identity)

    const kategoriHargaBahanBakuUsed = await checkSatuanBahanBakuAllowToEditRepo(uuid, req_identity)

    if (kategoriHargaBahanBakuUsed.length > 0) {
        if (kategoriHargaBahanBakuUsed[0].kode_bahan_baku || kategoriHargaBahanBakuUsed[0].nomor_invoice_aset || kategoriHargaBahanBakuUsed.nomor_invoice_perlengkapan) {
            throw Error(JSON.stringify({
                message: `Satuan BahanBaku Sudah Terpakai Pada Kategori Harga BahanBaku, Kode BahanBaku : ${kategoriHargaBahanBakuUsed[0].kode_bahan_baku}${kategoriHargaBahanBakuUsed[0].nomor_invoice_aset ? `, Nomor Invoice Aset : ${kategoriHargaBahanBakuUsed[0].nomor_invoice_aset}` : ``}${kategoriHargaBahanBakuUsed[0].nomor_invoice_perlengkapan ? `, Nomor Invoice Perlengkapan : ${kategoriHargaBahanBakuUsed[0].nomor_invoice_perlengkapan}` : ``}`,
                prop: "error"
            }))
        }
    }
}