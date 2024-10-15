import { rincianPesananPembelianBarangValidation } from "./rincianPesananPembelianBarang.validation.js"
import { createRincianPesananPembelianBarangService, deleteRincianPesananPembelianBarangByUuidService, getAllRincianPesananPembelianBarangService, getRincianPesananPembelianBarangByPesananPembelianUUIDService, updateRincianPesananPembelianBarangByUuidService } from "./rincianPesananPembelianBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPesananPembelianBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPembelianBarangController", null, req.identity)
    try {
        const rincianPesananPembelianBarangs = await getAllRincianPesananPembelianBarangService(req.query, req.identity)
        res.json({
            data: rincianPesananPembelianBarangs,
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

export const getRincianPesananPembelianBarangByPesananPembelianUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPesananPembelianBarangByPesananPembelianUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPesananPembelianBarangByPesananPembelianUUIDService(uuid, req.identity),
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

export const postCreateRincianPesananPembelianBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPesananPembelianBarangController", null, req.identity)
    try {
        const rincianPesananPembelianBarangData = req.body
        const { error, value } = rincianPesananPembelianBarangValidation(rincianPesananPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPesananPembelianBarang = await createRincianPesananPembelianBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPesananPembelianBarang, req.identity)
        res.json({
            data: rincianPesananPembelianBarang,
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

export const deleteRincianPesananPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPesananPembelianBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPesananPembelianBarangByUuidService(uuid, req.identity)
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

export const updateRincianPesananPembelianBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPesananPembelianBarangByUuidController", null, req.identity)
    try {    
        const rincianPesananPembelianBarangData = req.body
        const { error, value } = rincianPesananPembelianBarangValidation(rincianPesananPembelianBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPesananPembelianBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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