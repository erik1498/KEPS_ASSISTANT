import { convertNeracaToJurnalUmum } from "../../utils/jurnalUmumUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"
import { getNeracaSaldoBulanSebelumnya, getNeracaSaldoByBulanAndTahunServices } from "../neraca/neraca.services.js"
import { createJurnalUmumRepo, deleteJurnalUmumByBuktiTransaksiRepo, deleteJurnalUmumByUuidRepo, getJurnalUmumByBuktiTransaksiRepo, getJurnalUmumByBulanRepo, getJurnalUmumByUuidRepo, getJurnalUmumLabaRugiByBulanRepo, getJurnalUmumNeracaByBulanRepo, updateJurnalUmumByUuidRepo } from "./jurnalUmum.repository.js"

export const getJurnalUmumByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start getJurnalUmumByUuidService [${uuid}]`, null, req_identity)
    const jurnalUmum = await getJurnalUmumByUuidRepo(uuid)

    if (!jurnalUmum) {
        throw Error("data not found")
    }
    return jurnalUmum
}

export const getJurnalUmumByBulanSebelumService = async (bulan, tahun, req_identity) => {
    LOGGER(logType.INFO, `Start getJurnalUmumByBulanSebelumService [${bulan}, ${tahun}]`, null, req_identity)
    const neracaSebelumnya = await getNeracaSaldoBulanSebelumnya(bulan, tahun, null, req_identity);
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

export const getJurnalUmumNeracaByBulanService = async (bulan) => {
    LOGGER(logType.INFO, `Start getJurnalUmumNeracaByBulanService [${bulan}]`)
    const jurnalUmum = await getJurnalUmumNeracaByBulanRepo(bulan)

    if (!jurnalUmum) {
        throw Error("data not found")
    }
    return jurnalUmum
}

export const getJurnalUmumLabaRugiByBulanService = async (bulan) => {
    LOGGER(logType.INFO, `Start getJurnalUmumLabaRugiByBulanService [${bulan}]`)
    const jurnalUmum = await getJurnalUmumLabaRugiByBulanRepo(bulan)

    if (!jurnalUmum) {
        throw Error("data not found")
    }
    return jurnalUmum
}

export const getJurnalUmumByBulanService = async (bulan, tahun, sorting, search, req_identity) => {
    LOGGER(logType.INFO, `Start getJurnalUmumByBulanService [${bulan} ${sorting} ${search}]`, null, req_identity)
    const jurnalUmumBulanSebelum = await getJurnalUmumByBulanSebelumService(bulan, tahun, req_identity)
    const jurnalUmum = await getJurnalUmumByBulanRepo(bulan, tahun, search, sorting)
    return jurnalUmumBulanSebelum.concat(...jurnalUmum)
}

export const createJurnalUmumService = async (jurnalUmumData, req_identity) => {
    LOGGER(logType.INFO, `Start createJurnalUmumService`, jurnalUmumData, req_identity)
    jurnalUmumData.tanggal = parseFloat(jurnalUmumData.tanggal) < 10 ? "0" + jurnalUmumData.tanggal : jurnalUmumData.tanggal
    jurnalUmumData.bulan = parseFloat(jurnalUmumData.bulan) < 10 ? "0" + jurnalUmumData.bulan : jurnalUmumData.bulan
    jurnalUmumData.enabled = true

    const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(jurnalUmumData.bulan, jurnalUmumData.tahun);

    if (getDataValidasi.length) {
        throw Error(JSON.stringify({
            message: "Neraca bulan ini sudah di validasi",
            field: "buktiTransaksi"
        }))
    }

    const jurnalUmumWithSameBuktiTransaksi = await getJurnalUmumByBuktiTransaksiRepo(jurnalUmumData.bukti_transaksi, jurnalUmumData.uuidList)

    LOGGER(logType.INFO, "JURNAL UMUM BUKTI TRANSAKSI", jurnalUmumWithSameBuktiTransaksi, req_identity)

    if (jurnalUmumWithSameBuktiTransaksi.length > 0 && jurnalUmumWithSameBuktiTransaksi[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Bukti Transaksi Sudah Terdaftar",
            field: "buktiTransaksi"
        }))
    }

    const { uuidList, ...jurnalUmumDataCopy } = jurnalUmumData

    const jurnalUmum = await createJurnalUmumRepo(jurnalUmumDataCopy)
    return jurnalUmum
}

export const deleteJurnalUmumByUuidService = async (uuid, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJurnalUmumByUuidService [${uuid}]`, null, req_identity)
    const jurnalUmumData = await getJurnalUmumByUuidService(uuid, req_identity)

    const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(jurnalUmumData.bulan, jurnalUmumData.tahun);

    if (getDataValidasi.length) {
        throw Error(JSON.stringify({
            message: "Neraca bulan ini sudah di validasi",
            field: "buktiTransaksi"
        }))
    }

    await deleteJurnalUmumByUuidRepo(uuid)
    return true
}

