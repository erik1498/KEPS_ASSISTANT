import { perintahStokOpnameValidation } from "./perintahStokOpname.validation.js"
import { createPerintahStokOpnameService, deletePerintahStokOpnameByUuidService, getAllPerintahStokOpnameService, getJurnalByPerintahStokOpnameService, getPerintahStokOpnameByUuidService, updatePerintahStokOpnameByUuidService } from "./perintahStokOpname.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPerintahStokOpnames = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPerintahStokOpnameController", null, req.identity)
    try {
        const perintahStokOpnames = await getAllPerintahStokOpnameService(req.query, req.identity)
        res.json({
            data: perintahStokOpnames,
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

export const getPerintahStokOpnameByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPerintahStokOpnameByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPerintahStokOpnameByUuidService(uuid, req.identity),
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

export const getJurnalByPerintahStokOpname = async (req, res) => {
    LOGGER(logType.INFO, "Start getJurnalByPerintahStokOpname", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJurnalByPerintahStokOpnameService(uuid, req.identity),
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

export const postCreatePerintahStokOpname = async (req, res) => {
    LOGGER(logType.INFO, "Start createPerintahStokOpnameController", null, req.identity)
    try {
        const perintahStokOpnameData = req.body
        const { error, value } = perintahStokOpnameValidation(perintahStokOpnameData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const perintahStokOpname = await createPerintahStokOpnameService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, perintahStokOpname, req.identity)
        res.json({
            data: perintahStokOpname,
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

export const deletePerintahStokOpnameByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePerintahStokOpnameByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePerintahStokOpnameByUuidService(uuid, req.identity)
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

export const updatePerintahStokOpnameByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePerintahStokOpnameByUuidController", null, req.identity)
    try {
        const perintahStokOpnameData = req.body
        const { error, value } = perintahStokOpnameValidation(perintahStokOpnameData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePerintahStokOpnameByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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