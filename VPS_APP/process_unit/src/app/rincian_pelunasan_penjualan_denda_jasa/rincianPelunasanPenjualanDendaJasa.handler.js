import { rincianPelunasanPenjualanDendaJasaValidation } from "./rincianPelunasanPenjualanDendaJasa.validation.js"
import { createRincianPelunasanPenjualanDendaJasaService, deleteRincianPelunasanPenjualanDendaJasaByUuidService, getAllRincianPelunasanPenjualanDendaJasaService, getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanService, getRincianPelunasanPenjualanDendaJasaByUuidService, updateRincianPelunasanPenjualanDendaJasaByUuidService } from "./rincianPelunasanPenjualanDendaJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPelunasanPenjualanDendaJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanDendaJasaController", null, req.identity)
    try {
        const rincianPelunasanPenjualanDendaJasas = await getAllRincianPelunasanPenjualanDendaJasaService(req.query, req.identity)
        res.json({
            data: rincianPelunasanPenjualanDendaJasas,
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

export const getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualan = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPenjualanDendaJasaByPelunasanPenjualanService(uuid, false, req.identity),
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

export const getRincianPelunasanPenjualanDendaJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPelunasanPenjualanDendaJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPelunasanPenjualanDendaJasaByUuidService(uuid, req.identity),
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

export const postCreateRincianPelunasanPenjualanDendaJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPelunasanPenjualanDendaJasaController", null, req.identity)
    try {
        const rincianPelunasanPenjualanDendaJasaData = req.body
        const { error, value } = rincianPelunasanPenjualanDendaJasaValidation(rincianPelunasanPenjualanDendaJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPelunasanPenjualanDendaJasa = await createRincianPelunasanPenjualanDendaJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPelunasanPenjualanDendaJasa, req.identity)
        res.json({
            data: rincianPelunasanPenjualanDendaJasa,
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

export const deleteRincianPelunasanPenjualanDendaJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPelunasanPenjualanDendaJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPelunasanPenjualanDendaJasaByUuidService(uuid, req.identity)
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

export const updateRincianPelunasanPenjualanDendaJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPelunasanPenjualanDendaJasaByUuidController", null, req.identity)
    try {    
        const rincianPelunasanPenjualanDendaJasaData = req.body
        const { error, value } = rincianPelunasanPenjualanDendaJasaValidation(rincianPelunasanPenjualanDendaJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPelunasanPenjualanDendaJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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