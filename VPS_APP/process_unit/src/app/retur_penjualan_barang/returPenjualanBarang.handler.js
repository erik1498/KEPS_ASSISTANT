import { returPenjualanBarangValidation } from "./returPenjualanBarang.validation.js"
import { createReturPenjualanBarangService, deleteReturPenjualanBarangByUuidService, getAllReturPenjualanBarangService, getCekDendaByReturPenjualanUUIDService, getReturPenjualanBarangByUuidService, updateReturPenjualanBarangByUuidService } from "./returPenjualanBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllReturPenjualanBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllReturPenjualanBarangController", null, req.identity)
    try {
        const returPenjualanBarangs = await getAllReturPenjualanBarangService(req.query, req.identity)
        res.json({
            data: returPenjualanBarangs,
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

export const getReturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getReturPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getReturPenjualanBarangByUuidService(uuid, req.identity),
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

export const postCreateReturPenjualanBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createReturPenjualanBarangController", null, req.identity)
    try {
        const returPenjualanBarangData = req.body
        const { error, value } = returPenjualanBarangValidation(returPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const returPenjualanBarang = await createReturPenjualanBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, returPenjualanBarang, req.identity)
        res.json({
            data: returPenjualanBarang,
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

export const deleteReturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteReturPenjualanBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteReturPenjualanBarangByUuidService(uuid, req.identity)
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

export const updateReturPenjualanBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateReturPenjualanBarangByUuidController", null, req.identity)
    try {    
        const returPenjualanBarangData = req.body
        const { error, value } = returPenjualanBarangValidation(returPenjualanBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateReturPenjualanBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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