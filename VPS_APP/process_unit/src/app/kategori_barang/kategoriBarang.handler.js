import { kategoriBarangValidation } from "./kategoriBarang.validation.js"
import { createKategoriBarangService, deleteKategoriBarangByUuidService, getAllKategoriBarangService, getKategoriBarangByUuidService, updateKategoriBarangByUuidService } from "./kategoriBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriBarangController", null, req.identity)
    try {
        const kategoriBarangs = await getAllKategoriBarangService(req.query, req.identity)
        res.json({
            data: kategoriBarangs,
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

export const getKategoriBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriBarangByUuidService(uuid, req.identity),
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

export const postCreateKategoriBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriBarangController", null, req.identity)
    try {
        const kategoriBarangData = req.body
        const { error, value } = kategoriBarangValidation(kategoriBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriBarang = await createKategoriBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriBarang, req.identity)
        res.json({
            data: kategoriBarang,
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

export const deleteKategoriBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriBarangByUuidService(uuid, req.identity)
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

export const updateKategoriBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriBarangByUuidController", null, req.identity)
    try {    
        const kategoriBarangData = req.body
        const { error, value } = kategoriBarangValidation(kategoriBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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