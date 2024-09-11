import { rincianTransaksiKasValidation } from "./rincianTransaksiKas.validation.js"
import { createRincianTransaksiKasService, deleteRincianTransaksiKasByUuidService, getAllRincianTransaksiKasService, getRincianTransaksiKasByTransaksiKasUUIDService, updateRincianTransaksiKasByUuidService } from "./rincianTransaksiKas.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianTransaksiKass = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianTransaksiKasController", null, req.identity)
    try {
        const rincianTransaksiKass = await getAllRincianTransaksiKasService(req.query, req.identity)
        res.json({
            data: rincianTransaksiKass,
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

export const getRincianTransaksiKasByTransaksiKasUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianTransaksiKasByTransaksiKasUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianTransaksiKasByTransaksiKasUUIDService(uuid, req.identity),
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

export const postCreateRincianTransaksiKas = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianTransaksiKasController", null, req.identity)
    try {
        const rincianTransaksiKasData = req.body
        const { error, value } = rincianTransaksiKasValidation(rincianTransaksiKasData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianTransaksiKas = await createRincianTransaksiKasService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianTransaksiKas, req.identity)
        res.json({
            data: rincianTransaksiKas,
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

export const deleteRincianTransaksiKasByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianTransaksiKasByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianTransaksiKasByUuidService(uuid, req.identity)
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

export const updateRincianTransaksiKasByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianTransaksiKasByUuidController", null, req.identity)
    try {    
        const rincianTransaksiKasData = req.body
        const { error, value } = rincianTransaksiKasValidation(rincianTransaksiKasData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianTransaksiKasByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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