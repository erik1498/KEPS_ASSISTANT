import { satuanBahanBakuValidation } from "./satuanBahanBaku.validation.js"
import { createSatuanBahanBakuService, deleteSatuanBahanBakuByUuidService, getAllSatuanBahanBakuService, getSatuanBahanBakuByUuidService, updateSatuanBahanBakuByUuidService } from "./satuanBahanBaku.services.js"
import { generateValidationMessage } from "../../utils/validationUtil.js"
import { LOGGER, LOGGER_MONITOR, logType } from "../../utils/loggerUtil.js"

export const getAllSatuanBahanBakus = async (req, res) => {
    LOGGER(logType.INFO, "Start getAllSatuanBahanBakuController", null, req.identity)
    try {
        const satuanBahanBakus = await getAllSatuanBahanBakuService(req.query, req.identity)
        res.json({
            data: satuanBahanBakus,
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

export const getSatuanBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start getSatuanBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params

        res.json({
            data: await getSatuanBahanBakuByUuidService(uuid, req.identity),
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

export const postCreateSatuanBahanBaku = async (req, res) => {
    LOGGER(logType.INFO, "Start createSatuanBahanBakuController", null, req.identity)
    try {
        const satuanBahanBakuData = req.body
        const { error, value } = satuanBahanBakuValidation(satuanBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        const satuanBahanBaku = await createSatuanBahanBakuService(value, req.identity)
        LOGGER_MONITOR(req.originalUrl, req.method, satuanBahanBaku, req.identity)
        res.json({
            data: satuanBahanBaku,
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

export const deleteSatuanBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start deleteSatuanBahanBakuByUuidController", null, req.identity)
    try {
        const { uuid } = req.params
        await deleteSatuanBahanBakuByUuidService(uuid, req.identity)
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

export const updateSatuanBahanBakuByUUID = async (req, res) => {
    LOGGER(logType.INFO, "Start updateSatuanBahanBakuByUuidController", null, req.identity)
    try {    
        const satuanBahanBakuData = req.body
        const { error, value } = satuanBahanBakuValidation(satuanBahanBakuData)
        if (error) {
            return res.status(400).json({
                type: "validationError",
                message: generateValidationMessage(error)
            })
        }
        await updateSatuanBahanBakuByUuidService(req.params.uuid, value, req.identity, req.originalUrl, req.method)
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