import { rincianReturPenjualanBarangValidation } from "./rincianReturPenjualanBarang.validation.js"
import { createRincianReturPenjualanBarangService, deleteRincianReturPenjualanBarangByUuidService, getAllRincianPesananPenjualanBarangByReturPenjualanService, getAllRincianReturPenjualanBarangService, getRincianReturPenjualanBarangByUuidService, updateRincianReturPenjualanBarangByUuidService } from "./rincianReturPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianReturPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianReturPenjualanBarangController", null, req.identity)
    try {
        const rincianReturPenjualanBarangs = await getAllRincianReturPenjualanBarangService(req.query, req.identity)
        res.json({
            data: rincianReturPenjualanBarangs,
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

export const getAllRincianPesananPenjualanBarangByReturPenjualan = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanBarangByReturPenjualan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPenjualanBarangByReturPenjualanService(uuid, req.identity),
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

export const getRincianReturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianReturPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianReturPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianReturPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianReturPenjualanBarangController", null, req.identity)
    try {
        const rincianReturPenjualanBarangData = req.body
        const { error, value } = rincianReturPenjualanBarangValidation(rincianReturPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianReturPenjualanBarang = await createRincianReturPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianReturPenjualanBarang, req.identity)
        res.json({
            data: rincianReturPenjualanBarang,
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

export const deleteRincianReturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianReturPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianReturPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateRincianReturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianReturPenjualanBarangByUuidController", null, req.identity)
    try {    
        const rincianReturPenjualanBarangData = req.body
        const { error, value } = rincianReturPenjualanBarangValidation(rincianReturPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianReturPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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