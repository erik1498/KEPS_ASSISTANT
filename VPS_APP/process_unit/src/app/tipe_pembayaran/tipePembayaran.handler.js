import { tipePembayaranValidation } from "./tipePembayaran.validation.js"
import { createTipePembayaranService, deleteTipePembayaranByUuidService, getAllTipePembayaranService, getTipePembayaranByUuidService, updateTipePembayaranByUuidService } from "./tipePembayaran.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllTipePembayarans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllTipePembayaranController", null, req.identity)
    try {
        const tipePembayarans = await getAllTipePembayaranService(req.query, req.identity)
        res.json({
            data: tipePembayarans,
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

export const getTipePembayaranByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getTipePembayaranByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getTipePembayaranByUuidService(uuid, req.identity),
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

export const postCreateTipePembayaran = async (req, res) => {
    LOGGER(logType.INFO, "Start createTipePembayaranController", null, req.identity)
    try {
        const tipePembayaranData = req.body
        const { error, value } = tipePembayaranValidation(tipePembayaranData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const tipePembayaran = await createTipePembayaranService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, tipePembayaran, req.identity)
        res.json({
            data: tipePembayaran,
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

export const deleteTipePembayaranByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteTipePembayaranByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteTipePembayaranByUuidService(uuid, req.identity)
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

export const updateTipePembayaranByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateTipePembayaranByUuidController", null, req.identity)
    try {    
        const tipePembayaranData = req.body
        const { error, value } = tipePembayaranValidation(tipePembayaranData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateTipePembayaranByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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