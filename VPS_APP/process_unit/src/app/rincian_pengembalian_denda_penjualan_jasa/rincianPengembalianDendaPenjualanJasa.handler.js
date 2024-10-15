import { rincianPengembalianDendaPenjualanJasaValidation } from "./rincianPengembalianDendaPenjualanJasa.validation.js"
import { createRincianPengembalianDendaPenjualanJasaService, deleteRincianPengembalianDendaPenjualanJasaByUuidService, getAllRincianPengembalianDendaPenjualanJasaService, getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDService, getRincianPengembalianDendaPenjualanJasaByUuidService, updateRincianPengembalianDendaPenjualanJasaByUuidService } from "./rincianPengembalianDendaPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllRincianPengembalianDendaPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllRincianPengembalianDendaPenjualanJasaController", null, req.identity)
    try {
        const rincianPengembalianDendaPenjualanJasas = await getAllRincianPengembalianDendaPenjualanJasaService(req.query, req.identity)
        res.json({
            data: rincianPengembalianDendaPenjualanJasas,
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

export const getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getRincianPengembalianDendaPenjualanJasaByFakturPenjualanJasaUUIDService(uuid, req.identity),
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

export const postCreateRincianPengembalianDendaPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createRincianPengembalianDendaPenjualanJasaController", null, req.identity)
    try {
        const rincianPengembalianDendaPenjualanJasaData = req.body
        const { error, value } = rincianPengembalianDendaPenjualanJasaValidation(rincianPengembalianDendaPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const rincianPengembalianDendaPenjualanJasa = await createRincianPengembalianDendaPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, rincianPengembalianDendaPenjualanJasa, req.identity)
        res.json({
            data: rincianPengembalianDendaPenjualanJasa,
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

export const deleteRincianPengembalianDendaPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteRincianPengembalianDendaPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteRincianPengembalianDendaPenjualanJasaByUuidService(uuid, req.identity)
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

export const updateRincianPengembalianDendaPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateRincianPengembalianDendaPenjualanJasaByUuidController", null, req.identity)
    try {    
        const rincianPengembalianDendaPenjualanJasaData = req.body
        const { error, value } = rincianPengembalianDendaPenjualanJasaValidation(rincianPengembalianDendaPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateRincianPengembalianDendaPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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