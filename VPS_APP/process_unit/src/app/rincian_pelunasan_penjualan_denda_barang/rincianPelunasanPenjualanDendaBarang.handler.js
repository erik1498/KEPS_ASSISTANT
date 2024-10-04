import { rincianPelunasanPenjualanDendaBarangValidation } from "./rincianPelunasanPenjualanDendaBarang.validation.js"
import { createRincianPelunasanPenjualanDendaBarangService, deleteRincianPelunasanPenjualanDendaBarangByUuidService, getAllRincianPelunasanPenjualanDendaBarangService, getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanService, getRincianPelunasanPenjualanDendaBarangByUuidService, updateRincianPelunasanPenjualanDendaBarangByUuidService } from "./rincianPelunasanPenjualanDendaBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPelunasanPenjualanDendaBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPenjualanDendaBarangController", null, req.identity)
    try {
        const rincianPelunasanPenjualanDendaBarangs = await getAllRincianPelunasanPenjualanDendaBarangService(req.query, req.identity)
        res.json({
            data: rincianPelunasanPenjualanDendaBarangs,
            message: "Get Data Success"
        })
    } catch (error) {    
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualan = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPenjualanDendaBarangByPelunasanPenjualanService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const getRincianPelunasanPenjualanDendaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPelunasanPenjualanDendaBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPelunasanPenjualanDendaBarangByUuidService(uuid, req.identity),
            message: "Get Data By UUID Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const postCreateRincianPelunasanPenjualanDendaBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPelunasanPenjualanDendaBarangController", null, req.identity)
    try {
        const rincianPelunasanPenjualanDendaBarangData = req.body
        const { error, value } = rincianPelunasanPenjualanDendaBarangValidation(rincianPelunasanPenjualanDendaBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPelunasanPenjualanDendaBarang = await createRincianPelunasanPenjualanDendaBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPelunasanPenjualanDendaBarang, req.identity)
        res.json({
            data: rincianPelunasanPenjualanDendaBarang,
            message: "Create data Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const deleteRincianPelunasanPenjualanDendaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPelunasanPenjualanDendaBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPelunasanPenjualanDendaBarangByUuidService(uuid, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, { uuid }, req.identity)
        res.status(200).json({
            message: "Delete Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}

export const updateRincianPelunasanPenjualanDendaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPelunasanPenjualanDendaBarangByUuidController", null, req.identity)
    try {    
        const rincianPelunasanPenjualanDendaBarangData = req.body
        const { error, value } = rincianPelunasanPenjualanDendaBarangValidation(rincianPelunasanPenjualanDendaBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPelunasanPenjualanDendaBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
        return res.status(200).json({
            message: "Update Success"
        })
    } catch (error) {
        LOGGER(logType.ERROR, "Error ", error.stack, req.identity, req.originalUrl, req.method, true)
        res.status(500).json({
            type: "internalServerError",
            message: error.message
        })
    }
}