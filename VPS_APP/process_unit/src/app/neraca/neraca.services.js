import { getLabaRugiReport } from "../../utils/labaRugiUtil.js"
import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getBulanText } from "../../utils/mathUtil.js"
import { getNeracaSaldoReport } from "../../utils/neracaSaldoUtil.js"
import { getNeracaReport } from "../../utils/neracaUtils.js"
import { getAllNeracaSaldoByBulanService } from "../neraca_saldo/neracaSaldo.services.js"
import { createNeracaRepo, deleteNeracaByBulanAndTahun, getNeracaByBulanAndTahun, getNeracaValidasiByTanggalRepo } from "./neraca.repository.js"

export const getNeracaReportService = async (bulan, tahun, validate, whereIN, req_identity) => {
    const data = await getAllNeracaSaldoByBulanService(bulan, tahun, whereIN, req_identity)
    const neracaSaldos = await getNeracaSaldoReport(data)
    const laba_rugi = await getLabaRugiReport(neracaSaldos)
    const neracas = await getNeracaReport(neracaSaldos, laba_rugi, bulan, tahun, validate)
    return neracas
}

export const validasiNeracaServices = async (bulan, tahun, req_identity) => {
    const validasi = await getNeracaSaldoByBulanAndTahunServices(bulan - 1, tahun, req_identity)

    if (validasi.length > 0) {
        const neraca = await getNeracaReportService(bulan, tahun, true, null, req_identity)
        bulan = bulan < 10 ? "0" + bulan : bulan
        const neracaData = {
            bulan: bulan,
            tahun: tahun,
            json: JSON.stringify(neraca)
        }
        await createNeracaRepo(neracaData, req_identity)
        return neraca
    } else {
        throw Error(JSON.stringify({
            message: "Neraca bulan sebelumnya belum divalidasi",
            prop: "error"
        }))
    }
}

export const deleteValidasiNeracaByBulanAndTahunServices = async (bulan, tahun, req_identity) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    await deleteNeracaByBulanAndTahun(bulan, tahun, req_identity)
}

export const getNeracaSaldoBulanSebelumnya = async (bulan, tahun, req_identity) => {
    bulan = parseFloat(bulan) - 1
    if (bulan == 0) {
        bulan = 12
        tahun = tahun - 1
    }
    bulan = bulan < 10 ? "0" + bulan : bulan
    return await getNeracaByBulanAndTahun(bulan, tahun, req_identity)
}

export const getNeracaSaldoByBulanAndTahunServices = async (bulan, tahun, req_identity) => {
    if (bulan == 0) {
        bulan = 12
        tahun = tahun - 1
    }
    if (tahun == 2023) {
        return Array(1)
    }
    bulan = bulan < 10 ? "0" + bulan : bulan
    const returnData = await getNeracaByBulanAndTahun(bulan, tahun, req_identity)
    return returnData
}

export const getNeracaValidasiByTanggalService = async (addMessage, tanggal, req_identity) => {
    LOGGER(logType.INFO, `Start getNeracaValidasiByTanggalService`, { addMessage, tanggal, req_identity }, req_identity)
    const neracaValidasi = await getNeracaValidasiByTanggalRepo(tanggal, req_identity)

    if (neracaValidasi.length > 0 && neracaValidasi[0].count > 0) {
        throw Error(JSON.stringify({
            message: `${addMessage ? addMessage : ""}Neraca sudah divalidasi untuk Bulan ${getBulanText(neracaValidasi[0].bulan - 1)} Tahun ${neracaValidasi[0].tahun}`,
            prop: "error"
        }))
    }
}