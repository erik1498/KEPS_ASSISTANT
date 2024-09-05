import { jenisGudangValidation } from "./jenisGudang.validation.js"
import { createJenisGudangService, deleteJenisGudangByUuidService, getAllJenisGudangService, getJenisGudangByUuidService, updateJenisGudangByUuidService } from "./jenisGudang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisGudangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisGudangController", null, req.identity)
    try {
        const jenisGudangs = await getAllJenisGudangService(req.query, req.identity)
        res.json({
            data: jenisGudangs,
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

export const getJenisGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisGudangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisGudangByUuidService(uuid, req.identity),
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

export const postCreateJenisGudang = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisGudangController", null, req.identity)
    try {
        const jenisGudangData = req.body
        const { error, value } = jenisGudangValidation(jenisGudangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisGudang = await createJenisGudangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisGudang, req.identity)
        res.json({
            data: jenisGudang,
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

export const deleteJenisGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisGudangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisGudangByUuidService(uuid, req.identity)
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

export const updateJenisGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisGudangByUuidController", null, req.identity)
    try {    
        const jenisGudangData = req.body
        const { error, value } = jenisGudangValidation(jenisGudangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisGudangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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