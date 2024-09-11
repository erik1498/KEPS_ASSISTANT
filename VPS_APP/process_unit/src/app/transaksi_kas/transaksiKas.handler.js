import { transaksiKasValidation } from "./transaksiKas.validation.js"
import { createTransaksiKasService, deleteTransaksiKasByUuidService, getAllTransaksiKasService, getTransaksiKasByUuidService, updateTransaksiKasByUuidService } from "./transaksiKas.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllTransaksiKass = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllTransaksiKasController", null, req.identity)
    try {
        const transaksiKass = await getAllTransaksiKasService(req.params.bulan, req.params.tahun, req.query, req.identity)
        res.json({
            data: transaksiKass,
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

export const getTransaksiKasByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getTransaksiKasByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getTransaksiKasByUuidService(uuid, req.identity),
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

export const postCreateTransaksiKas = async (req, res) => {
    LOGGER(logType.INFO, "Start createTransaksiKasController", null, req.identity)
    try {
        const transaksiKasData = req.body
        const { error, value } = transaksiKasValidation(transaksiKasData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const transaksiKas = await createTransaksiKasService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, transaksiKas, req.identity)
        res.json({
            data: transaksiKas,
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

export const deleteTransaksiKasByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteTransaksiKasByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteTransaksiKasByUuidService(uuid, req.identity)
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

export const updateTransaksiKasByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateTransaksiKasByUuidController", null, req.identity)
    try {    
        const transaksiKasData = req.body
        const { error, value } = transaksiKasValidation(transaksiKasData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateTransaksiKasByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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