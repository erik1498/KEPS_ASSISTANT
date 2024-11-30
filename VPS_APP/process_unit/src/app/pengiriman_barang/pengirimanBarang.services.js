import { formatDate } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { checkNomorSuratJalanAndTanggalRepo, createPengirimanBarangRepo, deletePengirimanBarangByUuidRepo, getAllPengirimanBarangRepo, getDaftarPesananByUUIDRepo, getPengirimanBarangByUuidRepo, updatePengirimanBarangByUuidRepo } from "./pengirimanBarang.repository.js"

export const getAllPengirimanBarangService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPengirimanBarangService", null, req_identity)

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

    const pengirimanBarangs = await getAllPengirimanBarangRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(pengirimanBarangs.entry, pengirimanBarangs.count, pengirimanBarangs.pageNumber, pengirimanBarangs.size)
}

export const getDaftarPesananByUUIDService = async (pengiriman_barang, req_identity) => {
    LOGGER(logType.INFO, `Start getDaftarPesananByUUIDService`, {
        pengiriman_barang
    }, req_identity)
    const pesananPenjualanBarang = await getDaftarPesananByUUIDRepo(pengiriman_barang, req_identity)
    return pesananPenjualanBarang
}

export const getPengirimanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPengirimanBarangByUuidService [${uuid}]`, null, req_identity)
    const pengirimanBarang = await getPengirimanBarangByUuidRepo(uuid, req_identity)

    if (!pengirimanBarang) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return pengirimanBarang
}

export const createPengirimanBarangService = async (pengirimanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start createPengirimanBarangService`, pengirimanBarangData, req_identity)
    pengirimanBarangData.enabled = 1

    await checkNomorSuratJalanAndTanggalService(pengirimanBarangData, req_identity)

    const pengirimanBarang = await createPengirimanBarangRepo(pengirimanBarangData, req_identity)
    return pengirimanBarang
}

export const deletePengirimanBarangByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePengirimanBarangByUuidService [${uuid}]`, null, req_identity)
    await getPengirimanBarangByUuidService(uuid, req_identity)
    await deletePengirimanBarangByUuidRepo(uuid, req_identity)
    return true
}

export const updatePengirimanBarangByUuidService = async (uuid, pengirimanBarangData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePengirimanBarangByUuidService [${uuid}]`, pengirimanBarangData, req_identity)
    const beforeData = await getPengirimanBarangByUuidService(uuid, req_identity)

    await checkNomorSuratJalanAndTanggalService(beforeData, req_identity)

    const pengirimanBarang = await updatePengirimanBarangByUuidRepo(uuid, pengirimanBarangData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        pengirimanBarangData
    }, req_identity)

    return pengirimanBarang
}

export const checkNomorSuratJalanAndTanggalService = async (pengirimanBarangData, req_identity) => {
    LOGGER(logType.INFO, `Start checkNomorSuratJalanAndTanggalService`, {
        pengirimanBarangData
    }, req_identity)
    const pengirimanBarang = await checkNomorSuratJalanAndTanggalRepo(pengirimanBarangData, req_identity)

    if (pengirimanBarang.length > 0) {
        if (!pengirimanBarangData.uuid) {
            if (pengirimanBarang[0].tanggal_terakhir >= pengirimanBarangData.tanggal) {
                throw Error(JSON.stringify({
                    message: `Tidak Dapat Dieksekusi, Tanggal Pengiriman Barang Harus Diatas ${formatDate(pengirimanBarang[0].tanggal_terakhir)}`,
                    prop: "error"
                }))
            }
        }
        if (pengirimanBarang[0].nomor_surat_jalan == pengirimanBarangData.nomor_surat_jalan) {
            throw Error(JSON.stringify({
                message: `Tidak Dapat Dieksekusi, Nomor Surat Perintah Sudah Terdaftar`,
                prop: "error"
            }))
        }
    }
}
