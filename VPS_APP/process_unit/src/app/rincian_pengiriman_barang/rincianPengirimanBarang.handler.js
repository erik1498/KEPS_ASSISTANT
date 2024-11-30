import { rincianPengirimanBarangValidation } from "./rincianPengirimanBarang.validation.js"
import { createRincianPengirimanBarangService, deleteRincianPengirimanBarangByUuidService, getAllRincianPengirimanBarangService, getRincianPengirimanBarangByUuidService, updateRincianPengirimanBarangByUuidService } from "./rincianPengirimanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPengirimanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPengirimanBarangController", null, req.identity)
    try {
        const rincianPengirimanBarangs = await getAllRincianPengirimanBarangService(req.query, req.identity)
        res.json({
            data: rincianPengirimanBarangs,
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

export const getRincianPengirimanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPengirimanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPengirimanBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianPengirimanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPengirimanBarangController", null, req.identity)
    try {
        const rincianPengirimanBarangData = req.body
        const { error, value } = rincianPengirimanBarangValidation(rincianPengirimanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPengirimanBarang = await createRincianPengirimanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPengirimanBarang, req.identity)
        res.json({
            data: rincianPengirimanBarang,
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

export const deleteRincianPengirimanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPengirimanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPengirimanBarangByUuidService(uuid, req.identity)
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

export const updateRincianPengirimanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPengirimanBarangByUuidController", null, req.identity)
    try {    
        const rincianPengirimanBarangData = req.body
        const { error, value } = rincianPengirimanBarangValidation(rincianPengirimanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPengirimanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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