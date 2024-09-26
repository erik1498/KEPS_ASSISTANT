import { rincianPesananPenjualanBarangValidation } from "./rincianPesananPenjualanBarang.validation.js"
import { createRincianPesananPenjualanBarangService, deleteRincianPesananPenjualanBarangByUuidService, getAllRincianPesananPenjualanBarangService, getRincianPesananPenjualanBarangByPesananPenjualanUUIDService, updateRincianPesananPenjualanBarangByUuidService } from "./rincianPesananPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPesananPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanBarangController", null, req.identity)
    try {
        const rincianPesananPenjualanBarangs = await getAllRincianPesananPenjualanBarangService(req.query, req.identity)
        res.json({
            data: rincianPesananPenjualanBarangs,
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

export const getRincianPesananPenjualanBarangByPesananPenjualanUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPesananPenjualanBarangByPesananPenjualanUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPesananPenjualanBarangByPesananPenjualanUUIDService(uuid, req.identity),
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

export const postCreateRincianPesananPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPesananPenjualanBarangController", null, req.identity)
    try {
        const rincianPesananPenjualanBarangData = req.body
        const { error, value } = rincianPesananPenjualanBarangValidation(rincianPesananPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPesananPenjualanBarang = await createRincianPesananPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPesananPenjualanBarang, req.identity)
        res.json({
            data: rincianPesananPenjualanBarang,
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

export const deleteRincianPesananPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPesananPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPesananPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateRincianPesananPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPesananPenjualanBarangByUuidController", null, req.identity)
    try {    
        const rincianPesananPenjualanBarangData = req.body
        const { error, value } = rincianPesananPenjualanBarangValidation(rincianPesananPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPesananPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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