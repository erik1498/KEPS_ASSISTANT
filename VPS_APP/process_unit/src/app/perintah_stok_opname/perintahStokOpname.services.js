import { getTanggalTerakhirPadaBulan } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getBulanText } from "../../utils/mathUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { getNeracaValidasiByTanggalService } from "../neraca/neraca.services.js"
import { createPerintahStokOpnameRepo, deletePerintahStokOpnameByUuidRepo, getAllPerintahStokOpnameRepo, getPerintahStokOpnameByUuidRepo, getPerintahStokOpnameByUUIDWithTanggalRepo, getJurnalPerintahStokOpnameRepo, perintahStokOpnameStatusRepo, updatePerintahStokOpnameByUuidRepo, checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiRepo, validasiPerintahStokOpnameByUuidRepo, checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahRepo, removeJurnalPerintahStokOpanameRepo, perintahStokOpnemeAllowToValidasiRepo } from "./perintahStokOpname.repository.js"

export const getAllPerintahStokOpnameService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameService", null, req_identity)

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

    const perintahStokOpnames = await getAllPerintahStokOpnameRepo(pageNumber, size, search, tahun, req_identity)
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

    if (perintahStokOpname.length > 0) {

        const jurnalPerintahStokOpname = await getJurnalPerintahStokOpnameRepo(perintahStokOpname[0].bulan_transaksi, perintahStokOpname[0].tahun, false, req_identity)

        return jurnalPerintahStokOpname

    }
    return []

}

export const createPerintahStokOpnameService = async (perintahStokOpnameData, req_identity) => {
    LOGGER(logType.INFO, `Start createPerintahStokOpnameService`, { perintahStokOpnameData }, req_identity)
    perintahStokOpnameData.enabled = 1
    perintahStokOpnameData.validasi = false

    await getNeracaValidasiByTanggalService(null, perintahStokOpnameData.tanggal, req_identity)

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(perintahStokOpnameData.nomor_surat_perintah, perintahStokOpnameData.bulan_transaksi, perintahStokOpnameData.tahun, null, req_identity)

    await checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahService(null, false, perintahStokOpnameData, req_identity)

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

    const beforeData = await getPerintahStokOpnameByUuidService(uuid, req_identity)

    await checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahService(uuid, true, beforeData, req_identity)

    await deletePerintahStokOpnameByUuidRepo(uuid, req_identity)
    return true
}

export const updatePerintahStokOpnameByUuidService = async (uuid, perintahStokOpnameData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePerintahStokOpnameByUuidService`, { uuid, perintahStokOpnameData }, req_identity)

    await checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahService(uuid, false, perintahStokOpnameData, req_identity)

    const allowToUpdatePerintahStokOpname = await perintahStokOpnemeAllowToEdit(perintahStokOpnameData.uuid, req_identity);
    if (allowToUpdatePerintahStokOpname.length > 0 && allowToUpdatePerintahStokOpname[0].hasil_stok_opname > 0 && allowToUpdatePerintahStokOpname[0].penyesuaian_persediaan > 0) {
        throw Error(JSON.stringify({
            message: "Tidak dapat Diedit karena terdapat hasil stok opname atau penyesuaian persediaan pada stok opname ini",
            prop: "error"
        }))
    }

    await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService(perintahStokOpnameData.nomor_surat_perintah, perintahStokOpnameData.bulan_transaksi, perintahStokOpnameData.tahun, uuid, req_identity)

    const beforeData = await getPerintahStokOpnameByUuidService(uuid, req_identity)

    const perintahStokOpname = await updatePerintahStokOpnameByUuidRepo(uuid, perintahStokOpnameData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        perintahStokOpnameData
    }, req_identity)

    return perintahStokOpname
}


export const validasiPerintahStokOpnameByUuidService = async (perintahStokOpnameData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start validasiPerintahStokOpnameByUuidService`, { perintahStokOpnameData }, req_identity)

    const beforeData = await getPerintahStokOpnameByUuidService(perintahStokOpnameData.perintah_stok_opname, req_identity)

    await getNeracaValidasiByTanggalService(null, `${beforeData.tahun}-${beforeData.bulan_transaksi}-${getTanggalTerakhirPadaBulan(beforeData.tahun, beforeData.bulan_transaksi)}`, req_identity)

    await perintahStokOpnemeAllowToValidasiService(perintahStokOpnameData.validasi, perintahStokOpnameData.perintah_stok_opname, req_identity)

    const perintahStokOpname = await validasiPerintahStokOpnameByUuidRepo(perintahStokOpnameData, req_identity)

    if (perintahStokOpnameData.validasi == 1) {
        await getJurnalPerintahStokOpnameRepo(beforeData.bulan_transaksi, beforeData.tahun, beforeData.uuid, req_identity)
    } else {
        await removeJurnalPerintahStokOpanameRepo(beforeData.uuid, req_identity)
    }

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        perintahStokOpnameData
    }, req_identity)

    return perintahStokOpname
}

