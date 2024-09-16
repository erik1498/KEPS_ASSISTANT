import { metodePenyusutanValidation } from "./metodePenyusutan.validation.js"
import { createMetodePenyusutanService, deleteMetodePenyusutanByUuidService, getAllMetodePenyusutanService, getMetodePenyusutanByUuidService, updateMetodePenyusutanByUuidService } from "./metodePenyusutan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllMetodePenyusutans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllMetodePenyusutanController", null, req.identity)
    try {
        const metodePenyusutans = await getAllMetodePenyusutanService(req.query, req.identity)
        res.json({
            data: metodePenyusutans,
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

export const getMetodePenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getMetodePenyusutanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getMetodePenyusutanByUuidService(uuid, req.identity),
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

export const postCreateMetodePenyusutan = async (req, res) => {
    LOGGER(logType.INFO, "Start createMetodePenyusutanController", null, req.identity)
    try {
        const metodePenyusutanData = req.body
        const { error, value } = metodePenyusutanValidation(metodePenyusutanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const metodePenyusutan = await createMetodePenyusutanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, metodePenyusutan, req.identity)
        res.json({
            data: metodePenyusutan,
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

export const deleteMetodePenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteMetodePenyusutanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteMetodePenyusutanByUuidService(uuid, req.identity)
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

export const updateMetodePenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateMetodePenyusutanByUuidController", null, req.identity)
    try {    
        const metodePenyusutanData = req.body
        const { error, value } = metodePenyusutanValidation(metodePenyusutanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateMetodePenyusutanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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