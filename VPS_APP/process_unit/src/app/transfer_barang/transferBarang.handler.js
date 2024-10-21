import { transferBarangValidation } from "./transferBarang.validation.js"
import { createTransferBarangService, deleteTransferBarangByUuidService, getAllTransferBarangService, getTransferBarangByUuidService, updateTransferBarangByUuidService } from "./transferBarang.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllTransferBarangs = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllTransferBarangController", null, req.identity)
    try {
        const transferBarangs = await getAllTransferBarangService(req.query, req.identity)
        res.json({
            data: transferBarangs,
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

export const getTransferBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getTransferBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getTransferBarangByUuidService(uuid, req.identity),
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

export const postCreateTransferBarang = async (req, res) => {
    LOGGER(logType.INFO, "Start createTransferBarangController", null, req.identity)
    try {
        const TransferBarangData = req.body
        const { error, value } = transferBarangValidation(TransferBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const transferBarang = await createTransferBarangService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, transferBarang, req.identity)
        res.json({
            data: transferBarang,
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

export const deleteTransferBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteTransferBarangByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteTransferBarangByUuidService(uuid, req.identity)
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

export const updateTransferBarangByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateTransferBarangByUuidController", null, req.identity)
    try {    
        const TransferBarangData = req.body
        const { error, value } = transferBarangValidation(TransferBarangData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateTransferBarangByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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