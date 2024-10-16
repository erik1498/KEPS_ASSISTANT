import { rincianReturPembelianBarangValidation } from "./rincianReturPembelianBarang.validation.js"
import { createRincianReturPembelianBarangService, deleteRincianReturPembelianBarangByUuidService, getAllRincianPesananPembelianBarangByReturPembelianService, getAllRincianReturPembelianBarangService, getRincianReturPembelianBarangByUuidService, updateRincianReturPembelianBarangByUuidService } from "./rincianReturPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianReturPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianReturPembelianBarangController", null, req.identity)
    try {
        const rincianReturPembelianBarangs = await getAllRincianReturPembelianBarangService(req.query, req.identity)
        res.json({
            data: rincianReturPembelianBarangs,
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

export const getAllRincianPesananPembelianBarangByReturPembelian = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPembelianBarangByReturPembelian", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPembelianBarangByReturPembelianService(uuid, req.identity),
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

export const getRincianReturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianReturPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianReturPembelianBarangByUuidService(uuid, req.identity),
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

export const postCreateRincianReturPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianReturPembelianBarangController", null, req.identity)
    try {
        const rincianReturPembelianBarangData = req.body
        const { error, value } = rincianReturPembelianBarangValidation(rincianReturPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianReturPembelianBarang = await createRincianReturPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianReturPembelianBarang, req.identity)
        res.json({
            data: rincianReturPembelianBarang,
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

export const deleteRincianReturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianReturPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianReturPembelianBarangByUuidService(uuid, req.identity)
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

export const updateRincianReturPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianReturPembelianBarangByUuidController", null, req.identity)
    try {    
        const rincianReturPembelianBarangData = req.body
        const { error, value } = rincianReturPembelianBarangValidation(rincianReturPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianReturPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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