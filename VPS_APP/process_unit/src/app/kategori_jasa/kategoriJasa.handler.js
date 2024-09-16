import { kategoriJasaValidation } from "./kategoriJasa.validation.js"
import { createKategoriJasaService, deleteKategoriJasaByUuidService, getAllKategoriJasaService, getKategoriJasaByUuidService, updateKategoriJasaByUuidService } from "./kategoriJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriJasaController", null, req.identity)
    try {
        const kategoriJasas = await getAllKategoriJasaService(req.query, req.identity)
        res.json({
            data: kategoriJasas,
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

export const getKategoriJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriJasaByUuidService(uuid, req.identity),
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

export const postCreateKategoriJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriJasaController", null, req.identity)
    try {
        const kategoriJasaData = req.body
        const { error, value } = kategoriJasaValidation(kategoriJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriJasa = await createKategoriJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriJasa, req.identity)
        res.json({
            data: kategoriJasa,
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

export const deleteKategoriJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriJasaByUuidService(uuid, req.identity)
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

export const updateKategoriJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriJasaByUuidController", null, req.identity)
    try {    
        const kategoriJasaData = req.body
        const { error, value } = kategoriJasaValidation(kategoriJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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