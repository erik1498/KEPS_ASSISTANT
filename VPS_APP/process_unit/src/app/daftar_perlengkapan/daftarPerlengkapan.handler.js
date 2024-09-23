import { daftarPerlengkapanValidation } from "./daftarPerlengkapan.validation.js"
import { createDaftarPerlengkapanService, deleteDaftarPerlengkapanByUuidService, getAllDaftarPerlengkapanService, getDaftarPerlengkapanByUuidService, updateDaftarPerlengkapanByUuidService } from "./daftarPerlengkapan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllDaftarPerlengkapans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllDaftarPerlengkapanController", null, req.identity)
    try {
        const daftarPerlengkapans = await getAllDaftarPerlengkapanService(req.query, req.identity)
        res.json({
            data: daftarPerlengkapans,
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

export const getDaftarPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarPerlengkapanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getDaftarPerlengkapanByUuidService(uuid, req.identity),
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

export const postCreateDaftarPerlengkapan = async (req, res) => {
    LOGGER(logType.INFO, "Start createDaftarPerlengkapanController", null, req.identity)
    try {
        const daftarPerlengkapanData = req.body
        const { error, value } = daftarPerlengkapanValidation(daftarPerlengkapanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const daftarPerlengkapan = await createDaftarPerlengkapanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, daftarPerlengkapan, req.identity)
        res.json({
            data: daftarPerlengkapan,
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

export const deleteDaftarPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteDaftarPerlengkapanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteDaftarPerlengkapanByUuidService(uuid, req.identity)
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

export const updateDaftarPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateDaftarPerlengkapanByUuidController", null, req.identity)
    try {    
        const daftarPerlengkapanData = req.body
        const { error, value } = daftarPerlengkapanValidation(daftarPerlengkapanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateDaftarPerlengkapanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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