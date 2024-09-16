import { kategoriAsetValidation } from "./kategoriAset.validation.js"
import { createKategoriAsetService, deleteKategoriAsetByUuidService, getAllKategoriAsetService, getKategoriAsetByUuidService, updateKategoriAsetByUuidService } from "./kategoriAset.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriAsets = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriAsetController", null, req.identity)
    try {
        const kategoriAsets = await getAllKategoriAsetService(req.query, req.identity)
        res.json({
            data: kategoriAsets,
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

export const getKategoriAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriAsetByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriAsetByUuidService(uuid, req.identity),
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

export const postCreateKategoriAset = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriAsetController", null, req.identity)
    try {
        const kategoriAsetData = req.body
        const { error, value } = kategoriAsetValidation(kategoriAsetData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriAset = await createKategoriAsetService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriAset, req.identity)
        res.json({
            data: kategoriAset,
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

export const deleteKategoriAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriAsetByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriAsetByUuidService(uuid, req.identity)
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

export const updateKategoriAsetByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriAsetByUuidController", null, req.identity)
    try {    
        const kategoriAsetData = req.body
        const { error, value } = kategoriAsetValidation(kategoriAsetData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriAsetByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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