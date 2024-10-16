import { rincianPelunasanPembelianDendaBarangValidation } from "./rincianPelunasanPembelianDendaBarang.validation.js"
import { createRincianPelunasanPembelianDendaBarangService, deleteRincianPelunasanPembelianDendaBarangByUuidService, getAllRincianPelunasanPembelianDendaBarangService, getAllRincianPesananPembelianDendaBarangByPelunasanPembelianService, getRincianPelunasanPembelianDendaBarangByUuidService, updateRincianPelunasanPembelianDendaBarangByUuidService } from "./rincianPelunasanPembelianDendaBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPelunasanPembelianDendaBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPembelianDendaBarangController", null, req.identity)
    try {
        const rincianPelunasanPembelianDendaBarangs = await getAllRincianPelunasanPembelianDendaBarangService(req.query, req.identity)
        res.json({
            data: rincianPelunasanPembelianDendaBarangs,
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

export const getAllRincianPesananPembelianDendaBarangByPelunasanPembelian = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPembelianDendaBarangByPelunasanPembelian", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPembelianDendaBarangByPelunasanPembelianService(uuid, false, req.identity),
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

export const getRincianPelunasanPembelianDendaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPelunasanPembelianDendaBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPelunasanPembelianDendaBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianPelunasanPembelianDendaBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPelunasanPembelianDendaBarangController", null, req.identity)
    try {
        const rincianPelunasanPembelianDendaBarangData = req.body
        const { error, value } = rincianPelunasanPembelianDendaBarangValidation(rincianPelunasanPembelianDendaBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPelunasanPembelianDendaBarang = await createRincianPelunasanPembelianDendaBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPelunasanPembelianDendaBarang, req.identity)
        res.json({
            data: rincianPelunasanPembelianDendaBarang,
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

export const deleteRincianPelunasanPembelianDendaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPelunasanPembelianDendaBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPelunasanPembelianDendaBarangByUuidService(uuid, req.identity)
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

export const updateRincianPelunasanPembelianDendaBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPelunasanPembelianDendaBarangByUuidController", null, req.identity)
    try {    
        const rincianPelunasanPembelianDendaBarangData = req.body
        const { error, value } = rincianPelunasanPembelianDendaBarangValidation(rincianPelunasanPembelianDendaBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPelunasanPembelianDendaBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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