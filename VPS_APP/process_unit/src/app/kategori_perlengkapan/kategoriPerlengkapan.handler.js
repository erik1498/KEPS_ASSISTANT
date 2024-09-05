import { kategoriPerlengkapanValidation } from "./kategoriPerlengkapan.validation.js"
import { createKategoriPerlengkapanService, deleteKategoriPerlengkapanByUuidService, getAllKategoriPerlengkapanService, getKategoriPerlengkapanByUuidService, updateKategoriPerlengkapanByUuidService } from "./kategoriPerlengkapan.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriPerlengkapans = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriPerlengkapanController", null, req.identity)
    try {
        const kategoriPerlengkapans = await getAllKategoriPerlengkapanService(req.query, req.identity)
        res.json({
            data: kategoriPerlengkapans,
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

export const getKategoriPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriPerlengkapanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriPerlengkapanByUuidService(uuid, req.identity),
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

export const postCreateKategoriPerlengkapan = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriPerlengkapanController", null, req.identity)
    try {
        const kategoriPerlengkapanData = req.body
        const { error, value } = kategoriPerlengkapanValidation(kategoriPerlengkapanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriPerlengkapan = await createKategoriPerlengkapanService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriPerlengkapan, req.identity)
        res.json({
            data: kategoriPerlengkapan,
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

export const deleteKategoriPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriPerlengkapanByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriPerlengkapanByUuidService(uuid, req.identity)
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

export const updateKategoriPerlengkapanByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriPerlengkapanByUuidController", null, req.identity)
    try {    
        const kategoriPerlengkapanData = req.body
        const { error, value } = kategoriPerlengkapanValidation(kategoriPerlengkapanData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriPerlengkapanByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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