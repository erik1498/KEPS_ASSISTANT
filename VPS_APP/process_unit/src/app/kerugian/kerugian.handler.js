import { kerugianValidation } from "./kerugian.validation.js"
import { createKerugianService, deleteKerugianByUuidService, getAllKerugianService, getKerugianByPegawaiUUIDService, getKerugianByUuidService, updateKerugianByUuidService } from "./kerugian.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKerugians = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKerugianController", null, req.identity)
    try {
        const kerugians = await getAllKerugianService(req.query, req.identity)
        res.json({
            data: kerugians,
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

export const getKerugianByPegawaiUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKerugianByPegawaiUUIDController", null, req.identity)
    try {
        const { uuid, periode, tahun } = req.params

        res.json({
            data: await getKerugianByPegawaiUUIDService(uuid, periode, tahun, req.identity),
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

export const postCreateKerugian = async (req, res) => {
    LOGGER(logType.INFO, "Start createKerugianController", null, req.identity)
    try {
        const kerugianData = req.body
        const { error, value } = kerugianValidation(kerugianData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kerugian = await createKerugianService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kerugian, req.identity)
        res.json({
            data: kerugian,
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

export const deleteKerugianByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKerugianByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKerugianByUuidService(uuid, req.identity)
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

export const updateKerugianByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKerugianByUuidController", null, req.identity)
    try {    
        const kerugianData = req.body
        const { error, value } = kerugianValidation(kerugianData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKerugianByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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