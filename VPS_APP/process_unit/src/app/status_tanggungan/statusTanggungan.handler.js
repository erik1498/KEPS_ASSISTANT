import { statusTanggunganValidation } from "./statusTanggungan.validation.js"
import { createStatusTanggunganService, deleteStatusTanggunganByUuidService, getAllStatusTanggunganService, getStatusTanggunganByUuidService, updateStatusTanggunganByUuidService } from "./statusTanggungan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllStatusTanggungans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllStatusTanggunganController", null, req.identity)
    try {
        const statusTanggungans = await getAllStatusTanggunganService(req.query, req.identity)
        res.json({
            data: statusTanggungans,
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

export const getStatusTanggunganByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getStatusTanggunganByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getStatusTanggunganByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const postCreateStatusTanggungan = async (req, res) => {
    LOGGER(logType.INFO, "Start createStatusTanggunganController", null, req.identity)
    try {
        const statusTanggunganData = req.body
        const { error, value } = statusTanggunganValidation(statusTanggunganData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const statusTanggungan = await createStatusTanggunganService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, statusTanggungan, req.identity)
        res.json({
            data: statusTanggungan,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const deleteStatusTanggunganByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteStatusTanggunganByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteStatusTanggunganByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const updateStatusTanggunganByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateStatusTanggunganByUuidController", null, req.identity)
    try {    
        const statusTanggunganData = req.body
        const { error, value } = statusTanggunganValidation(statusTanggunganData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateStatusTanggunganByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}