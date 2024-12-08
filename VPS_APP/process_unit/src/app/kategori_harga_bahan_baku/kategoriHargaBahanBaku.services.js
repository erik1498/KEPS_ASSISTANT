import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkDaftarBahanBakuAllowToEditService } from "../daftar_bahan_baku/daftarBahanBaku.services.js"
import { createKategoriHargaBahanBakuRepo, deleteKategoriHargaBahanBakuByUuidRepo, getAllKategoriHargaBahanBakuRepo, getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportRepo, getKategoriHargaBahanBakuByKodeBahanBakuRepo, getKategoriHargaBahanBakuByUuidRepo, updateKategoriHargaBahanBakuByUuidRepo } from "./kategoriHargaBahanBaku.repository.js"

export const getAllKategoriHargaBahanBakuService = async (daftar_bahan_baku, query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaBahanBakuService", null, req_identity)

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

    const kategoriHargaBahanBakus = await getAllKategoriHargaBahanBakuRepo(daftar_bahan_baku, pageNumber, size, search, req_identity)
    return generatePaginationResponse(kategoriHargaBahanBakus.entry, kategoriHargaBahanBakus.count, kategoriHargaBahanBakus.pageNumber, kategoriHargaBahanBakus.size)
}

export const getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportService = async (daftar_bahan_baku, satuan_bahan_baku, req_identity) => {
    LOGGER(logType.INFO, `Start getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportService`,
        {
            daftar_bahan_baku,
            satuan_bahan_baku
        },
        req_identity
    )

    const kategoriHargaBahanBaku = await getHargaBeliByDaftarBahanBakuAndSatuanBahanBakuReportRepo(daftar_bahan_baku, satuan_bahan_baku, req_identity)
    return kategoriHargaBahanBaku
}

export const getKategoriHargaBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getKategoriHargaBahanBakuByUuidService [${uuid}]`, null, req_identity)
    const kategoriHargaBahanBaku = await getKategoriHargaBahanBakuByUuidRepo(uuid, req_identity)

    if (!kategoriHargaBahanBaku) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return kategoriHargaBahanBaku
}

export const createKategoriHargaBahanBakuService = async (kategoriHargaBahanBakuData, req_identity) => {
    LOGGER(logType.INFO, `Start createKategoriHargaBahanBakuService`, kategoriHargaBahanBakuData, req_identity)
    await checkKategoriHargaBahanBakuByKodeBahanBakuService(null, kategoriHargaBahanBakuData.kode_bahan_baku, req_identity)
    kategoriHargaBahanBakuData.enabled = 1

    const kategoriHargaBahanBaku = await createKategoriHargaBahanBakuRepo(kategoriHargaBahanBakuData, req_identity)
    return kategoriHargaBahanBaku
}

export const deleteKategoriHargaBahanBakuByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteKategoriHargaBahanBakuByUuidService [${uuid}]`, null, req_identity)

    await getKategoriHargaBahanBakuByUuidService(uuid, req_identity)

    await checkDaftarBahanBakuAllowToEditService(true, uuid, req_identity)

    await deleteKategoriHargaBahanBakuByUuidRepo(uuid, req_identity)
    return true
}

export const updateKategoriHargaBahanBakuByUuidService = async (uuid, kategoriHargaBahanBakuData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateKategoriHargaBahanBakuByUuidService [${uuid}]`, kategoriHargaBahanBakuData, req_identity)

    await checkKategoriHargaBahanBakuByKodeBahanBakuService(uuid, kategoriHargaBahanBakuData.kode_bahan_baku, req_identity)

    await checkDaftarBahanBakuAllowToEditService(true, uuid, req_identity)

    const beforeData = await getKategoriHargaBahanBakuByUuidService(uuid, req_identity)
    const kategoriHargaBahanBaku = await updateKategoriHargaBahanBakuByUuidRepo(uuid, kategoriHargaBahanBakuData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        kategoriHargaBahanBakuData
    }, req_identity)

    return kategoriHargaBahanBaku
}

export const checkKategoriHargaBahanBakuByKodeBahanBakuService = async (uuid, kode_bahan_baku, req_identity) => {
    LOGGER(logType.INFO, `Start checkKategoriHargaBahanBakuByKodeBahanBakuService`, {
        kode_bahan_baku,
        uuid
    }, req_identity)

    const kategoriHargaBahanBaku = await getKategoriHargaBahanBakuByKodeBahanBakuRepo(uuid, kode_bahan_baku, req_identity)

    if (kategoriHargaBahanBaku.length > 0) {
        throw Error(JSON.stringify({
            message: "Kode BahanBaku Sudah Terdaftar",
            prop: "error"
        }))
    }
    return
}