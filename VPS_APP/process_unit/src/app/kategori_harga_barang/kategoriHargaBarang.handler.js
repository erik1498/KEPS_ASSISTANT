import { kategoriHargaBarangValidation } from "./kategoriHargaBarang.validation.js"
import { createKategoriHargaBarangService, deleteKategoriHargaBarangByUuidService, getAllKategoriHargaBarangService, getKategoriHargaBarangByUuidService, updateKategoriHargaBarangByUuidService } from "./kategoriHargaBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriHargaBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriHargaBarangController", null, req.identity)
    try {
        const kategoriHargaBarangs = await getAllKategoriHargaBarangService(req.query, req.identity)
        res.json({
            data: kategoriHargaBarangs,
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

export const getKategoriHargaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriHargaBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriHargaBarangByUuidService(uuid, req.identity),
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

export const postCreateKategoriHargaBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriHargaBarangController", null, req.identity)
    try {
        const kategoriHargaBarangData = req.body
        const { error, value } = kategoriHargaBarangValidation(kategoriHargaBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriHargaBarang = await createKategoriHargaBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriHargaBarang, req.identity)
        res.json({
            data: kategoriHargaBarang,
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

export const deleteKategoriHargaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriHargaBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriHargaBarangByUuidService(uuid, req.identity)
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

export const updateKategoriHargaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriHargaBarangByUuidController", null, req.identity)
    try {    
        const kategoriHargaBarangData = req.body
        const { error, value } = kategoriHargaBarangValidation(kategoriHargaBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriHargaBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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