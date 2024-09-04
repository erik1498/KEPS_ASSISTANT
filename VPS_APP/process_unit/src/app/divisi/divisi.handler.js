import { divisiValidation } from "./divisi.validation.js"
import { createDivisiService, deleteDivisiByUuidService, getAllDivisiService, getDivisiByUuidService, updateDivisiByUuidService } from "./divisi.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDivisis = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDivisiController", null, req.identity)
    try {
        const divisis = await getAllDivisiService(req.query, req.identity)
        res.json({
            data: divisis,
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

export const getDivisiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDivisiByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDivisiByUuidService(uuid, req.identity),
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

export const postCreateDivisi = async (req, res) => {
    LOGGER(logType.INFO, "Start createDivisiController", null, req.identity)
    try {
        const divisiData = req.body
        const { error, value } = divisiValidation(divisiData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const divisi = await createDivisiService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, divisi, req.identity)
        res.json({
            data: divisi,
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

export const deleteDivisiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDivisiByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDivisiByUuidService(uuid, req.identity)
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

export const updateDivisiByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDivisiByUuidController", null, req.identity)
    try {
        const divisiData = req.body
        const { error, value } = divisiValidation(divisiData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }

        await updateDivisiByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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