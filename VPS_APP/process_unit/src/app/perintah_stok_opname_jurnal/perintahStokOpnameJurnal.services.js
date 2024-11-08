import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { generatePaginationResponse } from "../../utils/paginationUtil.js"
import { createPerintahStokOpnameJurnalRepo, deletePerintahStokOpnameJurnalByUuidRepo, generatePerintahStokOpnameQueryRepo, getAllPerintahStokOpnameJurnalRepo, getPerintahStokOpnameJurnalByUuidRepo, updatePerintahStokOpnameJurnalByUuidRepo } from "./perintahStokOpnameJurnal.repository.js"

export const getAllPerintahStokOpnameJurnalService = async (query, req_identity) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameJurnalService", null, req_identity)

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

    const perintahStokOpnameJurnals = await getAllPerintahStokOpnameJurnalRepo(pageNumber, size, search, req_identity)
    return generatePaginationResponse(perintahStokOpnameJurnals.entry, perintahStokOpnameJurnals.count, perintahStokOpnameJurnals.pageNumber, perintahStokOpnameJurnals.size)
}

export const getPerintahStokOpnameJurnalByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getPerintahStokOpnameJurnalByUuidService [${uuid}]`, null, req_identity)
    const perintahStokOpnameJurnal = await getPerintahStokOpnameJurnalByUuidRepo(uuid, req_identity)

    if (!perintahStokOpnameJurnal) {
        throw Error(JSON.stringify({
            message: "Data Not Found",
            prop: "error"
        }))
    }
    return perintahStokOpnameJurnal
}

export const createPerintahStokOpnameJurnalService = async (perintahStokOpnameJurnalData, req_identity) => {
    LOGGER(logType.INFO, `Start createPerintahStokOpnameJurnalService`, perintahStokOpnameJurnalData, req_identity)
    perintahStokOpnameJurnalData.enabled = 1

    const perintahStokOpnameJurnal = await createPerintahStokOpnameJurnalRepo(perintahStokOpnameJurnalData, req_identity)
    return perintahStokOpnameJurnal
}

export const deletePerintahStokOpnameJurnalByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deletePerintahStokOpnameJurnalByUuidService [${uuid}]`, null, req_identity)
    await getPerintahStokOpnameJurnalByUuidService(uuid, req_identity)
    await deletePerintahStokOpnameJurnalByUuidRepo(uuid, req_identity)
    return true
}

export const updatePerintahStokOpnameJurnalByUuidService = async (uuid, perintahStokOpnameJurnalData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updatePerintahStokOpnameJurnalByUuidService [${uuid}]`, perintahStokOpnameJurnalData, req_identity)
    const beforeData = await getPerintahStokOpnameJurnalByUuidService(uuid, req_identity)
    const perintahStokOpnameJurnal = await updatePerintahStokOpnameJurnalByUuidRepo(uuid, perintahStokOpnameJurnalData, req_identity)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        perintahStokOpnameJurnalData
    }, req_identity)

    return perintahStokOpnameJurnal
}

export const generatePerintahStokOpnameQueryService = async (uuid, bulan, tahun, forNeraca, req_identity) => {
    const daftarData = await generatePerintahStokOpnameQueryRepo(uuid, bulan, tahun, req_identity)

    if (uuid) {
        uuid = Array.isArray(uuid) ? uuid : [uuid]
    }

    let listDataSelected = []
    daftarData.map(x => {
        x.detail_json = JSON.parse(x.detail_json)
        x.detail_data = JSON.parse(x.detail_data)
        return x
    }).map(x => {
        x.detail_json.map((y, iy) => {

            if (uuid) {
                if (uuid.indexOf(JSON.parse(y.kode_akun_perkiraan).uuid) > -1) {
                    if (y.debet > 0 || y.kredit > 0) {
                        let dataInput = {
                            uuid: x.uuid,
                            bukti_transaksi: x.bukti_transaksi,
                            sumber: x.sumber,
                            tahun: x.tahun,
                            bulan: x.bulan,
                            tanggal: x.tanggal,
                            waktu: x.waktu ? x.waktu : x.tanggal,
                            transaksi: 1,
                            uraian: x.uraian,
                            kode_akun: JSON.parse(y.kode_akun_perkiraan).code,
                            type_akun: JSON.parse(y.kode_akun_perkiraan).type,
                            nama_akun: JSON.parse(y.kode_akun_perkiraan).name,
                            uuid_akun: JSON.parse(y.kode_akun_perkiraan).uuid,
                            debet: y.debet,
                            kredit: y.kredit,
                            detail_data: x.detail_data
                        }

                        listDataSelected.push(dataInput)
                    }
                }
            } else {
                if (y.debet > 0 || y.kredit > 0) {
                    let dataInput = {
                        uuid: x.uuid,
                        bukti_transaksi: x.bukti_transaksi,
                        sumber: x.sumber,
                        tahun: x.tahun,
                        bulan: x.bulan,
                        tanggal: x.tanggal,
                        waktu: x.waktu ? x.waktu : x.tanggal,
                        transaksi: 1,
                        uraian: x.uraian,
                        kode_akun: JSON.parse(y.kode_akun_perkiraan).code,
                        type_akun: JSON.parse(y.kode_akun_perkiraan).type,
                        nama_akun: JSON.parse(y.kode_akun_perkiraan).name,
                        uuid_akun: JSON.parse(y.kode_akun_perkiraan).uuid,
                        debet: y.debet,
                        kredit: y.kredit,
                        detail_data: x.detail_data
                    }

                    listDataSelected.push(dataInput)
                }
            }
        })
    })

    const queryString = listDataSelected.map((x, i) => {
        return !forNeraca ? `
            SELECT 
                "${x.uuid}" AS uuid,
                "${x.bukti_transaksi}" AS bukti_transaksi,
                LPAD(DAY("${x.tanggal}"), 2, '0') AS tanggal,
                LPAD(MONTH("${x.tanggal}"), 2, '0') AS bulan,
                ${x.tahun} AS tahun,
                TIME("${x.tanggal}") AS waktu,
                ${x.debet} AS debet,
                ${x.kredit} AS kredit,
                ${x.kode_akun} AS kode_akun,
                "${x.nama_akun}" AS nama_akun,
                "${x.type_akun}" AS type_akun,
                "${x.sumber} ${x.detail_data.daftar_barang_name} ${x.detail_data.jumlah} ${x.detail_data.satuan_barang_name} Diskon ${x.detail_data.diskon_persentase} % ( ${x.detail_data.daftar_gudang_name} ) Oleh ${x.detail_data.customer_name}" AS uraian,
                "${x.sumber}" AS sumber,
                1 AS enabled
        ` : `
            SELECT 
                "${x.uuid_akun}" AS kode_akun_perkiraan,
                LPAD(MONTH("${x.tanggal}"), 2, '0') AS bulan,
                YEAR("${x.tanggal}") AS tahun,
                ${x.debet} AS debet,
                ${x.kredit} AS kredit
        `
    })

    return `${queryString.join("UNION ALL")} ${queryString.length > 0 ? "UNION ALL" : ""}`
}