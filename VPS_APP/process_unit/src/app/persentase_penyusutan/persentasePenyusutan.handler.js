import { persentasePenyusutanValidation } from "./persentasePenyusutan.validation.js"
import { createPersentasePenyusutanService, deletePersentasePenyusutanByUuidService, getAllPersentasePenyusutanService, getPersentasePenyusutanByUuidService, updatePersentasePenyusutanByUuidService } from "./persentasePenyusutan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPersentasePenyusutans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPersentasePenyusutanController", null, req.identity)
    try {
        const persentasePenyusutans = await getAllPersentasePenyusutanService(req.query, req.identity)
        res.json({
            data: persentasePenyusutans,
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

export const getPersentasePenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPersentasePenyusutanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPersentasePenyusutanByUuidService(uuid, req.identity),
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

export const postCreatePersentasePenyusutan = async (req, res) => {
    LOGGER(logType.INFO, "Start createPersentasePenyusutanController", null, req.identity)
    try {
        const persentasePenyusutanData = req.body
        const { error, value } = persentasePenyusutanValidation(persentasePenyusutanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const persentasePenyusutan = await createPersentasePenyusutanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, persentasePenyusutan, req.identity)
        res.json({
            data: persentasePenyusutan,
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

export const deletePersentasePenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePersentasePenyusutanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePersentasePenyusutanByUuidService(uuid, req.identity)
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

export const updatePersentasePenyusutanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePersentasePenyusutanByUuidController", null, req.identity)
    try {    
        const persentasePenyusutanData = req.body
        const { error, value } = persentasePenyusutanValidation(persentasePenyusutanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePersentasePenyusutanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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