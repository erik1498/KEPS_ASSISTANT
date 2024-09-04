import { satuanBarangValidation } from "./satuanBarang.validation.js"
import { createSatuanBarangService, deleteSatuanBarangByUuidService, getAllSatuanBarangService, getSatuanBarangByUuidService, updateSatuanBarangByUuidService } from "./satuanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllSatuanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllSatuanBarangController", null, req.identity)
    try {
        const satuanBarangs = await getAllSatuanBarangService(req.query, req.identity)
        res.json({
            data: satuanBarangs,
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

export const getSatuanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getSatuanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getSatuanBarangByUuidService(uuid, req.identity),
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

export const postCreateSatuanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createSatuanBarangController", null, req.identity)
    try {
        const satuanBarangData = req.body
        const { error, value } = satuanBarangValidation(satuanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const satuanBarang = await createSatuanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, satuanBarang, req.identity)
        res.json({
            data: satuanBarang,
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

export const deleteSatuanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteSatuanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteSatuanBarangByUuidService(uuid, req.identity)
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

export const updateSatuanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateSatuanBarangByUuidController", null, req.identity)
    try {    
        const satuanBarangData = req.body
        const { error, value } = satuanBarangValidation(satuanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateSatuanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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