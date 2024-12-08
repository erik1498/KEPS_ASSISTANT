import { konversiBahanBakuValidation } from "./konversiBahanBaku.validation.js"
import { createKonversiBahanBakuService, deleteKonversiBahanBakuByUuidService, getAllKonversiBahanBakuService, getKonversiBahanBakuByUuidService, updateKonversiBahanBakuByUuidService } from "./konversiBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllKonversiBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllKonversiBahanBakuController", null, req.identity)
    try {
        const konversiBahanBakus = await getAllKonversiBahanBakuService(req.query, req.identity)
        res.json({
            data: konversiBahanBakus,
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

export const getKonversiBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getKonversiBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getKonversiBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateKonversiBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createKonversiBahanBakuController", null, req.identity)
    try {
        const konversiBahanBakuData = req.body
        const { error, value } = konversiBahanBakuValidation(konversiBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const konversiBahanBaku = await createKonversiBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, konversiBahanBaku, req.identity)
        res.json({
            data: konversiBahanBaku,
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

export const deleteKonversiBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteKonversiBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteKonversiBahanBakuByUuidService(uuid, req.identity)
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

export const updateKonversiBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateKonversiBahanBakuByUuidController", null, req.identity)
    try {    
        const konversiBahanBakuData = req.body
        const { error, value } = konversiBahanBakuValidation(konversiBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateKonversiBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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