import { returPenjualanJasaValidation } from "./returPenjualanJasa.validation.js"
import { createReturPenjualanJasaService, deleteReturPenjualanJasaByUuidService, getAllReturPenjualanJasaService, getCekDendaByReturPenjualanUUIDService, getReturPenjualanJasaByUuidService, updateReturPenjualanJasaByUuidService } from "./returPenjualanJasa.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllReturPenjualanJasas = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllReturPenjualanJasaController", null, req.identity)
    try {
        const returPenjualanJasas = await getAllReturPenjualanJasaService(req.query, req.identity)
        res.json({
            data: returPenjualanJasas,
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

export const getReturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getReturPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getReturPenjualanJasaByUuidService(uuid, req.identity),
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

export const postCreateReturPenjualanJasa = async (req, res) => {
    LOGGER(logType.INFO, "Start createReturPenjualanJasaController", null, req.identity)
    try {
        const returPenjualanJasaData = req.body
        const { error, value } = returPenjualanJasaValidation(returPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const returPenjualanJasa = await createReturPenjualanJasaService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, returPenjualanJasa, req.identity)
        res.json({
            data: returPenjualanJasa,
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

export const deleteReturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteReturPenjualanJasaByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteReturPenjualanJasaByUuidService(uuid, req.identity)
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

export const updateReturPenjualanJasaByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateReturPenjualanJasaByUuidController", null, req.identity)
    try {    
        const returPenjualanJasaData = req.body
        const { error, value } = returPenjualanJasaValidation(returPenjualanJasaData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateReturPenjualanJasaByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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