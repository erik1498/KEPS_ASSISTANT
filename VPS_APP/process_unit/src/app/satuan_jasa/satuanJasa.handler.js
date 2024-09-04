import { satuanJasaValidation } from "./satuanJasa.validation.js"
import { createSatuanJasaService, deleteSatuanJasaByUuidService, getAllSatuanJasaService, getSatuanJasaByUuidService, updateSatuanJasaByUuidService } from "./satuanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllSatuanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllSatuanJasaController", null, req.identity)
    try {
        const satuanJasas = await getAllSatuanJasaService(req.query, req.identity)
        res.json({
            data: satuanJasas,
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

export const getSatuanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getSatuanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getSatuanJasaByUuidService(uuid, req.identity),
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

export const postCreateSatuanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createSatuanJasaController", null, req.identity)
    try {
        const satuanJasaData = req.body
        const { error, value } = satuanJasaValidation(satuanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const satuanJasa = await createSatuanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, satuanJasa, req.identity)
        res.json({
            data: satuanJasa,
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

export const deleteSatuanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteSatuanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteSatuanJasaByUuidService(uuid, req.identity)
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

export const updateSatuanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateSatuanJasaByUuidController", null, req.identity)
    try {    
        const satuanJasaData = req.body
        const { error, value } = satuanJasaValidation(satuanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateSatuanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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