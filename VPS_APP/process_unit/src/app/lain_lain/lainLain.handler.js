import { lainLainValidation } from "./lainLain.validation.js"
import { createLainLainService, deleteLainLainByUuidService, getAllLainLainService, getLainLainByPegawaiUUIDService, updateLainLainByUuidService } from "./lainLain.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllLainLains = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllLainLainController", null, req.identity)
    try {
        const lainLains = await getAllLainLainService(req.query, req.identity)
        res.json({
            data: lainLains,
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

export const getLainLainByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getLainLainByPegawaiUUIDController", null, req.identity)
    try {
        const { uuid, periode, tahun } = req.params

        res.json({
            data: await getLainLainByPegawaiUUIDService(uuid, periode, tahun, req.identity),
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

export const postCreateLainLain = async (req, res) => {
    LOGGER(logType.INFO, "Start createLainLainController", null, req.identity)
    try {
        const lainLainData = req.body
        const { error, value } = lainLainValidation(lainLainData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const lainLain = await createLainLainService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, lainLain, req.identity)
        res.json({
            data: lainLain,
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

export const deleteLainLainByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteLainLainByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteLainLainByUuidService(uuid, req.identity)
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

export const updateLainLainByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateLainLainByUuidController", null, req.identity)
    try {    
        const lainLainData = req.body
        const { error, value } = lainLainValidation(lainLainData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateLainLainByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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