import { lemburValidation } from "./lembur.validation.js"
import { createLemburService, deleteLemburByUuidService, getAllLemburService, getLemburByPegawaiUUIDService, updateLemburByUuidService } from "./lembur.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllLemburs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllLemburController", null, req.identity)
    try {
        const lemburs = await getAllLemburService(req.query, req.identity)
        res.json({
            data: lemburs,
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

export const getLemburByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getLemburByPegawaiUUID", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getLemburByPegawaiUUIDService(uuid, req.identity),
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

export const postCreateLembur = async (req, res) => {
    LOGGER(logType.INFO, "Start createLemburController", null, req.identity)
    try {
        const lemburData = req.body
        const { error, value } = lemburValidation(lemburData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const lembur = await createLemburService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, lembur, req.identity)
        res.json({
            data: lembur,
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

export const deleteLemburByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteLemburByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteLemburByUuidService(uuid, req.identity)
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

export const updateLemburByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateLemburByUuidController", null, req.identity)
    try {    
        const lemburData = req.body
        const { error, value } = lemburValidation(lemburData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateLemburByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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