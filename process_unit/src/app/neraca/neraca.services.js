import { getLabaRugiReport } from "../../utils/labaRugiUtil.js"
import { getNeracaSaldoReport } from "../../utils/neracaSaldoUtil.js"
import { getNeracaReport } from "../../utils/neracaUtils.js"
import { getAllNeracaSaldoByBulanService } from "../neraca_saldo/neracaSaldo.services.js"
import { createNeracaRepo, deleteNeracaByBulanAndTahun, getNeracaByBulanAndTahun } from "./neraca.repository.js"

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
        await createNeracaRepo(neracaData)
        return neraca
    }else{
        throw Error(JSON.stringify({
            message: "Neraca bulan sebelumnya belum divalidasi",
            field: "error"
        }))
    }
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
    if (bulan == 0) {
        bulan = 12
        tahun = tahun - 1
    }
    if (tahun == 2023) {
        return Array(1)
    }
    bulan = bulan < 10 ? "0" + bulan : bulan
    const returnData = await getNeracaByBulanAndTahun(bulan, tahun)
    return returnData
}