import { getLabaRugiReport } from "../../utils/labaRugiUtil.js"
import { getNeracaSaldoReport } from "../../utils/neracaSaldoUtil.js"
import { getNeracaReport } from "../../utils/neracaUtils.js"
import { getAllNeracaSaldoByBulanService } from "../neraca_saldo/neracaSaldo.services.js"
import { createNeracaRepo, deleteNeracaByBulanAndTahun, getNeracaByBulanAndTahun } from "./neraca.repository.js"

export const getNeracaReportService = async (bulan, tahun, whereIN, req_identity) => {
    const data = await getAllNeracaSaldoByBulanService(bulan, tahun, whereIN, req_identity)
    const neracaSaldos = await getNeracaSaldoReport(data)
    const laba_rugi = await getLabaRugiReport(neracaSaldos)
    const neracas = await getNeracaReport(neracaSaldos, laba_rugi, bulan, tahun)
    return neracas
}

export const validasiNeracaServices = async (bulan, tahun, req_identity) => {
    const neraca = await getNeracaReportService(bulan, tahun, null, req_identity)
    bulan = bulan < 10 ? "0" + bulan : bulan
    const neracaData = {
        bulan: bulan,
        tahun: tahun,
        json: JSON.stringify(neraca)
    }
    await createNeracaRepo(neracaData)
    return neraca
}

export const deleteValidasiNeracaByBulanAndTahunServices = async (bulan, tahun, req_identity) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    await deleteNeracaByBulanAndTahun(bulan, tahun)
}

export const getNeracaSaldoBulanSebelumnya = async (bulan, tahun, req_identity) => {
    bulan = parseFloat(bulan) - 1
    if (bulan == 0) {
        bulan = 12
        tahun = tahun - 1
    }
    bulan = bulan < 10 ? "0" + bulan : bulan
    return await getNeracaByBulanAndTahun(bulan, tahun)
}

export const getNeracaSaldoByBulanAndTahunServices = async (bulan, tahun, req_identity) => {
    bulan = bulan < 10 ? "0" + bulan : bulan
    return await getNeracaByBulanAndTahun(bulan, tahun)
}