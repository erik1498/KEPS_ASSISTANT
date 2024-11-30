import { pengirimanBarangValidation } from "./pengirimanBarang.validation.js"
import { createPengirimanBarangService, deletePengirimanBarangByUuidService, getAllPengirimanBarangService, getDaftarPesananByUUIDService, getPengirimanBarangByUuidService, updatePengirimanBarangByUuidService } from "./pengirimanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllPengirimanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllPengirimanBarangController", null, req.identity)
    try {
        const pengirimanBarangs = await getAllPengirimanBarangService(req.query, req.identity)
        res.json({
            data: pengirimanBarangs,
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

export const getDaftarPesananByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getDaftarPesananByUUID", null, req.identity)
    try {
        const { pengiriman_barang } = req.params

        res.json({
            data: await getDaftarPesananByUUIDService(pengiriman_barang, req.identity),
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

export const getPengirimanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getPengirimanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getPengirimanBarangByUuidService(uuid, req.identity),
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

export const postCreatePengirimanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createPengirimanBarangController", null, req.identity)
    try {
        const pengirimanBarangData = req.body
        const { error, value } = pengirimanBarangValidation(pengirimanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const pengirimanBarang = await createPengirimanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, pengirimanBarang, req.identity)
        res.json({
            data: pengirimanBarang,
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

export const deletePengirimanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deletePengirimanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deletePengirimanBarangByUuidService(uuid, req.identity)
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

export const updatePengirimanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updatePengirimanBarangByUuidController", null, req.identity)
    try {    
        const pengirimanBarangData = req.body
        const { error, value } = pengirimanBarangValidation(pengirimanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updatePengirimanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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