import { LOGGER, logType } from "../../utils/loggerUtil.js"
import { getBulanText } from "../../utils/mathUtil.js"
import { NERACA_PATH, generatePDF } from "../../utils/pdfUtil.js"
import { deleteValidasiNeracaByBulanAndTahunServices, getNeracaSaldoByBulanAndTahunServices, getNeracaReportService, validasiNeracaServices } from "./neraca.services.js"

export const getAllNeracaByBulanController = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllNeracaByBulanController", null, req.identity)
    try {

        const { print } = req.query
        const { bulan, tahun } = req.params

        if (print) {
            const neracas = await getNeracaReportService(bulan, tahun, null, req.identity)
            neracas.bulan = getBulanText(bulan - 1)
            return await generatePDF(NERACA_PATH, neracas, res, req.identity)
        }

        const neracas = await getNeracaReportService(bulan, tahun, null, req.identity)
        res.json({
            data: neracas,
            message: "Get Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const validasiNeracaController = async (req, res) => {
    LOGGER(logType.INFO, "Start validasiNeracaController", null, req.identity)
    try {
        const { bulan, tahun } = req.body
        const validasi = await validasiNeracaServices(bulan, tahun, req.identity)
        res.json({
            data: validasi,
            message: "Validasi Neraca Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const deleteValidasiNeracaByBulanAndTahunController = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteValidasiNeracaByBulanAndTahunController", null, req.identity)
    try {
        const { bulan, tahun } = req.body
        deleteValidasiNeracaByBulanAndTahunServices(bulan, tahun, req.identity)
        res.json({
            message: "Batal Validasi Neraca Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}


export const checkValidasiNeracaController = async (req, res) => {
    LOGGER(logType.INFO, "Start checkValidasiNeracaController", null, req.identity)
    try {
        const validasi = await getNeracaSaldoByBulanAndTahunServices(req.params.bulan, req.params.tahun, req.identity)
        res.json({
            validasi: validasi.length > 0 ? true : false,
            uuid: validasi.length > 0 ? validasi[0].uuid : null,
            message: "Validasi Neraca Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
} 