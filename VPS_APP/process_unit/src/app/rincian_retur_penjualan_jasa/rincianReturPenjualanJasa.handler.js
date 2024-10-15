import { rincianReturPenjualanJasaValidation } from "./rincianReturPenjualanJasa.validation.js"
import { createRincianReturPenjualanJasaService, deleteRincianReturPenjualanJasaByUuidService, getAllRincianPesananPenjualanJasaByReturPenjualanService, getAllRincianReturPenjualanJasaService, getRincianReturPenjualanJasaByUuidService, updateRincianReturPenjualanJasaByUuidService } from "./rincianReturPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianReturPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianReturPenjualanJasaController", null, req.identity)
    try {
        const rincianReturPenjualanJasas = await getAllRincianReturPenjualanJasaService(req.query, req.identity)
        res.json({
            data: rincianReturPenjualanJasas,
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

export const getAllRincianPesananPenjualanJasaByReturPenjualan = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPesananPenjualanJasaByReturPenjualan", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getAllRincianPesananPenjualanJasaByReturPenjualanService(uuid, req.identity),
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

export const getRincianReturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianReturPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianReturPenjualanJasaByUuidService(uuid, req.identity),
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

export const postCreateRincianReturPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianReturPenjualanJasaController", null, req.identity)
    try {
        const rincianReturPenjualanJasaData = req.body
        const { error, value } = rincianReturPenjualanJasaValidation(rincianReturPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianReturPenjualanJasa = await createRincianReturPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianReturPenjualanJasa, req.identity)
        res.json({
            data: rincianReturPenjualanJasa,
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

export const deleteRincianReturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianReturPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianReturPenjualanJasaByUuidService(uuid, req.identity)
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

export const updateRincianReturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianReturPenjualanJasaByUuidController", null, req.identity)
    try {    
        const rincianReturPenjualanJasaData = req.body
        const { error, value } = rincianReturPenjualanJasaValidation(rincianReturPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianReturPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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