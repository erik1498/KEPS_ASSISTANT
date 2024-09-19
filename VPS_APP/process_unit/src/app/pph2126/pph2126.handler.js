import { pph2126Validation } from "./pph2126.validation.js"
import { createPph2126Service, deletePph2126ByUuidService, getAllPph2126Service, getPph2126ByPegawaiUUIDService, updatePph2126ByUuidService } from "./pph2126.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPph2126s = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPph2126Controller", null, req.identity)
    try {
        const pph2126s = await getAllPph2126Service(req.query, req.identity)
        res.json({
            data: pph2126s,
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

export const getPph2126ByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPph2126ByPegawaiUUIDController", null, req.identity)
    try {
        const { uuid, periode, tahun } = req.params

        res.json({
            data: await getPph2126ByPegawaiUUIDService(uuid, periode, tahun, req.identity),
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

export const postCreatePph2126 = async (req, res) => {
    LOGGER(logType.INFO, "Start createPph2126Controller", null, req.identity)
    try {
        const pph2126Data = req.body
        const { error, value } = pph2126Validation(pph2126Data)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pph2126 = await createPph2126Service(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pph2126, req.identity)
        res.json({
            data: pph2126,
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

export const deletePph2126ByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePph2126ByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePph2126ByUuidService(uuid, req.identity)
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

export const updatePph2126ByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePph2126ByUuidController", null, req.identity)
    try {    
        const pph2126Data = req.body
        const { error, value } = pph2126Validation(pph2126Data)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePph2126ByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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