export const deleteJurnalUmumByBuktiTransaksiService = async (bukti_transaksi, req_identity) => {
    LOGGER(logType.INFO, `Start deleteJurnalUmumByBuktiTransaksiService [${bukti_transaksi}]`, null, req_identity)

    const jurnalUmumData = await getJurnalUmumByBuktiTransaksiRepo(bukti_transaksi);

    if (jurnalUmumData.length > 0) {
        const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(jurnalUmumData[0].bulan, jurnalUmumData[0].tahun);

        if (getDataValidasi.length) {
            throw Error(JSON.stringify({
                message: "Neraca bulan ini sudah di validasi",
                field: "buktiTransaksi"
            }))
        }
    }

    await deleteJurnalUmumByBuktiTransaksiRepo(bukti_transaksi)
    return true
}

export const updateJurnalUmumByUuidService = async (uuid, jurnalUmumData, req_identity, req_original_url, req_method) => {
    LOGGER(logType.INFO, `Start updateJurnalUmumByUuidService [${uuid}]`, jurnalUmumData, req_identity)
    let beforeData = await getJurnalUmumByUuidService(uuid, req_identity)
    jurnalUmumData.tanggal = parseFloat(jurnalUmumData.tanggal) < 10 ? "0" + jurnalUmumData.tanggal : jurnalUmumData.tanggal
    jurnalUmumData.bulan = parseFloat(jurnalUmumData.bulan) < 10 ? "0" + jurnalUmumData.bulan : jurnalUmumData.bulan

    const getDataValidasi = await getNeracaSaldoByBulanAndTahunServices(jurnalUmumData.bulan, jurnalUmumData.tahun);

    if (getDataValidasi.length) {
        throw Error(JSON.stringify({
            message: "Neraca bulan ini sudah di validasi",
            field: "buktiTransaksi"
        }))
    }

    const jurnalUmumWithSameBuktiTransaksi = await getJurnalUmumByBuktiTransaksiRepo(jurnalUmumData.bukti_transaksi, jurnalUmumData.uuidList)

    LOGGER(logType.INFO, "JURNAL UMUM BUKTI TRANSAKSI", jurnalUmumWithSameBuktiTransaksi, req_identity)

    if (jurnalUmumWithSameBuktiTransaksi.length > 0 && jurnalUmumWithSameBuktiTransaksi[0].count > 0) {
        throw Error(JSON.stringify({
            message: "Bukti Transaksi Sudah Terdaftar",
            field: "buktiTransaksi"
        }))
    }

    const { uuidList, ...jurnalUmumDataCopy } = jurnalUmumData

    const jurnalUmum = await updateJurnalUmumByUuidRepo(uuid, jurnalUmumDataCopy)

    LOGGER_MONITOR(req_original_url, req_method, {
        beforeData,
        jurnalUmumDataCopy
    }, req_identity)
    return jurnalUmum
}