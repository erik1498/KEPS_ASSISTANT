import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createPerintahStokOpnameRepo, deletePerintahStokOpnameByUuidRepo, getAllPerintahStokOpnameRepo, getPerintahStokOpnameByUuidRepo, getPerintahStokOpnameByUUIDWithTanggalRepo, getRincianPelunasanPenjualanBarangRepo, getRincianPelunasanPenjualanJasaRepo, getStatusPerintahStokOpnameAktifByTanggalRepo, perintahStokOpnameStatusRepo, updatePerintahStokOpnameByUuidRepo } from "./perintahStokOpname.repository.js"

export const getAllPerintahStokOpnameService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameService", null, req_identity)

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

    const perintahStokOpnames = await getAllPerintahStokOpnameRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(perintahStokOpnames.entry, perintahStokOpnames.count, perintahStokOpnames.pageNumber, perintahStokOpnames.size)
}

export const getPerintahStokOpnameByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPerintahStokOpnameByUuidService [${uuid}]`, null, req_identity)
    const perintahStokOpname = await getPerintahStokOpnameByUuidRepo(uuid, req_identity)

    if (!perintahStokOpname) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return perintahStokOpname
}

export const getJurnalByPerintahStokOpnameService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJurnalByPerintahStokOpnameService [${uuid}]`, null, req_identity)

    const perintahStokOpname = await getPerintahStokOpnameByUUIDWithTanggalRepo(uuid, req_identity)

    if (perintahStokOpname.length > 0 && perintahStokOpname[0].tanggal_selesai != "BELUM SELESAI") {

        const rincianPelunasanPenjualanBarang = await getRincianPelunasanPenjualanBarangRepo(perintahStokOpname[0].tanggal, perintahStokOpname[0].tanggal_selesai, req_identity)

        const rincianPelunasanPenjualanJasa = await getRincianPelunasanPenjualanJasaRepo(perintahStokOpname[0].tanggal, perintahStokOpname[0].tanggal_selesai, req_identity)

        return rincianPelunasanPenjualanBarang.concat(...rincianPelunasanPenjualanJasa)

        // const fakturPenjualanBarangDendaAktif = await getFakturPenjualanBarangDendaAktifRepo(perintahStokOpname[0].tanggal_selesai)

        // const fakturPenjualanJasaDendaAktif = await getFakturPenjualanJasaDendaAktifRepo(perintahStokOpname[0].tanggal_selesai)

        // const jurnalPerintahStokOpname = await getJurnalByPerintahStokOpnameRepo(perintahStokOpname[0].tanggal, perintahStokOpname[0].tanggal_selesai, fakturPenjualanBarangDendaAktif[0].list, fakturPenjualanJasaDendaAktif[0].list, null, uuid, req_id)

        // return jurnalPerintahStokOpname
    }
    return []

}

export const createPerintahStokOpnameService = async (perintahStokOpnameData, req_identity) => {
    LOGGER(logType.INFO, `Start createPerintahStokOpnameService`, perintahStokOpnameData, req_identity)
    perintahStokOpnameData.enabled = 1
    perintahStokOpnameData.validasi = false

    await getNeracaValidasiByTanggalService(null, perintahStokOpnameData.tanggal, req_identity)

    await getStatusPerintahStokOpnameAktifByTanggalService(perintahStokOpnameData.tanggal, null, req_identity)

    const perintahStokOpname = await createPerintahStokOpnameRepo(perintahStokOpnameData, req_identity)
    return perintahStokOpname
}

export const deletePerintahStokOpnameByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePerintahStokOpnameByUuidService [${uuid}]`, null, req_identity)

    const allowToUpdatePerintahStokOpname = await perintahStokOpnemeAllowToEdit(uuid, req_identity);
    if (allowToUpdatePerintahStokOpname.length > 0 && (allowToUpdatePerintahStokOpname[0].hasil_stok_opname > 0 || allowToUpdatePerintahStokOpname[0].penyesuaian_persediaan > 0)) {
        throw Error(JSON.stringify({
            message: "Tidak dapat Dihapus karena terdapat hasil stok opname atau penyesuaian persediaan pada stok opname ini",
            prop: "error"
        }))
    }

    await getPerintahStokOpnameByUuidService(uuid, req_identity)
    await deletePerintahStokOpnameByUuidRepo(uuid, req_identity)
    return true
}

export const updatePerintahStokOpnameByUuidService = async (uuid, perintahStokOpnameData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePerintahStokOpnameByUuidService [${uuid}]`, perintahStokOpnameData, req_identity)

    const allowToUpdatePerintahStokOpname = await perintahStokOpnemeAllowToEdit(uuid, req_identity);
    if (allowToUpdatePerintahStokOpname.length > 0 && allowToUpdatePerintahStokOpname[0].hasil_stok_opname > 0 && allowToUpdatePerintahStokOpname[0].penyesuaian_persediaan > 0) {
        throw Error(JSON.stringify({
            message: "Tidak dapat Diedit karena terdapat hasil stok opname atau penyesuaian persediaan pada stok opname ini",
            prop: "error"
        }))
    }

    const beforeData = await getPerintahStokOpnameByUuidService(uuid, req_identity)

    await getStatusPerintahStokOpnameAktifByTanggalService(perintahStokOpnameData.tanggal, uuid, req_identity)

    const perintahStokOpname = await updatePerintahStokOpnameByUuidRepo(uuid, perintahStokOpnameData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        perintahStokOpnameData
    }, req_identity)

    return perintahStokOpname
}

export const perintahStokOpnemeAllowToEdit = async (perintah_stok_opname, req_identity) => {
    LOGGER(logType.INFO, `Start perintahStokOpnemeAllowToEdit`, { perintah_stok_opname }, req_identity)
    const hasilStokOpname = await perintahStokOpnameStatusRepo(perintah_stok_opname, req_identity)

    if (hasilStokOpname.length > 0 && hasilStokOpname[0].status_validasi > 0) {
        throw Error(JSON.stringify({
            message: `Neraca sudah divalidasi untuk Bulan ${hasilStokOpname[0].bulan} Dan Tahun ${hasilStokOpname[0].tahun}`,
            prop: "error"
        }))
    }

    return hasilStokOpname;
}

export const getStatusPerintahStokOpnameAktifByTanggalService = async (tanggal, uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getStatusPerintahStokOpnameAktifByTanggalService`, { tanggal, uuid }, req_identity)
    const perintahStokOpname = await getStatusPerintahStokOpnameAktifByTanggalRepo(tanggal, uuid, req_identity);

    if (perintahStokOpname.length > 0 && perintahStokOpname[0].allowToExecute == 0) {
        throw Error(JSON.stringify({
            message: `Perintah Stok Opname ${perintahStokOpname[0].nomor_surat_perintah} Berjalan Pada ${perintahStokOpname[0].tanggal} Hingga ${perintahStokOpname[0].tanggal_selesai}`,
            prop: "error"
        }))
    }

    await getNeracaValidasiByTanggalService(null, tanggal, req_identity)

    return
}