import { kategoriBahanBakuValidation } from "./kategoriBahanBaku.validation.js"
import { createKategoriBahanBakuService, deleteKategoriBahanBakuByUuidService, getAllKategoriBahanBakuService, getKategoriBahanBakuByUuidService, updateKategoriBahanBakuByUuidService } from "./kategoriBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKategoriBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKategoriBahanBakuController", null, req.identity)
    try {
        const kategoriBahanBakus = await getAllKategoriBahanBakuService(req.query, req.identity)
        res.json({
            data: kategoriBahanBakus,
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

export const getKategoriBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKategoriBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKategoriBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateKategoriBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createKategoriBahanBakuController", null, req.identity)
    try {
        const kategoriBahanBakuData = req.body
        const { error, value } = kategoriBahanBakuValidation(kategoriBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const kategoriBahanBaku = await createKategoriBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, kategoriBahanBaku, req.identity)
        res.json({
            data: kategoriBahanBaku,
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

export const deleteKategoriBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKategoriBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKategoriBahanBakuByUuidService(uuid, req.identity)
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

export const updateKategoriBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKategoriBahanBakuByUuidController", null, req.identity)
    try {    
        const kategoriBahanBakuData = req.body
        const { error, value } = kategoriBahanBakuValidation(kategoriBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKategoriBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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