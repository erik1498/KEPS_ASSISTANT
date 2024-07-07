import { convertNeracaToJurnalUmum } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getNeracaSaldoBulanSebelumnya, getNeracaSaldoByBulanAndTahunServices } from "../neraca/neraca.services.js"
import { createJurnalUmumRepo, deleteJurnalUmumByBuktiTransaksiRepo, deleteJurnalUmumByUuidRepo, getJurnalUmumByBuktiTransaksiAllDataRepo, getJurnalUmumByBuktiTransaksiRepo, getJurnalUmumByBulanRepo, getJurnalUmumByUuidRepo, getJurnalUmumLabaRugiByBulanRepo, getJurnalUmumNeracaByBulanRepo, updateJurnalUmumByUuidRepo } from "./jurnalUmum.repository.js"

export const getJurnalUmumByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start getJurnalUmumByUuidService [${uuid}]`, null, req_id)
    const jurnalUmum = await getJurnalUmumByUuidRepo(uuid, req_id)

    if (!jurnalUmum) {
        throw Error("data not found")
    }
    return jurnalUmum
}

export const getJurnalUmumByBulanSebelumService = async (bulan, tahun, req_id) => {
    LOGGER(logType.INFO, `Start getJurnalUmumByBulanSebelumService [${bulan}, ${tahun}]`, null, req_id)
    const neracaSebelumnya = await getNeracaSaldoBulanSebelumnya(bulan, tahun, req_id);
    if (neracaSebelumnya.length == 0) {
        return []
    } else {
        const laporanNeracaSebelummnya = JSON.parse(neracaSebelumnya[0].json)
        const jurnalUmumBulanSebelum = await convertNeracaToJurnalUmum(
            laporanNeracaSebelummnya?.harta?.data
                .concat(laporanNeracaSebelummnya?.utang?.data)
                .concat(laporanNeracaSebelummnya?.modal?.data)
            , bulan, tahun)
        return jurnalUmumBulanSebelum
    }
}

export const getJurnalUmumNeracaByBulanService = async (bulan, req_id) => {
    LOGGER(logType.INFO, `Start getJurnalUmumNeracaByBulanService [${bulan}]`)
    const jurnalUmum = await getJurnalUmumNeracaByBulanRepo(bulan, req_id)

    if (!jurnalUmum) {
        throw Error("data not found")
    }
    return jurnalUmum
}

export const getJurnalUmumLabaRugiByBulanService = async (bulan, req_id) => {
    LOGGER(logType.INFO, `Start getJurnalUmumLabaRugiByBulanService [${bulan}]`)
    const jurnalUmum = await getJurnalUmumLabaRugiByBulanRepo(bulan, req_id)

    if (!jurnalUmum) {
        throw Error("data not found")
    }
    return jurnalUmum
}

export const getJurnalUmumByBulanService = async (bulan, tahun, sorting, search, req_id) => {
    LOGGER(logType.INFO, `Start getJurnalUmumByBulanService [${bulan} ${sorting} ${search}]`, null, req_id)
    const jurnalUmumBulanSebelum = await getJurnalUmumByBulanSebelumService(bulan, tahun, req_id)
    const jurnalUmum = await getJurnalUmumByBulanRepo(bulan, tahun, search, sorting, req_id)
    return jurnalUmumBulanSebelum.concat(...jurnalUmum)
}

export const createJurnalUmumService = async (jurnalUmumData, req_id) => {
    LOGGER(logType.INFO, `Start createJurnalUmumService`, jurnalUmumData, req_id)
    jurnalUmumData.tanggal = parseFloat(jurnalUmumData.tanggal) < 10 ? "0" + jurnalUmumData.tanggal : jurnalUmumData.tanggal
    jurnalUmumData.enabled = 1
    
    const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(jurnalUmumData.bulan, jurnalUmumData.tahun, req_id);
    jurnalUmumData.bulan = parseFloat(jurnalUmumData.bulan) < 10 ? "0" + jurnalUmumData.bulan : jurnalUmumData.bulan
    
    if (getDataValidasi.length) {
        throw Error(JSON.stringify({
            message: "Neraca bulan ini sudah di validasi",
            field: "errorMessage"
        }))
    }

    const jurnalUmumWithSameBuktiTransaksi = await getJurnalUmumByBuktiTransaksiRepo(jurnalUmumData.bukti_transaksi, jurnalUmumData.uuidList, req_id)

    LOGGER(logType.INFO, "JURNAL UMUM BUKTI TRANSAKSI", jurnalUmumWithSameBuktiTransaksi, req_id)

    if (jurnalUmumWithSameBuktiTransaksi.length > 0 && jurnalUmumWithSameBuktiTransaksi[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Bukti Transaksi Sudah Terdaftar",
            field: "buktiTransaksi"
        }))
    }

    const { uuidList, ...jurnalUmumDataCopy } = jurnalUmumData

    const jurnalUmum = await createJurnalUmumRepo(jurnalUmumDataCopy, req_id)
    return jurnalUmum
}

export const deleteJurnalUmumByUuidService = async (uuid, req_id) => {
    LOGGER(logType.INFO, `Start deleteJurnalUmumByUuidService [${uuid}]`, null, req_id)
    const jurnalUmumData = await getJurnalUmumByUuidService(uuid, req_id)

    const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(parseFloat(jurnalUmumData.bulan), jurnalUmumData.tahun, req_id);

    if (getDataValidasi.length) {
        throw Error(JSON.stringify({
            message: "Neraca bulan ini sudah di validasi",
            field: "buktiTransaksi"
        }))
    }

    await deleteJurnalUmumByUuidRepo(uuid, req_id)
    return true
}

export const deleteJurnalUmumByBuktiTransaksiService = async (bukti_transaksi, req_id) => {
    LOGGER(logType.INFO, `Start deleteJurnalUmumByBuktiTransaksiService [${bukti_transaksi}]`, null, req_id)

    const jurnalUmumData = await getJurnalUmumByBuktiTransaksiAllDataRepo(bukti_transaksi, "EMPTY", req_id);

    if (jurnalUmumData.length > 0) {
        const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(parseFloat(jurnalUmumData[0].bulan), jurnalUmumData[0].tahun, req_id);

        if (getDataValidasi.length) {
            throw Error(JSON.stringify({
                message: "Neraca bulan ini sudah di validasi",
                field: "buktiTransaksi"
            }))
        }
    }

    await deleteJurnalUmumByBuktiTransaksiRepo(bukti_transaksi, req_id)
    return true
}

export const updateJurnalUmumByUuidService = async (uuid, jurnalUmumData, req_id, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJurnalUmumByUuidService [${uuid}]`, jurnalUmumData, req_id)
    let beforeData = await getJurnalUmumByUuidService(uuid, req_id)
    jurnalUmumData.tanggal = parseFloat(jurnalUmumData.tanggal) < 10 ? "0" + jurnalUmumData.tanggal : jurnalUmumData.tanggal

    const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(jurnalUmumData.bulan, jurnalUmumData.tahun, req_id);
    jurnalUmumData.bulan = parseFloat(jurnalUmumData.bulan) < 10 ? "0" + jurnalUmumData.bulan : jurnalUmumData.bulan
    
    if (getDataValidasi.length) {
        throw Error(JSON.stringify({
            message: "Neraca bulan ini sudah di validasi",
            field: "errorMessage"
        }))
    }

    const jurnalUmumWithSameBuktiTransaksi = await getJurnalUmumByBuktiTransaksiRepo(jurnalUmumData.bukti_transaksi, jurnalUmumData.uuidList, req_id)

    LOGGER(logType.INFO, "JURNAL UMUM BUKTI TRANSAKSI", jurnalUmumWithSameBuktiTransaksi, req_id)

    if (jurnalUmumWithSameBuktiTransaksi.length > 0 && jurnalUmumWithSameBuktiTransaksi[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Bukti Transaksi Sudah Terdaftar",
            field: "buktiTransaksi"
        }))
    }

    const { uuidList, ...jurnalUmumDataCopy } = jurnalUmumData

    const jurnalUmum = await updateJurnalUmumByUuidRepo(uuid, jurnalUmumDataCopy, req_id)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jurnalUmumDataCopy
    }, req_id)
    return jurnalUmum
}