import { gajiValidation } from "./gaji.validation.js"
import { createGajiService, deleteGajiByUuidService, getAllGajiService, getGajiByPegawaiUUIDService, updateGajiByUuidService } from "./gaji.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllGajis = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllGajiController", null, req.identity)
    try {
        const gajis = await getAllGajiService(req.query, req.identity)
        res.json({
            data: gajis,
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

export const getGajiByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getGajiByPegawaiUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getGajiByPegawaiUUIDService(uuid, req.identity),
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

export const postCreateGaji = async (req, res) => {
    LOGGER(logType.INFO, "Start createGajiController", null, req.identity)
    try {
        const gajiData = req.body
        const { error, value } = gajiValidation(gajiData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const gaji = await createGajiService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, gaji, req.identity)
        res.json({
            data: gaji,
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

export const deleteGajiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteGajiByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteGajiByUuidService(uuid, req.identity)
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

export const updateGajiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateGajiByUuidController", null, req.identity)
    try {    
        const gajiData = req.body
        const { error, value } = gajiValidation(gajiData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateGajiByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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