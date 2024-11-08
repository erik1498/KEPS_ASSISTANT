import { perintahStokOpnameJurnalValidation } from "./perintahStokOpnameJurnal.validation.js"
import { createPerintahStokOpnameJurnalService, deletePerintahStokOpnameJurnalByUuidService, getAllPerintahStokOpnameJurnalService, getPerintahStokOpnameJurnalByUuidService, updatePerintahStokOpnameJurnalByUuidService } from "./perintahStokOpnameJurnal.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPerintahStokOpnameJurnals = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameJurnalController", null, req.identity)
    try {
        const perintahStokOpnameJurnals = await getAllPerintahStokOpnameJurnalService(req.query, req.identity)
        res.json({
            data: perintahStokOpnameJurnals,
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

export const getPerintahStokOpnameJurnalByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPerintahStokOpnameJurnalByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPerintahStokOpnameJurnalByUuidService(uuid, req.identity),
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

export const postCreatePerintahStokOpnameJurnal = async (req, res) => {
    LOGGER(logType.INFO, "Start createPerintahStokOpnameJurnalController", null, req.identity)
    try {
        const perintahStokOpnameJurnalData = req.body
        const { error, value } = perintahStokOpnameJurnalValidation(perintahStokOpnameJurnalData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const perintahStokOpnameJurnal = await createPerintahStokOpnameJurnalService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, perintahStokOpnameJurnal, req.identity)
        res.json({
            data: perintahStokOpnameJurnal,
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

export const deletePerintahStokOpnameJurnalByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePerintahStokOpnameJurnalByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePerintahStokOpnameJurnalByUuidService(uuid, req.identity)
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

export const updatePerintahStokOpnameJurnalByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePerintahStokOpnameJurnalByUuidController", null, req.identity)
    try {    
        const perintahStokOpnameJurnalData = req.body
        const { error, value } = perintahStokOpnameJurnalValidation(perintahStokOpnameJurnalData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePerintahStokOpnameJurnalByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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