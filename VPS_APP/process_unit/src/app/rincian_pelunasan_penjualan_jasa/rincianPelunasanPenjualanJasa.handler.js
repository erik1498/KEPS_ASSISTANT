import { rincianPelunasanPenjualanJasaValidation } from "./rincianPelunasanPenjualanJasa.validation.js"
import { createRincianPelunasanPenjualanJasaService, deleteRincianPelunasanPenjualanJasaByUuidService, getAllRincianPelunasanPenjualanJasaService, getAllRincianPesananPenjualanJasaByPelunasanPenjualanService, getAllRincianPesananPenjualanJasaByTanggalService, getRincianPelunasanPenjualanJasaByUuidService, updateRincianPelunasanPenjualanJasaByUuidService } from "./rincianPelunasanPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPelunasanPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanJasaController", null, req.identity)
    try {
        const rincianPelunasanPenjualanJasas = await getAllRincianPelunasanPenjualanJasaService(req.query, req.identity)
        res.json({
            data: rincianPelunasanPenjualanJasas,
            message: "Get Data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getAllRincianPesananPenjualanJasaByTanggal = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanJasaByTanggal", null, req.identity)
    try {
        const { tanggal, faktur_penjualan_jasa } = req.body

        res.json({
            data: await getAllRincianPesananPenjualanJasaByTanggalService(tanggal, faktur_penjualan_jasa, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getAllRincianPesananPenjualanJasaByPelunasanPenjualan = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanJasaByPelunasanPenjualan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPenjualanJasaByPelunasanPenjualanService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const getRincianPelunasanPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPelunasanPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPelunasanPenjualanJasaByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const postCreateRincianPelunasanPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPelunasanPenjualanJasaController", null, req.identity)
    try {
        const rincianPelunasanPenjualanJasaData = req.body
        const { error, value } = rincianPelunasanPenjualanJasaValidation(rincianPelunasanPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPelunasanPenjualanJasa = await createRincianPelunasanPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPelunasanPenjualanJasa, req.identity)
        res.json({
            data: rincianPelunasanPenjualanJasa,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const deleteRincianPelunasanPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPelunasanPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPelunasanPenjualanJasaByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}

export const updateRincianPelunasanPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPelunasanPenjualanJasaByUuidController", null, req.identity)
    try {
        const rincianPelunasanPenjualanJasaData = req.body
        const { error, value } = rincianPelunasanPenjualanJasaValidation(rincianPelunasanPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPelunasanPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            errorData: error.message
        })
    }
}