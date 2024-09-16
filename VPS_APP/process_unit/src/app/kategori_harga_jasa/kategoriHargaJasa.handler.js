import { kategoriHargaJasaValidation } from "./kategoriHargaJasa.validation.js"
import { createKategoriHargaJasaService, deleteKategoriHargaJasaByUuidService, getAllKategoriHargaJasaService, getKategoriHargaJasaByUuidService, updateKategoriHargaJasaByUuidService } from "./kategoriHargaJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriHargaJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaJasaController", null, req.identity)
    try {
        const kategoriHargaJasas = await getAllKategoriHargaJasaService(req.query, req.identity)
        res.json({
            data: kategoriHargaJasas,
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

export const getKategoriHargaJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriHargaJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriHargaJasaByUuidService(uuid, req.identity),
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

export const postCreateKategoriHargaJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriHargaJasaController", null, req.identity)
    try {
        const kategoriHargaJasaData = req.body
        const { error, value } = kategoriHargaJasaValidation(kategoriHargaJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriHargaJasa = await createKategoriHargaJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriHargaJasa, req.identity)
        res.json({
            data: kategoriHargaJasa,
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

export const deleteKategoriHargaJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriHargaJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriHargaJasaByUuidService(uuid, req.identity)
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

export const updateKategoriHargaJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriHargaJasaByUuidController", null, req.identity)
    try {    
        const kategoriHargaJasaData = req.body
        const { error, value } = kategoriHargaJasaValidation(kategoriHargaJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriHargaJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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