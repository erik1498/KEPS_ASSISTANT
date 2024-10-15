import { pesananPenjualanJasaValidation } from "./pesananPenjualanJasa.validation.js"
import { createPesananPenjualanJasaService, deletePesananPenjualanJasaByUuidService, getAllPesananPenjualanJasaService, getPesananPenjualanJasaByUuidService, updatePesananPenjualanJasaByUuidService } from "./pesananPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPesananPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPesananPenjualanJasaController", null, req.identity)
    try {
        const pesananPenjualanJasas = await getAllPesananPenjualanJasaService(req.query, req.identity)
        res.json({
            data: pesananPenjualanJasas,
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

export const getPesananPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPesananPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPesananPenjualanJasaByUuidService(uuid, req.identity),
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

export const postCreatePesananPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createPesananPenjualanJasaController", null, req.identity)
    try {
        const pesananPenjualanJasaData = req.body
        const { error, value } = pesananPenjualanJasaValidation(pesananPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pesananPenjualanJasa = await createPesananPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pesananPenjualanJasa, req.identity)
        res.json({
            data: pesananPenjualanJasa,
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

export const deletePesananPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePesananPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePesananPenjualanJasaByUuidService(uuid, req.identity)
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

export const updatePesananPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePesananPenjualanJasaByUuidController", null, req.identity)
    try {    
        const pesananPenjualanJasaData = req.body
        const { error, value } = pesananPenjualanJasaValidation(pesananPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePesananPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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