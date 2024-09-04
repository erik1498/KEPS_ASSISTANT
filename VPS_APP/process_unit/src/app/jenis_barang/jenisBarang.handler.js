import { jenisBarangValidation } from "./jenisBarang.validation.js"
import { createJenisBarangService, deleteJenisBarangByUuidService, getAllJenisBarangService, getJenisBarangByUuidService, updateJenisBarangByUuidService } from "./jenisBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisBarangController", null, req.identity)
    try {
        const jenisBarangs = await getAllJenisBarangService(req.query, req.identity)
        res.json({
            data: jenisBarangs,
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

export const getJenisBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisBarangByUuidService(uuid, req.identity),
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

export const postCreateJenisBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisBarangController", null, req.identity)
    try {
        const jenisBarangData = req.body
        const { error, value } = jenisBarangValidation(jenisBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisBarang = await createJenisBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisBarang, req.identity)
        res.json({
            data: jenisBarang,
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

export const deleteJenisBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisBarangByUuidService(uuid, req.identity)
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

export const updateJenisBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisBarangByUuidController", null, req.identity)
    try {    
        const jenisBarangData = req.body
        const { error, value } = jenisBarangValidation(jenisBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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