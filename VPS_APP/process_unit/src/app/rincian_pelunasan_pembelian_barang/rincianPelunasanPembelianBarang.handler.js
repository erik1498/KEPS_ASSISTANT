import { rincianPelunasanPembelianBarangValidation } from "./rincianPelunasanPembelianBarang.validation.js"
import { createRincianPelunasanPembelianBarangService, deleteRincianPelunasanPembelianBarangByUuidService, getAllRincianPelunasanPembelianBarangService, getAllRincianPesananPembelianBarangByPelunasanPembelianService, getAllRincianPesananPembelianBarangByTanggalService, getRincianPelunasanPembelianBarangByUuidService, updateRincianPelunasanPembelianBarangByUuidService } from "./rincianPelunasanPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPelunasanPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPelunasanPembelianBarangController", null, req.identity)
    try {
        const rincianPelunasanPembelianBarangs = await getAllRincianPelunasanPembelianBarangService(req.query, req.identity)
        res.json({
            data: rincianPelunasanPembelianBarangs,
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

export const getAllRincianPesananPembelianBarangByTanggal = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPembelianBarangByTanggal", null, req.identity)
    try {
        const { tanggal, faktur_pembelian_barang } = req.body

        res.json({
            data: await getAllRincianPesananPembelianBarangByTanggalService(tanggal, faktur_pembelian_barang, req.identity),
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

export const getAllRincianPesananPembelianBarangByPelunasanPembelian = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPembelianBarangByPelunasanPembelian", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPembelianBarangByPelunasanPembelianService(uuid, req.identity),
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

export const getRincianPelunasanPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPelunasanPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPelunasanPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianPelunasanPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPelunasanPembelianBarangController", null, req.identity)
    try {
        const rincianPelunasanPembelianBarangData = req.body
        const { error, value } = rincianPelunasanPembelianBarangValidation(rincianPelunasanPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPelunasanPembelianBarang = await createRincianPelunasanPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPelunasanPembelianBarang, req.identity)
        res.json({
            data: rincianPelunasanPembelianBarang,
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

export const deleteRincianPelunasanPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPelunasanPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPelunasanPembelianBarangByUuidService(uuid, req.identity)
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

export const updateRincianPelunasanPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPelunasanPembelianBarangByUuidController", null, req.identity)
    try {
        const rincianPelunasanPembelianBarangData = req.body
        const { error, value } = rincianPelunasanPembelianBarangValidation(rincianPelunasanPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPelunasanPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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