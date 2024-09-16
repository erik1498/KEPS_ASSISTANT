import { jenisJasaValidation } from "./jenisJasa.validation.js"
import { createJenisJasaService, deleteJenisJasaByUuidService, getAllJenisJasaService, getJenisJasaByUuidService, updateJenisJasaByUuidService } from "./jenisJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllJenisJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllJenisJasaController", null, req.identity)
    try {
        const jenisJasas = await getAllJenisJasaService(req.query, req.identity)
        res.json({
            data: jenisJasas,
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

export const getJenisJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getJenisJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getJenisJasaByUuidService(uuid, req.identity),
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

export const postCreateJenisJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createJenisJasaController", null, req.identity)
    try {
        const jenisJasaData = req.body
        const { error, value } = jenisJasaValidation(jenisJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const jenisJasa = await createJenisJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, jenisJasa, req.identity)
        res.json({
            data: jenisJasa,
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

export const deleteJenisJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteJenisJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteJenisJasaByUuidService(uuid, req.identity)
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

export const updateJenisJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateJenisJasaByUuidController", null, req.identity)
    try {    
        const jenisJasaData = req.body
        const { error, value } = jenisJasaValidation(jenisJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateJenisJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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