const perintahStokOpnemeAllowToValidasiService = async (validasi, perintah_stok_opname, req_identity) => {
    LOGGER(logType.INFO, `Start perintahStokOpnemeAllowToValidasiService`, { validasi, perintah_stok_opname }, req_identity)

    const perintahStokOpnameData = await perintahStokOpnemeAllowToValidasiRepo(perintah_stok_opname, req_identity)

    if (perintahStokOpnameData.length > 0) {
        if (perintahStokOpnameData[0].tanggal_selesai == "BELUM SELESAI") {
            throw Error(JSON.stringify({
                message: `Perintah Stok Opname ${perintahStokOpnameData[0].nomor_surat_perintah} Belum Mengisi Penyesuaian Persediaan`,
                prop: "error"
            }))
        }
        if (validasi == 1 && perintahStokOpnameData[0].sudah_divalidasi_bulan_sebelum != null) {
            throw Error(JSON.stringify({
                message: `Perintah Stok Opname ${perintahStokOpnameData[0].sudah_divalidasi_bulan_sebelum} Belum Divalidasi`,
                prop: "error"
            }))
        }
        if (validasi == 0 && perintahStokOpnameData[0].sudah_divalidasi_bulan_sesudah != null) {
            throw Error(JSON.stringify({
                message: `Perintah Stok Opname Tidak Bisa Di Batal Validasi Karena ${perintahStokOpnameData[0].sudah_divalidasi_bulan_sesudah} Telah Divalidasi`,
                prop: "error"
            }))
        }
    }

}

export const perintahStokOpnemeAllowToEdit = async (perintah_stok_opname, req_identity) => {
    LOGGER(logType.INFO, `Start perintahStokOpnemeAllowToEdit`, { perintah_stok_opname }, req_identity)

    const perintahStokOpname = await perintahStokOpnameStatusRepo(perintah_stok_opname, req_identity)

    if (perintahStokOpname.length > 0) {
        if (perintahStokOpname[0].validasi > 0) {
            throw Error(JSON.stringify({
                message: `Perintah Stok Opname sudah divalidasi`,
                prop: "error"
            }))
        }
        if (perintahStokOpname[0].status_validasi > 0) {
            throw Error(JSON.stringify({
                message: `Neraca sudah divalidasi untuk Bulan ${getBulanText(perintahStokOpname[0].bulan - 1)} Tahun ${perintahStokOpname[0].tahun}`,
                prop: "error"
            }))
        }
    }

    return perintahStokOpname;
}

export const checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService = async (nomor_surat_perintah, bulan_transaksi, tahun, uuid, req_identity) => {
    LOGGER(logType.INFO, `Start checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiService`, { nomor_surat_perintah, bulan_transaksi, tahun }, req_identity)
    const perintahStokOpname = await checkPerintahStokOpnameByNomorSuratPerintahAndBulanTransaksiRepo(nomor_surat_perintah, bulan_transaksi, tahun, uuid, req_identity)

    if (perintahStokOpname.length > 0) {
        if (bulan_transaksi.length > 2) {
            if (perintahStokOpname[0].hasil_stok_opname_count > 0) {
                throw Error(JSON.stringify({
                    message: `Tidak Bisa Di Eksekusi Karena Bulan Transaksi Sudah Terdaftar Pada ${perintahStokOpname[0].nomor_surat_perintah} Bulan ${getBulanText(perintahStokOpname[0].bulan_transaksi - 1)} Tahun ${perintahStokOpname[0].tahun}`,
                    prop: "error"
                }))
            } else {
                return
            }
        }

        const perintahStokOpnameNomorSuratPerintahGet = perintahStokOpname.filter(x => x.nomor_surat_perintah == nomor_surat_perintah)
        if (perintahStokOpnameNomorSuratPerintahGet.length > 0) {
            throw Error(JSON.stringify({
                message: `Tidak Bisa Di Eksekusi Karena Nomor Surat Perintah Sudah Terdaftar`,
                prop: "error"
            }))
        }

        const perintahStokOpnameBulanTransaksiGet = perintahStokOpname.filter(x => x.bulan_transaksi == bulan_transaksi)
        if (perintahStokOpnameBulanTransaksiGet.length > 0) {
            throw Error(JSON.stringify({
                message: `Tidak Bisa Di Eksekusi Karena Bulan Transaksi Sudah Terdaftar Pada ${perintahStokOpnameBulanTransaksiGet[0].nomor_surat_perintah}`,
                prop: "error"
            }))
        }
    }
}

export const checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahService = async (uuid, sesudah, perintahStokOpnameData, req_identity) => {
    LOGGER(logType.INFO, `Start checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahService`, { sesudah, perintahStokOpnameData }, req_identity)
    const perintahStokOpname = await checkPerintahStokOpnameSudahAdaBulanTransaksiSebelumOrSesudahRepo(uuid, sesudah, perintahStokOpnameData, req_identity)

    if (perintahStokOpname.length > 0) {
        if (sesudah == false && perintahStokOpname[0].count == 0 && parseInt(perintahStokOpnameData.bulan_transaksi) > 1) {
            throw Error(JSON.stringify({
                message: `Tidak Bisa Di Eksekusi, Belum Ada Perintah Stok Opname Pada Bulan ${getBulanText(parseInt(perintahStokOpnameData.bulan_transaksi) - 2)}`,
                prop: "error"
            }))
        }
        if (sesudah == true && perintahStokOpname[0].count && parseInt(perintahStokOpnameData.bulan_transaksi) < 12) {
            throw Error(JSON.stringify({
                message: `Tidak Bisa Di Eksekusi, Sudah Ada Perintah Stok Opname Pada Bulan ${getBulanText(parseInt(perintahStokOpnameData.bulan_transaksi))}`,
                prop: "error"
            }))
        }
    }
}