import { penggunaanPerlengkapanValidation } from "./penggunaanPerlengkapan.validation.js"
import { createPenggunaanPerlengkapanService, deletePenggunaanPerlengkapanByUuidService, getAllPenggunaanPerlengkapanService, getPenggunaanPerlengkapanByUuidService, updatePenggunaanPerlengkapanByUuidService } from "./penggunaanPerlengkapan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPenggunaanPerlengkapans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPenggunaanPerlengkapanController", null, req.identity)
    try {
        const penggunaanPerlengkapans = await getAllPenggunaanPerlengkapanService(req.query, req.identity)
        res.json({
            data: penggunaanPerlengkapans,
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

export const getPenggunaanPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPenggunaanPerlengkapanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPenggunaanPerlengkapanByUuidService(uuid, req.identity),
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

export const postCreatePenggunaanPerlengkapan = async (req, res) => {
    LOGGER(logType.INFO, "Start createPenggunaanPerlengkapanController", null, req.identity)
    try {
        const penggunaanPerlengkapanData = req.body
        const { error, value } = penggunaanPerlengkapanValidation(penggunaanPerlengkapanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const penggunaanPerlengkapan = await createPenggunaanPerlengkapanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, penggunaanPerlengkapan, req.identity)
        res.json({
            data: penggunaanPerlengkapan,
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

export const deletePenggunaanPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePenggunaanPerlengkapanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePenggunaanPerlengkapanByUuidService(uuid, req.identity)
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

export const updatePenggunaanPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePenggunaanPerlengkapanByUuidController", null, req.identity)
    try {    
        const penggunaanPerlengkapanData = req.body
        const { error, value } = penggunaanPerlengkapanValidation(penggunaanPerlengkapanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePenggunaanPerlengkapanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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