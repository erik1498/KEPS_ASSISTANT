import { rincianPelunasanPenjualanBarangValidation } from "./rincianPelunasanPenjualanBarang.validation.js"
import { createRincianPelunasanPenjualanBarangService, deleteRincianPelunasanPenjualanBarangByUuidService, getAllRincianPelunasanPenjualanBarangService, getAllRincianPesananPenjualanBarangByPelunasanPenjualanService, getRincianPelunasanPenjualanBarangByUuidService, updateRincianPelunasanPenjualanBarangByUuidService } from "./rincianPelunasanPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPelunasanPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanBarangController", null, req.identity)
    try {
        const rincianPelunasanPenjualanBarangs = await getAllRincianPelunasanPenjualanBarangService(req.query, req.identity)
        res.json({
            data: rincianPelunasanPenjualanBarangs,
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

export const getAllRincianPesananPenjualanBarangByPelunasanPenjualan = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanBarangByPelunasanPenjualan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPenjualanBarangByPelunasanPenjualanService(uuid, req.identity),
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

export const getRincianPelunasanPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPelunasanPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPelunasanPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianPelunasanPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPelunasanPenjualanBarangController", null, req.identity)
    try {
        const rincianPelunasanPenjualanBarangData = req.body
        const { error, value } = rincianPelunasanPenjualanBarangValidation(rincianPelunasanPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPelunasanPenjualanBarang = await createRincianPelunasanPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPelunasanPenjualanBarang, req.identity)
        res.json({
            data: rincianPelunasanPenjualanBarang,
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

export const deleteRincianPelunasanPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPelunasanPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPelunasanPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateRincianPelunasanPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPelunasanPenjualanBarangByUuidController", null, req.identity)
    try {    
        const rincianPelunasanPenjualanBarangData = req.body
        const { error, value } = rincianPelunasanPenjualanBarangValidation(rincianPelunasanPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPelunasanPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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