import { rincianPesananPenjualanJasaValidation } from "./rincianPesananPenjualanJasa.validation.js"
import { createRincianPesananPenjualanJasaService, deleteRincianPesananPenjualanJasaByUuidService, getAllRincianPesananPenjualanJasaService, getRincianPesananPenjualanJasaByPesananPenjualanUUIDService, updateRincianPesananPenjualanJasaByUuidService } from "./rincianPesananPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPesananPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanJasaController", null, req.identity)
    try {
        const rincianPesananPenjualanJasas = await getAllRincianPesananPenjualanJasaService(req.query, req.identity)
        res.json({
            data: rincianPesananPenjualanJasas,
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

export const getRincianPesananPenjualanJasaByPesananPenjualanUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPesananPenjualanJasaByPesananPenjualanUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPesananPenjualanJasaByPesananPenjualanUUIDService(uuid, req.identity),
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

export const postCreateRincianPesananPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPesananPenjualanJasaController", null, req.identity)
    try {
        const rincianPesananPenjualanJasaData = req.body
        const { error, value } = rincianPesananPenjualanJasaValidation(rincianPesananPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPesananPenjualanJasa = await createRincianPesananPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPesananPenjualanJasa, req.identity)
        res.json({
            data: rincianPesananPenjualanJasa,
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

export const deleteRincianPesananPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPesananPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPesananPenjualanJasaByUuidService(uuid, req.identity)
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

export const updateRincianPesananPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPesananPenjualanJasaByUuidController", null, req.identity)
    try {    
        const rincianPesananPenjualanJasaData = req.body
        const { error, value } = rincianPesananPenjualanJasaValidation(rincianPesananPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPesananPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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