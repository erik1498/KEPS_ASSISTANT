import { konversiBarangValidation } from "./konversiBarang.validation.js"
import { createKonversiBarangService, deleteKonversiBarangByUuidService, getAllKonversiBarangService, getKonversiBarangByUuidService, updateKonversiBarangByUuidService } from "./konversiBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKonversiBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKonversiBarangController", null, req.identity)
    try {
        const konversiBarangs = await getAllKonversiBarangService(req.query, req.identity)
        res.json({
            data: konversiBarangs,
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

export const getKonversiBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKonversiBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKonversiBarangByUuidService(uuid, req.identity),
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

export const postCreateKonversiBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createKonversiBarangController", null, req.identity)
    try {
        const konversiBarangData = req.body
        const { error, value } = konversiBarangValidation(konversiBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const konversiBarang = await createKonversiBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, konversiBarang, req.identity)
        res.json({
            data: konversiBarang,
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

export const deleteKonversiBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKonversiBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKonversiBarangByUuidService(uuid, req.identity)
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

export const updateKonversiBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKonversiBarangByUuidController", null, req.identity)
    try {    
        const konversiBarangData = req.body
        const { error, value } = konversiBarangValidation(konversiBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKonversiBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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