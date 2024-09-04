import { syaratPembayaranValidation } from "./syaratPembayaran.validation.js"
import { createSyaratPembayaranService, deleteSyaratPembayaranByUuidService, getAllSyaratPembayaranService, getSyaratPembayaranByUuidService, updateSyaratPembayaranByUuidService } from "./syaratPembayaran.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllSyaratPembayarans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllSyaratPembayaranController", null, req.identity)
    try {
        const syaratPembayarans = await getAllSyaratPembayaranService(req.query, req.identity)
        res.json({
            data: syaratPembayarans,
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

export const getSyaratPembayaranByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getSyaratPembayaranByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getSyaratPembayaranByUuidService(uuid, req.identity),
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

export const postCreateSyaratPembayaran = async (req, res) => {
    LOGGER(logType.INFO, "Start createSyaratPembayaranController", null, req.identity)
    try {
        const syaratPembayaranData = req.body
        const { error, value } = syaratPembayaranValidation(syaratPembayaranData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const syaratPembayaran = await createSyaratPembayaranService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, syaratPembayaran, req.identity)
        res.json({
            data: syaratPembayaran,
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

export const deleteSyaratPembayaranByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteSyaratPembayaranByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteSyaratPembayaranByUuidService(uuid, req.identity)
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

export const updateSyaratPembayaranByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateSyaratPembayaranByUuidController", null, req.identity)
    try {    
        const syaratPembayaranData = req.body
        const { error, value } = syaratPembayaranValidation(syaratPembayaranData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateSyaratPembayaranByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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