import { kategoriGudangValidation } from "./kategoriGudang.validation.js"
import { createKategoriGudangService, deleteKategoriGudangByUuidService, getAllKategoriGudangService, getKategoriGudangByUuidService, updateKategoriGudangByUuidService } from "./kategoriGudang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriGudangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriGudangController", null, req.identity)
    try {
        const kategoriGudangs = await getAllKategoriGudangService(req.query, req.identity)
        res.json({
            data: kategoriGudangs,
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

export const getKategoriGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriGudangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriGudangByUuidService(uuid, req.identity),
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

export const postCreateKategoriGudang = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriGudangController", null, req.identity)
    try {
        const kategoriGudangData = req.body
        const { error, value } = kategoriGudangValidation(kategoriGudangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriGudang = await createKategoriGudangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriGudang, req.identity)
        res.json({
            data: kategoriGudang,
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

export const deleteKategoriGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriGudangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriGudangByUuidService(uuid, req.identity)
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

export const updateKategoriGudangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriGudangByUuidController", null, req.identity)
    try {    
        const kategoriGudangData = req.body
        const { error, value } = kategoriGudangValidation(kategoriGudangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriGudangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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