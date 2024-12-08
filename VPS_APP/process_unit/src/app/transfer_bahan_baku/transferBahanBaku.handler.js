import { transferBahanBakuValidation } from "./transferBahanBaku.validation.js"
import { createTransferBahanBakuService, deleteTransferBahanBakuByUuidService, getAllTransferBahanBakuService, getTransferBahanBakuByUuidService, updateTransferBahanBakuByUuidService } from "./transferBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllTransferBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllTransferBahanBakuController", null, req.identity)
    try {
        const transferBahanBakus = await getAllTransferBahanBakuService(req.query, req.identity)
        res.json({
            data: transferBahanBakus,
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

export const getTransferBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getTransferBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getTransferBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateTransferBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createTransferBahanBakuController", null, req.identity)
    try {
        const TransferBahanBakuData = req.body
        const { error, value } = transferBahanBakuValidation(TransferBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const transferBahanBaku = await createTransferBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, transferBahanBaku, req.identity)
        res.json({
            data: transferBahanBaku,
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

export const deleteTransferBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteTransferBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteTransferBahanBakuByUuidService(uuid, req.identity)
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

export const updateTransferBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateTransferBahanBakuByUuidController", null, req.identity)
    try {    
        const TransferBahanBakuData = req.body
        const { error, value } = transferBahanBakuValidation(TransferBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateTransferBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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