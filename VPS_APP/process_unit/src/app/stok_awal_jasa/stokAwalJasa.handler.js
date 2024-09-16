import { stokAwalJasaValidation } from "./stokAwalJasa.validation.js"
import { createStokAwalJasaService, deleteStokAwalJasaByUuidService, getAllStokAwalJasaService, getStokAwalJasaByJasaUUIDService, updateStokAwalJasaByUuidService } from "./stokAwalJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStokAwalJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStokAwalJasaController", null, req.identity)
    try {
        const stokAwalJasas = await getAllStokAwalJasaService(req.query, req.identity)
        res.json({
            data: stokAwalJasas,
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

export const getStokAwalJasaByJasaUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStokAwalJasaByJasaUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStokAwalJasaByJasaUUIDService(uuid, req.identity),
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

export const postCreateStokAwalJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createStokAwalJasaController", null, req.identity)
    try {
        const stokAwalJasaData = req.body
        const { error, value } = stokAwalJasaValidation(stokAwalJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const stokAwalJasa = await createStokAwalJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, stokAwalJasa, req.identity)
        res.json({
            data: stokAwalJasa,
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

export const deleteStokAwalJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStokAwalJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStokAwalJasaByUuidService(uuid, req.identity)
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

export const updateStokAwalJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStokAwalJasaByUuidController", null, req.identity)
    try {    
        const stokAwalJasaData = req.body
        const { error, value } = stokAwalJasaValidation(stokAwalJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStokAwalJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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