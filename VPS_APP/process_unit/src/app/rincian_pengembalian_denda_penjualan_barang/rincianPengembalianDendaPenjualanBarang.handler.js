import { rincianPengembalianDendaPenjualanBarangValidation } from "./rincianPengembalianDendaPenjualanBarang.validation.js"
import { createRincianPengembalianDendaPenjualanBarangService, deleteRincianPengembalianDendaPenjualanBarangByUuidService, getAllRincianPengembalianDendaPenjualanBarangService, getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDService, getRincianPengembalianDendaPenjualanBarangByUuidService, updateRincianPengembalianDendaPenjualanBarangByUuidService } from "./rincianPengembalianDendaPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPengembalianDendaPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPenjualanBarangController", null, req.identity)
    try {
        const rincianPengembalianDendaPenjualanBarangs = await getAllRincianPengembalianDendaPenjualanBarangService(req.query, req.identity)
        res.json({
            data: rincianPengembalianDendaPenjualanBarangs,
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

export const getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPengembalianDendaPenjualanBarangByFakturPenjualanBarangUUIDService(uuid, req.identity),
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

export const postCreateRincianPengembalianDendaPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPengembalianDendaPenjualanBarangController", null, req.identity)
    try {
        const rincianPengembalianDendaPenjualanBarangData = req.body
        const { error, value } = rincianPengembalianDendaPenjualanBarangValidation(rincianPengembalianDendaPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPengembalianDendaPenjualanBarang = await createRincianPengembalianDendaPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPengembalianDendaPenjualanBarang, req.identity)
        res.json({
            data: rincianPengembalianDendaPenjualanBarang,
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

export const deleteRincianPengembalianDendaPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPengembalianDendaPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPengembalianDendaPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateRincianPengembalianDendaPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPengembalianDendaPenjualanBarangByUuidController", null, req.identity)
    try {    
        const rincianPengembalianDendaPenjualanBarangData = req.body
        const { error, value } = rincianPengembalianDendaPenjualanBarangValidation(rincianPengembalianDendaPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPengembalianDendaPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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